/* =====================================================================
 * pre-labs2.js — 「前置知识」章的交互实验（下）
 *   w-p0-lazy  无限滚动      w-p0-cart  购物车（多重集）
 *   w-p0-vm    编译器+虚拟机  w-p0-proof 测试 vs 证明
 *   w-p0-domino 多米诺归纳    w-p0-type  类型检查（NzNat）
 * ===================================================================== */
(function (global) {
  'use strict';
  var W = global.W, C = global.CafeOBJ;
  var M = (W.MOUNT = W.MOUNT || {});
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function red(mod, term) {
    var r = C.runScript('open ' + mod + ' .\nred ' + term + ' .\nclose', C.builtins());
    return r.output.filter(function (o) { return o.kind === 'red'; })[0] || { result: '（出错）' + r.errors.join(';'), count: 0 };
  }

  /* ---------------- 实验 ②：无限滚动 = 惰性求值 ---------------- */
  M['w-p0-lazy'] = function (el) {
    el.innerHTML = '<div class="lab-t"><b>📱 无限滚动：为什么「无限长的列表」不会卡死</b><span>对应 L6 无限列表</span></div>' +
      '<div class="grid2"><div class="panel"><h4>😴 惰性（lazy）：要几个，算几个</h4>' +
      '<div class="feed-l" style="min-height:90px"></div><div class="row"><button class="btn-main more">往下刷一下</button>' +
      '<span class="dim cl"></span></div></div>' +
      '<div class="panel"><h4>😵 急切（eager）：先把全部算完再显示</h4><div class="feed-e" style="min-height:90px" class="dim"></div>' +
      '<div class="row"><button class="mini-btn eager">试试看</button><span class="dim ce"></span></div></div></div>' +
      '<div class="explain">「所有素数」有无穷多个。急切的做法要先把它们全算完，永远停不下来；惰性的做法只在你往下刷的时候才多算一个。' +
      'CafeOBJ 里靠 <code>{strat: (1 0)}</code> 做到这一点：列表 <code>头 | 尾</code> 只先算「头」，「尾」等真正需要时再算。</div>' +
      '<h4 style="margin:14px 0 4px">用真正的 CafeOBJ 试一下：<code>red take(primes, n) .</code></h4>' +
      '<div class="row">n = <input type="range" min="1" max="8" value="4" class="n"><b class="nv">4</b><button class="mini-btn run">▶ 运行</button></div>' +
      '<div class="log out">拖动滑块选 n，然后点运行。</div>';
    var q = function (s) { return el.querySelector(s); };
    var shown = [], cand = 2, work = 0, timer = null;
    function isPrime(n) { for (var d = 2; d * d <= n; d++) { work++; if (n % d === 0) return false; } return n > 1; }
    q('.more').onclick = function () {
      for (var k = 0; k < 3; k++) { while (!isPrime(cand)) cand++; shown.push(cand); cand++; }
      q('.feed-l').innerHTML = shown.map(function (p, i) { return '<span class="chip' + (i >= shown.length - 3 ? ' on' : '') + '">' + p + '</span>'; }).join('');
      q('.cl').textContent = '已显示 ' + shown.length + ' 个，总共只做了 ' + work + ' 次除法';
    };
    q('.eager').onclick = function () {
      if (timer) { clearInterval(timer); timer = null; q('.eager').textContent = '试试看'; return; }
      var n = 2, cnt = 0, t0 = Date.now();
      q('.eager').textContent = '⏹ 停下（它自己永远停不了）';
      q('.feed-e').innerHTML = '<div class="dim">屏幕上什么都没有，因为还没「算完全部」……</div>';
      timer = setInterval(function () {
        for (var k = 0; k < 4000; k++) { var p = true; for (var d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; } if (p) cnt++; n++; }
        q('.ce').textContent = '已经算了 ' + cnt + ' 个素数，用时 ' + ((Date.now() - t0) / 1000).toFixed(1) + ' 秒，还没算完';
      }, 50);
    };
    q('.n').oninput = function () { q('.nv').textContent = q('.n').value; };
    q('.run').onclick = function () {
      var n = q('.n').value, r = red('ERATOSTHENES-SIEVE', 'take(primes, ' + n + ')');
      q('.out').innerHTML = 'take(primes, ' + n + ')<br>⇒ ' + esc(r.result) + '<br><span class="c">用了 ' + r.count + ' 步重写。n 越大步数越多，但永远是有限的，因为只算了前 ' + n + ' 个。</span>';
    };
    q('.more').onclick();
  };

  /* ---------------- 实验 ③：购物车 = 多重集 ---------------- */
  M['w-p0-cart'] = function (el) {
    var cart = [['苹果', 1], ['香蕉', 2], ['苹果', 3]];
    el.innerHTML = '<div class="lab-t"><b>🛒 购物车：顺序无关、可以重复</b><span>对应 L7 多重集（assoc + comm）</span></div>' +
      '<div class="big cart"></div><div class="row"><button class="mini-btn shuf">🔀 打乱顺序</button>' +
      '<button class="mini-btn add">＋ 再加一个苹果</button><button class="btn-main upd">把「苹果」的数量改成 9（天真写法）</button></div>' +
      '<div class="explain ex">购物车里的东西没有先后之分：打乱顺序还是同一个购物车。CafeOBJ 用 <code>{assoc comm}</code> 告诉系统这一点，系统匹配时会尝试所有排列（AC 匹配）。</div>';
    var q = function (s) { return el.querySelector(s); };
    function draw(hl) {
      q('.cart').innerHTML = cart.map(function (c, i) { return '<span class="chip' + (hl === i ? ' on' : '') + '">(' + c[0] + ', ' + c[1] + ')</span>'; }).join(' ');
    }
    q('.shuf').onclick = function () {
      for (var i = cart.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cart[i]; cart[i] = cart[j]; cart[j] = t; }
      draw(); q('.ex').innerHTML = '顺序变了，但它还是同一个购物车（同一个多重集）。';
    };
    q('.add').onclick = function () { cart.push(['苹果', 1]); draw(); };
    q('.upd').onclick = function () {
      var idx = -1;
      for (var i = 0; i < cart.length; i++) if (cart[i][0] === '苹果') { idx = i; break; }
      if (idx < 0) { q('.ex').textContent = '购物车里没有苹果。'; return; }
      var before = cart.map(function (c) { return '(' + c[0] + ',' + c[1] + ')'; }).join(' ');
      var after = cart.map(function (c, i) { return i === idx ? '(苹果,9)' : '(' + c[0] + ',' + c[1] + ')'; }).join(' ');
      draw(idx);
      q('.ex').innerHTML = '天真的写法是「找到一个苹果，把它的数量改成 9」：<br><code>' + esc(before) + '</code><br>⇒ <code>' + esc(after) + '</code><br>' +
        '<b>多点几次「🔀 打乱顺序」再改一次</b>：被改的会是另一个苹果，结果就不一样了。同一个购物车，因为写法顺序不同得到不同结果，这就是 L7 讲的 <code>update</code> 的 bug。' +
        '修复方法：先保证同一种商品只出现一次（这个条件叫 <code>isValid</code>），再做更新。';
    };
    draw();
  };

  /* ---------------- 实验 ④：编译器 + 虚拟机 ---------------- */
  function parseExpr(src) {
    var toks = src.match(/\d+|[a-z]\w*|[-+*()]/gi) || [], i = 0;
    function peek() { return toks[i]; }
    function prim() {
      var t = toks[i++];
      if (t === undefined) throw new Error('式子没写完');
      if (t === '(') { var e = sum(); if (toks[i++] !== ')') throw new Error('括号没有配对'); return e; }
      if (/^\d+$/.test(t)) return { k: 'num', v: +t };
      if (/^[a-z]/i.test(t)) return { k: 'var', v: t };
      throw new Error('看不懂「' + t + '」');
    }
    function prod() { var l = prim(); while (peek() === '*') { i++; l = { k: '*', l: l, r: prim() }; } return l; }
    function sum() { var l = prod(); while (peek() === '+' || peek() === '-') { var o = toks[i++]; l = { k: o, l: l, r: prod() }; } return l; }
    var e = sum();
    if (i < toks.length) throw new Error('多出了「' + toks[i] + '」');
    return e;
  }
  function compile(e, out) {
    if (e.k === 'num') out.push(['push(' + e.v + ')', '', '把数字 ' + e.v + ' 放到栈顶']);
    else if (e.k === 'var') out.push(['load(' + e.v + ')', '', '读出变量 ' + e.v + ' 的值，放到栈顶']);
    else {
      compile(e.l, out); compile(e.r, out);
      var nm = { '+': 'add', '-': 'minus', '*': 'multiply' }[e.k];
      out.push([nm, '', '取出栈顶两个数，做 ' + (e.k === '-' ? '减法（讲义的 minus 算的是差的绝对值）' : e.k) + '，把结果放回栈顶']);
    }
    return out;
  }
  function treeTxt(e, d) {
    var pad = new Array(d + 1).join('　　');
    if (e.k === 'num' || e.k === 'var') return pad + e.v + '\n';
    return pad + e.k + '\n' + treeTxt(e.l, d + 1) + treeTxt(e.r, d + 1);
  }
  M['w-p0-vm'] = function (el) {
    el.innerHTML = '<div class="lab-t"><b>⚙️ 编译器 + 虚拟机：程序是怎么被执行的</b><span>对应 L8–L10 Minila</span></div>' +
      '<div class="row">x := <input type="text" class="src" value="(a + b) * (c - 1)"> a=<input type="text" class="va" value="2" style="min-width:40px;width:50px">' +
      ' b=<input type="text" class="vb" value="3" style="min-width:40px;width:50px"> c=<input type="text" class="vc" value="5" style="min-width:40px;width:50px">' +
      '<button class="btn-main go">编译</button></div>' +
      '<div class="grid2" style="grid-template-columns:1fr 1.3fr 0.8fr"><div class="panel"><h4>① 语法树（编译器先读懂结构）</h4><pre class="tree" style="margin:0;font-family:var(--mono);font-size:13px"></pre></div>' +
      '<div class="panel"><h4>② 编译出的指令</h4><div class="ins"></div></div>' +
      '<div class="panel"><h4>③ 虚拟机的栈</h4><div class="stack-viz"></div><div class="env dim" style="font-size:13px;margin-top:6px"></div></div></div>' +
      '<div class="row"><button class="mini-btn reset">⏮ 从头</button><button class="btn-main step">执行一条指令 ▶</button><span class="dim msg"></span></div>' +
      '<div class="explain">编译器把人写的式子翻译成一串很简单的指令；虚拟机只会做「放到栈顶」「取两个算一下」这种小事，一条条执行就能得到答案。' +
      'Python、Java 都是这样工作的。指令名和讲义一致（push / load / add / minus / multiply / store / quit）。L9、L10 还会讲 <code>if</code> / <code>while</code>：编译器先用 <code>len</code> 算出每段指令有多长，再生成相对跳转指令 <code>jump(n)</code>、<code>jumpOnCond(n)</code>、<code>bjump(n)</code>。</div>';
    var q = function (s) { return el.querySelector(s); };
    var code = [], pc = 0, stack = [], env = {};
    function build() {
      try {
        var e = parseExpr(q('.src').value);
        code = compile(e, []); code.push(['store(x)', '', '取出栈顶的值，存进变量 x']); code.push(['quit', '', '程序结束']);
        q('.tree').textContent = treeTxt(e, 0);
      } catch (err) { q('.tree').textContent = '出错：' + err.message; code = []; }
      env = { a: +q('.va').value || 0, b: +q('.vb').value || 0, c: +q('.vc').value || 0 };
      pc = 0; stack = []; draw('');
    }
    function draw(msg) {
      q('.ins').innerHTML = code.map(function (c, i) {
        return '<div class="instr' + (i === pc ? ' cur' : '') + '">' + i + ': ' + esc(c[0]) + '<span class="dim" style="font-size:12px">　' + c[2] + '</span></div>';
      }).join('') + (pc >= code.length && code.length ? '<div class="instr cur">（执行完毕）</div>' : '');
      q('.stack-viz').innerHTML = stack.map(function (v) { return '<div class="cell">' + v + '</div>'; }).join('');
      q('.env').innerHTML = '变量：' + Object.keys(env).map(function (k) { return k + '=' + env[k]; }).join('，');
      q('.msg').innerHTML = msg;
    }
    q('.step').onclick = function () {
      if (pc >= code.length) return;
      var c = code[pc], msg = '';
      var arg = (c[0].match(/\((.*)\)/) || [])[1];
      if (/^push/.test(c[0])) stack.push(+arg);
      else if (/^load/.test(c[0])) { if (!(arg in env)) { stack.push('errNat'); msg = '变量 ' + arg + ' 没有值，讲义里这时压入的是 errNat'; } else stack.push(env[arg]); }
      else if (/^store/.test(c[0])) { env[arg] = stack.pop(); msg = '✅ 结果 x = ' + env[arg]; }
      else if (c[0] === 'quit') { msg = '遇到 quit，虚拟机停下，返回环境（所有变量的值）'; }
      else { var r = stack.pop(), l = stack.pop(); var v = c[0] === 'add' ? l + r : c[0] === 'minus' ? Math.abs(l - r) : l * r; stack.push(v); msg = l + ' ' + { add: '+', minus: '-', multiply: '*' }[c[0]] + ' ' + r + ' = ' + v + (c[0] === 'minus' && l < r ? '（取绝对值）' : ''); }
      pc++; draw(msg);
    };
    q('.reset').onclick = build;
    q('.go').onclick = build;
    build();
  };

  /* ---------------- 实验 ⑤：测试 vs 证明 ---------------- */
  M['w-p0-proof'] = function (el) {
    el.innerHTML = '<div class="lab-t"><b>🔬 测试 vs 证明：一个藏了 9 年的真实 bug</b><span>对应 L11–L14 验证</span></div>' +
      '<div class="explain">二分查找要算中点 <code>mid = (lo + hi) / 2</code>。在 32 位整数里，<code>lo + hi</code> 超过 2147483647 就会「溢出」变成负数。' +
      'Java 标准库的二分查找就有这个 bug，2006 年才被发现并修复。原因是平时测试用的数组都不大。</div>' +
      '<div class="grid2"><div class="panel"><h4>🎲 随机测试</h4><div class="row"><select class="sz"><option value="1000">数组长度 ≤ 1 千</option>' +
      '<option value="1000000">≤ 100 万</option><option value="2147483647">≤ 21 亿（极少有人这样测）</option></select>' +
      '<button class="btn-main t">测 1000 次</button></div><div class="log tl">还没测试。</div></div>' +
      '<div class="panel"><h4>📐 证明（对所有输入一起推理）</h4><div class="row"><button class="btn-main p">尝试证明「不会溢出」</button></div><div class="log pl">还没开始。</div></div></div>' +
      '<div class="explain">测试只检查了你挑出来的那些输入，证明要对<b>所有</b>输入成立，所以证不下去的地方就是 bug 藏身的地方。' +
      '这门课 L11–L14 教的就是第二种：用 CafeOBJ 写「证明分数」，让系统把每一步都检查一遍。</div>';
    var q = function (s) { return el.querySelector(s); };
    q('.t').onclick = function () {
      var max = +q('.sz').value, fail = 0, ex = null;
      for (var i = 0; i < 1000; i++) {
        var hi = Math.floor(Math.random() * max), lo = Math.floor(Math.random() * (hi + 1));
        var mid = ((lo + hi) | 0) >> 1;
        if (mid < lo || mid > hi) { fail++; if (!ex) ex = [lo, hi, mid]; }
      }
      q('.tl').innerHTML = fail ? '<div style="color:#ff9b9b">❌ ' + fail + ' 次出错。例如 lo=' + ex[0] + ', hi=' + ex[1] + ' 算出 mid=' + ex[2] + '（负数！）</div>'
        : '<div style="color:#8ef0c4">✅ 1000 次全部通过</div><div class="c">看起来没问题……但真的没问题吗？</div>';
    };
    q('.p').onclick = function () {
      var lines = ['目标：对所有 0 ≤ lo ≤ hi ≤ 2147483647，lo + hi ≤ 2147483647',
        '分析：lo + hi 的最大值 = 2147483647 + 2147483647 = 4294967294',
        '4294967294 &gt; 2147483647，目标<b>不成立</b>',
        '<span style="color:#ff9b9b">❌ 证明失败，并且直接得到反例：lo = hi = 2147483647</span>',
        '修复：改成 mid = lo + (hi - lo) / 2。此时 hi - lo ≥ 0 且 lo + (hi - lo)/2 ≤ hi，证明可以完成 ✅'];
      var i = 0; q('.pl').innerHTML = '';
      (function next() { if (i >= lines.length) return; q('.pl').innerHTML += '<div>' + (i + 1) + '. ' + lines[i++] + '</div>'; setTimeout(next, 600); })();
    };
  };

  /* ---------------- 实验 ⑥：多米诺骨牌 = 归纳法 ---------------- */
  M['w-p0-domino'] = function (el) {
    var N = 14;
    el.innerHTML = '<div class="lab-t"><b>🁢 多米诺骨牌：归纳法为什么能证明「所有」</b><span>对应 L11–L12 结构归纳</span></div>' +
      '<div class="row"><label><input type="checkbox" class="base" checked> ① 基础情形：第 0 块会倒</label>' +
      '<label><input type="checkbox" class="stepok" checked> ② 归纳情形：任何一块倒下都能推倒下一块</label></div>' +
      '<div class="domino">' + Array.apply(null, Array(N)).map(function (_, i) { return '<div class="d">' + i + '</div>'; }).join('') + '</div>' +
      '<div class="row"><button class="btn-main go">推！</button><span class="dim msg"></span></div>' +
      '<h4 style="margin:12px 0 4px">用真正的 CafeOBJ 证明 <code>X + 0 = X</code>（对所有自然数 X）</h4>' +
      '<div class="row"><button class="mini-btn b1">① 证基础情形</button><button class="mini-btn b2">② 证归纳情形</button></div><div class="log pl">点上面两个按钮。</div>';
    var q = function (s) { return el.querySelector(s); };
    q('.go').onclick = function () {
      var ds = el.querySelectorAll('.d'), base = q('.base').checked, ok = q('.stepok').checked, gap = ok ? -1 : 4 + Math.floor(Math.random() * 6);
      ds.forEach(function (d) { d.className = 'd'; });
      if (!base) { q('.msg').textContent = '第 0 块根本没倒，后面再怎么连锁也没用。没有基础情形，归纳证明不成立。'; ds[0].classList.add('stuck'); return; }
      var i = 0;
      (function next() {
        if (i >= N) { q('.msg').textContent = '全部倒下！两步都成立，所以「对所有数都成立」。'; return; }
        if (i === gap) { ds[i].classList.add('stuck'); q('.msg').textContent = '第 ' + (i - 1) + ' 块推不倒第 ' + i + ' 块：归纳情形有漏洞，结论只对前面几个成立。'; return; }
        ds[i].classList.add('fall'); i++; setTimeout(next, 160);
      })();
    };
    var MOD = 'mod! PADD-LAB {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _+_ : PNat PNat -> PNat\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s X + Y = s(X + Y) .\n}\n';
    function run(body) {
      var r = C.runScript(MOD + 'open PADD-LAB .\n' + body + '\nclose', C.builtins());
      return r.output.filter(function (o) { return o.kind === 'red'; }).pop();
    }
    q('.b1').onclick = function () {
      var r = run('red 0 + 0 = 0 .');
      q('.pl').innerHTML = '<div class="c">-- 基础情形：X 取最小的 0</div><div>red 0 + 0 = 0 .</div><div>⇒ <b>' + esc(r.result) + '</b>　<span class="c">（规则 0 + Y = Y 把 0 + 0 换成 0，两边相等）</span></div>';
    };
    q('.b2').onclick = function () {
      var r = run('op x : -> PNat .\neq x + 0 = x .\nred s x + 0 = s x .');
      q('.pl').innerHTML = '<div class="c">-- 归纳情形：假设对某个 x 成立，证明对 s x（下一个数）也成立</div>' +
        '<div>op x : -&gt; PNat .　<span class="c">-- x 是一个「什么都不知道」的数，所以它代表任意的数</span></div>' +
        '<div>eq x + 0 = x .　<span class="c">-- 归纳假设 IH：第 x 块会倒</span></div>' +
        '<div>red s x + 0 = s x .　<span class="c">-- 要证：第 s x 块也会倒</span></div>' +
        '<div>⇒ <b>' + esc(r.result) + '</b>　<span class="c">（s x + 0 → s(x + 0) → s x，两边相等）</span></div>' +
        (r.result === 'true' ? '<div style="color:#8ef0c4">✅ 两个情形都是 true，所以 X + 0 = X 对所有自然数成立</div>' : '');
    };
  };

  /* ---------------- 实验 ⑦：类型检查（NzNat） ---------------- */
  M['w-p0-type'] = function (el) {
    el.innerHTML = '<div class="lab-t"><b>🧱 类型帮你挡住错误：「减一」不能用在 0 上</b><span>对应 L2 子排序 NzNat</span></div>' +
      '<div class="explain">内置 NAT 模块里，减一 <code>p_</code> 的声明是 <code>op p_ : NzNat -&gt; Nat</code>：它只接受<b>非零</b>自然数（NzNat）。点一个数试试：</div>' +
      '<div class="row">' + [0, 1, 2, 5].map(function (n) { return '<button class="chip pv" data-n="' + n + '">p ' + n + '</button>'; }).join('') + '</div>' +
      '<div class="log out">点上面的按钮，会真的在 CafeOBJ 引擎里运行 <code>red p N .</code></div>' +
      '<div class="explain">Rust 的 <code>NonZeroU32</code>、TypeScript 的「非空数组」类型都是同一个想法：把「不能为 0 / 不能为空」写进类型里，错误在程序运行之前就能发现。</div>';
    el.querySelectorAll('.pv').forEach(function (b) {
      b.onclick = function () {
        var n = b.dataset.n, r = red('NAT', 'p ' + n);
        el.querySelectorAll('.pv').forEach(function (x) { x.classList.remove('ok', 'bad'); });
        var ok = !!r.sort;
        b.classList.add(ok ? 'ok' : 'bad');
        el.querySelector('.out').innerHTML = 'red p ' + n + ' .<br>⇒ ' + esc(r.result) + (r.sort ? ' : ' + esc(r.sort) : '') + '<br><span class="c">' +
          (ok ? n + ' 是 NzNat（非零），p_ 接受它，算出 ' + esc(r.result) + '。'
            : '0 不是 NzNat，p_ 不接受它。系统没法化简，原样留下 p 0，它的类型落到了「错误类型」里，相当于报错。') + '</span>';
      };
    });
  };
})(window);
