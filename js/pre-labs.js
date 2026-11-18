/* =====================================================================
 * pre-labs.js — 「前置知识」章的交互实验（上）
 *   w-p0-apps  应用场景地图     w-p0-simp  化简器（项重写）
 *   w-p0-lazy  无限滚动（惰性求值）
 * ===================================================================== */
(function (global) {
  'use strict';
  var W = global.W, C = global.CafeOBJ;
  var M = (W.MOUNT = W.MOUNT || {});
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  global.LabUtil = { esc: esc };

  /* ---------------- 应用场景地图 ---------------- */
  var APPS = [
    ['L1–L2', '类型与签名', 'TypeScript / Rust 的类型检查、数据库表结构、接口文档。Rust 的 NonZeroU32 和 L2 的 NzNat 是同一个想法：在写代码时就挡住「除以 0」。', 'P0.s8', 'L1'],
    ['L3', '项重写 = 按规则化简', '编译器优化（把 x*1 换成 x）、SymPy / Mathematica 的化简、Babel 把新版 JavaScript 改写成旧版。', 'P0.s3', 'L3'],
    ['L3 / L6', '求值策略与惰性', 'Python 的 a and b（a 为假就不算 b）、生成器 yield、短视频 App 往下刷才加载下一批。', 'P0.s4', 'L6'],
    ['L4', '参数化模块', 'Java / TypeScript 的泛型 List&lt;T&gt;：一份代码，换个类型就能复用。', null, 'L4'],
    ['L5', '表', 'Python 的 dict、通讯录、Redis 缓存：键 → 值，键不重复。', null, 'L5'],
    ['L7', '多重集', '购物车、库存、计票：可以重复、不在乎顺序。', 'P0.s5', 'L7'],
    ['L8–L10', '解释器 / 虚拟机 / 编译器', 'python 命令本身就是解释器；Python 和 Java 都先编译成字节码再交给虚拟机执行；浏览器的 JavaScript 引擎也一样。', 'P0.s6', 'L8'],
    ['L11–L14', '证明程序永远正确', 'seL4 微内核和 CompCert C 编译器有完整的机器检查证明；AWS 用自动推理检查权限策略；芯片公司在 1994 年 Intel 除法 bug 之后大量使用形式化验证；本课老师的研究就是用 CafeOBJ 验证通信协议。', 'P0.s7', 'L11']
  ];
  M['w-p0-apps'] = function (el) {
    var h = '<div class="app-grid">';
    APPS.forEach(function (a) {
      h += '<div class="app-card" data-sec="' + (a[3] || '') + '"><div class="ac-ch">' + a[0] + '</div><div class="ac-t">' + a[1] + '</div>' +
        '<div class="ac-d">' + a[2] + '</div><div class="ac-go">' + (a[3] ? '▶ 下面有交互实验，点我过去' : '') +
        ' <a href="#/' + a[4] + '" class="ac-link">去学 ' + a[4] + ' →</a></div></div>';
    });
    el.innerHTML = h + '</div>';
    el.querySelectorAll('.app-card').forEach(function (c) {
      c.onclick = function (e) {
        if (e.target.classList.contains('ac-link')) return;
        var s = c.dataset.sec && document.getElementById('sec-' + c.dataset.sec);
        if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    });
  };

  /* ---------------- 实验 ①：化简器 ---------------- */
  var RULES = [
    ['mul1', 'E * 1 = E', '任何东西乘 1，等于它自己'],
    ['onemul', '1 * E = E', '1 乘任何东西，等于那个东西'],
    ['mul0', 'E * 0 = 0', '任何东西乘 0，等于 0'],
    ['add0', 'E + 0 = E', '任何东西加 0，等于它自己'],
    ['zeroadd', '0 + E = E', '0 加任何东西，等于那个东西'],
    ['sub', 'E - E = 0', '自己减自己等于 0（左边 E 出现了两次，所以两边必须<b>完全一样</b>才能用）']
  ];
  function simpModule(on) {
    var src = 'mod! SIMP-LAB {\n  [Exp]\n  ops a b c x y 0 1 : -> Exp {constr}\n  op _+_ : Exp Exp -> Exp {prec: 33}\n' +
      '  op _-_ : Exp Exp -> Exp {prec: 33}\n  op _*_ : Exp Exp -> Exp {prec: 31}\n  var E : Exp\n';
    RULES.forEach(function (r) { if (on[r[0]]) src += '  eq [' + r[0] + '] : ' + r[1] + ' .\n'; });
    var reg = C.builtins();
    C.runScript(src + '}', reg);
    return reg['SIMP-LAB'];
  }
  /* 把项写成 HTML，并把 path 指向的那一块包上高亮 */
  function fmt(t, hl, cls, path) {
    path = path || [];
    var s;
    if (t.k === 'num') s = esc(t.n);
    else if (t.k !== 'a') s = esc(t.op || t.name);
    else if (/^_.+_$/.test(t.op) && t.args.length === 2) {
      s = t.args.map(function (a, i) {
        var x = fmt(a, hl, cls, path.concat([i]));
        return a.k === 'a' ? '(' + x + ')' : x;
      }).join(' ' + esc(t.op.slice(1, -1)) + ' ');
    } else s = esc(t.op) + '(' + t.args.map(function (a, i) { return fmt(a, hl, cls, path.concat([i])); }).join(', ') + ')';
    return hl && path.join('.') === hl.join('.') ? '<span class="' + cls + '">' + s + '</span>' : s;
  }
  global.LabUtil.fmt = fmt;
  M['w-p0-simp'] = function (el) {
    var on = {}; RULES.forEach(function (r) { on[r[0]] = true; });
    var presets = ['(a * 1) + (b * 0)', '(x - x) + y * 1', '((a + 0) * 1) * (b - b)', 'a * (b + 0)', '(a + b) - (a + b)', '(a + b) - (b + a)'];
    el.innerHTML = '<div class="lab-t"><b>🧮 化简器：亲手体验「项重写」</b><span>这就是 CafeOBJ 计算的方式，也是编译器做优化的方式</span></div>' +
      '<div class="row"><select class="ps">' + presets.map(function (p) { return '<option>' + esc(p) + '</option>'; }).join('') + '</select>' +
      '<input type="text" class="inp" value="' + esc(presets[0]) + '"><button class="btn-main go">开始</button></div>' +
      '<div class="dim" style="font-size:13px">可用的东西：a b c x y 0 1，以及 + - * 和括号。也可以自己输入。下面的规则可以勾掉，看看少了一条规则会怎样。</div>' +
      '<div class="rules">' + RULES.map(function (r) {
        return '<label class="rule-i" data-r="' + r[0] + '"><input type="checkbox" checked data-r="' + r[0] + '"> 规则 ' + r[0] + '：<b>' + esc(r[1]) + '</b>　<span class="dim">' + r[2] + '</span></label>';
      }).join('') + '</div>' +
      '<div class="big cur">…</div><div class="explain"></div>' +
      '<div class="row"><button class="mini-btn prev">◀ 上一步</button><button class="btn-main next">下一步 ▶</button><span class="dim pos"></span></div>';
    var q = function (s) { return el.querySelector(s); };
    var mod, steps, t0, ph;
    function start() {
      mod = simpModule(on);
      try {
        t0 = new C.Parser(C.tokenize(q('.inp').value), mod).parseTerm(0, {});
        steps = C.reduce(t0, mod, { trace: true, maxSteps: 200 }).steps;
      } catch (e) { q('.big').textContent = '看不懂这个式子：' + e.message; q('.explain').innerHTML = ''; steps = null; return; }
      ph = 0; draw();
    }
    function draw() {
      el.querySelectorAll('.rule-i').forEach(function (r) { r.classList.remove('fire'); });
      var i = Math.floor(ph / 2), s = steps[i], last = !s;
      q('.pos').textContent = last ? '化简结束（共 ' + steps.length + ' 步）' : '第 ' + (i + 1) + ' / ' + steps.length + ' 步 · ' + (ph % 2 ? '② 替换' : '① 找 redex');
      if (last) {
        var fin = steps.length ? steps[steps.length - 1].to : t0;
        q('.big').innerHTML = fmt(fin);
        q('.explain').innerHTML = '✅ <b>没有任何一块能和规则左边对上了</b>，这就是最终结果，叫<b>范式（normal form）</b>。' +
          (steps.length ? '' : '<br>一步都没换：这个式子里没有能用规则化简的部分（或者对应的规则被你勾掉了）。');
        return;
      }
      var rule = RULES.filter(function (r) { return r[0] === s.rule; })[0] || [s.rule, '?', ''];
      var lab = el.querySelector('.rule-i[data-r="' + s.rule + '"]'); if (lab) lab.classList.add('fire');
      var sig = Object.keys(s.subst || {}).map(function (k) { return k + ' = ' + C.formatTerm(s.subst[k], mod); }).join('，');
      var pos = C.posString(s.path);
      if (ph % 2 === 0) {
        q('.big').innerHTML = fmt(s.from, s.path, 'hl');
        q('.explain').innerHTML = '① 在式子里找到一块能和规则左边对上的部分：<code>' + esc(C.formatTerm(s.redex, mod)) + '</code>（橙色），它叫 <b>redex</b>，位置是 <code>' + pos + '</code>' +
          (pos === 'ε' ? '（ε 表示整个式子）' : '') + '。<br>它和规则 <b>' + rule[0] + '</b> 的左边 <code>' + esc(rule[1].split(' = ')[0]) + '</code> 对上了，对上的方式是 <b>' + esc(sig) + '</b>（这张对照表叫<b>替换 σ</b>）。';
      } else {
        q('.big').innerHTML = fmt(s.to, s.path, 'new');
        q('.explain').innerHTML = '② 按规则右边 <code>' + esc(rule[1].split(' = ')[1]) + '</code> 换掉，把 ' + esc(sig) + ' 代进去，得到绿色的那一块。这就完成了<b>一步重写</b>。';
      }
    }
    q('.ps').onchange = function () { q('.inp').value = q('.ps').value; start(); };
    q('.go').onclick = start;
    q('.inp').onkeydown = function (e) { if (e.key === 'Enter') start(); };
    q('.next').onclick = function () { if (steps && ph < steps.length * 2) { ph++; draw(); } };
    q('.prev').onclick = function () { if (steps && ph > 0) { ph--; draw(); } };
    el.querySelectorAll('input[type=checkbox]').forEach(function (cbx) {
      cbx.onchange = function () { on[cbx.dataset.r] = cbx.checked; start(); };
    });
    start();
  };
})(window);
