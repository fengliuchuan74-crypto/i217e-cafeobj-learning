/* =========================================================================
 * engine.js  —  一个教学用的 CafeOBJ 子集实现
 * -------------------------------------------------------------------------
 * 目的：让学习者在本系统里"亲手"看到项重写（term rewriting）的每一步，
 *      看到 redex / contract / 替换（substitution）/ 局部策略（E-strategy），
 *      并且能运行课程里的 proof score（证明脚本）。
 *
 * 支持：
 *   - mod! / mod* 模块、[S1 S2 < S3] 排序、op/ops、var/vars、eq/ceq
 *   - 重载（overloading）、子排序（subsort）、错误排序（?S）
 *   - assoc / comm / id: 的 AC 匹配
 *   - E-strategy（局部策略）：{strat: (1 0)}、{strat: (0 1 0)} 等
 *   - 内建的 Nat / Bool 运算（+ * quo rem sd p s < > <= >= == divides）
 *   - open / close / red / set trace
 * 不支持的（会明确提示）：参数化模块实例化、视图展开、复杂的内建库
 * ========================================================================= */
(function (global) {
  'use strict';

  /* =====================================================================
   * 0. 工具
   * ===================================================================== */
  var MAX_STEPS_DEFAULT = 20000;

  function isDig(c) { return c >= '0' && c <= '9'; }
  function isIdStart(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '?' || c === '$';
  }
  function isIdChar(c) { return isIdStart(c) || isDig(c) || c === '-' || c === '&' || c === '"'; }

  /* =====================================================================
   * 1. 排序格（subsort lattice）
   * ===================================================================== */
  function SortLattice() {
    this.sup = Object.create(null);   // sort -> [直接父排序]
    this.all = Object.create(null);
    this._cl = Object.create(null);
  }
  SortLattice.prototype.ensure = function (s) {
    if (!this.sup[s]) { this.sup[s] = []; this.all[s] = true; this._cl = Object.create(null); }
    return s;
  };
  SortLattice.prototype.addSub = function (sub, sups) {
    this.ensure(sub);
    var i;
    for (i = 0; i < sups.length; i++) {
      this.ensure(sups[i]);
      if (this.sup[sub].indexOf(sups[i]) < 0) this.sup[sub].push(sups[i]);
    }
    this._cl = Object.create(null);
  };
  SortLattice.prototype.closure = function (s) {
    if (this._cl[s]) return this._cl[s];
    var seen = Object.create(null), stack = [s], x, i, nx;
    while (stack.length) {
      x = stack.pop();
      if (seen[x]) continue;
      seen[x] = true;
      nx = this.sup[x] || [];
      for (i = 0; i < nx.length; i++) stack.push(nx[i]);
    }
    this._cl[s] = seen;
    return seen;
  };
  /* a <= b ?  a 是 b 的子排序（或相同）*/
  SortLattice.prototype.le = function (a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    return !!this.closure(a)[b];
  };
  SortLattice.prototype.isSort = function (s) { return !!this.all[s]; };
  /* 在一组候选里挑最小的（最小上界意义上的 least sort）*/
  SortLattice.prototype.least = function (cands) {
    if (!cands.length) return null;
    var best = cands[0], i, changed = true;
    for (i = 1; i < cands.length; i++) if (this.le(cands[i], best)) best = cands[i];
    return best;
  };

  /* =====================================================================
   * 2. 项（term）
   *   {k:'num', n:'12'}                 数字常量
   *   {k:'c',   op:'nil'}               已声明的常量（0 元算子）
   *   {k:'v',   name:'X', sort:'Nat'}   变量
   *   {k:'a',   op:'_+_', args:[...]}   算子应用
   * ===================================================================== */
  function num(n) { return { k: 'num', n: String(n) }; }
  function con(o) { return { k: 'c', op: o }; }
  function vr(name, sort) { return { k: 'v', name: name, sort: sort || null }; }
  function app(op, args) { return { k: 'a', op: op, args: args }; }
  function isGround(t) {
    if (t.k === 'v') return false;
    if (t.k === 'a') { for (var i = 0; i < t.args.length; i++) if (!isGround(t.args[i])) return false; }
    return true;
  }
  function eqTerm(a, b) {
    if (a.k !== b.k) return false;
    if (a.k === 'num') return a.n === b.n;
    if (a.k === 'c') return a.op === b.op;
    if (a.k === 'v') return a.name === b.name;
    if (a.op !== b.op || a.args.length !== b.args.length) return false;
    for (var i = 0; i < a.args.length; i++) if (!eqTerm(a.args[i], b.args[i])) return false;
    return true;
  }
  function cloneTerm(t) {
    if (t.k === 'a') return { k: 'a', op: t.op, args: t.args.map(cloneTerm) };
    return t;
  }
  function size(t) {
    if (t.k === 'a') { var s = 1; for (var i = 0; i < t.args.length; i++) s += size(t.args[i]); return s; }
    return 1;
  }

  /* =====================================================================
   * 3. 模块
   * ===================================================================== */
  function Module(name) {
    this.name = name;
    this.sorts = new SortLattice();
    this.ranks = Object.create(null);       // opName -> [{args:[sorts], co, attrs}]
    this.varSorts = Object.create(null);
    this.eqs = [];                          // {lhs, rhs, cond, name}
    this.principal = null;
    this.imports = [];
    this.notes = [];
  }
  Module.prototype.addRank = function (op, args, co, attrs) {
    var i;
    for (i = 0; i < args.length; i++) this.sorts.ensure(args[i]);
    this.sorts.ensure(co);
    if (!this.ranks[op]) this.ranks[op] = [];
    attrs = attrs || {};
    /* 合并重载：如果已存在完全相同的 rank，则合并属性 */
    for (i = 0; i < this.ranks[op].length; i++) {
      var r = this.ranks[op][i];
      if (r.args.length === args.length && r.co === co) {
        var same = true;
        for (var j = 0; j < args.length; j++) if (r.args[j] !== args[j]) { same = false; break; }
        if (same) { for (var k in attrs) r.attrs[k] = attrs[k]; return; }
      }
    }
    this.ranks[op].push({ args: args.slice(), co: co, attrs: attrs });
  };
  Module.prototype.hasOp = function (op) { return !!this.ranks[op]; };
  Module.prototype.attr = function (op) {
    var rs = this.ranks[op] || [], out = {};
    for (var i = 0; i < rs.length; i++) for (var k in rs[i].attrs) if (out[k] === undefined) out[k] = rs[i].attrs[k];
    return out;
  };
  Module.prototype.arity = function (op) {
    var rs = this.ranks[op];
    return rs ? rs[0].args.length : 0;
  };

  /* ---- 排序推断 与 rank 选择（处理重载）---- */
  function rankOf(t, mod) {
    if (t.k !== 'a') return null;
    if (t._r && t._r.m === mod.name) return t._r.r;
    var rs = mod.ranks[t.op], ls = mod.sorts, best = null, i, k;
    if (rs) {
      var argS = [];
      for (k = 0; k < t.args.length; k++) argS.push(sortOf(t.args[k], mod));
      for (i = 0; i < rs.length; i++) {
        var r = rs[i];
        if (r.args.length !== t.args.length) continue;
        var ok = true;
        for (k = 0; k < r.args.length; k++) {
          if (!ls.le(argS[k], r.args[k])) { ok = false; break; }
        }
        if (!ok) continue;
        if (best === null || ls.le(r.co, best.co)) best = r;
      }
    }
    t._r = { m: mod.name, r: best };
    return best;
  }
  function attrsOf(t, mod) {
    if (t && t.k === 'a') {
      var r = rankOf(t, mod);
      if (r) return r.attrs;
    }
    return (t && t.k === 'a') ? mod.attr(t.op) : {};
  }
  function sortOf(t, mod) {
    var ls = mod.sorts;
    if (t.k === 'num') {
      if (t.n === '0' && ls.isSort('Zero')) return 'Zero';
      if (t.n !== '0' && ls.isSort('NzNat')) return 'NzNat';
      if (ls.isSort('Nat')) return 'Nat';
      return t.n === '0' ? 'Zero' : 'NzNat';
    }
    if (t.k === 'v') return t.sort || null;
    if (t.k === 'c') {
      var rs = mod.ranks[t.op];
      if (!rs) return null;
      var best = null;
      for (var i = 0; i < rs.length; i++) {
        if (rs[i].args.length !== 0) continue;
        if (best === null || ls.le(rs[i].co, best)) best = rs[i].co;
      }
      return best;
    }
    var r = rankOf(t, mod);
    if (r) return r.co;
    if (mod.eqs && (t.op === '_=_' || t.op === '_==_' || t.op === '_and_' || t.op === '_or_' || t.op === 'not_')) return 'Bool';
    return null;
  }

  /* ---- 项的构造（含 AC 规范化）---- */
  function mkApp(op, args, mod) {
    var at = mod.attr(op), i;
    if (at.assoc) {
      var flat = [];
      for (i = 0; i < args.length; i++) {
        var a = args[i];
        if (a.k === 'a' && a.op === op && mod.attr(op).assoc) flat = flat.concat(a.args);
        else flat.push(a);
      }
      args = flat;
    }
    if (at.comm && args.length === 2) {
      if (termKey(args[1]) < termKey(args[0])) args = [args[1], args[0]];
    } else if (at.comm && args.length > 2) {
      args = args.slice().sort(function (x, y) {
        var kx = termKey(x), ky = termKey(y);
        return kx < ky ? -1 : (kx > ky ? 1 : 0);
      });
    }
    return { k: 'a', op: op, args: args };
  }

  function subst(t, b) {
    if (t.k === 'v') {
      var v = b[t.name];
      return v === undefined ? t : v;
    }
    if (t.k === 'a') return { k: 'a', op: t.op, args: t.args.map(function (x) { return subst(x, b); }) };
    return t;
  }
  /* 带 AC 规范化的替换 */
  function substAc(t, b, mod) {
    if (t.k === 'v') {
      var v = b[t.name];
      return v === undefined ? t : v;
    }
    if (t.k === 'a') return mkApp(t.op, t.args.map(function (x) { return substAc(x, b, mod); }), mod);
    return t;
  }

  /* =====================================================================
   * 4. 匹配（pattern matching）
   * ===================================================================== */
  /* ---- 匹配（使用 CPS 实现完整回溯，AC 匹配也能与其他参数联动）---- */
  function copyBind(b) {
    var o = Object.create(null);
    for (var k in b) o[k] = b[k];
    return o;
  }
  function match(pat, term, b, mod, depth) {
    var res = null;
    mC(pat, term, b, mod, depth || 0, function (bb) { res = bb; return true; });
    if (!res) return false;
    for (var k in res) b[k] = res[k];
    return true;
  }
  function mC(pat, term, b, mod, depth, k) {
    if (depth > 260) return false;
    var i, kk;
    if (pat.k === 'v') {
      var got = b[pat.name];
      if (got !== undefined) return eqTerm(got, term) ? k(b) : false;
      var ts = sortOf(term, mod);
      if (pat.sort && ts && !mod.sorts.le(ts, pat.sort)) return false;
      var b2 = copyBind(b);
      b2[pat.name] = term;
      return k(b2);
    }
    if (pat.k === 'num') return (term.k === 'num' && term.n === pat.n) ? k(b) : false;
    if (pat.k === 'c') return (term.k === 'c' && term.op === pat.op) ? k(b) : false;
    if (term.k !== 'a' || term.op !== pat.op) {
      var ap = mod.attr(pat.op);
      if (ap.assoc && ap.id && ap.id !== '_') {
        return acC(pat.args, [term, con(ap.id)], pat.op, b, mod, depth, k);
      }
      return false;
    }
    var at = attrsOf(term, mod);
    if (at.comm) return acC(pat.args, term.args, pat.op, b, mod, depth, k);
    if (at.assoc) return seqC(pat.args, term.args, pat.op, b, mod, depth, k);
    if (pat.args.length !== term.args.length) return false;
    return argsC(pat.args, term.args, 0, b, mod, depth, k);
  }
  function argsC(pats, terms, i, b, mod, depth, k) {
    if (i === pats.length) return k(b);
    return mC(pats[i], terms[i], b, mod, depth + 1, function (b2) {
      return argsC(pats, terms, i + 1, b2, mod, depth, k);
    });
  }
  /* assoc：按顺序切分成若干组 */
  function seqC(pats, elems, op, b, mod, depth, k) {
    if (depth > 260) return false;
    var at = mod.attr(op);
    var hasId = at.id && at.id !== '_';
    function go(pi, ei, bb) {
      if (pi === pats.length) return ei === elems.length ? k(bb) : false;
      var restP = pats.length - pi - 1;
      var maxTake = elems.length - ei - restP;
      var minTake = hasId ? 0 : 1;
      for (var take = minTake; take <= maxTake; take++) {
        var grp = take === 0 ? con(at.id) : combineTerms(op, elems.slice(ei, ei + take), mod);
        if (!grp) continue;
        var ok = mC(pats[pi], grp, bb, mod, depth + 1, function (b2) {
          return go(pi + 1, ei + take, b2);
        });
        if (ok) return true;
      }
      return false;
    }
    return go(0, 0, b);
  }
  /* AC：元素无序，可任意分组 */
  function acC(pats, elems, op, b, mod, depth, k) {
    if (depth > 260) return false;
    if (pats.length === 0) return elems.length === 0 ? k(b) : false;
    var at = mod.attr(op);
    var n = elems.length, i, j;
    var groups = [];
    for (i = 0; i < n; i++) groups.push([i]);
    if (at.assoc && n >= 2) {
      for (var mask = 3; mask < (1 << n); mask++) {
        var g = [], c = 0;
        for (j = 0; j < n; j++) if (mask & (1 << j)) { g.push(j); c++; }
        if (c >= 2) groups.push(g);
      }
    }
    if (at.id && at.id !== '_') groups.push([]);
    groups.sort(function (x, y) { return x.length - y.length; });
    for (var gi = 0; gi < groups.length; gi++) {
      var sel = groups[gi], picked = [], remain = [], used = {};
      for (j = 0; j < sel.length; j++) { picked.push(elems[sel[j]]); used[sel[j]] = true; }
      for (j = 0; j < n; j++) if (!used[j]) remain.push(elems[j]);
      var grp = picked.length === 0 ? con(at.id) : combineTerms(op, picked, mod);
      if (!grp) continue;
      var ok = mC(pats[0], grp, b, mod, depth + 1, function (b2) {
        return acC(pats.slice(1), remain, op, b2, mod, depth + 1, k);
      });
      if (ok) return true;
    }
    return false;
  }

  function combineTerms(op, elems, mod) {
    if (!op) return null;
    if (elems.length === 0) {
      var at = mod.attr(op);
      if (at.id && at.id !== '_') return con(at.id);
      return null;
    }
    if (elems.length === 1) return elems[0];
    return mkApp(op, elems.slice(), mod);
  }

  /* =====================================================================
   * 5. 打印
   * ===================================================================== */
  var PREC_OF = { '_=_': 60, '_==_': 50, '_<_': 50, '_>_': 50, '_<=_': 50, '_>=_': 50,
    '_+_': 33, '_-_': 33, '_*_': 31, '_/_': 31, '_%_': 31, '_|_': 40, '_@_': 40,
    '_quo_': 31, '_rem_': 31, '_divides_': 50, '_and_': 55, '_or_': 56, '_ _': 70,
    '_:=_;': 80, '_=>_': 45, '_   _': 70 };

  function termKey(t) {
    if (t.k === 'num') return '0' + pad(t.n, 24);
    if (t.k === 'c') return '1' + t.op;
    if (t.k === 'v') return '2' + t.name;
    var s = '3' + t.op + '(';
    for (var i = 0; i < t.args.length; i++) s += termKey(t.args[i]) + ',';
    return s + ')';
  }
  function pad(s, n) { while (s.length < n) s = '0' + s; return s; }

  function formatTerm(t, mod, prec, top, parentOp) {
    prec = prec === undefined ? 100 : prec;
    switch (t.k) {
      case 'num': return t.n;
      case 'v': return t.name;
      case 'c': return t.op;
      case 'a':
        var name = t.op;
        var p = (mod && mod.attr && mod.attr(t.op).prec) || PREC_OF[t.op] || 20;
        if (name.indexOf('_') < 0) {
          var aa = t.args.map(function (a) { return formatTerm(a, mod, 0); });
          return name + '(' + aa.join(', ') + ')';
        }
        var pieces = name.split('_');
        var out = '', idx = 0, i;
        function isSymLit(x) {
          if (!x) return false;
          if ('()[]{},:;'.indexOf(x) >= 0) return false;
          return !/[A-Za-z0-9_]/.test(x);
        }
        for (i = 0; i < pieces.length; i++) {
          var lit = pieces[i];
          if (lit) {
            if (isSymLit(lit)) {
              if (out && !/ $/.test(out)) out += ' ';
              out += lit;
              if (i < pieces.length - 1) out += ' ';
            } else {
              if (out && /[A-Za-z0-9_}:]$/.test(out) && /^[A-Za-z0-9_(}{]/.test(lit)) out += ' ';
              out += lit;
              if (/[A-Za-z0-9_}:{]$/.test(lit) && i < pieces.length - 1) out += ' ';
            }
          }
          if (i < pieces.length - 1) {
            var a = t.args[idx++];
            if (!a) continue;
            var st = formatTerm(a, mod, p, false, t.op);
            if (out && !/ $/.test(out) && !/^[)}\],;]$/.test(st)) out += ' ';
            out += st;
            if (i + 1 < pieces.length - 1) out += ' ';
          }
        }
        if (idx < t.args.length) {
          for (; idx < t.args.length; idx++) out += ' ' + formatTerm(t.args[idx], mod, p, false, t.op);
        }
        out = out.replace(/\s+/g, ' ').trim();
        var needs = (p > prec) || (p === prec && parentOp && parentOp !== t.op) || (parentOp && parentOp === t.op);
        return needs ? '(' + out + ')' : out;
    }
    return '?';
  }
  Module.prototype.show = function (t) { return formatTerm(t, this); };
  Module.prototype.showTyped = function (t) {
    var s = sortOf(t, this);
    return '(' + formatTerm(t, this) + '):' + (s || '?' + (this.principal || 'Err'));
  };

  /* =====================================================================
   * 6. 词法
   * ===================================================================== */
  var KEYWORDS = { 'mod!': 1, 'mod*': 1, 'mod': 1, 'pr': 1, 'protecting': 1, 'op': 1, 'ops': 1,
    'var': 1, 'vars': 1, 'eq': 1, 'ceq': 1, 'if': 1, 'then': 1, 'else': 1, 'open': 1, 'close': 1,
    'red': 1, 'reduce': 1, 'set': 1, 'trace': 1, 'on': 1, 'off': 1, 'show': 1, 'quit': 1,
    'true': 1, 'false': 1, 'imports': 1, 'signature': 1, 'axioms': 1, 'principal-sort': 1 };

  function tokenize(src) {
    var toks = [], i = 0, n = src.length;
    while (i < n) {
      var c = src[i];
      if (c === '\n') { toks.push({ t: 'nl' }); i++; continue; }
      if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
      /* 注释 -- 到行尾 ; "..." ; ** ... */
      if (c === '-' && src[i + 1] === '-') { while (i < n && src[i] !== '\n') i++; continue; }
      if (c === '"') {
        var j = i + 1, buf = '';
        while (j < n) {
          if (src[j] === '\\') { buf += src[j + 1]; j += 2; continue; }
          if (src[j] === '"') break;
          buf += src[j]; j++;
        }
        i = j + 1;
        toks.push({ t: 'str', v: buf });
        continue;
      }
      if (c === '*' && src[i + 1] === '*') { while (i < n && src[i] !== '\n') i++; continue; }
      if (isDig(c)) {
        var k = i;
        while (k < n && isDig(src[k])) k++;
        /* 形如 2* 这种以数字开头的算子名 */
        if (k < n && (src[k] === '*' || src[k] === '+' || src[k] === '-') && !isDig(src[k + 1] || '')) {
          var kk = k; while (kk < n && (src[kk] === '*' || src[kk] === '+' || src[kk] === '-')) kk++;
          toks.push({ t: 'id', v: src.slice(i, kk) }); i = kk; continue;
        }
        toks.push({ t: 'num', v: src.slice(i, k) }); i = k; continue;
      }
      if (src.substr(i, 4) === 'mod!' || src.substr(i, 4) === 'mod*') {
        toks.push({ t: 'id', v: src.substr(i, 4) }); i += 4; continue;
      }
      if (c === '&' && src[i + 1] === '&') { toks.push({ t: 'sym', v: '&&' }); i += 2; continue; }
      if (isIdStart(c)) {
        var m = i;
        while (m < n && isIdChar(src[m])) m++;
        toks.push({ t: 'id', v: src.slice(i, m) }); i = m; continue;
      }
      if (c === "'") { /* 'a 这种 quoted id */
        var q = i + 1, b2 = "'";
        while (q < n && isIdChar(src[q])) { b2 += src[q]; q++; }
        if (b2 === "'") { b2 = "'"; q = i + 1; }
        toks.push({ t: 'qid', v: b2 }); i = q; continue;
      }
      /* 多字符符号 */
      var three = src.substr(i, 3), two = src.substr(i, 2);
      if (three === '=== ' || three === '=!=' ) { }
      if (i + 2 < n && (src.substr(i, 3) === '===' || src.substr(i, 3) === '=!=')) {
        toks.push({ t: 'sym', v: src.substr(i, 3) }); i += 3; continue;
      }
      if (i + 1 < n && ['==', '<=', '>=', '||', '&&', ':=', '->', '=>', '::', '..'].indexOf(src.substr(i, 2)) >= 0) {
        toks.push({ t: 'sym', v: src.substr(i, 2) }); i += 2; continue;
      }
      toks.push({ t: 'sym', v: c }); i++;
    }
    return toks;
  }

  /* =====================================================================
   * 7. 解析器（mixfix）
   * --------------------------------------------------------------------
   * 算子的"形式"由名字里的 _ 决定： _ 的位置给出参数位置，
   * 其余字面部分（含 if / then / { / } / [ / , / : / ; 等）按出现顺序
   * 分别落在 lead（第 1 个参数之前）、gaps[k]（第 k 个参数之前）、
   * trail（最后一个参数之后）。
   *   '_+_'            lead=[]      gaps[1]=['+']       trail=[]
   *   'p_'             lead=['p']   gaps[0]=[]          trail=[]
   *   '_|_'            lead=[]      gaps[1]=['|']       trail=[]
   *   '(_,_)'          lead=['(']   gaps[1]=[',']       trail=[')']
   *   '[_.._]'         lead=['[']   gaps[1]=['..']      trail=[']']
   *   'H[_]_'          lead=['H','[']  gaps[1]=[']']    trail=[]
   *   'if_then{_}else{_}' lead=['if'] gaps[1]=['then','{']
   *                                    gaps[2]=['}','else','{'] trail=['}']
   *   '_:=_;'          lead=[]      gaps[1]=[':=']      trail=[';']
   * ===================================================================== */
  var DEFAULT_PREC = 20;

  function bpOf(prec) { return 100 - (prec === undefined ? DEFAULT_PREC : prec); }

  function litTokens(s) {
    var out = [], ts = tokenize(s), i;
    for (i = 0; i < ts.length; i++) if (ts[i].t !== 'nl') out.push(ts[i]);
    return out;
  }

  function opForm(name) {
    if (name.indexOf('_') < 0) return { kind: 'call', name: name, arity: 0, lead: [], gaps: [], trail: [] };
    var segs = name.split('_');
    var arity = segs.length - 1;
    var lead = [], gaps = [], cur = [], i, j;
    for (i = 0; i < segs.length; i++) {
      if (segs[i]) {
        var tk = litTokens(segs[i]);
        for (j = 0; j < tk.length; j++) cur.push(tk[j]);
      }
      if (i < arity) {
        if (i === 0) { lead = cur; gaps[0] = []; }
        else { gaps[i] = cur; }
        cur = [];
      }
    }
    return { kind: 'mixfix', name: name, arity: arity, lead: lead, gaps: gaps, trail: cur };
  }

  function Parser(toks, mod) {
    this.toks = toks; this.i = 0; this.mod = mod;
    this._skipNl();
  }
  Parser.prototype.peek = function (k) { return this.toks[this.i + (k || 0)]; };
  Parser.prototype.next = function () { return this.toks[this.i++]; };
  Parser.prototype._skipNl = function () { while (this.i < this.toks.length && this.toks[this.i].t === 'nl') this.i++; };
  Parser.prototype.at = function (t, v) {
    var p = this.peek();
    if (!p) return false;
    if (t && p.t !== t) return false;
    if (v !== undefined && p.v !== v) return false;
    return true;
  };
  Parser.prototype.eatTok = function (lit) {
    var p = this.peek();
    if (p && p.v === lit.v) { this.i++; this._skipNl(); return true; }
    return false;
  };
  Parser.prototype.eat = function (t, v) {
    if (this.at(t, v)) { this.i++; this._skipNl(); return true; }
    return false;
  };
  Parser.prototype.expect = function (t, v) {
    if (!this.eat(t, v)) {
      var p = this.peek();
      throw new Error('解析错误：期望 ' + (v || t) + '，却遇到 ' + (p ? (p.v || p.t) : '文件结束'));
    }
  };

  Parser.prototype.precOf = function (name) {
    var at = this.mod.attr(name);
    if (at.prec !== undefined) return at.prec;
    if (PREC_OF[name] !== undefined) return PREC_OF[name];
    return DEFAULT_PREC;
  };

  Parser.prototype.parseTerm = function (minBp, stops) {
    var left = this.parseAtom(stops);
    return this.parseTail(left, minBp, stops);
  };

  Parser.prototype.parseTail = function (left, minBp, stops) {
    for (var guard = 0; guard < 400; guard++) {
      this._skipNl();
      var p = this.peek();
      if (!p) break;
      if (stops && stops[p.v]) break;
      var cand = this.matchInfix(p);
      if (cand) {
        if (cand.bp < minBp) break;
        var save = this.i;
        var r1 = this.tryInfixAt(cand, left, stops, cand.rightBp);
        if (!r1) { this.i = save; break; }
        var chosen = r1;
        /* 类型导向的回退：[2 | 1 | 0 | nil] 左结合会得到非法排序，改用右结合 */
        if (sortOf(r1.term, this.mod) === null) {
          this.i = save;
          var r2 = this.tryInfixAt(cand, left, stops, cand.bp);
          if (r2 && sortOf(r2.term, this.mod) !== null) chosen = r2;
          else if (r2) chosen = r2;
        }
        this.i = chosen.end;
        left = chosen.term;
        continue;
      }
      /* 并置（juxtaposition）：f g 形式，如多重集 1 2 3 */
      var jop = this.juxtaOp();
      if (jop && this.canStartAtom(p) && minBp <= bpOf(this.precOf(jop))) {
        var jbp = bpOf(this.precOf(jop));
        var rhs = this.parseTerm(jbp, stops);
        left = mkApp(jop, [left, rhs], this.mod);
        continue;
      }
      break;
    }
    return left;
  };

  /* 尝试把 left 与后面的部分组合成一个中缀项；失败则回滚并返回 null */
  Parser.prototype.tryInfixAt = function (cand, left, stops, rightBp) {
    var save = this.i, ok = true, k, q;
    for (k = 0; k < cand.f.lead.length; k++) if (!this.eatTok(cand.f.lead[k])) { ok = false; break; }
    var args = [left];
    if (ok) {
      for (k = 1; k < cand.f.arity; k++) {
        var g = cand.f.gaps[k] || [];
        for (q = 0; q < g.length; q++) if (!this.eatTok(g[q])) { ok = false; break; }
        if (!ok) break;
        try { args.push(this.parseTerm(rightBp, stops)); } catch (e) { ok = false; break; }
      }
    }
    if (ok) for (q = 0; q < cand.f.trail.length; q++) if (!this.eatTok(cand.f.trail[q])) { ok = false; break; }
    if (!ok) { this.i = save; return null; }
    return { term: mkApp(cand.f.name, args, this.mod), end: this.i };
  };

  Parser.prototype.juxtaOp = function () {
    if (this.mod.hasOp('__')) return '__';
    if (this.mod.hasOp('_ _')) return '_ _';
    return null;
  };

  Parser.prototype.matchInfix = function (p) {
    var best = null;
    for (var name in this.mod.ranks) {
      if (name.indexOf('_') < 0) continue;
      var f = opForm(name);
      if (f.arity < 1) continue;
      if (f.lead.length) continue;                 /* 有 lead 的当作前缀/括号式 */
      var trig = (f.arity === 1) ? (f.trail.length ? f.trail[0] : null)
        : (f.gaps[1] && f.gaps[1][0]);
      if (!trig || trig.v !== p.v) continue;
      var prec = this.precOf(name);
      var bp = bpOf(prec);
      if (!best || bp > best.bp) {
        best = { f: f, bp: bp, rightBp: this.mod.attr(name).rassoc ? bp : bp + 1 };
      }
    }
    return best;
  };

  Parser.prototype.canStartAtom = function (p) {
    if (!p) return false;
    if (p.t === 'num' || p.t === 'qid' || p.t === 'str') return true;
    if (p.t === 'sym' && (p.v === '(' || p.v === '{' || p.v === '[' || p.v === '|')) return true;
    if (p.t === 'id') {
      if (KEYWORDS[p.v] && p.v !== 'true' && p.v !== 'false' && p.v !== 'if' && p.v !== 'where') return false;
      return true;
    }
    return false;
  };

  Parser.prototype.parseAtom = function (stops) {
    this._skipNl();
    var p = this.peek();
    if (!p) throw new Error('解析错误：表达式不完整');
    if (p.t === 'num') {
      this.next(); this._skipNl();
      if (this.mod.ranks[p.v] && this.mod.arity(p.v) === 0 && !this.mod.sorts.isSort('Nat')) return con(p.v);
      return num(p.v);
    }
    if (p.t === 'qid') { this.next(); this._skipNl(); return con(p.v); }
    if (p.t === 'str') { this.next(); this._skipNl(); return { k: 'c', op: '"' + p.v + '"' }; }
    if (p.t === 'id' && (p.v === 'if' || p.v === 'while' || p.v === 'for')) {
      var kw = this.tryKeywordOp(p.v, stops);
      if (kw) return kw;
    }
    var pre = this.tryPrefix(stops);
    if (pre) return pre;
    if (p.t === 'sym' && p.v === '(') return this.parseParen();
    if (p.t === 'sym' && p.v === '{') {
      this.next(); this._skipNl();
      var e = this.parseTerm(0, stops);
      this.expect('sym', '}');
      return e;
    }
    if (p.t === 'sym' && p.v === '[') {
      /* 列表区间 [2 .. 5] */
      this.next(); this._skipNl();
      var a = this.parseTerm(0, { '..': 1 });
      this.expect('sym', '..');
      var b = this.parseTerm(0, { ']': 1 });
      this.expect('sym', ']');
      if (this.mod.hasOp('[_.._]')) return mkApp('[_.._]', [a, b], this.mod);
      throw new Error('解析错误：未声明 [_.._]');
    }
    /* 括号式调用 f(...)，名字也可以是符号（如 #） */
    var pn0 = this.peek(1);
    if (pn0 && pn0.t === 'sym' && pn0.v === '(' && this.mod.hasOp(p.v)) {
      var fname = p.v;
      this.next(); this.next(); this._skipNl();
      var cargs = [];
      if (!this.at('sym', ')')) {
        for (;;) {
          cargs.push(this.parseTerm(0, { ')': 1 }));
          if (this.eat('sym', ',')) continue;
          break;
        }
      }
      this.expect('sym', ')');
      return mkApp(fname, cargs, this.mod);
    }
    if (p.t === 'id') {
      var nm = p.v;
      var pn = this.peek(1);
      if (pn && pn.t === 'sym' && pn.v === '(' && this.mod.hasOp(nm)) {
        this.next(); this.next(); this._skipNl();
        var args = [];
        if (!this.at('sym', ')')) {
          for (;;) {
            args.push(this.parseTerm(0, { ')': 1 }));
            if (this.eat('sym', ',')) continue;
            break;
          }
        }
        this.expect('sym', ')');
        return mkApp(nm, args, this.mod);
      }
      this.next(); this._skipNl();
      if (this.mod.varSorts[nm]) return vr(nm, this.mod.varSorts[nm]);
      if (this.mod.ranks[nm] && this.mod.arity(nm) === 0) return con(nm);
      if (nm === 'true' || nm === 'false') return con(nm);
      this.mod._undeclared = this.mod._undeclared || {};
      this.mod._undeclared[nm] = true;
      return vr(nm, null);
    }
    throw new Error('解析错误：无法处理的记号 "' + (p.v || p.t) + '"');
  };

  Parser.prototype.parseParen = function () {
    this.expect('sym', '(');
    var items = [];
    if (!this.at('sym', ')')) {
      for (;;) {
        items.push(this.parseTerm(0, { ',': 1, ')': 1 }));
        if (this.eat('sym', ',')) continue;
        break;
      }
    }
    this.expect('sym', ')');
    if (items.length === 1) return items[0];
    var want = '';
    for (var i = 0; i < items.length; i++) want += (i ? ',' : '') + '_';
    var opn = '(' + want + ')';
    if (this.mod.hasOp(opn)) return mkApp(opn, items, this.mod);
    throw new Error('解析错误：没有 ' + items.length + ' 元组算子');
  };

  /* 前缀 / 括号式算子 */
  Parser.prototype.tryPrefix = function (stops) {
    var p = this.peek();
    if (!p) return null;
    var cands = [], name;
    for (name in this.mod.ranks) {
      if (name.indexOf('_') < 0) continue;
      var f = opForm(name);
      if (!f.lead.length) continue;
      if (f.lead[0].v !== p.v) continue;
      if (f.lead.length === 1 && (p.v === '(' || p.v === '[')) continue; /* 交给 parseParen */
      cands.push({ f: f, name: name });
    }
    if (!cands.length) return null;
    cands.sort(function (a, b) { return b.f.lead.length - a.f.lead.length; });
    for (var ci = 0; ci < cands.length; ci++) {
      var c = cands[ci], f = c.f, save = this.i, ok = true, i, q, k;
      for (i = 0; i < f.lead.length; i++) if (!this.eatTok(f.lead[i])) { ok = false; break; }
      if (!ok) { this.i = save; continue; }
      var bp = bpOf(this.precOf(c.name));
      var bracket = (f.lead[0].v === '(' || f.lead[0].v === '[' || f.lead.length > 1 && f.lead[1].v === '[');
      var args = [];
      for (k = 0; k < f.arity; k++) {
        if (k > 0) {
          var g = f.gaps[k] || [];
          for (q = 0; q < g.length; q++) if (!this.eatTok(g[q])) { ok = false; break; }
          if (!ok) break;
        }
        var sub;
        if (k === 0) sub = bracket ? 0 : bp + 1;
        else {
          var gk = f.gaps[k] || [];
          var comma = gk.length && gk[0].v === ',';
          sub = (bracket && comma) ? 0 : bp + 1;
        }
        try { args.push(this.parseTerm(sub, stops)); } catch (e) { ok = false; break; }
      }
      if (ok) for (q = 0; q < f.trail.length; q++) if (!this.eatTok(f.trail[q])) { ok = false; break; }
      if (ok) return mkApp(c.name, args, this.mod);
      this.i = save;
    }
    return null;
  };

  /* if / while / for 关键字式 */
  Parser.prototype.tryKeywordOp = function (nm, stops) {
    var save = this.i;
    if (nm === 'if') {
      this.next(); this._skipNl();
      var cond = this.parseTerm(0, { then: 1 });
      if (!this.eat('id', 'then')) { this.i = save; return null; }
      var s1;
      if (this.at('sym', '{')) { this.next(); this._skipNl(); s1 = this.parseTerm(0, { '}': 1 }); this.expect('sym', '}'); }
      else s1 = this.parseTerm(0, { else: 1 });
      if (!this.eat('id', 'else')) { this.i = save; return null; }
      var s2;
      if (this.at('sym', '{')) { this.next(); this._skipNl(); s2 = this.parseTerm(0, { '}': 1 }); this.expect('sym', '}'); }
      else s2 = this.parseTerm(0, stops);
      var on = this.mod.hasOp('if_then{_}else{_}') ? 'if_then{_}else{_}' : 'if_{_}else{_}';
      return mkApp(on, [cond, s1, s2], this.mod);
    }
    if (nm === 'while') {
      this.next(); this._skipNl();
      var c2 = this.parseTerm(0, { '{': 1 });
      if (!this.eat('sym', '{')) { this.i = save; return null; }
      this._skipNl();
      var b = this.parseTerm(0, { '}': 1 });
      this.expect('sym', '}');
      return mkApp('while_{_}', [c2, b], this.mod);
    }
    if (nm === 'for') {
      this.next(); this._skipNl();
      var v = this.parseTerm(bpOf(90), {});
      var e1 = this.parseTerm(bpOf(90), {});
      var e2 = this.parseTerm(0, { '{': 1 });
      if (!this.eat('sym', '{')) { this.i = save; return null; }
      this._skipNl();
      var b2 = this.parseTerm(0, { '}': 1 });
      this.expect('sym', '}');
      var fn = this.mod.hasOp('for_ _ _{_}') ? 'for_ _ _{_}' : 'for_ _ _{_}';
      return mkApp(fn, [v, e1, e2, b2], this.mod);
    }
    return null;
  };

  /* =====================================================================
   * 8. 模块解析（mod! NAME { ... }）
   * ===================================================================== */
  function parseModuleText(src, registry) {
    var toks = tokenize(src);
    var p = new Parser(toks, new Module('__tmp__'));
    var created = [];
    while (p.i < p.toks.length) {
      p._skipNl();
      if (p.i >= p.toks.length) break;
      var t = p.peek();
      if (t.t === 'id' && (t.v === 'mod!' || t.v === 'mod*' || t.v === 'mod')) {
        p.next(); p._skipNl();
        var nameTok = p.next();
        var modName = nameTok.v;
        /* 跳过参数表 (E :: TRIV) */
        if (p.at('sym', '(')) {
          var depth = 0;
          while (p.i < p.toks.length) {
            var q = p.next();
            if (q.t === 'sym' && q.v === '(') depth++;
            if (q.t === 'sym' && q.v === ')') { depth--; if (depth === 0) break; }
          }
        }
        p._skipNl();
        p.expect('sym', '{');
        var mod = new Module(modName);
        parseModuleBody(p, mod, registry);
        p.expect('sym', '}');
        registry[modName] = mod;
        created.push(mod);
        continue;
      }
      /* 跳过无法识别的内容 */
      p.next();
    }
    return created;
  }

  function parseModuleBody(p, mod, registry) {
    p.mod = mod;
    while (p.i < p.toks.length) {
      p._skipNl();
      var t = p.peek();
      if (!t) return;
      if (t.t === 'sym' && t.v === '}') return;
      if (t.t === 'str' || (t.t === 'id' && (t.v === 'imports' || t.v === 'signature' || t.v === 'axioms'))) { p.next(); continue; }
      if (t.t === 'id' && (t.v === 'pr' || t.v === 'protecting')) {
        p.next(); p._skipNl();
        p.expect('sym', '(');
        var iname = p.next().v;
        p.expect('sym', ')');
        mod.imports.push(iname);
        importInto(mod, iname, registry);
        continue;
      }
      if (t.t === 'id' && (t.v === 'principal-sort' || t.v === 'principal')) {
        p.next(); p._skipNl();
        mod.principal = p.next().v;
        mod.sorts.ensure(mod.principal);
        continue;
      }
      if (t.t === 'sym' && t.v === '[') {
        p.next(); p._skipNl();
        var subs = [], sups = [], mode = 'sub';
        for (;;) {
          var u = p.peek();
          if (!u) break;
          if (u.t === 'sym' && u.v === ']') { p.next(); break; }
          if (u.t === 'sym' && u.v === '<') { mode = 'sup'; p.next(); continue; }
          if (u.t === 'id' || u.t === 'sym') {
            var sname = u.v;
            p.next();
            mod.sorts.ensure(sname);
            if (mode === 'sub') subs.push(sname); else sups.push(sname);
            continue;
          }
          p.next();
        }
        for (var si = 0; si < subs.length; si++) mod.sorts.addSub(subs[si], sups);
        if (!mod.principal && sups.length) mod.principal = sups[0];
        if (!mod.principal && subs.length) mod.principal = subs[0];
        continue;
      }
      if (t.t === 'id' && (t.v === 'op' || t.v === 'ops')) {
        parseOpDecl(p, mod, t.v === 'ops');
        continue;
      }
      if (t.t === 'id' && (t.v === 'var' || t.v === 'vars')) {
        parseVarDecl(p, mod, t.v === 'vars');
        continue;
      }
      if (t.t === 'id' && (t.v === 'eq' || t.v === 'ceq')) {
        parseEquation(p, mod, t.v === 'ceq');
        continue;
      }
      p.next();
    }
  }

  function importInto(mod, iname, registry) {
    var src = registry[iname];
    if (!src) { mod.notes.push('未找到模块 ' + iname + '（已忽略导入）'); return; }
    var k, i;
    for (k in src.sorts.all) mod.sorts.ensure(k);
    for (k in src.sorts.sup) {
      for (i = 0; i < src.sorts.sup[k].length; i++) mod.sorts.addSub(k, [src.sorts.sup[k][i]]);
    }
    for (k in src.ranks) for (i = 0; i < src.ranks[k].length; i++) {
      var r = src.ranks[k][i];
      mod.addRank(k, r.args, r.co, JSON.parse(JSON.stringify(r.attrs)));
    }
    for (k in src.varSorts) mod.varSorts[k] = src.varSorts[k];
    mod.eqs = mod.eqs.concat(src.eqs.map(function (e) { return e; }));
    if (!mod.principal) mod.principal = src.principal;
  }

  function parseOpDecl(p, mod, plural) {
    p.next(); p._skipNl();
    /* 收集名字：可能带 _ 的算子名，或一组标识符 */
    var names = [];
    if (plural) {
      for (;;) {
        var u = p.peek();
        if (!u) break;
        if (u.t === 'sym' && u.v === ':') break;
        if (u.t === 'nl') { p._skipNl(); continue; }
        names.push(u.v); p.next();
      }
    } else {
      /* 单数：名字可能由多段组成（mixfix），直到 ':' */
      var buf = '';
      for (;;) {
        var v = p.peek();
        if (!v) break;
        if (v.t === 'sym' && v.v === ':') break;
        if (v.t === 'nl') { p._skipNl(); continue; }
        if (v.t === 'str') { p.next(); continue; }
        buf += (v.t === 'sym' ? v.v : v.v);
        if (v.t === 'id' && (v.v === 'prec' || v.v === 'strat')) { }
        p.next();
        var nx = p.peek();
        if (!nx) break;
      }
      names.push(buf);
    }
    p._skipNl();
    p.expect('sym', ':');
    /* 排序列表 -> 排序 */
    var sortsList = [];
    for (;;) {
      p._skipNl();
      var s = p.peek();
      if (!s) break;
      if (s.t === 'sym' && s.v === '->') break;
      if (s.t === 'id') { sortsList.push(s.v); p.next(); continue; }
      p.next();
    }
    p.expect('sym', '->');
    p._skipNl();
    var co = p.next().v;
    /* 属性 { ... } */
    var attrs = {};
    p._skipNl();
    if (p.at('sym', '{')) {
      p.next();
      attrs = parseAttrs(p);
    }
    p._skipNl();
    if (p.at('sym', '.')) { p.next(); }
    for (var i = 0; i < names.length; i++) {
      var nm = names[i].trim();
      if (!nm) continue;
      mod.addRank(nm, sortsList.slice(), co, JSON.parse(JSON.stringify(attrs)));
    }
  }

  function parseAttrs(p) {
    var attrs = {};
    for (;;) {
      p._skipNl();
      var t = p.peek();
      if (!t || (t.t === 'sym' && t.v === '}')) { if (t) p.next(); break; }
      if (t.t === 'id' || t.t === 'sym') {
        p.next();
        var nm = t.v;
        if (nm === 'strat') {
          p._skipNl();
          if (p.at('sym', ':')) p.next();
          p._skipNl();
          if (p.at('sym', '(')) {
            p.next();
            var arr = [];
            for (;;) {
              p._skipNl();
              var u = p.peek();
              if (!u || (u.t === 'sym' && u.v === ')')) { if (u) p.next(); break; }
              if (u.t === 'num') { arr.push(parseInt(u.v, 10)); p.next(); continue; }
              p.next();
            }
            attrs.strat = arr;
          }
        } else if (nm === 'prec') {
          p._skipNl();
          if (p.at('sym', ':')) p.next();
          p._skipNl();
          var w = p.peek();
          if (w && w.t === 'num') { attrs.prec = parseInt(w.v, 10); p.next(); }
        } else if (nm === 'id' || nm === 'idr' || nm === 'idl' || nm === 'idem') {
          p._skipNl();
          if (p.at('sym', ':')) p.next();
          p._skipNl();
          var z = p.peek();
          if (z) { attrs.id = z.v === '_' ? '_' : z.v; p.next(); }
          attrs.idKind = nm;
        } else {
          attrs[nm] = true;
        }
      } else p.next();
    }
    return attrs;
  }

  function parseVarDecl(p, mod, plural) {
    p.next(); p._skipNl();
    var names = [];
    for (;;) {
      var u = p.peek();
      if (!u) break;
      if (u.t === 'sym' && u.v === ':') break;
      if (u.t === 'nl') { p._skipNl(); continue; }
      names.push(u.v); p.next();
    }
    p._skipNl();
    p.expect('sym', ':');
    p._skipNl();
    var s = p.next();
    for (var i = 0; i < names.length; i++) mod.varSorts[names[i]] = s.v;
    mod.sorts.ensure(s.v);
    p._skipNl();
    if (p.at('sym', '.')) p.next();
  }

  function parseEquation(p, mod, cond) {
    p.next(); p._skipNl();
    var name = null;
    if (p.at('sym', '[')) {
      /* 只有形如 [label] : 才是等式标签；否则 '[' 是项的一部分，如 [2 .. 5] */
      var saveL = p.i, nx1 = p.peek(1), nx2 = p.peek(2), nx3 = p.peek(3);
      if (nx1 && (nx1.t === 'id' || nx1.t === 'qid') && nx2 && nx2.v === ']' && nx3 && nx3.v === ':') {
        p.next(); name = p.next().v; p.expect('sym', ']'); p._skipNl();
        p.expect('sym', ':');
        p._skipNl();
      } else p.i = saveL;
    }
    var lhs = p.parseTerm(0, { '=': 1 });
    if (!p.at('sym', '=')) {
      /* 不是等式，跳过 */
      while (p.i < p.toks.length && !(p.peek().t === 'sym' && p.peek().v === '.')) p.next();
      if (p.at('sym', '.')) p.next();
      return;
    }
    p.next();
    var rhs = p.parseTerm(0, { if: 1, '.' : 1 });
    var c = null;
    if (cond) {
      if (p.eat('id', 'if')) c = p.parseTerm(0, { '.': 1 });
    }
    p._skipNl();
    if (p.at('sym', '.')) p.next();
    mod.eqs.push({ lhs: lhs, rhs: rhs, cond: c, name: name });
  }

  /* =====================================================================
   * 9. 内建数值/布尔运算
   * ===================================================================== */
  function numVal(t) { return t.k === 'num' ? BigInt(t.n) : null; }
  function isNum(t) { return t.k === 'num'; }
  function mkNumFromBig(b) { return b < 0n ? num(0) : num(b.toString()); }

  var NUM_OPS = {
    '_+_': { lab: '(+)', f: function (a, b) { return a + b; } },
    '_*_': { lab: '(*)', f: function (a, b) { return a * b; } },
    '_quo_': { lab: '(quo)', f: function (a, b) { return b === 0n ? null : a / b; } },
    '_rem_': { lab: '(rem)', f: function (a, b) { return b === 0n ? null : a % b; } },
    'sd': { lab: '(sd)', f: function (a, b) { return a > b ? a - b : b - a; } },
    'p_': { lab: '(p)', f: function (a) { return a === 0n ? null : a - 1n; } },
    's_': { lab: '(s)', f: function (a) { return a + 1n; } },
    '_-_': { lab: '(-)', f: function (a, b) { return a >= b ? a - b : b - a; } }
  };
  var BOOL_OPS = {
    '_<_': { lab: '(<)', f: function (a, b) { return a < b; } },
    '_>_': { lab: '(>)', f: function (a, b) { return a > b; } },
    '_<=_': { lab: '(<=)', f: function (a, b) { return a <= b; } },
    '_>=_': { lab: '(>=)', f: function (a, b) { return a >= b; } },
    '_divides_': { lab: '(divides)', f: function (a, b) { return b % a === 0n; } }
  };

  function numericRoot(t, mod) {
    if (t.k !== 'a') return null;
    var op = t.op, i;
    /* 1) 算术：只有结果排序在 Nat 之下才当作内建数值（PNat 的 s/+/* 不走这里）*/
    if (NUM_OPS[op]) {
      var co = sortOf(t, mod);
      if (!co || !mod.sorts.le(co, 'Nat')) return null;
      var ar = (op === 'p_' || op === 's_') ? 1 : 2;
      if (t.args.length !== ar) return null;
      var vals = [];
      for (i = 0; i < t.args.length; i++) {
        var v = numVal(t.args[i]);
        if (v === null) return null;
        vals.push(v);
      }
      var r = NUM_OPS[op].f.apply(null, vals);
      if (r === null) return null;
      return { term: mkNumFromBig(r), rule: NUM_OPS[op].lab };
    }
    /* 2) 比较（参数必须都是数字字面量）*/
    if (BOOL_OPS[op] && t.args.length === 2) {
      var a = numVal(t.args[0]), b = numVal(t.args[1]);
      if (a === null || b === null) return null;
      return { term: con(BOOL_OPS[op].f(a, b) ? 'true' : 'false'), rule: BOOL_OPS[op].lab };
    }
    /* 2.5) 相等 = / 行为相等 == ：数字比较，否则范式结构比较 */
    if ((op === '_==_' || op === '_=_') && t.args.length === 2) {
      var na = numVal(t.args[0]), nb = numVal(t.args[1]);
      var same = (na !== null && nb !== null) ? (na === nb) : eqTerm(t.args[0], t.args[1]);
      if (op === '_==_') return { term: con(same ? 'true' : 'false'), rule: '(==)' };
      /* CafeOBJ 的 = 只靠等式归约：相等则 true，否则原样停留（不比 false）*/
      if (same) return { term: con('true'), rule: '(=)' };
      if (na !== null && nb !== null) return { term: con('false'), rule: '(=)' };
      return null;
    }
    /* 3) 布尔运算 */
    if (op === 'not_') {
      var x = t.args[0];
      if (x.k === 'c' && (x.op === 'true' || x.op === 'false'))
        return { term: con(x.op === 'true' ? 'false' : 'true'), rule: '(not)' };
    }
    if (op === '_and_' || op === '_or_') {
      var l = t.args[0], rr = t.args[1];
      if (l.k === 'c' && rr.k === 'c' && (l.op === 'true' || l.op === 'false') && (rr.op === 'true' || rr.op === 'false')) {
        var lb = l.op === 'true', rb = rr.op === 'true';
        var out = op === '_and_' ? (lb && rb) : (lb || rb);
        return { term: con(out ? 'true' : 'false'), rule: op === '_and_' ? '(and)' : '(or)' };
      }
    }
    return null;
  }

  /* =====================================================================
   * 10. 重写：一处重写 + E-strategy
   * ===================================================================== */
  function rootRewrite(t, mod) {
    /* 1) 等式（按声明顺序） */
    for (var i = 0; i < mod.eqs.length; i++) {
      var eq = mod.eqs[i];
      var b = Object.create(null);
      if (match(eq.lhs, t, b, mod, 0)) {
        if (eq.cond) {
          var c = reduce(substAc(eq.cond, b, mod), mod, { maxSteps: 4000 });
          if (!(c.term.k === 'c' && c.term.op === 'true')) continue;
        }
        var rhs = substAc(eq.rhs, b, mod);
        return { term: rhs, rule: eq.name || '(anon)', subst: b };
      }
    }
    /* 2) AC 单位元（id:）消除 */
    if (t.k === 'a') {
      var at = attrsOf(t, mod);
      if (at.id && t.args.length > 1) {
        var kept = [], removed = false;
        for (var k = 0; k < t.args.length; k++) {
          var a = t.args[k];
          if (a.k === 'c' && a.op === at.id) { removed = true; continue; }
          kept.push(a);
        }
        if (removed) {
          return { term: combineTerms(t.op, kept, mod), rule: '(id:' + at.id + ')', subst: {} };
        }
      }
    }
    /* 3) 内建数值/布尔 */
    var nr = numericRoot(t, mod);
    if (nr) return { term: nr.term, rule: nr.rule, subst: {} };
    return null;
  }

  var CMP_OPS = { '_=_': 1, '_==_': 1, '_<_': 1, '_>_': 1, '_<=_': 1, '_>=_': 1, '_divides_': 1 };

  function strategyOf(mod, t) {
    if (!t || t.k !== 'a') return [];
    var r = rankOf(t, mod);
    var at = r ? r.attrs : (mod.attr(t.op) || {});
    if (at && at.strat && at.strat.length) return at.strat;
    var n = t.args.length;
    if (/if/.test(t.op) && /else/.test(t.op) && n === 3) return [1, 0, 2, 3];
    /* 比较/相等：必须先把两边都归约，再判定 */
    if (CMP_OPS[t.op] && n === 2) return [1, 2, 0];
    if (at && at.comm && n === 2) return [1, 0, 2];
    var s = [];
    for (var i = 1; i <= n; i++) s.push(i);
    s.push(0);
    return s;
  }

  /* 找到下一个 redex（按 E-strategy），返回 {path, rule, contract, subst, redex} */
  function findRedex(t, path, mod, stratOverride) {
    if (t.k === 'c') {
      var rc = rootRewrite(t, mod);
      if (rc) return { path: path, rule: rc.rule, contract: rc.term, subst: rc.subst || {}, redex: t };
      return null;
    }
    if (t.k !== 'a') return null;
    var strat = (stratOverride && stratOverride[t.op]) || strategyOf(mod, t);
    var cur = t;
    for (var si = 0; si < strat.length; si++) {
      var j = strat[si];
      if (j === 0) {
        var rr = rootRewrite(cur, mod);
        if (rr) {
          return { path: path, rule: rr.rule, contract: rr.term, subst: rr.subst || {}, redex: cur };
        }
      } else if (j <= cur.args.length) {
        var sub = findRedex(cur.args[j - 1], path.concat([j - 1]), mod, stratOverride);
        if (sub) return sub;
      }
    }
    return null;
  }

  function replaceAt(t, path, repl) {
    if (path.length === 0) return repl;
    var idx = path[0];
    var newArgs = t.args.slice();
    newArgs[idx] = replaceAt(t.args[idx], path.slice(1), repl);
    return { k: 'a', op: t.op, args: newArgs };
  }

  /* ---- 归约（reduce）---- */
  function reduce(t, mod, opts) {
    opts = opts || {};
    var maxSteps = opts.maxSteps || MAX_STEPS_DEFAULT;
    var steps = [];
    var cur = t;
    var n = 0;
    var stratOverride = opts.strat || null;
    while (n < maxSteps) {
      var rd = findRedex(cur, [], mod, stratOverride);
      if (!rd) break;
      var next = replaceAt(cur, rd.path, rd.contract);
      n++;
      if (opts.trace) {
        steps.push({
          from: cur, to: next, rule: rd.rule, subst: rd.subst,
          redex: rd.redex, position: posString(rd.path), path: rd.path
        });
      }
      cur = next;
    }
    return { term: cur, sort: sortOf(cur, mod), steps: steps, count: n, truncated: n >= maxSteps };
  }

  function posString(path) {
    if (!path.length) return 'ε';
    var out = '';
    for (var i = 0; i < path.length; i++) out += (i ? '.' : '') + (path[i] + 1);
    return out;
  }

  /* =====================================================================
   * 11. 会话：open / red / close
   * ===================================================================== */
  function Interpreter(registry) {
    this.registry = registry || {};
    this.current = null;
    this.output = [];
  }
  Interpreter.prototype.open = function (name) {
    var m = this.registry[name];
    if (!m) throw new Error('没有名为 ' + name + ' 的模块');
    this.current = m;
    return m;
  };
  Interpreter.prototype.red = function (termText, opts) {
    if (!this.current) throw new Error('请先 open 一个模块');
    var mod = this.current;
    var p = new Parser(tokenize(termText), mod);
    var t = p.parseTerm(0, {});
    p._skipNl();
    if (p.i < p.toks.length && !(p.peek().t === 'sym' && p.peek().v === '.')) {
      throw new Error('项解析后仍有多余内容：' + p.peek().v);
    }
    var r = reduce(t, mod, opts || {});
    var r2 = reduce(r.term, mod, { maxSteps: 50 }); /* 保证已充分归约 */
    return {
      input: t,
      inputText: formatTerm(t, mod),
      result: r2.term,
      resultText: formatTerm(r2.term, mod),
      sort: r2.sort,
      steps: r.steps,
      count: r.count + (r2.count || 0),
      mod: mod
    };
  };

  /* 复制一个模块，用于 open 时的局部扩充（声明不污染原模块）*/
  function cloneModule(mod, tag) {
    var m = new Module(mod.name + (tag || '@open'));
    var k;
    for (k in mod.sorts.all) m.sorts.all[k] = true;
    for (k in mod.sorts.sup) m.sorts.sup[k] = mod.sorts.sup[k].slice();
    m.sorts._cl = Object.create(null);
    for (var op in mod.ranks) {
      m.ranks[op] = mod.ranks[op].map(function (r) {
        var at = {};
        for (var kk in r.attrs) at[kk] = r.attrs[kk];
        return { args: r.args.slice(), co: r.co, attrs: at };
      });
    }
    for (k in mod.varSorts) m.varSorts[k] = mod.varSorts[k];
    m.eqs = mod.eqs.slice();
    m.principal = mod.principal;
    m.baseName = mod.name;
    return m;
  }

  /* 运行一段 .cafe 文本（支持 mod! / open / red / close，以及 open 中的声明）*/
  function runScript(src, registry, opts) {
    opts = opts || {};
    var out = [];
    var toks = tokenize(src);
    var p = new Parser(toks, new Module('__tmp__'));
    var reg = registry;
    var cur = null;
    var errors = [];
    var self = API;
    while (p.i < p.toks.length) {
      p._skipNl();
      if (p.i >= p.toks.length) break;
      var t = p.peek();
      try {
        if (t.t === 'id' && (t.v === 'mod!' || t.v === 'mod*' || t.v === 'mod')) {
          p.next(); p._skipNl();
          var name = p.next().v;
          if (p.at('sym', '(')) {
            var d = 0;
            while (p.i < p.toks.length) { var q = p.next(); if (q.t === 'sym' && q.v === '(') d++; if (q.t === 'sym' && q.v === ')') { d--; if (!d) break; } }
          }
          p._skipNl();
          p.expect('sym', '{');
          var mod = new Module(name);
          parseModuleBody(p, mod, reg);
          p.expect('sym', '}');
          reg[name] = mod;
          out.push({ kind: 'msg', text: '已定义模块 ' + name });
          continue;
        }
        if (t.t === 'id' && t.v === 'open') {
          p.next(); p._skipNl();
          var mn = p.next().v;
          p._skipNl(); if (p.at('sym', '.')) p.next();
          if (!reg[mn]) throw new Error('没有模块 ' + mn);
          cur = cloneModule(reg[mn], '@' + (opts.openTag || 'open'));
          p.mod = cur;
          out.push({ kind: 'msg', text: '打开模块 ' + mn });
          continue;
        }
        if (t.t === 'id' && (t.v === 'close' || t.v === 'quit')) {
          p.next(); p._skipNl(); if (p.at('sym', '.')) p.next();
          cur = null; p.mod = new Module('__tmp__');
          continue;
        }
        if (t.t === 'id' && (t.v === 'op' || t.v === 'ops')) {
          if (!cur) throw new Error('op 声明必须写在 open 之内');
          p.mod = cur;
          parseOpDecl(p, cur, t.v === 'ops');
          continue;
        }
        if (t.t === 'id' && (t.v === 'var' || t.v === 'vars')) {
          if (!cur) throw new Error('vars 声明必须写在 open 之内');
          p.mod = cur;
          parseVarDecl(p, cur, t.v === 'vars');
          continue;
        }
        if (t.t === 'id' && (t.v === 'eq' || t.v === 'ceq')) {
          if (!cur) throw new Error('eq 必须写在模块或 open 之内');
          p.mod = cur;
          parseEquation(p, cur, t.v === 'ceq');
          continue;
        }
        if (t.t === 'id' && (t.v === 'red' || t.v === 'reduce')) {
          p.next(); p._skipNl();
          if (!cur) throw new Error('red 之前必须先 open 一个模块');
          p.mod = cur;
          var term = p.parseTerm(0, { '.': 1 });
          p._skipNl(); if (p.at('sym', '.')) p.next();
          var r = reduce(term, cur, { trace: opts.trace, maxSteps: opts.maxSteps || MAX_STEPS_DEFAULT });
          out.push({
            kind: 'red', input: formatTerm(term, cur), result: formatTerm(r.term, cur),
            sort: r.sort, steps: r.steps, count: r.count, mod: cur, raw: term, out: r.term
          });
          continue;
        }
        if (t.t === 'id' && (t.v === 'set' || t.v === 'show')) {
          while (p.i < p.toks.length && !(p.peek().t === 'sym' && p.peek().v === '.')) p.next();
          if (p.at('sym', '.')) p.next();
          continue;
        }
        p.next();
      } catch (e) {
        errors.push(e.message);
        out.push({ kind: 'err', text: e.message });
        var guard = 0;
        while (p.i < p.toks.length && guard < 5000) {
          var z = p.next(); guard++;
          if (z.t === 'sym' && z.v === '.') break;
        }
      }
    }
    return { output: out, errors: errors, registry: reg };
  }

  /* =====================================================================
   * 12. 内建模块（用 CafeOBJ 源码形式定义）
   * ===================================================================== */
  var BUILTIN_SRC = [
    /* ---------- 基础：Bool + 相等 ---------- */
    ['BOOL',
      'mod! BOOL {\n' +
      '  [Bool]\n' +
      '  ops true false : -> Bool {constr}\n' +
      '  op not_ : Bool -> Bool\n' +
      '  op _and_ : Bool Bool -> Bool\n' +
      '  op _or_ : Bool Bool -> Bool\n' +
      '  op if_then{_}else{_} : Bool Bool Bool -> Bool\n' +
      '  vars B1 B2 : Bool\n' +
      '  eq not true = false .\n' +
      '  eq not false = true .\n' +
      '  eq true and B2 = B2 .\n' +
      '  eq false and B2 = false .\n' +
      '  eq true or B2 = true .\n' +
      '  eq false or B2 = B2 .\n' +
      '  eq if true then {B1} else {B2} = B1 .\n' +
      '  eq if false then {B1} else {B2} = B2 .\n' +
      '  op _=_ : Bool Bool -> Bool {comm}\n' +
      '  eq (X = X) = true .\n' +
      '}'],
    /* ---------- NAT ---------- */
    ['NAT',
      'mod! NAT {\n' +
      '  pr(BOOL)\n' +
      '  [Zero NzNat < Nat]\n' +
      '  op 0 : -> Zero {constr}\n' +
      '  op s_ : Nat -> NzNat\n' +
      '  op p_ : NzNat -> Nat\n' +
      '  op _+_ : Nat Nat -> Nat {assoc comm prec: 33}\n' +
      '  op _*_ : Nat Nat -> Nat {assoc comm prec: 31}\n' +
      '  op _-_ : Nat Nat -> Nat {prec: 33}\n' +
      '  op _quo_ : Nat NzNat -> Nat {prec: 31}\n' +
      '  op _rem_ : Nat NzNat -> Nat {prec: 31}\n' +
      '  op sd : Nat Nat -> Nat {prec: 0}\n' +
      '  op _divides_ : NzNat Nat -> Bool {prec: 50}\n' +
      '  op _<_ : Nat Nat -> Bool {prec: 50}\n' +
      '  op _>_ : Nat Nat -> Bool {prec: 50}\n' +
      '  op _<=_ : Nat Nat -> Bool {prec: 50}\n' +
      '  op _>=_ : Nat Nat -> Bool {prec: 50}\n' +
      '  op _==_ : Nat Nat -> Bool {prec: 50}\n' +
      '  op _=_ : Nat Nat -> Bool {comm}\n' +
      '}\n'],
    /* ---------- NAT-ERR ---------- */
    ['NAT-ERR',
      'mod! NAT-ERR {\n' +
      '  pr(NAT)\n' +
      '  [Nat ErrNat < Nat&Err]\n' +
      '  op errNat : -> ErrNat {constr}\n' +
      '  op _+_ : Nat&Err Nat&Err -> Nat&Err\n' +
      '  op _*_ : Nat&Err Nat&Err -> Nat&Err\n' +
      '  op if_then{_}else{_} : Bool Nat&Err Nat&Err -> Nat&Err\n' +
      '  vars NE1 NE2 : Nat&Err\n' +
      '  eq errNat + NE2 = errNat .\n' +
      '  eq NE1 + errNat = errNat .\n' +
      '  eq errNat * NE2 = errNat .\n' +
      '  eq NE1 * errNat = errNat .\n' +
      '  eq if true then {NE1} else {NE2} = NE1 .\n' +
      '  eq if false then {NE1} else {NE2} = NE2 .\n' +
      '}'],
    /* ---------- NATLIST ---------- */
    ['NATLIST',
      'mod! NATLIST {\n' +
      '  pr(NAT-ERR)\n' +
      '  [Nil NnNatList < NatList]\n' +
      '  op nil : -> Nil {constr}\n' +
      '  op _|_ : Nat NatList -> NnNatList {constr prec: 40}\n' +
      '  op hd : Nil -> ErrNat\n' +
      '  op hd : NnNatList -> Nat\n' +
      '  op hd : NatList -> Nat&Err\n' +
      '  op tl : NatList -> NatList\n' +
      '  op len : NatList -> Nat\n' +
      '  op _@_ : NatList NatList -> NatList {prec: 40}\n' +
      '  op [_.._] : Nat Nat -> NatList\n' +
      '  op if_then{_}else{_} : Bool NatList NatList -> NatList\n' +
      '  vars X Y : Nat\n' +
      '  vars L L2 : NatList\n' +
      '  eq hd(nil) = errNat .\n' +
      '  eq hd(X | L) = X .\n' +
      '  eq tl(nil) = nil .\n' +
      '  eq tl(X | L) = L .\n' +
      '  eq len(nil) = 0 .\n' +
      '  eq len(X | L) = s(len(L)) .\n' +
      '  eq nil @ L2 = L2 .\n' +
      '  eq (X | L) @ L2 = X | (L @ L2) .\n' +
      '  eq [X .. Y] = if X > Y then {nil} else {X | [X + 1 .. Y]} .\n' +
      '  eq if true then {L} else {L2} = L .\n' +
      '  eq if false then {L} else {L2} = L2 .\n' +
      '}'],
    /* ---------- FACT ---------- */
    ['FACT',
      'mod! FACT {\n' +
      '  pr(NAT)\n' +
      '  op fact : Nat -> Nat\n' +
      '  var NzX : NzNat\n' +
      '  eq fact(0) = 1 .\n' +
      '  eq fact(NzX) = NzX * fact(p NzX) .\n' +
      '}'],
    /* ---------- OEDC-FACT ---------- */
    ['OEDC-FACT',
      'mod! OEDC-FACT {\n' +
      '  pr(NAT)\n' +
      '  op cond : Bool Nat Nat -> Nat\n' +
      '  op g : Nat Nat -> Nat\n' +
      '  op oedc-fact : Nat -> Nat\n' +
      '  vars X Y : Nat\n' +
      '  var NzX : NzNat\n' +
      '  eq cond(true,X,Y) = X .\n' +
      '  eq cond(false,X,Y) = Y .\n' +
      '  eq g(X,Y) = cond(X > Y , g(X,2 * Y) * g(sd(X,Y),2 * Y), X) .\n' +
      '  eq oedc-fact(0) = 1 .\n' +
      '  eq oedc-fact(NzX) = g(NzX,1) .\n' +
      '}'],
    /* ---------- GCD ---------- */
    ['GCD',
      'mod! GCD {\n' +
      '  pr(NAT)\n' +
      '  op gcd : Nat Zero -> Nat\n' +
      '  op gcd : Nat NzNat -> NzNat\n' +
      '  op gcd : Nat Nat -> Nat\n' +
      '  var X : Nat\n' +
      '  var NzY : NzNat\n' +
      '  eq gcd(X,0) = X .\n' +
      '  eq gcd(X,NzY) = gcd(NzY,X rem NzY) .\n' +
      '}'],
    /* ---------- QSORT ---------- */
    ['QSORT',
      'mod! QSORT {\n' +
      '  pr(NATLIST)\n' +
      '  op qsort : NatList -> NatList\n' +
      '  op partition : Nat NatList NatList NatList -> NatList\n' +
      '  vars X Y : Nat\n' +
      '  vars L LL RL : NatList\n' +
      '  eq qsort(nil) = nil .\n' +
      '  eq qsort(X | nil) = X | nil .\n' +
      '  eq qsort(X | Y | L) = partition(X,Y | L,nil,nil) .\n' +
      '  eq partition(X,nil,LL,RL) = qsort(LL) @ (X | qsort(RL)) .\n' +
      '  eq partition(X,Y | L,LL,RL) = if Y < X then {partition(X,L,Y | LL,RL)} else {partition(X,L,LL,Y | RL)} .\n' +
      '}'],
    /* ---------- 有限筛法 ---------- */
    ['ERATOSTHENES-SIEVE-FIN',
      'mod! ERATOSTHENES-SIEVE-FIN {\n' +
      '  pr(NATLIST)\n' +
      '  op primesUpto : Nat -> NatList\n' +
      '  op sieve : NatList -> NatList\n' +
      '  op check : Nat NatList -> NatList\n' +
      '  vars X Y : Nat\n' +
      '  var NzX : NzNat\n' +
      '  var L : NatList\n' +
      '  eq primesUpto(X) = sieve([2 .. X]) .\n' +
      '  eq sieve(nil) = nil .\n' +
      '  eq sieve(X | L) = X | sieve(check(X,L)) .\n' +
      '  eq check(0,L) = L .\n' +
      '  eq check(NzX,nil) = nil .\n' +
      '  eq check(NzX,Y | L) = if NzX divides Y then {check(NzX,L)} else {Y | check(NzX,L)} .\n' +
      '}'],
    /* ---------- E-strategy 演示 ---------- */
    ['NAT-TRIPLE-IMLM',
      'mod! NAT-TRIPLE-IMLM {\n' +
      '  pr(NAT)\n' +
      '  [NatTriple]\n' +
      '  op (_,_,_) : Nat Nat Nat -> NatTriple {constr}\n' +
      '  op 1st : NatTriple -> Nat {strat: (1 0)}\n' +
      '  vars FE SE TE : Nat\n' +
      '  eq 1st((FE,SE,TE)) = FE .\n' +
      '}'],
    ['NAT-TRIPLE-OMLM',
      'mod! NAT-TRIPLE-OMLM {\n' +
      '  pr(NAT)\n' +
      '  [NatTriple]\n' +
      '  op (_,_,_) : Nat Nat Nat -> NatTriple {constr}\n' +
      '  op 1st : NatTriple -> Nat {strat: (0 1 0)}\n' +
      '  vars FE SE TE : Nat\n' +
      '  eq 1st((FE,SE,TE)) = FE .\n' +
      '}'],
    /* ---------- 无限表 ---------- */
    ['INF-LIST',
      'mod! INF-LIST {\n' +
      '  pr(NATLIST)\n' +
      '  [InfList]\n' +
      '  op _|_ : Nat InfList -> InfList {constr strat: (1 0) prec: 40}\n' +
      '  op take : InfList Nat -> NatList\n' +
      '  op drop : InfList Nat -> InfList\n' +
      '  op _@_ : NatList InfList -> InfList {prec: 40}\n' +
      '  op zip : InfList InfList -> InfList\n' +
      '  op if_then{_}else{_} : Bool InfList InfList -> InfList\n' +
      '  var X : Nat\n' +
      '  vars IL IL2 : InfList\n' +
      '  var NzN : NzNat\n' +
      '  var N : Nat\n' +
      '  var L : NatList\n' +
      '  eq take(IL,0) = nil .\n' +
      '  eq take(X | IL,NzN) = X | take(IL,p NzN) .\n' +
      '  eq drop(IL,0) = IL .\n' +
      '  eq drop(X | IL,NzN) = drop(IL,p NzN) .\n' +
      '  eq nil @ IL = IL .\n' +
      '  eq (X | L) @ IL = X | (L @ IL) .\n' +
      '  eq zip(X | IL,Y | IL2) = X | Y | zip(IL,IL2) .\n' +
      '  eq if true then {IL} else {IL2} = IL .\n' +
      '  eq if false then {IL} else {IL2} = IL2 .\n' +
      '}'],
    ['NAT-INF-LIST',
      'mod! NAT-INF-LIST {\n' +
      '  pr(INF-LIST)\n' +
      '  op mkNILFrom : Nat -> InfList\n' +
      '  var N : Nat\n' +
      '  eq mkNILFrom(N) = N | mkNILFrom(N + 1) .\n' +
      '}'],
    ['ERATOSTHENES-SIEVE',
      'mod! ERATOSTHENES-SIEVE {\n' +
      '  pr(NAT-INF-LIST)\n' +
      '  op primes : -> InfList\n' +
      '  op sieve : InfList -> InfList\n' +
      '  op check : Nat InfList -> InfList\n' +
      '  vars X Y : Nat\n' +
      '  var NzX : NzNat\n' +
      '  var IL : InfList\n' +
      '  eq primes = sieve(mkNILFrom(2)) .\n' +
      '  eq sieve(X | IL) = X | sieve(check(X,IL)) .\n' +
      '  eq check(0,IL) = IL .\n' +
      '  eq check(NzX,Y | IL) = if NzX divides Y then {check(NzX,IL)} else {Y | check(NzX,IL)} .\n' +
      '}'],
    ['HAMMING',
      'mod! HAMMING {\n' +
      '  pr(NAT-INF-LIST)\n' +
      '  op ham : -> InfList\n' +
      '  op 2* : InfList -> InfList\n' +
      '  op 3* : InfList -> InfList\n' +
      '  op 5* : InfList -> InfList\n' +
      '  op merge : InfList InfList -> InfList\n' +
      '  vars X Y : Nat\n' +
      '  vars IL IL2 : InfList\n' +
      '  eq ham = 1 | merge(merge(2*(ham),3*(ham)),5*(ham)) .\n' +
      '  eq 2*(X | IL) = 2 * X | 2*(IL) .\n' +
      '  eq 3*(X | IL) = 3 * X | 3*(IL) .\n' +
      '  eq 5*(X | IL) = 5 * X | 5*(IL) .\n' +
      '  eq merge(X | IL,Y | IL2) = if X < Y then {X | merge(IL,Y | IL2)} else {if Y < X then {Y | merge(X | IL,IL2)} else {X | merge(IL,IL2)}} .\n' +
      '}'],
    /* ---------- 多重集 ---------- */
    ['QID',
      'mod! QID {\n' +
      '  [Qid]\n' +
      '  ops \'a \'b \'c \'d \'e \'f \'g \'h \'i \'j \'k \'l \'m : -> Qid {constr}\n' +
      '  op _=_ : Qid Qid -> Bool {comm}\n' +
      '  op _==_ : Qid Qid -> Bool\n' +
      '}\n'],
    ['QID-NAT-PAIR',
      'mod! QID-NAT-PAIR {\n' +
      '  pr(QID)\n' +
      '  pr(NAT)\n' +
      '  [QNPair]\n' +
      '  op (_,_) : Qid Nat -> QNPair {constr}\n' +
      '}'],
    /* ---------- PNat（第 11 章） ---------- */
    ['PNAT1',
      'mod! PNAT1 {\n' +
      '  pr(BOOL)\n' +
      '  [PNat]\n' +
      '  op 0 : -> PNat {constr}\n' +
      '  op s_ : PNat -> PNat {constr}\n' +
      '  vars X Y : PNat\n' +
      '  eq (0 = s(Y)) = false .\n' +
      '  eq (s(X) = s(Y)) = (X = Y) .\n' +
      '  op _+_ : PNat PNat -> PNat {prec: 33}\n' +
      '  eq 0 + Y = Y .\n' +
      '  eq s(X) + Y = s(X + Y) .\n' +
      '  op _*_ : PNat PNat -> PNat {prec: 31}\n' +
      '  eq 0 * Y = 0 .\n' +
      '  eq s(X) * Y = (X * Y) + Y .\n' +
      '  op fact1 : PNat -> PNat\n' +
      '  eq fact1(0) = s(0) .\n' +
      '  eq fact1(s(X)) = s(X) * fact1(X) .\n' +
      '  op fact2 : PNat -> PNat\n' +
      '  op sfact2 : PNat PNat -> PNat\n' +
      '  eq fact2(X) = sfact2(X,s(0)) .\n' +
      '  eq sfact2(0,Y) = Y .\n' +
      '  eq sfact2(s(X),Y) = sfact2(X,s(X) * Y) .\n' +
      '}'],
    ['PNAT2',
      'mod! PNAT2 {\n' +
      '  pr(PNAT1)\n' +
      '  -- _+_ 已证明 assoc & comm，因此可以加属性\n' +
      '  op _+_ : PNat PNat -> PNat {assoc comm prec: 33}\n' +
      '}'],
    ['PNAT3',
      'mod! PNAT3 {\n' +
      '  pr(PNAT2)\n' +
      '  op _*_ : PNat PNat -> PNat {assoc comm prec: 31}\n' +
      '}'],
    /* ---------- List（第 12 章） ---------- */
    ['LIST1',
      'mod! LIST1 {\n' +
      '  pr(BOOL)\n' +
      '  [Elt]\n' +
      '  [List]\n' +
      '  op nil : -> List {constr}\n' +
      '  op _|_ : Elt List -> List {constr prec: 40}\n' +
      '  vars E E2 : Elt\n' +
      '  vars L1 L2 : List\n' +
      '  eq (nil = E | L1) = false .\n' +
      '  eq (E | L1 = E2 | L2) = (E = E2) and (L1 = L2) .\n' +
      '  op _@_ : List List -> List {prec: 40}\n' +
      '  eq nil @ L2 = L2 .\n' +
      '  eq (E | L1) @ L2 = E | (L1 @ L2) .\n' +
      '  op rev1 : List -> List\n' +
      '  eq rev1(nil) = nil .\n' +
      '  eq rev1(E | L1) = rev1(L1) @ (E | nil) .\n' +
      '  op rev2 : List -> List\n' +
      '  op sr2 : List List -> List\n' +
      '  eq rev2(L1) = sr2(L1,nil) .\n' +
      '  eq sr2(nil,L2) = L2 .\n' +
      '  eq sr2(E | L1,L2) = sr2(L1,E | L2) .\n' +
      '}'],
    ['LIST2',
      'mod! LIST2 {\n' +
      '  pr(LIST1)\n' +
      '  op _@_ : List List -> List {assoc prec: 40}\n' +
      '}'],
    ['BOOL-IF',
      'mod! BOOL-IF {\n' +
      '  pr(BOOL)\n' +
      '  op if_then{_}else{_} : Bool Bool Bool -> Bool\n' +
      '  vars B1 B2 : Bool\n' +
      '  eq if true then {B1} else {B2} = B1 .\n' +
      '  eq if false then {B1} else {B2} = B2 .\n' +
      '}\n'],
    ['NAT-IF',
      'mod! NAT-IF {\n' +
      '  pr(NAT)\n' +
      '  op if_then{_}else{_} : Bool Nat Nat -> Nat\n' +
      '  vars N1 N2 : Nat\n' +
      '  eq if true then {N1} else {N2} = N1 .\n' +
      '  eq if false then {N1} else {N2} = N2 .\n' +
      '}\n'],
    ['MULTISET-NAT',
      'mod! MULTISET-NAT {\n' +
      '  pr(NAT)\n' +
      '  [Nat < MSet]\n' +
      '  op emp : -> MSet {constr}\n' +
      '  op __ : MSet MSet -> MSet {constr assoc comm id: emp}\n' +
      '  op if_then{_}else{_} : Bool MSet MSet -> MSet\n' +
      '  vars MS1 MS2 : MSet\n' +
      '  eq if true then {MS1} else {MS2} = MS1 .\n' +
      '  eq if false then {MS1} else {MS2} = MS2 .\n' +
      '}\n'],
    ['MULTISET-PAIR',
      'mod! MULTISET-PAIR {\n' +
      '  pr(QID-NAT-PAIR)\n' +
      '  [QNPair < MSet]\n' +
      '  op emp : -> MSet {constr}\n' +
      '  op __ : MSet MSet -> MSet {constr assoc comm id: emp}\n' +
      '  op if_then{_}else{_} : Bool MSet MSet -> MSet\n' +
      '  vars MS1 MS2 : MSet\n' +
      '  eq if true then {MS1} else {MS2} = MS1 .\n' +
      '  eq if false then {MS1} else {MS2} = MS2 .\n' +
      '}\n'],
    ['TEST',
      'mod! TEST {\n' +
      '  pr(MULTISET-PAIR)\n' +
      '  op update : MSet Qid Nat -> MSet\n' +
      '  vars I J : Qid\n' +
      '  vars N N2 : Nat\n' +
      '  var MS : MSet\n' +
      '  eq update(emp,J,N2) = emp .\n' +
      '  eq update((I,N) MS,J,N2) = if I == J then {(I,N2) MS} else {(I,N) update(MS,J,N2)} .\n' +
      '}\n'],
    ['TEST2',
      'mod! TEST2 {\n' +
      '  pr(BOOL-IF)\n' +
      '  pr(NAT-IF)\n' +
      '  pr(MULTISET-PAIR)\n' +
      '  op # : MSet Qid -> Nat\n' +
      '  eq #(emp,J) = 0 .\n' +
      '  eq #((I,N) MS,J) = if I == J then {1 + #(MS,J)} else {#(MS,J)} .\n' +
      '  op isValid : MSet -> Bool\n' +
      '  eq isValid(emp) = true .\n' +
      '  eq isValid((I,N) MS) = if #(MS,I) > 0 then {false} else {isValid(MS)} .\n' +
      '  op update : MSet Qid Nat -> MSet\n' +
      '  ceq update((I,N) MS,I,N2) = (I,N2) MS if isValid((I,N) MS) .\n' +
      '  ceq update(MS,J,N2) = MS if (not isValid(MS)) or #(MS,J) == 0 .\n' +
      '}\n'],
  ];

  var REGISTRY = null;
  function builtins() {
    if (REGISTRY) return REGISTRY;
    REGISTRY = Object.create(null);
    /* BOOL 需要 _=_ 的隐式规则：X = X -> true */
    for (var i = 0; i < BUILTIN_SRC.length; i++) {
      var name = BUILTIN_SRC[i][0], src = BUILTIN_SRC[i][1];
      var mods = parseModuleText(src, REGISTRY);
    }
    REGISTRY.BOOL.eqs.unshift({ lhs: app('_=_', [vr('X', 'Bool'), vr('X', 'Bool')]), rhs: con('true'), cond: null, name: '(=)' });
    REGISTRY.BOOL.varSorts.X = 'Bool';
    REGISTRY.BOOL.eqs.push({ lhs: app('_=_', [con('true'), con('false')]), rhs: con('false'), cond: null, name: '(=)' });
    return REGISTRY;
  }

  /* =====================================================================
   * 13. 对外接口
   * ===================================================================== */
  var API = {
    tokenize: tokenize,
    Parser: Parser,
    Module: Module,
    parseModuleText: parseModuleText,
    runScript: runScript,
    builtins: builtins,
    reduce: reduce,
    match: match,
    rootRewrite: rootRewrite,
    formatTerm: formatTerm,
    sortOf: sortOf,
    eqTerm: eqTerm,
    findRedex: findRedex,
    replaceAt: replaceAt,
    posString: posString,
    strategyOf: strategyOf,
    num: num, con: con, vr: vr, app: app,
    version: '1.0'
  };

  global.CafeOBJ = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;

})(typeof window !== 'undefined' ? window : globalThis);
