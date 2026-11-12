/* =====================================================================
 * widgets.js — 所有可视化 / 动态组件
 * 依赖 engine.js（window.CafeOBJ）
 * ===================================================================== */
(function (global) {
  'use strict';
  var C = global.CafeOBJ;
  var REG = null;
  function reg() { if (!REG) REG = C.builtins(); return REG; }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function $(id) { return document.getElementById(id); }
  var W = {};

  /* =====================================================================
   * 1. 项树（SVG）
   * ===================================================================== */
  function nodeLabel(t) {
    if (t.k === 'num') return t.n;
    if (t.k === 'c') return t.op;
    if (t.k === 'v') return t.name;
    return t.op;
  }
  function children(t) { return t.k === 'a' ? t.args : []; }

  /* 两遍布局：先算宽度再定位 */
  function measure(t, gapX) {
    var kids = children(t);
    if (!kids.length) {
      var w0 = Math.max(56, nodeLabel(t).length * 8 + 24);
      return { w: w0, t: t };
    }
    var cw = [], tw = 0;
    for (var i = 0; i < kids.length; i++) { var m = measure(kids[i], gapX); cw.push(m); tw += m.w; }
    var selfW = Math.max(56, nodeLabel(t).length * 8 + 24);
    return { w: Math.max(tw, selfW), t: t, kids: cw, tw: tw };
  }
  function place(m, x, depth, path, out, gapX, gapY) {
    var kids = m.kids || [];
    var cx = x + m.w / 2;
    var y = depth * gapY;
    out.nodes.push({ x: cx, y: y, label: nodeLabel(m.t), kind: m.t.k, path: path, t: m.t, sub: m.t.k === 'a' ? m.t.op : null });
    var startX = x + (m.w - (m.tw || 0)) / 2;
    var cur = startX;
    for (var i = 0; i < kids.length; i++) {
      var childCx = cur + kids[i].w / 2;
      out.edges.push({ x1: cx, y1: y + 16, x2: childCx, y2: (depth + 1) * gapY - 16 });
      place(kids[i], cur, depth + 1, path.concat([i]), out, gapX, gapY);
      cur += kids[i].w;
    }
  }

  W.termTree = function (el, opts) {
    opts = opts || {};
    var mod = typeof opts.mod === 'string' ? reg()[opts.mod] : opts.mod;
    var t;
    try {
      var p = new C.Parser(C.tokenize(opts.term), mod);
      t = p.parseTerm(0, {});
    } catch (e) {
      el.innerHTML = '<div class="dim">解析失败：' + esc(e.message) + '</div>';
      return;
    }
    var m = measure(t, 12);
    var out = { nodes: [], edges: [] };
    place(m, 6, 0, [], out, 12, 76);
    var h = 0;
    out.nodes.forEach(function (n) { h = Math.max(h, n.y); });
    h += 44;
    var svg = '<svg viewBox="0 0 ' + (m.w + 12) + ' ' + h + '" width="' + Math.min(m.w + 12, 940) + '" height="' + h + '">';
    out.edges.forEach(function (e) {
      svg += '<path class="edge" d="M' + e.x1 + ' ' + e.y1 + ' C' + e.x1 + ' ' + ((e.y1 + e.y2) / 2) +
        ',' + e.x2 + ' ' + ((e.y1 + e.y2) / 2) + ',' + e.x2 + ' ' + e.y2 + '"/>';
    });
    var hi = opts.highlight || [];
    var hiStr = hi.map(function (p) { return p.join('.'); });
    out.nodes.forEach(function (n) {
      var cls = 'node-box';
      if (hiStr.indexOf(n.path.join('.')) >= 0) cls += ' hl-cur';
      var wBox = Math.max(56, n.label.length * 8 + 24);
      svg += '<rect class="' + cls + '" x="' + (n.x - wBox / 2) + '" y="' + (n.y - 15) + '" width="' + wBox + '" height="30" rx="9"/>';
      svg += '<text class="' + (n.kind === 'a' ? 'node-op' : 'node-lbl') + '" x="' + n.x + '" y="' + (n.y + 4) + '">' +
        esc(n.label) + '</text>';
    });
    svg += '</svg>';
    el.innerHTML = '<div class="widget-t"><b>项（term）结构</b><span>' + esc(opts.term) + '</span></div>' + svg +
      (opts.note ? '<div class="hint" style="text-align:left;margin-top:6px">' + opts.note + '</div>' : '');
  };

  /* =====================================================================
   * 2. 归约播放器
   * ===================================================================== */
  W.reducePlayer = function (el, opts) {
    opts = opts || {};
    var mod = typeof opts.mod === 'string' ? reg()[opts.mod] : opts.mod;
    var t, res;
    try {
      var p = new C.Parser(C.tokenize(opts.term), mod);
      t = p.parseTerm(0, {});
      res = C.reduce(t, mod, { trace: true, maxSteps: opts.maxSteps || 120, strat: opts.strat });
    } catch (e) {
      el.innerHTML = '<div class="run-out err">错误：' + esc(e.message) + '</div>';
      return;
    }
    var steps = res.steps;
    var html = '<div class="widget-t"><b>一步归约（one-step rewrite）</b><span>' + esc(opts.term) + ' → ' +
      esc(C.formatTerm(res.term, mod)) + ' · ' + res.count + ' 步</span></div>';
    if (!steps.length) {
      html += '<div class="dim" style="font-family:var(--mono)">这个项已经没有可归约的位置（范式 normal form）。</div>';
    } else {
      html += '<div class="steps" id="' + el.id + '-steps">';
      html += '<div class="step-row" data-i="-1"><span class="idx">0</span><span class="trm">' + esc(C.formatTerm(t, mod)) + '</span></div>';
      steps.forEach(function (s, i) {
        html += '<div class="step-row" data-i="' + i + '"><span class="idx">' + (i + 1) + '</span>' +
          '<span class="rule">' + esc(s.rule) + '@' + esc(s.position) + '</span>' +
          '<span class="trm">' + esc(C.formatTerm(s.to, mod)) + '</span></div>';
      });
      html += '</div>';
    }
    html += '<div class="wctl">' +
      '<button class="mini-btn" data-act="prev">◀ 上一步</button>' +
      '<button class="mini-btn" data-act="play">▶ 播放</button>' +
      '<button class="mini-btn" data-act="next">下一步 ▶</button>' +
      '<span class="dim" style="font-size:11.5px" id="' + el.id + '-pos"></span></div>';
    html += '<div id="' + el.id + '-tree"></div>';
    el.innerHTML = html;

    var cur = -1, timer = null;
    var treeBox = $(el.id + '-tree');
    var posEl = $(el.id + '-pos');
    function show(i) {
      cur = i;
      var term = i < 0 ? t : steps[i].to;
      el.querySelectorAll('.step-row').forEach(function (r) {
        r.classList.toggle('on', +r.dataset.i === i);
      });
      var row = el.querySelector('.step-row.on');
      if (row) row.scrollIntoView({ block: 'nearest' });
      posEl.textContent = i < 0 ? '初始项' : ('第 ' + (i + 1) + ' 步：规则 ' + steps[i].rule + '，位置 ' + steps[i].position);
      W.termTree(treeBox, { term: C.formatTerm(term, mod), mod: mod, highlight: [] });
    }
    el.querySelectorAll('[data-act]').forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.act;
        if (a === 'next') show(Math.min(cur + 1, steps.length - 1));
        else if (a === 'prev') show(Math.max(cur - 1, -1));
        else {
          if (timer) { clearInterval(timer); timer = null; b.textContent = '▶ 播放'; return; }
          if (cur >= steps.length - 1) show(-1);
          b.textContent = '⏸ 暂停';
          timer = setInterval(function () {
            if (cur >= steps.length - 1) { clearInterval(timer); timer = null; b.textContent = '▶ 播放'; return; }
            show(cur + 1);
          }, 850);
        }
      };
    });
    el.querySelectorAll('.step-row').forEach(function (r) {
      r.onclick = function () { show(+r.dataset.i); };
    });
    show(steps.length ? 0 : -1);
  };

  /* =====================================================================
   * 3. 排序格（subsort lattice）
   * ===================================================================== */
  W.lattice = function (el, opts) {
    var mod = typeof opts.mod === 'string' ? reg()[opts.mod] : opts.mod;
    var SL = mod.sorts;
    var all = Object.keys(SL.all);
    /* 按「向上层数」分层：叶子在下 */
    var level = {};
    function lv(s, seen) {
      if (level[s] !== undefined) return level[s];
      var sups = SL.sup[s] || [];
      if (!sups.length) { level[s] = 0; return 0; }
      var m = 0;
      for (var i = 0; i < sups.length; i++) m = Math.max(m, lv(sups[i], {}) + 1);
      level[s] = m;
      return m;
    }
    all.forEach(function (s) { lv(s, {}); });
    var byLevel = {};
    all.forEach(function (s) { (byLevel[level[s]] = byLevel[level[s]] || []).push(s); });
    var maxLv = 0;
    all.forEach(function (s) { maxLv = Math.max(maxLv, level[s]); });
    var Wd = 620, rowH = 84, pos = {};
    var svgW = Wd, svgH = (maxLv + 1) * rowH + 40;
    var nodes = [];
    for (var l = 0; l <= maxLv; l++) {
      var arr = (byLevel[l] || []).sort();
      arr.forEach(function (s, i) {
        var x = 40 + (Wd - 80) * (arr.length === 1 ? 0.5 : i / (arr.length - 1));
        var y = svgH - 40 - l * rowH;
        pos[s] = { x: x, y: y };
        nodes.push({ s: s, x: x, y: y });
      });
    }
    var svg = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" width="100%" height="' + svgH + '">';
    nodes.forEach(function (n) {
      (SL.sup[n.s] || []).forEach(function (sup) {
        if (!pos[sup]) return;
        svg += '<line x1="' + n.x + '" y1="' + (n.y - 16) + '" x2="' + pos[sup].x + '" y2="' + (pos[sup].y + 16) +
          '" stroke="#3a4c66" stroke-width="1.6" marker-end="url(#ar)"/>';
      });
    });
    nodes.forEach(function (n) {
      var wBox = Math.max(58, n.s.length * 9 + 22);
      svg += '<rect class="node-box" x="' + (n.x - wBox / 2) + '" y="' + (n.y - 15) + '" width="' + wBox +
        '" height="30" rx="9"/>';
      svg += '<text class="node-lbl" x="' + n.x + '" y="' + (n.y + 4) + '">' + esc(n.s) + '</text>';
    });
    svg += '</svg>';
    var decl = all.map(function (s) {
      var sp = (SL.sup[s] || []);
      if (!sp.length) return null;
      return '<code>' + esc(s) + ' &lt; ' + sp.map(esc).join(' ') + '</code>';
    }).filter(Boolean).join(' &nbsp; ');
    el.innerHTML = '<div class="widget-t"><b>排序格（sort lattice）</b><span>箭头指向父排序；下方是子排序</span></div>' +
      '<div style="overflow:auto">' + svg.replace('<svg ', '<svg style="min-width:560px" ') + '</div>' +
      (decl ? '<div style="margin-top:8px;font-size:12px;color:var(--dim)">' + decl + '</div>' : '') +
      '<div class="lattice-legend"><span>● 越小 = 越具体</span><span>● 越大 = 越抽象</span>' +
      '<span>重载算子按参数排序选择 rank</span></div>';
  };

  /* =====================================================================
   * 4. E-strategy 对比演示（同一项，两种策略）
   * ===================================================================== */
  W.strategyDemo = function (el, opts) {
    var mod = typeof opts.mod === 'string' ? reg()[opts.mod] : opts.mod;
    var t;
    try {
      var p = new C.Parser(C.tokenize(opts.term), mod);
      t = p.parseTerm(0, {});
    } catch (e) { el.innerHTML = '<div class="run-out err">' + esc(e.message) + '</div>'; return; }

    var inner = {}, outer = {};
    inner[opts.op] = [1, 0];
    outer[opts.op] = opts.outer || [0, 1];
    var MS = opts.maxSteps || 60;
    var ri = C.reduce(t, mod, { trace: true, maxSteps: MS, strat: inner });
    var ro = C.reduce(t, mod, { trace: true, maxSteps: MS, strat: outer });
    function pane(title, r, color) {
      var h = '<div class="card" style="margin:0"><div class="card-t" style="color:' + color + '">' + title +
        '　<span class="badge">' + r.count + ' 步' + (r.truncated ? '（已达上限，未停止）' : '') + '</span></div>' +
        '<div style="font-family:var(--mono);font-size:12.5px;line-height:1.75;color:#a8d8ff">';
      h += esc(C.formatTerm(t, mod)) + '<br>';
      r.steps.slice(0, 8).forEach(function (s) {
        h += '<span style="color:var(--warn)">→</span> ' + esc(C.formatTerm(s.to, mod)) + '<br>';
      });
      if (r.steps.length > 8) h += '<span class="dim">… 共 ' + r.steps.length + ' 步' + (r.truncated ? '（还在继续）' : '') + '</span><br>';
      h += '</div><div style="margin-top:8px;font-size:12px;color:var(--dim)">结果：<code>' +
        esc(C.formatTerm(r.term, mod)) + '</code></div></div>';
      return h;
    }
    el.innerHTML = '<div class="widget-t"><b>同一项 · 两种局部策略的对比</b><span>' + esc(opts.term) + '</span></div>' +
      '<div class="cols">' + pane('策略 (' + inner[opts.op].join(' ') + ')：' + (opts.left || '先算参数') +
        '（innermost 风格）', ri, '#4ea8ff') +
      pane('策略 (' + outer[opts.op].join(' ') + ')：' + (opts.right || '先试根') +
        '（outermost 风格）', ro, '#a86bd8') + '</div>' +
      '<div class="hint" style="text-align:left;margin-top:8px">' + (opts.note || '') + '</div>';
  };

  /* =====================================================================
   * 5. 长度/列表动画：take & drop、zip、@、筛法、Hamming、qsort
   * ===================================================================== */
  function chainHTML(cells, opt) {
    opt = opt || {};
    var h = '<div class="chain">';
    cells.forEach(function (c, i) {
      if (i) h += '<div class="link"></div>';
      var cls = 'cell';
      if (c.gone) cls += ' gone';
      if (c.hi) cls += ' hi';
      if (c.pr) cls += ' pr';
      h += '<div class="' + cls + '">' + esc(c.v) + '</div>';
    });
    h += '</div>';
    return h;
  }

  W.listDemo = function (el, opts) {
    opts = opts || {};
    var kind = opts.kind || 'takedrop';
    var N = opts.n || 10;
    var html = '', frames = [], i;

    if (kind === 'takedrop') {
      var total = 16;
      frames.push({ tl: '初始：一个无限列表 0|1|2|…（只画出前面 ' + total + ' 个）', cells: mk(), take: [], drop: [] });
      for (i = 1; i <= N; i++) frames.push({ tl: 'take 取第 ' + i + ' 个；drop 已经丢掉 ' + (i - 1) + ' 个', cells: mk(), take: rng(0, i), drop: rng(0, i - 1) });
      function rng(a, b) { var r = []; for (var k = a; k < b; k++) r.push(k); return r; }
      function mk() { var r = []; for (var k = 0; k < total; k++) r.push({ v: k }); r.push({ v: '…', pr: true }); return r; }
    } else if (kind === 'zip') {
      var a = [], b = [];
      for (i = 0; i < N; i++) { a.push({ v: 1 + i }); b.push({ v: 100 + i }); }
      frames.push({ tl: '两个无限列表：1,2,3,… 与 100,101,102,…', cells: [] });
      for (i = 1; i <= N; i++) {
        var z = [];
        for (var k = 0; k < i; k++) { z.push({ v: 1 + k, hi: true }); z.push({ v: 100 + k, hi: true }); }
        frames.push({ tl: '第 ' + i + ' 轮：从两个列表各取一个，交错放进结果', cells: z });
      }
    } else if (kind === 'sieve') {
      var M = opts.max || 60;
      var comp = {};
      frames.push({ tl: '先把 2 到 ' + M + ' 全部放入「候选」', cells: nums(2, M, comp) });
      for (var p = 2; p * p <= M; p++) {
        if (comp[p]) continue;
        for (var m = p * p; m <= M; m += p) comp[m] = p;
        frames.push({ tl: '筛掉 ' + p + ' 的倍数（' + p + '×' + p + ' 起）', cells: nums(2, M, comp) });
      }
      frames.push({ tl: '剩下的就是素数', cells: nums(2, M, comp), done: true });
      function nums(a, b, comp) {
        var r = [];
        for (var k = a; k <= b; k++) r.push({ v: k, gone: !!comp[k], pr: !comp[k] });
        return r;
      }
    } else if (kind === 'hamming') {
      var seq = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20];
      frames.push({ tl: 'Hamming 数：只含素因子 2、3、5 的数，从 1 开始按序合并', cells: [{ v: 1, pr: true }] });
      for (i = 1; i < Math.min(seq.length, N + 1); i++) {
        frames.push({
          tl: '下一个 = min(2×' + '…, 3×…, 5×…)；取 ' + seq[i],
          cells: seq.slice(0, i + 1).map(function (v) { return { v: v, pr: true }; })
        });
      }
    } else if (kind === 'append') {
      var L1 = [4, 3, 2, 1], L2 = [0, 9, 8];
      frames.push({ tl: 'L1 = 4|3|2|1|nil，L2 = 0|9|8|nil', cells: L1.concat(L2).map(function (v, k) { return { v: v, hi: k < 4 }; }) });
      frames.push({ tl: 'eq (E|L1) @ L2 = E | (L1 @ L2)：把 L1 的头部一个个搬到结果前面', cells: L1.concat(L2) });
      frames.push({ tl: 'eq nil @ L2 = L2：最后接上 L2', cells: L2.slice() });
      frames.push({ tl: '结果 = 4|3|2|1|0|9|8|nil', cells: L1.concat(L2).map(function (v) { return { v: v, pr: true }; }) });
    } else if (kind === 'qsort') {
      var arr = [4, 7, 5, 1, 0, 3, 6, 2];
      frames.push({ tl: 'qsort(L) = qsort(比 pivot 小的) @ (pivot|nil) @ qsort(比 pivot 大的)', cells: arr.map(function (v) { return { v: v }; }) });
      frames.push({ tl: '取 pivot = 4：小 = 1,0,3,2；大 = 7,5,6', cells: arr.map(function (v) { return { v: v, pr: v === 4 }; }) });
      frames.push({ tl: '递归排序两侧…', cells: [0, 1, 2, 3, 4, 5, 6, 7].map(function (v) { return { v: v, pr: true }; }) });
      frames.push({ tl: '结果（有序）', cells: [0, 1, 2, 3, 4, 5, 6, 7].map(function (v) { return { v: v, pr: true }; }), done: true });
    }

    html = '<div class="widget-t"><b>' + esc(opts.title || '列表动画') + '</b><span id="' + el.id + '-ttl"></span></div>' +
      '<div id="' + el.id + '-chain"></div>' +
      '<div class="wctl"><button class="mini-btn" data-act="prev">◀</button>' +
      '<button class="mini-btn" data-act="play">▶ 播放</button>' +
      '<button class="mini-btn" data-act="next">▶</button>' +
      '<span class="dim" style="font-size:11.5px" id="' + el.id + '-idx"></span></div>' +
      (opts.note ? '<div class="hint" style="text-align:left;margin-top:8px">' + opts.note + '</div>' : '');
    el.innerHTML = html;
    var box = $(el.id + '-chain'), ttl = $(el.id + '-ttl'), idxEl = $(el.id + '-idx');
    var cur = 0, timer = null;
    function show(k) {
      cur = Math.max(0, Math.min(k, frames.length - 1));
      var f = frames[cur];
      ttl.textContent = f.tl;
      idxEl.textContent = (cur + 1) + ' / ' + frames.length;
      box.innerHTML = chainHTML(f.cells || []);
    }
    el.querySelectorAll('[data-act]').forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.act;
        if (a === 'next') show(cur + 1);
        else if (a === 'prev') show(cur - 1);
        else {
          if (timer) { clearInterval(timer); timer = null; b.textContent = '▶ 播放'; return; }
          if (cur >= frames.length - 1) show(0);
          b.textContent = '⏸ 暂停';
          timer = setInterval(function () {
            if (cur >= frames.length - 1) { clearInterval(timer); timer = null; b.textContent = '▶ 播放'; return; }
            show(cur + 1);
          }, 900);
        }
      };
    });
    show(0);
  };

  /* =====================================================================
   * 6. Minila：解释器 / 虚拟机 / 编译器
   * ===================================================================== */
  function MLex(src) {
    var toks = [], i = 0;
    var syms = ['==', '!=', '<=', '>=', '&&', '||', ':=', '->'];
    while (i < src.length) {
      var c = src[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9]/.test(c)) { var j = i; while (j < src.length && /[0-9]/.test(src[j])) j++; toks.push({ t: 'num', v: +src.slice(i, j) }); i = j; continue; }
      if (/[a-zA-Z_]/.test(c)) { var k = i; while (k < src.length && /[a-zA-Z0-9_]/.test(src[k])) k++; toks.push({ t: 'id', v: src.slice(i, k) }); i = k; continue; }
      var two = src.substr(i, 2);
      if (syms.indexOf(two) >= 0) { toks.push({ t: 'sym', v: two }); i += 2; continue; }
      toks.push({ t: 'sym', v: c }); i++;
    }
    toks.push({ t: 'eof', v: '' });
    return toks;
  }
  var KW = { 'if': 1, 'then': 1, 'else': 1, 'fi': 1, 'while': 1, 'do': 1, 'od': 1, 'skip': 1, 'true': 1, 'false': 1 };

  function MLParse(src) {
    var toks = MLex(src), i = 0;
    function peek() { return toks[i]; }
    function next() { return toks[i++]; }
    function eat(t, v) {
      var x = toks[i];
      if (x.t === t && (v === undefined || x.v === v)) { i++; return x; }
      throw new Error('期望 ' + (v || t) + '，遇到 ' + (x.v || 'EOF'));
    }
    function isId(v) { var x = toks[i]; return x.t === 'id' && x.v === v; }

    function parseExp() { return parseOr(); }
    function parseOr() {
      var l = parseAnd();
      while (isId('||') || (peek().t === 'sym' && peek().v === '||')) { next(); var r = parseAnd(); l = { k: 'or', a: l, b: r }; }
      return l;
    }
    function parseAnd() {
      var l = parseCmp();
      while (peek().t === 'sym' && peek().v === '&&') { next(); var r = parseCmp(); l = { k: 'and', a: l, b: r }; }
      return l;
    }
    function parseCmp() {
      var l = parseAdd();
      while (peek().t === 'sym' && ['==', '!=', '<', '>', '<=', '>='].indexOf(peek().v) >= 0) {
        var op = next().v; var r = parseAdd(); l = { k: 'bin', op: op, a: l, b: r };
      }
      return l;
    }
    function parseAdd() {
      var l = parseMul();
      while (peek().t === 'sym' && (peek().v === '+' || peek().v === '-')) { var op = next().v; var r = parseMul(); l = { k: 'bin', op: op, a: l, b: r }; }
      return l;
    }
    function parseMul() {
      var l = parseUnary();
      while (peek().t === 'sym' && (peek().v === '*' || peek().v === '/')) { var op = next().v; var r = parseUnary(); l = { k: 'bin', op: op, a: l, b: r }; }
      return l;
    }
    function parseUnary() {
      if (peek().t === 'sym' && peek().v === '-') { next(); return { k: 'neg', a: parseUnary() }; }
      if (isId('!')) { next(); return { k: 'not', a: parseUnary() }; }
      if (peek().t === 'sym' && peek().v === '!') { next(); return { k: 'not', a: parseUnary() }; }
      if (peek().t === 'sym' && peek().v === '(') { next(); var e = parseExp(); eat('sym', ')'); return e; }
      if (peek().t === 'num') return { k: 'num', v: next().v };
      if (peek().t === 'id' && peek().v === 'true') { next(); return { k: 'bool', v: true }; }
      if (peek().t === 'id' && peek().v === 'false') { next(); return { k: 'bool', v: false }; }
      if (peek().t === 'id') return { k: 'var', v: next().v };
      throw new Error('表达式解析失败：' + peek().v);
    }
    function parseStmt() {
      if (isId('skip')) { next(); return { k: 'skip' }; }
      if (isId('if')) {
        next(); var c = parseExp();
        if (!isId('then')) eat('id', 'then'); else next();
        var s1 = parseStmt();
        if (isId('else')) next();
        var s2 = parseStmt();
        if (isId('fi')) next();
        return { k: 'if', c: c, s1: s1, s2: s2 };
      }
      if (isId('while')) {
        next(); var c2 = parseExp();
        if (isId('do')) next();
        var body = parseStmt();
        if (isId('od')) next();
        return { k: 'while', c: c2, s: body };
      }
      if (peek().t === 'id' && toks[i + 1].t === 'sym' && toks[i + 1].v === ':=') {
        var x = next().v; next(); var e = parseExp();
        return { k: 'asg', x: x, e: e };
      }
      throw new Error('语句解析失败：' + peek().v);
    }
    function parseProg() {
      var stmts = [parseStmt()];
      while (peek().t === 'sym' && peek().v === ';') {
        next();
        if (peek().t === 'eof') break;
        stmts.push(parseStmt());
      }
      var s = stmts[0];
      for (var k = 1; k < stmts.length; k++) s = { k: 'seq', s1: s, s2: stmts[k] };
      return s;
    }
    return parseProg();
  }

  function envGet(env, x) { return env[x] === undefined ? 0 : env[x]; }
  function evalExp(e, env) {
    switch (e.k) {
      case 'num': return e.v;
      case 'bool': return e.v;
      case 'var': return envGet(env, e.v);
      case 'neg': return -evalExp(e.a, env);
      case 'not': return !evalExp(e.a, env);
      case 'and': return evalExp(e.a, env) && evalExp(e.b, env);
      case 'or': return evalExp(e.a, env) || evalExp(e.b, env);
      case 'bin':
        var a = evalExp(e.a, env), b = evalExp(e.b, env);
        switch (e.op) {
          case '+': return a + b; case '-': return a - b; case '*': return a * b;
          case '/': return Math.floor(a / b);
          case '==': return a === b; case '!=': return a !== b;
          case '<': return a < b; case '>': return a > b; case '<=': return a <= b; case '>=': return a >= b;
        }
    }
    return 0;
  }

  /* 解释器：返回执行轨迹（每步的语句与环境） */
  function runInterp(prog, initEnv, maxSteps) {
    var env = {}, k;
    for (k in initEnv) env[k] = initEnv[k];
    var trace = [], steps = 0;
    function snap(where, extra) {
      trace.push({ where: where, env: JSON.parse(JSON.stringify(env)), note: extra || '' });
    }
    function execS(st, cont) {
      if (++steps > (maxSteps || 2000)) throw new Error('步数超过上限');
      switch (st.k) {
        case 'skip': snap('skip'); return cont();
        case 'asg':
          var v = evalExp(st.e, env);
          var old = env[st.x];
          env[st.x] = v;
          snap(st.x + ' := ' + fmtExp(st.e) + '  ⇒  ' + st.x + ' = ' + v,
            old === undefined ? '新建变量' : (old + ' → ' + v));
          return cont();
        case 'seq':
          return execS(st.s1, function () { return execS(st.s2, cont); });
        case 'if':
          var c = evalExp(st.c, env);
          snap('if ' + fmtExp(st.c) + ' ⇒ ' + c, c ? '走 then 分支' : '走 else 分支');
          return c ? execS(st.s1, cont) : execS(st.s2, cont);
        case 'while':
          (function loop() {
            var cc = evalExp(st.c, env);
            snap('while ' + fmtExp(st.c) + ' ⇒ ' + cc, cc ? '进入循环体' : '退出循环');
            if (!cc) return cont();
            return execS(st.s, loop);
          })();
          return;
      }
    }
    execS(prog, function () { });
    return { trace: trace, env: env };
  }
  function fmtExp(e) {
    switch (e.k) {
      case 'num': return String(e.v);
      case 'bool': return String(e.v);
      case 'var': return e.v;
      case 'neg': return '-' + fmtExp(e.a);
      case 'not': return '!' + fmtExp(e.a);
      case 'and': return fmtExp(e.a) + ' && ' + fmtExp(e.b);
      case 'or': return fmtExp(e.a) + ' || ' + fmtExp(e.b);
      case 'bin': return fmtExp(e.a) + ' ' + e.op + ' ' + fmtExp(e.b);
    }
    return '?';
  }

  /* 编译器：AST → 指令序列 */
  function compile(prog) {
    var code = [];
    function genExp(e) {
      switch (e.k) {
        case 'num': return code.push(['push', e.v]);
        case 'bool': return code.push(['push', e.v ? 1 : 0]);
        case 'var': return code.push(['load', e.v]);
        case 'neg': genExp(e.a); return code.push(['neg']);
        case 'not': genExp(e.a); return code.push(['not']);
        case 'and': genExp(e.a); genExp(e.b); return code.push(['and']);
        case 'or': genExp(e.a); genExp(e.b); return code.push(['or']);
        case 'bin':
          genExp(e.a); genExp(e.b);
          var m = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '==': 'eq', '!=': 'neq', '<': 'lt', '>': 'gt', '<=': 'le', '>=': 'ge' };
          return code.push([m[e.op]]);
      }
    }
    function genStmt(s) {
      switch (s.k) {
        case 'skip': return;
        case 'asg': genExp(s.e); return code.push(['store', s.x]);
        case 'seq': genStmt(s.s1); return genStmt(s.s2);
        case 'if':
          genExp(s.c);
          var j1 = code.push(['jumpOnCond', 0]) - 1;
          genStmt(s.s1);
          var j2 = code.push(['jump', 0]) - 1;
          code[j1][1] = code.length;
          genStmt(s.s2);
          code[j2][1] = code.length;
          return;
        case 'while':
          var top = code.length;
          genExp(s.c);
          var jc = code.push(['bjump', 0]) - 1;
          genStmt(s.s);
          code.push(['jump', top]);
          code[jc][1] = code.length;
          return;
      }
    }
    genStmt(prog);
    code.push(['halt']);
    return code;
  }

  /* 虚拟机：执行指令，记录每一步 */
  function runVM(code, initEnv, maxSteps) {
    var pc = 0, stack = [], env = {}, k;
    for (k in initEnv) env[k] = initEnv[k];
    var trace = [], n = 0;
    function snap(note) {
      trace.push({
        pc: pc, instr: code[pc] ? code[pc][0] + (code[pc].length > 1 ? ' ' + code[pc][1] : '') : '-',
        stack: stack.slice(), env: JSON.parse(JSON.stringify(env)), note: note || ''
      });
    }
    while (n++ < (maxSteps || 4000)) {
      if (pc >= code.length) break;
      var ins = code[pc], op = ins[0];
      snap();
      pc++;
      switch (op) {
        case 'push': stack.push(ins[1]); break;
        case 'load': stack.push(envGet(env, ins[1])); break;
        case 'store': env[ins[1]] = stack.pop(); break;
        case 'neg': stack.push(-stack.pop()); break;
        case 'not': stack.push(stack.pop() ? 0 : 1); break;
        case 'add': var b = stack.pop(), a = stack.pop(); stack.push(a + b); break;
        case 'sub': var b2 = stack.pop(), a2 = stack.pop(); stack.push(a2 - b2); break;
        case 'mul': var b3 = stack.pop(), a3 = stack.pop(); stack.push(a3 * b3); break;
        case 'div': var b4 = stack.pop(), a4 = stack.pop(); stack.push(Math.floor(a4 / b4)); break;
        case 'and': var b5 = stack.pop(), a5 = stack.pop(); stack.push((a5 && b5) ? 1 : 0); break;
        case 'or': var b6 = stack.pop(), a6 = stack.pop(); stack.push((a6 || b6) ? 1 : 0); break;
        case 'eq': var b7 = stack.pop(), a7 = stack.pop(); stack.push(a7 === b7 ? 1 : 0); break;
        case 'neq': var b8 = stack.pop(), a8 = stack.pop(); stack.push(a8 !== b8 ? 1 : 0); break;
        case 'lt': var b9 = stack.pop(), a9 = stack.pop(); stack.push(a9 < b9 ? 1 : 0); break;
        case 'gt': var b10 = stack.pop(), a10 = stack.pop(); stack.push(a10 > b10 ? 1 : 0); break;
        case 'le': var b11 = stack.pop(), a11 = stack.pop(); stack.push(a11 <= b11 ? 1 : 0); break;
        case 'ge': var b12 = stack.pop(), a12 = stack.pop(); stack.push(a12 >= b12 ? 1 : 0); break;
        case 'jump': pc = ins[1]; break;
        case 'jumpOnCond': if (stack.pop()) pc = ins[1]; break;
        case 'bjump': if (!stack.pop()) pc = ins[1]; break;
        case 'halt': n = 1e9; break;
      }
    }
    return { trace: trace, env: env, stack: stack, pc: pc };
  }

  W.minila = function (el, opts) {
    opts = opts || {};
    var src = opts.src || 'x := 1 ; y := 0 ; while x < 10 do y := y + x ; x := x + 1 od';
    var initEnv = opts.env || { x: 0, y: 0 };
    var html = '<div class="widget-t"><b>Minila 三重实验台</b><span>同一段程序，三种执行方式</span></div>' +
      '<div style="font-family:var(--mono);font-size:12.5px;color:#8fd0ff;background:#0b111b;border:1px solid #223046;' +
      'border-radius:10px;padding:9px 12px;margin-bottom:12px">' + esc(src) + '</div>' +
      '<div class="wctl" style="margin-bottom:12px">' +
      '<button class="mini-btn tab on" data-tab="interp">① 解释器</button>' +
      '<button class="mini-btn tab" data-tab="vm">② 虚拟机</button>' +
      '<button class="mini-btn tab" data-tab="code">③ 编译器输出的指令</button></div>' +
      '<div id="' + el.id + '-body"></div>';
    el.innerHTML = html;
    var body = $(el.id + '-body');
    var ast, ires, code, vres, err = null;
    try {
      ast = MLParse(src);
      ires = runInterp(ast, initEnv, 4000);
      code = compile(ast);
      vres = runVM(code, initEnv, 8000);
    } catch (e) { err = e.message; }
    if (err) { body.innerHTML = '<div class="run-out err">' + esc(err) + '</div>'; return; }

    function showInterp() {
      var h = '<div style="font-size:12.5px;color:var(--dim);margin-bottom:8px">解释器直接遍历语法树，环境（environment）就是「变量 → 值」的表。</div>';
      h += '<div id="' + el.id + '-ia"></div>';
      h += '<div class="steps" style="max-height:300px">';
      ires.trace.forEach(function (t, i) {
        h += '<div class="step-row" data-i="' + i + '"><span class="idx">' + i + '</span>' +
          '<span class="rule" style="color:#a86bd8">' + esc(t.note || '') + '</span>' +
          '<span class="trm">' + esc(envStr(t.env)) + '</span></div>';
      });
      h += '</div>';
      body.innerHTML = h;
    }
    function showVM() {
      var h = '<div style="font-size:12.5px;color:var(--dim);margin-bottom:8px">虚拟机（VM）用 pc + 栈 + 环境 三个部件执行指令；栈（stack）是计算表达式的工作台。</div>';
      h += '<div class="steps" style="max-height:320px">';
      vres.trace.slice(0, 400).forEach(function (t, i) {
        h += '<div class="step-row"><span class="idx">' + t.pc + '</span>' +
          '<span class="rule">' + esc(t.instr) + '</span>' +
          '<span class="trm">栈[' + esc(t.stack.join(' ')) + '] ' + esc(envStr(t.env)) + '</span></div>';
      });
      h += '</div>';
      body.innerHTML = h;
    }
    function showCode() {
      var h = '<div style="font-size:12.5px;color:var(--dim);margin-bottom:8px">编译器把语法树翻译成线性指令；跳转指令的地址是「指令编号」。</div>';
      h += '<div class="codebox"><pre>';
      code.forEach(function (ins, i) {
        h += '<span style="color:#5c7a99">' + String(i).padStart(3, ' ') + '</span>  ' +
          '<span style="color:#ff9ecd">' + esc(ins[0]) + '</span>' +
          (ins.length > 1 ? ' <span style="color:#ffd08a">' + esc(ins[1]) + '</span>' : '') + '\n';
      });
      h += '</pre></div>';
      h += '<div class="card tip"><div class="card-t">🔎 看懂这三件事就够了</div>' +
        '<ul><li><code>jumpOnCond n</code>：弹出栈顶，若为真就跳到第 n 条指令</li>' +
        '<li><code>bjump n</code>：弹出栈顶，若为假就跳到第 n 条指令（while 循环用它退出）</li>' +
        '<li><code>halt</code>：停机</li></ul></div>';
      body.innerHTML = h;
    }
    function envStr(env) {
      var ks = Object.keys(env).sort();
      if (!ks.length) return 'env{}';
      return ks.map(function (k) { return k + '=' + env[k]; }).join(' ');
    }
    el.querySelectorAll('[data-tab]').forEach(function (b) {
      b.onclick = function () {
        el.querySelectorAll('[data-tab]').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var t = b.dataset.tab;
        if (t === 'interp') showInterp();
        else if (t === 'vm') showVM();
        else showCode();
      };
    });
    showInterp();
  };

  /* =====================================================================
   * 7. 归纳证明可视化
   * ===================================================================== */
  W.induction = function (el, opts) {
    var mod = typeof opts.mod === 'string' ? reg()[opts.mod] : opts.mod;
    var base = opts.base, ind = opts.ind, ih = opts.ih || null;
    function runCase(script) {
      var res = C.runScript('open ' + opts.mod + ' . ' + script + ' close', reg(), { openTag: 'ix' });
      var o = res.output.filter(function (x) { return x.kind === 'red'; });
      return o.length ? o[o.length - 1] : null;
    }
    var rb = null, ri = null;
    try { rb = runCase(base); } catch (e) { }
    try { ri = runCase(ind); } catch (e) { }
    function row(title, r, color, extra) {
      if (!r) return '<div class="card" style="margin:8px 0"><div class="card-t">' + title + '</div>运行失败</div>';
      var okstr = r.result === 'true';
      return '<div class="card ' + (okstr ? 'tip' : 'warn') + '" style="margin:8px 0">' +
        '<div class="card-t" style="color:' + (okstr ? '#8ef0c4' : '#ffd08a') + '">' + title +
        '　<span class="badge ' + (okstr ? 'ok' : '') + '">' + (okstr ? '✓ 成立' : '✗ 未化简为 true') + '</span></div>' +
        '<div style="font-family:var(--mono);font-size:12.5px;color:#a8d8ff">' +
        esc(r.input) + '<br><span style="color:var(--warn)">⇒</span> ' + esc(r.result) +
        '　<span class="dim">(' + r.count + ' 步)</span></div>' +
        (extra ? '<div style="margin-top:6px;font-size:12px;color:var(--dim)">' + extra + '</div>' : '') + '</div>';
    }
    el.innerHTML = '<div class="widget-t"><b>结构归纳法（structural induction）两个分支</b>' +
      '<span>' + esc(opts.goal || '') + '</span></div>' +
      row('① 基础情形 base case', rb, '#4ea8ff', opts.baseNote) +
      row('② 归纳情形 induction case（' + (ih ? '把 IH 作为等式加入' : '无 IH') + '）', ri, '#a86bd8', opts.indNote) +
      (opts.note ? '<div class="hint" style="text-align:left">' + opts.note + '</div>' : '');
  };

  /* =====================================================================
   * 8. 互斥协议状态图
   * ===================================================================== */
  W.mutex = function (el, opts) {
    var nodes = [
      { id: 'n0', lab: '(false, rs, rs)', x: 90, y: 60 },
      { id: 'n1', lab: '(true, cs, rs)', x: 330, y: 60 },
      { id: 'n2', lab: '(true, rs, cs)', x: 570, y: 60 },
      { id: 'n3', lab: '(false, rs, ms1)', x: 90, y: 220 },
      { id: 'n4', lab: '(false, ms1, rs)', x: 570, y: 220 },
      { id: 'n5', lab: '(true, cs, ms2)', x: 330, y: 300 }
    ];
    var edges = [
      { a: 'n0', b: 'n3', lab: 't1: rs→ms' },
      { a: 'n3', b: 'n0', lab: 'lock 忙，退回' },
      { a: 'n3', b: 'n1', lab: 't1: ms→cs' },
      { a: 'n1', b: 'n0', lab: 't1: cs→rs' },
      { a: 'n0', b: 'n4', lab: 't2: rs→ms' },
      { a: 'n4', b: 'n2', lab: 't2: ms→cs' },
      { a: 'n2', b: 'n0', lab: 't2: cs→rs' }
    ];
    var pos = {};
    nodes.forEach(function (n) { pos[n.id] = n; });
    var svg = '<svg viewBox="0 0 700 360" width="100%" height="340">';
    svg += '<defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">' +
      '<path d="M0,0 L8,4.5 L0,9 z" fill="#4a5f7a"/></marker></defs>';
    edges.forEach(function (e) {
      var a = pos[e.a], b = pos[e.b];
      var mx = (a.x + b.x) / 2 + (a.y === b.y ? 0 : 26), my = (a.y + b.y) / 2 - (a.y === b.y ? 22 : 0);
      svg += '<path d="M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y +
        '" stroke="#4a5f7a" fill="none" stroke-width="1.5" marker-end="url(#ah)"/>';
      svg += '<text x="' + mx + '" y="' + (my - 6) + '" fill="#7f93ab" font-size="10" text-anchor="middle">' + esc(e.lab) + '</text>';
    });
    nodes.forEach(function (n) {
      svg += '<rect class="node-box" x="' + (n.x - 82) + '" y="' + (n.y - 18) + '" width="164" height="36" rx="10"/>';
      svg += '<text class="node-lbl" x="' + n.x + '" y="' + (n.y + 5) + '">' + esc(n.lab) + '</text>';
    });
    svg += '</svg>';
    el.innerHTML = '<div class="widget-t"><b>互斥协议的状态迁移（state transition）</b>' +
      '<span>塔元组 (locked, pc1, pc2)</span></div>' + svg +
      '<div class="hint" style="text-align:left">每个状态是一个项；一条等式就是一个迁移规则。' +
      '「不可能出现 (true, cs, cs)」就是互斥性（mutual exclusion）。</div>';
  };

  /* =====================================================================
   * 9. 归约树 / 筛法用的小工具
   * ===================================================================== */
  W.codeRun = function (boxId) {
    var box = $(boxId);
    if (!box) return;
    var pre = box.querySelector('pre');
    var out = box.querySelector('.run-out');
    var src = pre.textContent;
    try {
      var res = C.runScript(src, reg(), { openTag: 'x' + Math.random().toString(36).slice(2, 7) });
      var lines = [];
      res.output.forEach(function (o) {
        if (o.kind === 'red') lines.push(o.input + '\n  ⇒ ' + o.result + '  : ' + (o.sort || '?') + '   [' + o.count + ' 步]');
        else if (o.kind === 'err') lines.push('⚠ ' + o.text);
        else if (o.kind === 'msg') lines.push('· ' + o.text);
      });
      if (res.errors.length) lines.push('⚠ ' + res.errors.join('；'));
      out.className = 'run-out';
      out.textContent = lines.join('\n') || '（没有输出）';
    } catch (e) {
      out.className = 'run-out err';
      out.textContent = '错误：' + e.message;
    }
  };

  global.W = W;
})(window);
