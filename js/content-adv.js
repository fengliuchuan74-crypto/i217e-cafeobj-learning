/* =====================================================================
 * content-adv.js — L11 ~ L14 + 期末冲刺
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});
  var W = window.W;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* notes：可选，{ '这一行代码(去掉首尾空格)': '这一行的中文解释' }，供「逐行解读」使用 */
  function cb(id, src, cap, notes) {
    if (notes) (window.CODE_NOTES = window.CODE_NOTES || {})[id] = notes;
    return '<div class="codebox" id="' + id + '">' +
      '<div class="codebox-h"><span>' + esc(cap || 'CafeOBJ') + '</span>' +
      '<button class="btn-run" data-run="' + id + '">▶ 运行</button></div>' +
      '<pre>' + esc(src) + '</pre>' +
      '<div class="run-out">点「运行」，本机引擎会真的执行这段代码</div></div>';
  }
  function cbStatic(src, cap, notes) {
    var nk = 'st-' + (window.__ST_SEQ = (window.__ST_SEQ || 0) + 1);
    if (notes) (window.CODE_NOTES = window.CODE_NOTES || {})[nk] = notes;
    return '<div class="codebox" data-nk="' + nk + '"><div class="codebox-h"><span>' + esc(cap || '代码（读懂即可）') + '</span>' +
      '<span class="dim">非可执行片段</span></div><pre>' + esc(src) + '</pre></div>';
  }
  function cta(id, title, sub) {
    return '<div class="quiz-cta" data-quiz="' + id + '"><span class="q-ico">✍️</span>' +
      '<span class="q-txt"><b>' + title + '</b><span>' + (sub || '检查一下刚才学的') + '</span></span>' +
      '<span class="q-go">开始 →</span></div>';
  }

  /* =====================================================================
   * L11 验证：自然数
   * ===================================================================== */
  CH.push({
    id: 'L11', num: 'L11', group: '第 4 部分 · 验证（高分值）', short: 'L11 验证·自然数',
    title: '11. 程序验证：自然数',
    sub: '从「算」到「证」。结构归纳法 + 证明分数（proof score）：base case + induction case + IH。',
    minutes: 75,
    goals: [
      '说清结构归纳法的两个分支和一个假设',
      '会写证明分数：<code>open</code> / 新常量 / <code>eq IH</code> / <code>red</code> / <code>close</code>',
      '能独立完成 assoc+、comm+（含两个引理）的证明',
      '理解「需要引理」时怎么构造引理'
    ],
    pre: [
      'L1：皮亚诺自然数 <code>0</code>、<code>s</code>，以及 <code>_+_</code>、<code>_*_</code> 的递归定义',
      'L3：一步重写、redex、范式；会手算 <code>red</code> 的每一步',
      'L3：<code>assoc</code> / <code>comm</code> 属性的含义（PNAT2、PNAT3 会用到）',
      'P0 实验 ⑥（多米诺骨牌）：归纳法的直觉'
    ],
    summary: [
      '结构归纳 = base case（X 取 0）+ induction case（假设对 x 成立，证对 s(x) 成立）',
      '证明分数五步：open / 声明新常量 / 写 IH（新常量 + 原变量）/ red 目标 / close；red 得到 true 就证完一个分支',
      '红结果卡住、化不成 true 时，看是哪一项化不动，把它推广成引理（rz+、rs+、d*o+、rz*、rs*、p-sf2）',
      '讲义的模块：PNAT1 → PNAT2（+ 加上 assoc comm）→ PNAT3（* 也加上 assoc comm）；乘法的定理在 PNAT2/PNAT3 里证',
      '定理的依赖顺序：assoc+ → rz+、rs+ → comm+ → d*o+ → assoc* → rz*、rs* → comm* → p-sf2 → trf'
    ],
    sections: [
      {
        id: 'L11.s1', title: '皮亚诺自然数 PNAT1',
        guide: {
          what: '本章所有定理都关于这个模块：用 <code>0</code> 和 <code>s</code> 表示自然数，再定义加法、乘法和两种阶乘。',
          why: '验证要先有一个被验证的对象。PNAT1 足够小，每条等式都能手算，适合练习证明。',
          how: '先把源码读一遍（点「📖 逐行解读」），再运行下面的热身代码，看每个函数算出什么。',
          use: '真实的程序验证也是这样开始的：先把要验证的程序写成精确的定义，比如 seL4 内核先有一份形式化规格。',
          pitfalls: ['<code>s</code> 在本章写成 <code>s(X)</code>（普通函数写法），和 L1 的 <code>s_</code> 是同一个意思', '<code>fact1</code> 是普通递归，<code>fact2</code> 是尾递归（带累加器），两者算的是同一个函数，这正是本章最后要证明的']
        },
        html: '<p>验证的对象是这个模块（第 11 章的全部定理都关于它）：</p>' +
          cbStatic('mod! PNAT1 {\n  [PNat]\n  op 0 : -> PNat {constr} .\n  op s : PNat -> PNat {constr} .\n  vars X Y Z : PNat .\n  eq (0 = s(Y)) = false .\n  eq (s(X) = s(Y)) = (X = Y) .\n  op _+_ : PNat PNat -> PNat .\n  eq 0 + Y = Y .                -- (+1)\n  eq s(X) + Y = s(X + Y) .      -- (+2)\n  op _*_ : PNat PNat -> PNat .\n  eq 0 * Y = 0 .                -- (*1)\n  eq s(X) * Y = (X * Y) + Y .   -- (*2)\n  op fact1 : PNat -> PNat .\n  eq fact1(0) = s(0) .          -- (f1-1)\n  eq fact1(s(X)) = s(X) * fact1(X) .  -- (f1-2)\n  op fact2 : PNat -> PNat .\n  op sfact2 : PNat PNat -> PNat .\n  eq fact2(X) = sfact2(X,s(0)) .     -- (f2)\n  eq sfact2(0,Y) = Y .               -- (sf2-1)\n  eq sfact2(s(X),Y) = sfact2(X,s(X) * Y) .  -- (sf2-2)\n}', 'PNAT1 完整源码（背下来）') +
          '<p>要点：</p><ul>' +
          '<li><code>0</code> 和 <code>s</code> 是<b>构造子</b>：所有自然数都是 <code>s(s(...0))</code> 这个形状。</li>' +
          '<li><code>_=_</code> 由内建模块提供基本规则（<code>X = X</code> 为 true，<code>true = false</code> 为 false），' +
          '再加上两条：<code>0 = s(Y)</code> 为 false、<code>s(X) = s(Y)</code> 化成 <code>X = Y</code>。</li>' +
          '<li><code>fact2</code> 是<b>尾递归</b>版本：靠累加器 <code>Y</code>。它的正确性就是本章最后一道大题。</li></ul>' +
          cb('w-l11-1', 'open PNAT1 .\nred s(s(0)) + s(s(s(0))) .\nred s(s(0)) * s(s(0)) .\nred fact1(s(s(s(0)))) .\nred fact2(s(s(s(s(0))))) .\nclose', '先跑一跑，热身', {
            'open PNAT1 .': '打开模块 PNAT1（系统已内置），准备试算。',
            'red s(s(0)) + s(s(s(0))) .': '算 2 + 3，结果应该是 5 个 s 套着 0。',
            'red s(s(0)) * s(s(0)) .': '算 2 × 2，结果应该是 4 个 s。',
            'red fact1(s(s(s(0)))) .': '用普通递归算 3 的阶乘，结果是 6 个 s。',
            'red fact2(s(s(s(s(0))))) .': '用尾递归算 4 的阶乘，结果是 24 个 s。和 fact1 算的是同一个函数。',
            'close': '退出试算。'
          }) +
          '<p>注意 <code>red s(s(0)) + s(s(s(0)))</code> 的中间步骤：<code>s(s(0)) + s(s(s(0))) → s(s(0) + s(s(s(0)))) → …</code>，' +
          '每用一次 <code>(+2)</code> 就去掉一个 <code>s</code>，最后靠 <code>(+1)</code> 收尾。<b>这就是归纳法的计算对应物</b>。</p>'
      },
      {
        id: 'L11.s2', title: '结构归纳法：一段话讲清',
        guide: {
          what: '证明「对所有自然数 X 都成立」的方法：先证 X = 0 成立，再证「对 x 成立就能推出对 s(x) 成立」。',
          why: '自然数有无穷多个，不可能一个个检查。归纳法只用两步就覆盖了全部。',
          how: '写证明时固定三样东西：对哪个变量归纳、base case 要证什么、induction case 要证什么以及 IH 是什么。',
          use: '所有递归程序的正确性证明都用它：数组/链表/树的算法、编译器的正确性证明（CompCert）。',
          pitfalls: ['只证了归纳情形，忘了基础情形', '归纳情形里把 IH 当成了要证的结论（循环论证）']
        },
        html:'<div class="card exam"><div class="card-t"><span class="ico">📐</span>核心命题（必须一字不差记住）</div>' +
          '<p>设 <code>l(X)</code> 和 <code>r(X)</code> 是同一个排序的项（X 出现在其中）。下面两个命题等价：</p>' +
          '<p><b>(A)</b> (∀X:PNat) l(X) = r(X)</p>' +
          '<p><b>(B)</b>　I. <code>l(0) = r(0)</code><br>　　II. 若 <code>l(x) = r(x)</code>，则 <code>l(s(x)) = r(s(x))</code>，其中 x 是 PNat 的新常量</p>' +
          '<p>所以只要证 (B) 就证了 (A)。这叫<b>对自然数 X 的结构归纳法</b>。I 叫 <b>base case</b>（基础情形），' +
          'II 叫 <b>induction case</b>（归纳情形），<code>l(x) = r(x)</code> 叫 <b>induction hypothesis, IH</b>（归纳假设）。</p></div>' +
          '<p>直觉上为什么对：因为每个自然数都是有限个 <code>s</code> 套在 <code>0</code> 外面。' +
          '基础情形处理 <code>0</code>；归纳情形说「如果对 <code>x</code> 成立，那么对再多套一个 <code>s</code> 也成立」；' +
          '于是沿着 <code>0 → s(0) → s(s(0)) → …</code> 一层层推上去，所有自然数都被覆盖。</p>' +
          '<table><tr><th>类比</th><th>结构归纳</th></tr>' +
          '<tr><td>多米诺骨牌</td><td>推倒第一块（base），且每块都能推倒下一块（induction）→ 全倒</td></tr>' +
          '<tr><td>爬楼梯</td><td>能上第一级，且能从第 n 级上第 n+1 级 → 能上任意级</td></tr>' +
          '<tr><td>代码</td><td>base = 递归函数的基础情形（<code>fact(0)</code>）；induction = 递归情形（<code>fact(s(X))</code>）</td></tr></table>' +
          '<div class="card why"><div class="card-t"><span class="ico">🔑</span>x 为什么必须「新」</div>' +
          '<p>归纳情形里我们假设「对<b>某个固定的但任意的</b> x 成立」。如果 x 是旧常量（比如前面用过的），' +
          '可能已经带有不该有的性质，证明就不成立了。这就是证明助手（第 14 章）要解决的问题之一 —— 手写时容易重复使用常量。</p></div>'
      },
      {
        id: 'L11.s3', title: '证明分数：把证明写成 CafeOBJ 代码',
        guide: {
          what: '证明分数（proof score）就是用 CafeOBJ 代码写的证明：声明新常量、写归纳假设、让系统 red 目标等式。',
          why: '手写证明容易漏步。让系统一步步化简，结果是 true 就说明每一步都对。',
          how: '先看下面的「手把手示范」走一遍最简单的 X + 0 = X，再看 assoc+ 的完整证明分数。',
          use: '这就是「机器检查的证明」：CafeOBJ 的作者团队用同样的方法验证过通信协议和安全协议。',
          pitfalls: ['IH 里把所有变量都写成小写常量，结果 IH 只对那一组具体值成立，证明卡住', '忘了把 base 和 induction 放在两个不同的 open … close 里，导致 IH 污染了 base case']
        },
        html: '<div class="card"><div class="card-t"><span class="ico">👣</span>手把手示范：证明 X + 0 = X（对所有自然数 X）</div>' +
          '<p><b>① 要证什么</b>：<code>X + 0 = X</code>。注意 PNAT1 只有 <code>0 + Y = Y</code>（0 在左边），没有「0 在右边」的规则，所以这不是显然的，要证明。</p>' +
          '<p><b>② 对谁归纳</b>：对 <code>X</code>。因为 <code>_+_</code> 的两条等式都是按<b>第一个参数</b>的形状（<code>0</code> 还是 <code>s(X)</code>）来写的，对第一个参数归纳，每一步才能用上等式。</p>' +
          '<p><b>③ base case</b>：把 X 换成 0，要证 <code>0 + 0 = 0</code>。手算：<code>0 + 0 → 0</code>（用 +1），两边都是 0，所以 <code>red</code> 得到 true。</p>' +
          '<p><b>④ 为什么 IH 要用新常量</b>：归纳情形要说「<b>假设</b>对某个数成立」。我们声明一个新常量 <code>op x : -&gt; PNat .</code>，系统对 x 一无所知，没有任何等式能化简它。' +
          '既然对它一无所知还能证出结论，说明证明没有用到「x 具体是几」，所以结论对<b>任意</b>的 x 都成立。IH 就写成 <code>eq x + 0 = x .</code>。</p>' +
          '<p><b>⑤ induction case</b>：要证 <code>s(x) + 0 = s(x)</code>。手算：<code>s(x) + 0 → s(x + 0)</code>（用 +2，X = x、Y = 0）<code>→ s(x)</code>（用 IH 把里面的 x + 0 换成 x）。两边相同，<code>red</code> 得到 true。</p>' +
          '<p><b>⑥ 结论</b>：两个分支都是 true，所以 <code>X + 0 = X</code> 对所有自然数成立。这条定理以后叫 <b>rz+</b>（right zero of +，右零元），下一节证交换律时要用到它。</p>' +
          cb('w-l11-hand', 'open PNAT1 .\n-- base case: X = 0\nred 0 + 0 = 0 .\nclose\nopen PNAT1 .\n-- induction case\nop x : -> PNat .\neq x + 0 = x .\nred s(x) + 0 = s(x) .\nclose', '手把手示范的证明分数（点运行，两个都应是 true）', {
            '-- base case: X = 0': '注释：下面是基础情形，把 X 换成 0。',
            'red 0 + 0 = 0 .': '让系统化简 <code>0 + 0 = 0</code>：左边用 (+1) 变成 0，两边相等，结果是 true。',
            '-- induction case': '注释：下面是归纳情形，放在<b>另一个</b> open … close 里，免得 IH 影响 base case。',
            'op x : -> PNat .': '声明新常量 x：一个「我们什么都不知道」的自然数，所以它代表任意的数。',
            'eq x + 0 = x .': '归纳假设 IH：假设对 x 成立。用 eq 写进去，系统就可以拿它来重写。',
            'red s(x) + 0 = s(x) .': '要证的目标：对 x 的下一个数 s(x) 也成立。s(x) + 0 → s(x + 0)（+2）→ s(x)（IH），结果 true。',
            'open PNAT1 .': '打开模块 PNAT1，进入试算模式。',
            'close': '退出试算模式，open 里加的常量和等式全部丢掉。'
          }) +
          '<div class="card warn"><div class="card-t"><span class="ico">🔍</span>red 卡住了怎么办：从结果里找引理</div>' +
          '<p>如果 <code>red</code> 的结果不是 true，而是一个停在半路的等式，比如 <code>y + 0 = y</code>，就看<b>哪一边化不动、为什么化不动</b>。' +
          '这里 <code>y + 0</code> 化不动，是因为 y 是常量，不是 0 也不是 s(…)，两条等式都用不上。于是把它推广成引理 <code>X + 0 = X</code>，单独证明，再作为 <code>eq</code> 加进去。下一节的交换律就是这样做的。</p></div></div>' +
          '<p><b>证明分数（proof score）</b>= 用 CafeOBJ 写的证明。核心套路只有三步：</p>' +
          '<div class="card tip"><div class="card-t"><span class="ico">📝</span>模板</div>' +
          '<div class="codebox"><pre>open 模块名 .\n-- 1. 声明新常量（把归纳变量实例化）\nops x y z : -&gt; PNat .\n-- 2. （归纳情形）把 IH 作为等式加进去\neq (x + Y) + Z = x + (Y + Z) .\n-- 3. 检查：red 目标等式\nred (s(x) + y) + z = s(x) + (y + z) .\nclose</pre></div>' +
          '<p>如果 <code>red</code> 的结果是 <code>true</code>，这个分支就证完了。</p></div>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>最关键的一点：IH 怎么写</div>' +
          '<p>IH 的写法是 <b>「新常量 + 原变量」</b>：<code>eq (x + Y) + Z = x + (Y + Z) .</code></p>' +
          '<p>注意 <code>x</code> 是小写（新常量），而 <code>Y Z</code> 是大写（原来的全称变量，仍然可以被任意实例化）。' +
          '<b>千万不要把 IH 写成 <code>eq (x + y) + z = x + (y + z) .</code></b> —— 那样只对那一组具体常量成立，' +
          '证明就会卡住。</p></div>' +
          '<h3 class="sub">定理 1：加法结合律（assoc+）</h3>' +
          '<p><b>(X + Y) + Z = X + (Y + Z)</b></p>' +
          '<p>① 基础情形：要证 <code>(0 + y) + z = 0 + (y + z)</code>。手算：左边 <code>→ y + z</code>（用 +1），右边 <code>→ y + z</code>（用 +1），相同。</p>' +
          '<p>② 归纳情形：假设 <code>(x + Y) + Z = x + (Y + Z)</code>，要证 <code>(s(x) + y) + z = s(x) + (y + z)</code>。</p>' +
          '<div class="codebox"><pre>左边 (s(x) + y) + z\n  → s(x + y) + z      by (+2)\n  → s((x + y) + z)    by (+2)\n  → s(x + (y + z))    by (IH)\n\n右边 s(x) + (y + z)\n  → s(x + (y + z))    by (+2)</pre></div>' +
          '<p>两边都是 <code>s(x + (y + z))</code>，所以相等。</p>' +
          cb('w-l11-2', 'open PNAT1 .\n-- I. base case\nops y z : -> PNat .\nred (0 + y) + z = 0 + (y + z) .\nclose\n\nopen PNAT1 .\n-- II. induction case\nops x y z : -> PNat .\neq (x + Y) + Z = x + (Y + Z) .\nred (s(x) + y) + z = s(x) + (y + z) .\nclose', 'assoc+ 的完整证明分数', {
            'open PNAT1 .': '打开 PNAT1。base 和 induction 各用一个 open，互不干扰。',
            '-- I. base case': '注释：基础情形，X 取 0。',
            'ops y z : -> PNat .': '声明新常量 y、z，代表任意的 Y、Z。',
            'red (0 + y) + z = 0 + (y + z) .': '两边都用 (+1) 化成 y + z，结果 true。',
            'close': '结束这一个分支。',
            '-- II. induction case': '注释：归纳情形。',
            'ops x y z : -> PNat .': '三个新常量：x 是归纳用的，y、z 代表任意的 Y、Z。',
            'eq (x + Y) + Z = x + (Y + Z) .': '归纳假设 IH。注意 x 小写（固定的新常量），Y、Z 大写（仍是变量，可以对上任何式子）。',
            'red (s(x) + y) + z = s(x) + (y + z) .': '目标：对 s(x) 也成立。两边都化成 s(x + (y + z))，结果 true。'
          }) +
          '<p>两个 <code>red</code> 都会输出 <code>true</code> —— 这就是「定理证完了」的标志。</p>' +
          cta('L11-quiz1', '随堂小测 · 归纳法基础（3 题）')
      },
      {
        id: 'L11.s4', title: '定理 2：交换律，以及「为什么要引理」',
        guide: {
          what: '证明 X + Y = Y + X。直接归纳会卡两次，每次都要先证一个小定理（引理）才能继续。',
          why: '这是全章最重要的技巧：真实的证明很少一次成功，通常要在卡住的地方补上缺少的事实。',
          how: '先看卡在哪里（y + 0、y + s(x) 化不动），再看怎么把它推广成引理 rz+、rs+，最后运行完整的证明分数。',
          use: '数学家和验证工程师每天都在做这件事：证明卡住 → 找出缺的引理 → 单独证明 → 回来继续。',
          pitfalls: ['引理写得太具体（如 y + 0 = y），单独证不出来；要推广成 X + 0 = X', '把还没证明的引理当成已知直接用，却没有给出它的证明']
        },
        html:'<p><b>X + Y = Y + X</b>。直接做归纳会卡住，这是全章最重要的一课。</p>' +
          '<p>① 基础情形：要证 <code>0 + y = y + 0</code>。<br>' +
          '左边 <code>0 + y → y</code>（+1）。右边 <code>y + 0</code> —— <b>卡住了！</b>' +
          '因为 <code>_+_</code> 的定义是对<b>第一个</b>参数递归的，<code>y</code> 是常量，不知道它长什么样，' +
          '所以既不能匹配 <code>0 + Y</code> 也不能匹配 <code>s(X) + Y</code>。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🧩</span>这时候怎么办：猜一个引理</div>' +
          '<p>既然需要 <code>y + 0 = y</code>，那就<b>把它猜成一个引理</b>，并单独证明它：</p>' +
          '<p><b>Lemma 1 (rz+)　X + 0 = X</b>　（右零元）</p>' +
          '<p>证明（对 X 归纳）：<br>' +
          'base：<code>0 + 0 = 0</code> → 左边 <code>→ 0</code> ✓<br>' +
          'ind：假设 <code>x + 0 = x</code>，证 <code>s(x) + 0 = s(x)</code>：左边 <code>→ s(x + 0) → s(x)</code>（用 IH）✓</p>' +
          '<p>有了 rz+，基础情形就通了：<code>0 + y → y</code>，<code>y + 0 → y</code>（用 rz+）。</p></div>' +
          '<p>② 归纳情形：假设 <code>x + Y = Y + x</code>，要证 <code>s(x) + y = y + s(x)</code>。</p>' +
          '<p>左边 <code>s(x) + y → s(x + y) → s(y + x)</code>（用 IH）。<br>' +
          '右边 <code>y + s(x)</code> —— <b>又卡住了！</b> 还是因为 <code>y</code> 是常量的第一个参数。</p>' +
          '<p>所以再猜一个引理：</p>' +
          '<p><b>Lemma 2 (rs+)　X + s(Y) = s(X + Y)</b>　（右后继）</p>' +
          '<p>证明（对 X 归纳）：<br>' +
          'base：<code>0 + s(y) = s(0 + y)</code>：左 <code>→ s(y)</code>，右 <code>→ s(y)</code> ✓<br>' +
          'ind：假设 <code>x + s(Y) = s(x + Y)</code>，证 <code>s(x) + s(y) = s(s(x) + y)</code>：' +
          '左 <code>→ s(x + s(y)) → s(s(x + y))</code>；右 <code>→ s(s(x + y))</code> ✓</p>' +
          cb('w-l11-3', 'open PNAT1 .\n-- Lemma 1 (rz+): X + 0 = X\nop x : -> PNat .\nred 0 + 0 = 0 .\nclose\nopen PNAT1 .\nop x : -> PNat .\neq x + 0 = x .\nred s(x) + 0 = s(x) .\nclose', '引理 1（rz+）的两半', {
            'open PNAT1 .': '打开 PNAT1。',
            '-- Lemma 1 (rz+): X + 0 = X': '注释：引理 rz+（右零元），上面的手把手示范证的就是它。',
            'op x : -> PNat .': '新常量 x（base 里其实用不到，写上也没关系）。',
            'red 0 + 0 = 0 .': '基础情形：0 + 0 → 0，结果 true。',
            'close': '结束这个分支。',
            'eq x + 0 = x .': '归纳假设 IH。',
            'red s(x) + 0 = s(x) .': '归纳情形：s(x) + 0 → s(x + 0) → s(x)，结果 true。'
          }) +
          cb('w-l11-4', 'open PNAT1 .\n-- Lemma 2 (rs+): X + s(Y) = s(X + Y)\nop y : -> PNat .\nred 0 + s(y) = s(0 + y) .\nclose\nopen PNAT1 .\nops x y : -> PNat .\neq x + s(Y) = s(x + Y) .\nred s(x) + s(y) = s(s(x) + y) .\nclose', '引理 2（rs+）的两半', {
            'open PNAT1 .': '打开 PNAT1。',
            '-- Lemma 2 (rs+): X + s(Y) = s(X + Y)': '注释：引理 rs+（右后继）。',
            'op y : -> PNat .': '新常量 y。',
            'red 0 + s(y) = s(0 + y) .': '基础情形：两边都化成 s(y)，结果 true。',
            'close': '结束这个分支。',
            'ops x y : -> PNat .': '新常量 x、y。',
            'eq x + s(Y) = s(x + Y) .': '归纳假设 IH：x 小写固定，Y 大写仍是变量。',
            'red s(x) + s(y) = s(s(x) + y) .': '归纳情形：两边都化成 s(s(x + y))，结果 true。'
          }) +
          cb('w-l11-5', 'open PNAT1 .\n-- Theorem 2 (comm+) base case\nop y : -> PNat .\neq X + 0 = X .            -- (rz+)\nred 0 + y = y + 0 .\nclose\n\nopen PNAT1 .\n-- Theorem 2 (comm+) induction case\nops x y : -> PNat .\neq X + s(Y) = s(X + Y) .  -- (rs+)\neq x + Y = Y + x .        -- (IH)\nred s(x) + y = y + s(x) .\nclose', 'comm+ 的完整证明（含两个引理）', {
            'open PNAT1 .': '打开 PNAT1。',
            '-- Theorem 2 (comm+) base case': '注释：交换律的基础情形。',
            'op y : -> PNat .': '新常量 y。',
            'eq X + 0 = X .            -- (rz+)': '把已证的引理 rz+ 写进来。引理对所有值成立，所以用大写变量 X。',
            'red 0 + y = y + 0 .': '左边 → y（+1）；右边 → y（rz+）。结果 true。',
            'close': '结束这个分支。',
            '-- Theorem 2 (comm+) induction case': '注释：归纳情形。',
            'ops x y : -> PNat .': '新常量 x、y。',
            'eq X + s(Y) = s(X + Y) .  -- (rs+)': '把已证的引理 rs+ 写进来。',
            'eq x + Y = Y + x .        -- (IH)': '归纳假设：对 x 成立，Y 仍是变量。',
            'red s(x) + y = y + s(x) .': '左边 → s(x + y) → s(y + x)（IH）；右边 → s(y + x)（rs+）。结果 true。'
          }) +
          '<div class="card tip"><div class="card-t"><span class="ico">💡</span>从这个例子学到的通用方法</div>' +
          '<ol><li>归纳证明卡住时，<b>看是哪一项化不动</b>。</li>' +
          '<li>把「化不动的那个等式」<b>猜成引理</b>（例如 <code>y + 0 = y</code> → 一般化成 <code>X + 0 = X</code>）。</li>' +
          '<li>引理要<b>比需要的更一般</b>（把 y 换成变量 X），否则单独证不出来。</li>' +
          '<li>引理本身用归纳法证明，或者作为「已知定理」引用。</li></ol>' +
          '<p>这就是数学证明的真实过程：<b>不是一次成功，而是不断发现「我还需要另一个事实」</b>。</p></div>'
      },
      {
        id: 'L11.s5', title: '定理 3、4：乘法的结合律与交换律',
        guide: {
          what: '证明乘法满足结合律 assoc*（要先证分配律 d*o+）和交换律 comm*（要先证 rz*、rs*）。',
          why: '最后一节的尾递归阶乘要用到这些性质；同时练习「卡住 → 找引理」的方法。',
          how: '注意讲义从这里开始改用 <b>PNAT2</b>：它就是 PNAT1，只是给 <code>_+_</code> 加上了 <code>{assoc comm}</code>。因为 assoc+、comm+ 已经证明过了，可以放心让系统自动使用。',
          use: '编译器优化时会用到这些代数性质，例如把 <code>(a*b)*c</code> 重新组合成更快的计算顺序；前提是这些性质被证明成立。',
          pitfalls: ['还在 PNAT1 里证乘法的定理：+ 没有 assoc comm，很多步要手动处理，red 会卡住', '没证 d*o+ 就直接用它来证 assoc*']
        },
        html: '<div class="card tip"><div class="card-t"><span class="ico">🔁</span>先换模块：PNAT2</div>' +
          '<p>讲义原文：<i>PNAT2 is PNAT1 in which _+_ is declared as follows: <code>op _+_ : PNat PNat -&gt; PNat {assoc comm} .</code></i></p>' +
          '<p>为什么可以这样做？因为上一节已经证明了 + 满足结合律和交换律。把这两个性质写成属性，系统在匹配时会自动考虑括号和顺序，乘法的证明就不用再一步步处理加法的重排。</p></div>' +
          '<p><b>assoc*：(X * Y) * Z = X * (Y * Z)</b></p>' +
          '<p>基础情形：两边都 <code>→ 0</code>（用 *1）✓</p>' +
          '<p>归纳情形：(s(x) * y) * z 和 s(x) * (y * z)：</p>' +
          '<div class="codebox"><pre>左边 (s(x) * y) * z → ((x * y) + y) * z      by (*2)\n右边 s(x) * (y * z) → (x * (y * z)) + (y * z)  by (*2)</pre></div>' +
          '<p>这两个项没法化成同一个，需要<b>分配律</b>：</p>' +
          '<p><b>Lemma 3 (d*o+)　(X + Y) * Z = (X * Z) + (Y * Z)</b></p>' +
          '<p>用分配律：左边 <code>((x*y) + y) * z → ((x*y)*z) + (y*z) → (x*(y*z)) + (y*z)</code>（第二步用 IH），正好等于右边。</p>' +
          '<p>分配律本身也要对 X 归纳（base 用 +1、*1；ind 用 *2 和 IH）。</p>' +
          cb('w-l11-dist', 'open PNAT2 .\n-- d*o+ base\nops y z : -> PNat .\nred (0 + y) * z = (0 * z) + (y * z) .\nclose\nopen PNAT2 .\n-- d*o+ induction\nops x y z : -> PNat .\neq (x + Y) * Z = (x * Z) + (Y * Z) .\nred (s(x) + y) * z = (s(x) * z) + (y * z) .\nclose', '引理 3（d*o+）的证明分数（讲义写法，在 PNAT2 里）', {
            'open PNAT2 .': '打开 PNAT2（+ 已经带 assoc comm 属性）。',
            '-- d*o+ base': '注释：分配律的基础情形，X 取 0。',
            'ops y z : -> PNat .': '新常量 y、z。',
            'red (0 + y) * z = (0 * z) + (y * z) .': '左边 → y * z；右边 → 0 + (y * z) → y * z。结果 true。',
            'close': '结束这个分支。',
            '-- d*o+ induction': '注释：归纳情形。',
            'ops x y z : -> PNat .': '新常量 x、y、z。',
            'eq (x + Y) * Z = (x * Z) + (Y * Z) .': 'IH：对 x 成立（Y、Z 仍是变量）。',
            'red (s(x) + y) * z = (s(x) * z) + (y * z) .': '左边 → s(x + y) * z → ((x + y) * z) + z → ((x * z) + (y * z)) + z（IH）；右边 → ((x * z) + z) + (y * z)。因为 + 有 assoc comm，两边是同一个和，结果 true。'
          }) +
          cb('w-l11-6', 'open PNAT2 .\n-- assoc* base\nops y z : -> PNat .\nred (0 * y) * z = 0 * (y * z) .\nclose\n\nopen PNAT2 .\n-- assoc* induction, with distributivity as lemma\nops x y z : -> PNat .\neq (X + Y) * Z = (X * Z) + (Y * Z) .   -- (d*o+)\neq (x * Y) * Z = x * (Y * Z) .           -- (IH)\nred (s(x) * y) * z = s(x) * (y * z) .\nclose', 'assoc*（借助分配律，讲义写法在 PNAT2 里）', {
            'open PNAT2 .': '打开 PNAT2。',
            '-- assoc* base': '注释：基础情形。',
            'ops y z : -> PNat .': '新常量 y、z。',
            'red (0 * y) * z = 0 * (y * z) .': '两边都用 (*1) 化成 0，结果 true。',
            'close': '结束这个分支。',
            '-- assoc* induction, with distributivity as lemma': '注释：归纳情形，要用分配律作为引理。',
            'ops x y z : -> PNat .': '新常量 x、y、z。',
            'eq (X + Y) * Z = (X * Z) + (Y * Z) .   -- (d*o+)': '把已经证明的引理 d*o+ 写进来。这里全是大写变量，因为引理对所有值成立。',
            'eq (x * Y) * Z = x * (Y * Z) .           -- (IH)': '归纳假设：对 x 成立。',
            'red (s(x) * y) * z = s(x) * (y * z) .': '左边 → ((x * y) + y) * z → ((x * y) * z) + (y * z)（d*o+）→ (x * (y * z)) + (y * z)（IH）；右边 → (x * (y * z)) + (y * z)。结果 true。'
          }) +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>引理的顺序很重要</div>' +
          '<p>必须先证 <code>d*o+</code>，才能用它证 <code>assoc*</code>。证明是有<b>依赖顺序</b>的：' +
          '后面的定理可以用前面的定理/引理，反之不行。</p></div>' +
          '<h3 class="sub">定理 4：乘法交换律 comm*　X * Y = Y * X</h3>' +
          '<p>和 comm+ 一模一样的套路，也会卡两次：</p>' +
          '<ul><li><b>base</b>：要证 <code>0 * y = y * 0</code>。左边 → 0，右边 <code>y * 0</code> 化不动 → 需要引理 <b>rz*</b>：<code>X * 0 = 0</code>。</li>' +
          '<li><b>ind</b>：假设 <code>x * Y = Y * x</code>，要证 <code>s(x) * y = y * s(x)</code>。左边 → (x * y) + y → (y * x) + y（IH）；右边 <code>y * s(x)</code> 化不动 → 需要引理 <b>rs*</b>：<code>X * s(Y) = (X * Y) + X</code>。</li></ul>' +
          '<p>rz* 和 rs* 本身都对 X 归纳证明（讲义第 30–34 页）。四段证明分数都在 PNAT2 里：</p>' +
          cb('w-l11-comm', 'open PNAT2 .\n-- Lemma 4 (rz*) base\nred 0 * 0 = 0 .\nclose\nopen PNAT2 .\n-- Lemma 4 (rz*) induction\nop x : -> PNat .\neq x * 0 = 0 .\nred s(x) * 0 = 0 .\nclose\nopen PNAT2 .\n-- Lemma 5 (rs*) base\nop y : -> PNat .\nred 0 * s(y) = (0 * y) + 0 .\nclose\nopen PNAT2 .\n-- Lemma 5 (rs*) induction\nops x y : -> PNat .\neq x * s(Y) = (x * Y) + x .\nred s(x) * s(y) = (s(x) * y) + s(x) .\nclose\nopen PNAT2 .\n-- Theorem 4 (comm*) base\nop y : -> PNat .\neq X * 0 = 0 .\nred 0 * y = y * 0 .\nclose\nopen PNAT2 .\n-- Theorem 4 (comm*) induction\nops x y : -> PNat .\neq X * s(Y) = (X * Y) + X .\neq x * Y = Y * x .\nred s(x) * y = y * s(x) .\nclose', 'rz*、rs*、comm* 的证明分数（讲义写法，6 个 red 都应是 true）', {
            'open PNAT2 .': '打开 PNAT2，每个分支单独一个 open。',
            '-- Lemma 4 (rz*) base': '注释：引理 rz*（X * 0 = 0）的基础情形。',
            'red 0 * 0 = 0 .': '0 * 0 用 (*1) 化成 0，结果 true。',
            'close': '结束这个分支。',
            '-- Lemma 4 (rz*) induction': '注释：rz* 的归纳情形。',
            'op x : -> PNat .': '新常量 x。',
            'eq x * 0 = 0 .': 'rz* 的 IH：对 x 成立。',
            'red s(x) * 0 = 0 .': 's(x) * 0 → (x * 0) + 0（*2）→ 0 + 0（IH）→ 0（+1）。结果 true。',
            '-- Lemma 5 (rs*) base': '注释：引理 rs*（X * s(Y) = (X * Y) + X）的基础情形。',
            'op y : -> PNat .': '新常量 y。',
            'red 0 * s(y) = (0 * y) + 0 .': '两边都化成 0，结果 true。',
            '-- Lemma 5 (rs*) induction': '注释：rs* 的归纳情形。',
            'ops x y : -> PNat .': '新常量 x、y。',
            'eq x * s(Y) = (x * Y) + x .': 'rs* 的 IH。',
            'red s(x) * s(y) = (s(x) * y) + s(x) .': '两边都化成 s(y + (x * y) + x) 这类和；+ 有 assoc comm，系统能看出它们相同。结果 true。',
            '-- Theorem 4 (comm*) base': '注释：comm* 的基础情形，要用引理 rz*。',
            'eq X * 0 = 0 .': '把已证的 rz* 写进来（大写变量）。',
            'red 0 * y = y * 0 .': '左边 → 0（*1）；右边 → 0（rz*）。结果 true。',
            '-- Theorem 4 (comm*) induction': '注释：comm* 的归纳情形，要用引理 rs*。',
            'eq X * s(Y) = (X * Y) + X .': '把已证的 rs* 写进来。',
            'eq x * Y = Y * x .': 'comm* 的 IH。',
            'red s(x) * y = y * s(x) .': '左边 → (x * y) + y → (y * x) + y（IH）；右边 → (y * x) + y（rs*）。结果 true。'
          })
      },
      {
        id: 'L11.s6', title: '定理 5：尾递归阶乘的正确性（压轴）',
        guide: {
          what: '证明两个阶乘实现 fact1（普通递归）和 fact2（尾递归、带累加器）对所有输入算出同样的结果。',
          why: '「快的版本和简单的版本结果一样」是程序优化最常见的正确性问题，也是考试最可能出的证明题形状。',
          how: '先证引理 p-sf2（在 PNAT3 里，需要再借用 d*o+），再用它完成 trf 的归纳情形。下面两段证明分数都能直接运行。',
          use: '编译器把普通递归自动改写成尾递归（尾调用优化）时，要保证的就是这件事。',
          pitfalls: ['引理写成太具体的 <code>s(X) * sfact2(X,s(0)) = …</code>，结果证不出来；要推广成 <code>Y * sfact2(X,Z) = sfact2(X,Y * Z)</code>', '忘了 p-sf2 的证明分数里还要加上 d*o+（讲义特别指出：这是手写证明里没用到、但证明分数里必须加的引理）']
        },
        html:'<p><b>要证：fact1(X) = fact2(X)</b>（两个实现算的是同一个函数）</p>' +
          '<p>基础情形：<code>fact1(0) → s(0)</code>；<code>fact2(0) → sfact2(0,s(0)) → s(0)</code>。✓</p>' +
          '<p>归纳情形：假设 <code>fact1(x) = fact2(x)</code>，要证 <code>fact1(s(x)) = fact2(s(x))</code>。</p>' +
          '<div class="codebox"><pre>左边 fact1(s(x)) → s(x) * fact1(x) → s(x) * fact2(x)\n                → s(x) * sfact2(x,s(0))        by (f1-2), IH, (f2)\n\n右边 fact2(s(x)) → sfact2(s(x),s(0))\n                → sfact2(x,s(x) * s(0))        by (f2), (sf2-2)</pre></div>' +
          '<p>还差一步：<code>s(x) * sfact2(x,s(0))</code> 要等于 <code>sfact2(x,s(x) * s(0))</code>。' +
          '这个等式太具体了，推广成：</p>' +
          '<p><b>Lemma 6 (p-sf2)　Y * sfact2(X,Z) = sfact2(X,Y * Z)</b></p>' +
          '<p>它的归纳证明（对 X）会用到 <code>assoc*</code> 和 <code>comm*</code>，所以要在 <b>PNAT3</b> 里做。讲义原文：<i>PNAT3 is PNAT2 in which _*_ is declared as <code>{assoc comm}</code>.</i></p>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>讲义特别提醒：证明分数里要多加一个引理</div>' +
          '<p>手写证明 p-sf2 时只用到 assoc* 和 comm*。但写成证明分数时，还必须把<b>分配律 d*o+</b> 作为 <code>eq</code> 加进去（讲义第 40 页：<i>we need to use the lemma that was not used in the manual proof</i>）。' +
          '原因是 <code>s(x) * z</code> 会被 (*2) 展开成 <code>(x * z) + z</code>，系统要靠分配律才能把两边整理成同一个形状。</p></div>' +
          cb('w-l11-7', 'open PNAT3 .\n-- p-sf2 base\nops y z : -> PNat .\nred y * sfact2(0,z) = sfact2(0,y * z) .\nclose\n\nopen PNAT3 .\n-- p-sf2 induction\nops x y z : -> PNat .\neq (X + Y) * Z = (X * Z) + (Y * Z) .   -- (d*o+)\neq Y * sfact2(x,Z) = sfact2(x,Y * Z) .   -- (IH)\nred y * sfact2(s(x),z) = sfact2(s(x),y * z) .\nclose', 'p-sf2 的两个分支（讲义写法）', {
            'open PNAT3 .': '打开 PNAT3：+ 和 * 都带 assoc comm 属性。',
            '-- p-sf2 base': '注释：引理 p-sf2 的基础情形，X 取 0。',
            'ops y z : -> PNat .': '新常量 y、z。',
            'red y * sfact2(0,z) = sfact2(0,y * z) .': '两边都用 (sf2-1) 化成 y * z，结果 true。',
            'close': '结束这个分支。',
            '-- p-sf2 induction': '注释：归纳情形。',
            'ops x y z : -> PNat .': '新常量 x、y、z。',
            'eq (X + Y) * Z = (X * Z) + (Y * Z) .   -- (d*o+)': '讲义要求加上的分配律引理（手写证明里没用到，但证明分数需要）。',
            'eq Y * sfact2(x,Z) = sfact2(x,Y * Z) .   -- (IH)': '归纳假设：对 x 成立；Y、Z 仍是变量。',
            'red y * sfact2(s(x),z) = sfact2(s(x),y * z) .': '两边都用 (sf2-2) 和 IH 化成 sfact2(x, …)，里面的乘积靠 assoc comm 和 d*o+ 整理成同一个形状。结果 true。'
          }) +
          cb('w-l11-8', 'open PNAT3 .\n-- trf base case\nred fact1(0) = fact2(0) .\nclose\nopen PNAT3 .\n-- trf induction case\nop x : -> PNat .\neq Y * sfact2(X,Z) = sfact2(X,Y * Z) .   -- (p-sf2)\neq fact1(x) = fact2(x) .                 -- (IH)\nred fact1(s(x)) = fact2(s(x)) .\nclose', '定理 5（trf）的完整证明分数（讲义写法，两个都应是 true）', {
            'open PNAT3 .': '打开 PNAT3。',
            '-- trf base case': '注释：基础情形。',
            'red fact1(0) = fact2(0) .': 'fact1(0) → s(0)；fact2(0) → sfact2(0,s(0)) → s(0)。结果 true。',
            'close': '结束这个分支。',
            '-- trf induction case': '注释：归纳情形。',
            'op x : -> PNat .': '新常量 x。',
            'eq Y * sfact2(X,Z) = sfact2(X,Y * Z) .   -- (p-sf2)': '把已证的引理 p-sf2 写进来（全是变量）。',
            'eq fact1(x) = fact2(x) .                 -- (IH)': '归纳假设：fact1 和 fact2 在 x 上相等。',
            'red fact1(s(x)) = fact2(s(x)) .': '左边 → s(x) * fact1(x) → s(x) * fact2(x)（IH）→ s(x) * sfact2(x,s(0)) → sfact2(x,s(x) * s(0))（p-sf2）；右边 → sfact2(s(x),s(0)) → sfact2(x,s(x) * s(0))。结果 true。'
          }) +
          '<div class="card exam"><div class="card-t"><span class="ico">🏆</span>这道题为什么是压轴</div>' +
          '<p>它同时用到了：结构归纳、IH 的正确写法、引理的构造与泛化、assoc/comm 属性、以及「两个不同实现的等价性」这个真实目标。' +
          '考试如果出一道 20 分的证明题，大概率就是这个形状（换了函数而已，比如求和、幂、或列表的 reverse）。</p>' +
          '<p><b>答题顺序建议：</b>先写定理 → 说明对谁归纳 → 写 base（含手算步骤）→ 写 ind（含 IH 声明和手算步骤）→ ' +
          '如果卡住就说「需要引理 L，其内容为…，证明略/附后」→ 给出证明分数代码。</p></div>' +
          cta('L11-quiz2', '随堂小测 · 证明技巧（4 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L11 必背</div>' +
          '<ul><li>结构归纳的 (A)(B) 等价表述（一字不差）</li>' +
          '<li>IH 的写法：<code>eq (x + Y) + Z = x + (Y + Z) .</code>（小写常量 + 大写变量）</li>' +
          '<li>六个引理：rz+ <code>X+0=X</code>、rs+ <code>X+s(Y)=s(X+Y)</code>、d*o+ <code>(X+Y)*Z=(X*Z)+(Y*Z)</code>、rz* <code>X*0=0</code>、rs* <code>X*s(Y)=(X*Y)+X</code>、p-sf2 <code>Y*sfact2(X,Z)=sfact2(X,Y*Z)</code></li>' +
          '<li>模块：加法的定理在 PNAT1；d*o+、assoc*、rz*、rs*、comm* 在 PNAT2；p-sf2、trf 在 PNAT3</li>' +
          '<li>证明分数的五步：open / ops / eq IH / red / close</li></ul></div>'
      }
    ],
    quiz: 'L11-quiz', flash: 'L11-flash'
  });

  QZ['L11-quiz1'] = {
    title: '随堂小测 · 归纳法',
    items: [
      { q: '热身：用归纳法证明「对所有自然数成立」，需要证几个情形？', opts: ['1 个', '2 个：基础情形和归纳情形', '无穷多个', '3 个'], a: 1, why: '就像多米诺骨牌：第一块倒（base），每块都能推倒下一块（induction）。',
        optWhy: ['只证一个情形不够：只有 base 不知道后面的数，只有 induction 第一块骨牌不会倒', '正确', '归纳法的意义就是不用一个个检查', '自然数只有 0 和 s(…) 两种形状，所以只需要两个情形'] },
      { q: '结构归纳法的 induction case 是什么？', opts: ['证 l(0)=r(0)', '假设 l(x)=r(x)，证 l(s(x))=r(s(x))', '证 l(X)=r(X)', '证 X 存在'], a: 1, why: '基础情形 + 归纳情形（含 IH）= 全称命题。',
        optWhy: ['这是基础情形（base case）', '正确：先假设对 x 成立，再证对下一个数 s(x) 也成立', '这是最终要证的结论，不能直接拿来用', '和归纳法无关'] },
      { q: '证明分数里 IH 的正确写法是？', opts: ['<code>eq (x + y) + z = x + (y + z) .</code>', '<code>eq (x + Y) + Z = x + (Y + Z) .</code>', '<code>eq (X + Y) + Z = X + (Y + Z) .</code>', '<code>eq x = y .</code>'], a: 1, why: '新常量 x 配原变量 Y Z，才能对任意 Y Z 使用。',
        optWhy: ['y、z 也写成了常量，IH 只对那一组具体的 y、z 成立，证明中用到其他值时就用不上', '正确：只把归纳的变量换成新常量 x，其他保持大写变量', '全是变量就等于直接假设了要证的结论，这是循环论证', '这不是归纳假设，而且会让 x 和 y 被当成相等'] },
      { q: '证明分数最后用什么检查？', opts: ['<code>show</code>', '<code>red 目标等式 .</code>，结果为 true 即证完', '<code>close</code>', '<code>eq</code>'], a: 1, why: 'red 归约到 true。',
        optWhy: ['show 只显示信息，不做计算', '正确', 'close 只是结束 open，不检查任何东西', 'eq 是添加等式（如 IH），不是检查'] }
    ]
  };
  QZ['L11-quiz2'] = {
    title: '随堂小测 · 证明技巧',
    items: [
      { q: '证 comm+ 的基础情形时卡在 <code>y + 0</code>，该怎么办？', opts: ['换一个变量', '猜引理 <code>X + 0 = X</code> 并单独证明', '放弃', '改成归纳 Y'], a: 1, why: 'rz+ 就是为此而生的引理。',
        optWhy: ['换名字不改变 y 是常量这个事实，还是化不动', '正确：把化不动的那一项推广成引理，单独证明后再用', '卡住是正常的，补上引理就能继续', '对 Y 归纳也会在别处卡住，讲义的做法是补引理'] },
      { q: '证 comm+ 的归纳情形卡在 <code>y + s(x)</code>，需要哪个引理？', opts: ['rz+', 'rs+ <code>X + s(Y) = s(X + Y)</code>', 'assoc+', 'd*o+'], a: 1, why: '让「右后继」能化开。',
        optWhy: ['rz+ 处理的是右边是 0 的情况，这里右边是 s(x)', '正确：右边是 s(…) 时把 s 提到外面', '结合律处理括号，和这里无关', '分配律是乘法的，这里只有加法'] },
      { q: '引理为什么要写得比实际需要「更一般」？', opts: ['为了好看', '因为太具体的等式无法单独用归纳法证明', '为了减少代码', '因为 CafeOBJ 要求'], a: 1, why: '例如把 y+0=y 泛化成 X+0=X。',
        optWhy: ['和美观无关', '正确：y 是常量，没法对它做归纳；换成变量 X 才能对 X 归纳', '代码量差不多', 'CafeOBJ 没有这个要求，这是证明方法上的需要'] },
      { q: 'p-sf2 的证明为什么要在 PNAT3 而不是 PNAT1 里做？', opts: ['PNAT1 没有 sfact2', '因为要用到 + 和 * 的 assoc/comm 属性', '因为更快', 'PNAT3 才有 bool'], a: 1, why: 'PNAT2 给 + 加了 assoc comm，PNAT3 再给 * 加了 assoc comm。',
        optWhy: ['PNAT1 里就有 sfact2', '正确：手写证明用到 assoc* 和 comm*，PNAT3 把它们写成了属性', '和速度无关', '三个模块都有 Bool'] },
      { q: '讲义指出，p-sf2 的证明分数里还要额外加哪个引理？', opts: ['rz+', 'd*o+（分配律）', 'p-sf2 本身', '不用加'], a: 1, why: '讲义第 40 页：手写证明没用到，但证明分数需要分配律，因为 s(x) * z 会被展开成 (x * z) + z。',
        optWhy: ['rz+ 用不上', '正确', '把要证的结论当作已知就是循环论证', '不加 d*o+，red 会停在两个形状不同的和上'] }
    ]
  };
  QZ['L11-quiz'] = {
    title: 'L11 综合测验',
    items: [
      { q: '热身：证明分数里 <code>op x : -&gt; PNat .</code> 声明的 x 叫什么？', opts: ['变量', '新常量（fresh constant）', '构造子', '引理'], a: 1, why: '系统对它一无所知，所以它代表任意的数。',
        optWhy: ['变量要用 var / vars 声明，而且大写', '正确', '构造子要标 {constr}，比如 0 和 s', '引理是一条等式，不是常量'] },
      { q: 'assoc+ 的归纳情形最后两边化成什么？', opts: ['<code>s(x + (y + z))</code>', '<code>s(s(x))</code>', '<code>0</code>', '<code>x + y</code>'], a: 0, why: '左 → s((x+y)+z) → s(x+(y+z))；右 → s(x+(y+z))。',
        optWhy: ['正确', 'y、z 不会消失', '只有基础情形里才会出现 0 相关的化简', 'z 不会消失'] },
      { q: 'comm+ 需要几个引理？', opts: ['0 个', '1 个', '2 个（rz+ 和 rs+）', '3 个'], a: 2, why: '基础情形要 rz+，归纳情形要 rs+。',
        optWhy: ['不加引理，y + 0 和 y + s(x) 都化不动', 'base 和 induction 各卡一次，需要两个', '正确', '只需要 rz+ 和 rs+'] },
      { q: 'assoc* 需要哪个引理？', opts: ['rz+', 'rs+', 'd*o+（分配律）', 'p-sf2'], a: 2, why: '需要 (X+Y)*Z = (X*Z)+(Y*Z)。',
        optWhy: ['rz+ 是加法的右零元，用不上', 'rs+ 是加法的右后继，用不上', '正确：((x*y)+y)*z 要靠分配律展开', 'p-sf2 是阶乘的引理'] },
      { q: 'comm*（乘法交换律）需要哪两个引理？', opts: ['rz+ 和 rs+', 'rz* <code>X*0=0</code> 和 rs* <code>X*s(Y)=(X*Y)+X</code>', 'd*o+ 和 p-sf2', '不需要'], a: 1, why: '和 comm+ 同一个套路：base 卡在 y * 0，induction 卡在 y * s(x)。',
        optWhy: ['这是加法交换律用的', '正确', '它们用于 assoc* 和阶乘', 'y * 0 和 y * s(x) 都化不动，必须补引理'] },
      { q: '尾递归阶乘正确性的辅助引理是？', opts: ['rz*', 'p-sf2 <code>Y * sfact2(X,Z) = sfact2(X,Y*Z)</code>', 'assoc+', '没有'], a: 1, why: '把 s(x)*sfact2(x,s(0)) 化成 sfact2(x, s(x)*s(0))。',
        optWhy: ['rz* 用不上', '正确', 'assoc+ 用不上', '不加引理两边停在不同形状上'] }
    ]
  };
  QZ['L11-flash'] = {
    title: 'L11 闪卡',
    cards: [
      { q: '结构归纳法两个分支？', a: 'base: l(0) = r(0)；ind: 若 l(x)=r(x) 则 l(s(x))=r(s(x))，x 为新常量。' },
      { q: '证明分数的五步？', a: 'open 模块 / ops 新常量 / eq IH / red 目标 / close' },
      { q: '六个引理？', a: 'rz+ X+0=X；rs+ X+s(Y)=s(X+Y)；d*o+ (X+Y)*Z=(X*Z)+(Y*Z)；rz* X*0=0；rs* X*s(Y)=(X*Y)+X；p-sf2 Y*sfact2(X,Z)=sfact2(X,Y*Z)' },
      { q: 'PNAT1 / PNAT2 / PNAT3 的区别？', a: 'PNAT2 = PNAT1 + 给 _+_ 加 {assoc comm}；PNAT3 = PNAT2 + 给 _*_ 加 {assoc comm}。前面证完了这些性质，后面才能当属性用。' },
      { q: 'IH 写法？', a: '<code>eq (x + Y) + Z = x + (Y + Z) .</code> —— 小写是新常量，大写仍是全称变量。' }
    ]
  };

  /* =====================================================================
   * L12 验证：列表
   * ===================================================================== */
  CH.push({
    id: 'L12', num: 'L12', group: '第 4 部分 · 验证（高分值）', short: 'L12 验证·列表',
    title: '12. 程序验证：列表',
    sub: '同样的归纳法，对象换成列表。@ 的结合律 + 尾递归 reverse 的正确性。',
    minutes: 60,
    goals: [
      '对列表做归纳时，「base」和「induction」分别是什么形状',
      '会写 assoc@ 的证明分数',
      '会用 p-sr2 引理完成 ctrr 的证明',
      '能对比自然数与列表的证明结构'
    ],
    pre: [
      'L11：结构归纳、新常量、IH 的写法（新常量 + 原变量）、怎样从卡住的 red 结果找引理',
      'L2：列表 <code>E | L</code>、<code>nil</code>、连接 <code>@</code> 的递归定义',
      'L3：<code>assoc</code> 属性会自动抹平括号'
    ],
    summary: [
      '列表归纳：base 证 nil；induction 证 e | l1，需要两个新常量（头 e 和尾 l1）',
      'assoc@ 在 LIST1 里要证；LIST2 给 @ 加了 {assoc}，就不用再证',
      'rev1（直观但慢）和 rev2（尾递归、带累加器）相等，要先证引理 p-sr2：sr2(L1,E2 | L2) = sr2(L1,nil) @ (E2 | L2)',
      '依赖顺序：assoc@ → p-sr2 → ctrr（rev1 = rev2）'
    ],
    sections: [
      {
        id: 'L12.s1', title: 'LIST1 与 LIST2',
        guide: {
          what: '本章验证的对象：列表模块 LIST1（有连接 @、两个反转函数 rev1 和 rev2），以及给 @ 加上 assoc 的 LIST2。',
          why: '列表是程序里最常用的数据结构。证明「两个反转算法结果相同」是很典型的程序验证题。',
          how: '读源码时重点看 rev1 和 rev2 的写法差别，再运行下面的代码确认它们算出同样的结果。',
          use: 'Haskell、OCaml 等语言的标准库里，reverse 就是用 rev2 这种累加器写法实现的，因为它更快。',
          pitfalls: ['Elt 是抽象类型，没有具体的值，所以试算时要先声明常量 a b c d', '<code>_|_</code> 的 prec 是 40，<code>a | b | nil</code> 读作 <code>a | (b | nil)</code>']
        },
        html: cbStatic('mod! LIST1 {\n  pr(BOOL)\n  [Elt]\n  [List]\n  op nil : -> List {constr}\n  op _|_ : Elt List -> List {constr prec: 40}\n  vars E E2 : Elt\n  vars L1 L2 : List\n  eq (nil = E | L1) = false .\n  eq (E | L1 = E2 | L2) = (E = E2) and (L1 = L2) .\n  op _@_ : List List -> List {prec: 40}\n  eq nil @ L2 = L2 .                        -- (@1)\n  eq (E | L1) @ L2 = E | (L1 @ L2) .         -- (@2)\n  op rev1 : List -> List\n  eq rev1(nil) = nil .\n  eq rev1(E | L1) = rev1(L1) @ (E | nil) .\n  op rev2 : List -> List\n  op sr2 : List List -> List\n  eq rev2(L1) = sr2(L1,nil) .\n  eq sr2(nil,L2) = L2 .                      -- (sr2-1)\n  eq sr2(E | L1,L2) = sr2(L1,E | L2) .       -- (sr2-2)\n}\n\nmod! LIST2 {\n  pr(LIST1)\n  op _@_ : List List -> List {assoc prec: 40}\n}', 'LIST1 / LIST2 源码', {
            'mod! LIST1 {': '定义模块 LIST1。',
            'pr(BOOL)': '导入布尔值，因为等式判断 _=_ 的结果是 Bool。',
            '[Elt]': '列表元素的类型。它是抽象的：不规定元素具体是什么。',
            '[List]': '列表类型。',
            'op nil : -> List {constr}': '空列表，是构造子。',
            'op _|_ : Elt List -> List {constr prec: 40}': '把一个元素 E 接到列表 L 前面，写作 <code>E | L</code>，也是构造子。',
            'vars E E2 : Elt': '元素变量。',
            'vars L1 L2 : List': '列表变量。',
            'eq (nil = E | L1) = false .': '空列表不等于非空列表。',
            'eq (E | L1 = E2 | L2) = (E = E2) and (L1 = L2) .': '两个非空列表相等，当且仅当头相等且尾相等。',
            'op _@_ : List List -> List {prec: 40}': '连接两个列表，写作 <code>L1 @ L2</code>。LIST1 里没有 assoc。',
            'eq nil @ L2 = L2 .                        -- (@1)': '(@1)：空列表接上 L2 还是 L2。',
            'eq (E | L1) @ L2 = E | (L1 @ L2) .         -- (@2)': '(@2)：先把头 E 拿出来，再把尾 L1 和 L2 连接。',
            'op rev1 : List -> List': '第一种反转。',
            'eq rev1(nil) = nil .': '空列表反转还是空。',
            'eq rev1(E | L1) = rev1(L1) @ (E | nil) .': '反转 = 先反转尾巴，再把头接到最后。每次都要用 @ 遍历，所以慢。',
            'op rev2 : List -> List': '第二种反转。',
            'op sr2 : List List -> List': '辅助函数 sr2(要反转的列表, 累加器)。',
            'eq rev2(L1) = sr2(L1,nil) .': 'rev2 从空累加器开始。',
            'eq sr2(nil,L2) = L2 .                      -- (sr2-1)': '(sr2-1)：没有元素了，累加器就是结果。',
            'eq sr2(E | L1,L2) = sr2(L1,E | L2) .       -- (sr2-2)': '(sr2-2)：把头 E 塞进累加器前面，继续处理尾巴。这是尾递归，很快。',
            '}': '模块结束。',
            'mod! LIST2 {': '定义模块 LIST2。',
            'pr(LIST1)': '导入 LIST1 的全部内容。',
            'op _@_ : List List -> List {assoc prec: 40}': '给 @ 加上 assoc 属性（结合律）。因为 assoc@ 已经在 LIST1 里证明过，可以放心这样做。'
          }) +
          '<p>两个 reverse 实现：</p>' +
          '<ul><li><code>rev1</code>：递归地把头搬到「已经反转的尾巴」的后面。直观，但每次 <code>@</code> 都要遍历，慢。</li>' +
          '<li><code>rev2</code>：用累加器 <code>sr2(L, acc)</code>，把元素依次塞到 acc 前面。快（尾递归）。</li></ul>' +
          '<p>问题：<b>它们相等吗？</b>这就是 Theorem 2 (ctrr)。</p>' +
          cb('w-l12-1', 'open LIST2 .\nops a b c d : -> Elt .\nred rev1(a | b | c | nil) .\nred rev2(a | b | c | nil) .\nred (a | b | nil) @ (c | d | nil) .\nred sr2(a | b | nil, c | nil) .\nclose', '先跑一跑（Elt 是抽象排序，所以用常量 a b c d）', {
            'open LIST2 .': '打开 LIST2。',
            'ops a b c d : -> Elt .': '声明 4 个元素常量，用来拼列表。',
            'red rev1(a | b | c | nil) .': '用 rev1 反转 [a, b, c]，结果是 c | b | a | nil。',
            'red rev2(a | b | c | nil) .': '用 rev2 反转，结果一样，但步数更少。',
            'red (a | b | nil) @ (c | d | nil) .': '连接两个列表。',
            'red sr2(a | b | nil, c | nil) .': '看累加器怎么工作：a、b 依次被塞到 c 前面，结果是 b | a | c | nil。',
            'close': '退出试算。'
          }) +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>LIST1 里没有 assoc</div>' +
          '<p><code>LIST1</code> 的 <code>@</code> 没有 assoc 属性，所以 <code>(L1 @ L2) @ L3</code> 和 <code>L1 @ (L2 @ L3)</code> 是<b>不同的项</b>，' +
          '需要证明它们相等。<code>LIST2</code> 里加了 <code>{assoc}</code>，这时它们自动相同 —— 证明就变成了一行。</p>' +
          '<p><b>考点</b>：为什么有时要证结合律、有时不用？<b>答：取决于模块里有没有声明 assoc 属性。</b></p></div>'
      },
      {
        id: 'L12.s2', title: '列表上的结构归纳',
        guide: {
          what: '把归纳法用在列表上：base 证空列表 nil，induction 证「对 l1 成立 → 对 e | l1 也成立」。',
          why: '列表也是用构造子一层层搭起来的，和自然数一样可以归纳。',
          how: '对照下面的手算，看 assoc@ 的两个分支怎么化成同一个式子，再运行证明分数。',
          use: '函数式语言的列表函数（map、filter、append）的性质，都是这样证明的。',
          pitfalls: ['归纳情形只声明了一个新常量；列表的构造子 _|_ 有两个参数，需要 e 和 l1 两个', '在 LIST2 里证 assoc@：那里 @ 已经有 assoc 属性，等于什么都没证']
        },
        html:'<p>列表的构造子是 <code>nil</code> 和 <code>_|_</code>，所以归纳法变成：</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">📐</span>对列表 L1 的结构归纳</div>' +
          '<p>要证 (∀L1:List) P(L1)，只需证：</p>' +
          '<p>I. <b>base</b>：<code>P(nil)</code></p>' +
          '<p>II. <b>induction</b>：若 <code>P(l1)</code>，则 <code>P(e | l1)</code>，其中 <code>e</code> 是 Elt 的新常量、<code>l1</code> 是 List 的新常量</p>' +
          '<p>注意：<b>两个新常量</b>（头和尾），因为构造子 <code>_|_</code> 有两个参数。</p></div>' +
          '<h3 class="sub">定理 1：assoc@　(L1 @ L2) @ L3 = L1 @ (L2 @ L3)</h3>' +
          '<p>对 L1 归纳。</p>' +
          '<p><b>base</b>：(nil @ l2) @ l3 = nil @ (l2 @ l3)<br>' +
          '左 <code>→ l2 @ l3</code>（@1）；右 <code>→ l2 @ l3</code>（@1）✓</p>' +
          '<p><b>ind</b>：假设 <code>(l1 @ L2) @ L3 = l1 @ (L2 @ L3)</code>，证 <code>((e | l1) @ l2) @ l3 = (e | l1) @ (l2 @ l3)</code><br>' +
          '左 <code>→ (e | (l1 @ l2)) @ l3 → e | ((l1 @ l2) @ l3) → e | (l1 @ (l2 @ l3))</code><br>' +
          '右 <code>→ e | (l1 @ (l2 @ l3))</code> ✓</p>' +
          cb('w-l12-2', 'open LIST1 .\n-- assoc@ base\nops l2 l3 : -> List .\nred (nil @ l2) @ l3 = nil @ (l2 @ l3) .\nclose\n\nopen LIST1 .\n-- assoc@ induction\nops e : -> Elt .\nops l1 l2 l3 : -> List .\neq (l1 @ L2) @ L3 = l1 @ (L2 @ L3) .   -- (IH)\nred ((e | l1) @ l2) @ l3 = (e | l1) @ (l2 @ l3) .\nclose', 'assoc@ 的证明分数', {
            'open LIST1 .': '在 LIST1 里证明（这里 @ 没有 assoc，所以要证）。',
            '-- assoc@ base': '注释：基础情形，L1 取 nil。',
            'ops l2 l3 : -> List .': '新常量 l2、l3。',
            'red (nil @ l2) @ l3 = nil @ (l2 @ l3) .': '两边都用 (@1) 化成 l2 @ l3，结果 true。',
            'close': '结束这个分支。',
            '-- assoc@ induction': '注释：归纳情形。',
            'ops e : -> Elt .': '新常量 e：列表的头。',
            'ops l1 l2 l3 : -> List .': '新常量 l1（列表的尾）、l2、l3。',
            'eq (l1 @ L2) @ L3 = l1 @ (L2 @ L3) .   -- (IH)': '归纳假设：对 l1 成立；L2、L3 仍是变量。',
            'red ((e | l1) @ l2) @ l3 = (e | l1) @ (l2 @ l3) .': '两边都化成 e | (l1 @ (l2 @ l3))，结果 true。'
          }) +
          '<p>顺便验证：在 LIST2 里同一件事只要一行 <code>red (l1 @ l2) @ l3 = l1 @ (l2 @ l3) .</code> 就得到 true，因为 assoc 属性直接处理了。</p>'
      },
      {
        id: 'L12.s3', title: '定理 2：尾递归 reverse 的正确性',
        guide: {
          what: '证明 rev1(L) = rev2(L)：慢的反转和快的反转对所有列表结果相同。',
          why: '和 L11 的阶乘是同一类题：优化后的版本是否还正确。',
          how: '直接归纳会卡住，先证引理 p-sr2（要用到 assoc@，所以在 LIST2 里证），再证 ctrr。',
          use: '把「慢但明显正确」的版本当规格，证明「快的」版本和它一致，这是验证优化代码的标准做法。',
          pitfalls: ['p-sr2 写成只针对 e | nil 的特例，结果单独证不出来', '在 LIST1 里证 p-sr2：那里 @ 没有 assoc，右边的括号整理不过来']
        },
        html:'<p><b>要证：rev1(L1) = rev2(L1)</b></p>' +
          '<p><b>base</b>：<code>rev1(nil) = nil</code>；<code>rev2(nil) → sr2(nil,nil) → nil</code> ✓ 这一步很干净。</p>' +
          '<p><b>ind</b>：假设 <code>rev1(l1) = rev2(l1)</code>，证 <code>rev1(e | l1) = rev2(e | l1)</code>。</p>' +
          '<div class="codebox"><pre>左边 rev1(e | l1) → rev1(l1) @ (e | nil)\n                   → rev2(l1) @ (e | nil)          by IH\n右边 rev2(e | l1) → sr2(e | l1,nil)\n                   → sr2(l1,e | nil)               by (sr2-2)</pre></div>' +
          '<p>于是需要 <code>rev2(l1) @ (e | nil) = sr2(l1,e | nil)</code>，而 <code>rev2(l1) = sr2(l1,nil)</code>，所以本质上是：</p>' +
          '<p><b>Lemma 1 (p-sr2)　sr2(L1,E2 | L2) = sr2(L1,nil) @ (E2 | L2)</b></p>' +
          '<p>这个引理说的是「往累加器里塞一个元素」等价于「算完再在后面接上它」。它对 L1 归纳：</p>' +
          '<p><b>base</b>：<code>sr2(nil,e2|l2) → e2|l2</code>；<code>sr2(nil,nil) @ (e2|l2) → nil @ (e2|l2) → e2|l2</code> ✓</p>' +
          '<p><b>ind</b>：假设 <code>sr2(l1,E2|L2) = sr2(l1,nil) @ (E2|L2)</code>，证 <code>sr2(e|l1,e2|l2) = sr2(e|l1,nil) @ (e2|l2)</code>：</p>' +
          '<div class="codebox"><pre>左 sr2(e|l1,e2|l2) → sr2(l1, e|e2|l2)                  by (sr2-2)\n                    → sr2(l1,nil) @ (e|e2|l2)         by IH\n右 sr2(e|l1,nil) @ (e2|l2)\n   → sr2(l1,e|nil) @ (e2|l2)                          by (sr2-2)\n   → (sr2(l1,nil) @ (e|nil)) @ (e2|l2)                by IH\n   → sr2(l1,nil) @ ((e|nil) @ (e2|l2))                by assoc@\n   → sr2(l1,nil) @ (e|(nil @ (e2|l2)))                by (@2)\n   → sr2(l1,nil) @ (e|e2|l2)                          by (@1)</pre></div>' +
          '<p>两边一样 ✓。注意这里<b>用了 assoc@</b>（定理 1），所以顺序是：先证 assoc@，再证 p-sr2，最后证 ctrr。</p>' +
          cb('w-l12-3', 'open LIST2 .\n-- p-sr2 base\nop l2 : -> List .\nop e2 : -> Elt .\nred sr2(nil,e2 | l2) = sr2(nil,nil) @ (e2 | l2) .\nclose\n\nopen LIST2 .\n-- p-sr2 induction\nops e e2 : -> Elt .\nops l1 l2 : -> List .\neq sr2(l1,E2 | L2) = sr2(l1,nil) @ (E2 | L2) .   -- (IH)\nred sr2(e | l1,e2 | l2) = sr2(e | l1,nil) @ (e2 | l2) .\nclose', 'p-sr2 的证明分数', {
            'open LIST2 .': '在 LIST2 里证明：要用到已证的 assoc@，所以选 @ 带 assoc 的模块。',
            '-- p-sr2 base': '注释：引理 p-sr2 的基础情形，L1 取 nil。',
            'op l2 : -> List .': '新常量 l2。',
            'op e2 : -> Elt .': '新常量 e2。',
            'red sr2(nil,e2 | l2) = sr2(nil,nil) @ (e2 | l2) .': '左边 → e2 | l2（sr2-1）；右边 → nil @ (e2 | l2) → e2 | l2。结果 true。',
            'close': '结束这个分支。',
            '-- p-sr2 induction': '注释：归纳情形。',
            'ops e e2 : -> Elt .': '新常量 e、e2。',
            'ops l1 l2 : -> List .': '新常量 l1、l2。',
            'eq sr2(l1,E2 | L2) = sr2(l1,nil) @ (E2 | L2) .   -- (IH)': '归纳假设：对 l1 成立；E2、L2 仍是变量。',
            'red sr2(e | l1,e2 | l2) = sr2(e | l1,nil) @ (e2 | l2) .': '两边都化成 sr2(l1,nil) @ (e | e2 | l2)。右边要靠 assoc 把括号重新组合，结果 true。'
          }) +
          cb('w-l12-4', 'open LIST2 .\n-- ctrr base\nred rev1(nil) = rev2(nil) .\nclose\n\nopen LIST2 .\n-- ctrr induction\nops e : -> Elt .\nop l1 : -> List .\neq sr2(L1,E2 | L2) = sr2(L1,nil) @ (E2 | L2) .  -- (p-sr2)\neq rev1(l1) = rev2(l1) .                       -- (IH)\nred rev1(e | l1) = rev2(e | l1) .\nclose', 'ctrr 的证明分数', {
            'open LIST2 .': '打开 LIST2。',
            '-- ctrr base': '注释：基础情形。',
            'red rev1(nil) = rev2(nil) .': '两边都化成 nil，结果 true。',
            'close': '结束这个分支。',
            '-- ctrr induction': '注释：归纳情形。',
            'ops e : -> Elt .': '新常量 e。',
            'op l1 : -> List .': '新常量 l1。',
            'eq sr2(L1,E2 | L2) = sr2(L1,nil) @ (E2 | L2) .  -- (p-sr2)': '把已证的引理 p-sr2 写进来（全是变量）。',
            'eq rev1(l1) = rev2(l1) .                       -- (IH)': '归纳假设：rev1 和 rev2 在 l1 上相等。',
            'red rev1(e | l1) = rev2(e | l1) .': '左边 → rev1(l1) @ (e | nil) → sr2(l1,nil) @ (e | nil)；右边 → sr2(l1, e | nil) → sr2(l1,nil) @ (e | nil)（p-sr2）。结果 true。'
          }) +
          '<div class="card tip"><div class="card-t"><span class="ico">🧠</span>三个定理的依赖顺序</div>' +
          '<p><code>assoc@</code> → <code>p-sr2</code> → <code>ctrr</code>。考试里如果只让你证 ctrr，' +
          '你可以说「设 assoc@ 与 p-sr2 已证，现证 ctrr」，然后直接用它们 —— 这是允许的。</p></div>'
      },
      {
        id: 'L12.s4', title: '自然数 vs 列表：证明结构对照',
        guide: {
          what: '把自然数归纳和列表归纳放在一张表里对比：骨架完全一样，只是构造子不同。',
          why: '看懂这个对应关系，遇到新的数据结构（比如树）也知道怎么归纳。',
          how: '背下面的「通用答题骨架」，考试写证明题时照着填。',
          pitfalls: ['考试时只写 red 代码不写手算步骤：过程分占大头，两样都要写']
        },
        html:'<table><tr><th></th><th>自然数 PNat</th><th>列表 List</th></tr>' +
          '<tr><td>构造子</td><td><code>0</code>, <code>s</code></td><td><code>nil</code>, <code>_|_</code></td></tr>' +
          '<tr><td>base</td><td>代入 <code>0</code></td><td>代入 <code>nil</code></td></tr>' +
          '<tr><td>ind 新常量</td><td><code>x : PNat</code>（1 个）</td><td><code>e : Elt</code>、<code>l1 : List</code>（2 个）</td></tr>' +
          '<tr><td>IH</td><td><code>l(x) = r(x)</code></td><td><code>l(l1) = r(l1)</code></td></tr>' +
          '<tr><td>要证</td><td><code>l(s(x)) = r(s(x))</code></td><td><code>l(e|l1) = r(e|l1)</code></td></tr>' +
          '<tr><td>常用引理</td><td>rz+, rs+, d*o+, p-sf2</td><td>assoc@, p-sr2</td></tr></table>' +
          '<p><b>一模一样，只是构造子换了。</b>理解了自然数，列表就是换个名字；理解了列表，树（二叉树、表达式树）也是一样：' +
          '<code>leaf</code> + <code>node(l, x, r)</code>，两个新常量。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>通用答题骨架（任何归纳证明都能套）</div>' +
          '<div class="codebox"><pre>Theorem. 要证的等式\nProof. By structural induction on X.\n\nI. Base case\n   What to show is  l(0) = r(0).\n   l(0) →* ... → t      by (...)\n   r(0) →* ... → t      by (...)\n\nII. Induction case\n   What to show is  l(s(x)) = r(s(x))\n   assuming the induction hypothesis  l(x) = r(x)  -- (IH)\n   l(s(x)) →* ... → u    by (...)\n   r(s(x)) →* ... → u    by (...)\nEnd of Proof.</pre></div></div>' +
          cta('L12-quiz1', '随堂小测 · 列表验证（3 题）')
      }
    ],
    quiz: 'L12-quiz', flash: 'L12-flash'
  });

  QZ['L12-quiz1'] = {
    title: '随堂小测 · 列表验证',
    items: [
      { q: '热身：对列表做归纳，基础情形是什么？', opts: ['L1 取 0', 'L1 取 nil（空列表）', 'L1 取 e | nil', '不需要基础情形'], a: 1, why: '列表最小的形状就是空列表 nil。',
        optWhy: ['0 是自然数的基础情形', '正确', '这是只有一个元素的列表，不是最小的', '没有基础情形，归纳就不成立'] },
      { q: '对列表做归纳，归纳情形需要引入几个新常量？', opts: ['1 个', '2 个（头和尾）', '3 个', '0 个'], a: 1, why: '构造子 <code>_|_</code> 有两个参数：<code>e</code> 和 <code>l1</code>。',
        optWhy: ['自然数的 s 只有一个参数，所以一个；列表的 _|_ 有两个', '正确', '第三个参数不存在', '没有新常量就没法写 IH'] },
      { q: 'LIST2 里不用证 assoc@ 的原因是？', opts: ['因为已经证明过', '@ 有 assoc 属性，匹配时自动视为同一个项', '因为 @ 是构造子', '因为列表有限'], a: 1, why: '属性让匹配器处理结合律，不会产生重写循环。',
        optWhy: ['证明过是加属性的前提，但「不用再证」的直接原因是属性让系统自动处理括号', '正确', '@ 不是构造子（没有 {constr}）', '列表长短和结合律无关'] },
      { q: 'p-sr2 说的是？', opts: ['<code>sr2(L1,E2|L2) = sr2(L1,nil) @ (E2|L2)</code>', '<code>rev1 = rev2</code>', '<code>(L1@L2)@L3 = L1@(L2@L3)</code>', '<code>sr2(nil,L) = L</code>'], a: 0, why: '「往累加器塞元素」= 「算完后接上」。',
        optWhy: ['正确', '这是定理 ctrr，不是引理', '这是 assoc@', '这是等式 (sr2-1)，是定义而不是引理'] }
    ]
  };
  QZ['L12-quiz'] = {
    title: 'L12 综合测验',
    items: [
      { q: '热身：rev1(a | b | nil) 的结果是？', opts: ['a | b | nil', 'b | a | nil', 'nil', 'a | nil'], a: 1, why: '反转就是把顺序倒过来。',
        optWhy: ['这是原列表，没有反转', '正确', '反转不会丢掉元素', '少了一个元素'] },
      { q: '三个定理的正确证明顺序？', opts: ['ctrr → p-sr2 → assoc@', 'assoc@ → p-sr2 → ctrr', 'p-sr2 → ctrr → assoc@', '任意顺序'], a: 1, why: '后面的用前面的。',
        optWhy: ['ctrr 要用 p-sr2，p-sr2 又要用 assoc@，所以不能先证 ctrr', '正确', 'p-sr2 要用 assoc@，必须先证 assoc@', '有依赖关系，顺序不能随便'] },
      { q: 'rev2 比 rev1 好的地方是？', opts: ['更短', '尾递归，用累加器，效率更高', '不需要 @ ', '不需要归纳'], a: 1, why: 'sr2 是尾递归。',
        optWhy: ['代码长度差不多', '正确：rev1 每一步都要用 @ 遍历，rev2 只走一遍', 'rev2 确实不用 @，但这不是它「好」的本质原因，本质是效率', '它们的性质都要用归纳证明'] },
      { q: 'assoc@ 的基础情形两边都化成？', opts: ['<code>nil</code>', '<code>l2 @ l3</code>', '<code>e | l1</code>', '<code>l1</code>'], a: 1, why: 'nil @ x = x 用两次。',
        optWhy: ['l2、l3 不会消失', '正确', 'base 里没有 e 和 l1', 'base 里 L1 已经被换成 nil 了'] },
      { q: '列表归纳与自然数归纳的共同点是？', opts: ['都要用 IH', '都要两个引理', '都只对 nil 成立', '都用到乘法'], a: 0, why: 'base + ind + IH 是通用骨架。',
        optWhy: ['正确', '引理个数看具体定理，assoc@ 一个都不需要', 'nil 只是列表的基础情形', '列表的证明不涉及乘法'] }
    ]
  };
  QZ['L12-flash'] = {
    title: 'L12 闪卡',
    cards: [
      { q: '列表归纳的两个分支？', a: 'base: P(nil)；ind: 若 P(l1) 则 P(e|l1)，e:Elt、l1:List 为新常量。' },
      { q: 'assoc@ 的证明要点？', a: 'base 两边都 → l2@l3；ind 用 (@2) 两次再用 IH。' },
      { q: 'p-sr2 的公式？', a: '<code>sr2(L1,E2 | L2) = sr2(L1,nil) @ (E2 | L2)</code>' },
      { q: 'ctrr 的 IH？', a: '<code>eq rev1(l1) = rev2(l1) .</code>' }
    ]
  };

  /* =====================================================================
   * L13 量子隐形传态的验证
   * ===================================================================== */
  CH.push({
    id: 'L13', num: 'L13', group: '第 4 部分 · 验证（高分值）', short: 'L13 验证·量子隐形传态',
    title: '13. 量子隐形传态的验证',
    sub: 'Verification of Quantum Teleportation —— 同一套「等式 + 重写 + 分情形」的方法，用在一个看起来完全不同的领域。',
    minutes: 55,
    goals: [
      '用 <code>a|0&gt; + b|1&gt;</code> 表示量子比特，解释归一化条件',
      '说清四个门（H / CX / X / Z）分别做什么',
      '理解测量的概率与状态塌缩',
      '能描述隐形传态电路与「分情形 + 归一化」的验证思路'
    ],
    pre: [
      'L11–L12：结构归纳、新常量、IH、证明分数的写法',
      'L3 / L7：<code>assoc</code>、<code>comm</code>、<code>id:</code> 属性（量子态的 ⊗ 和 + 都用到）',
      '不需要量子物理基础：本章只用到「态是带系数的和」和「门是改写规则」'
    ],
    summary: [
      '量子比特 a|0&gt; + b|1&gt;，归一化 |a|² + |b|² = 1；多个比特用张量积 ⊗（CafeOBJ 里的 _@_）',
      '四个门：H 造叠加、CX 造纠缠、X 翻转、Z 翻相位；测量会让状态塌缩',
      '隐形传态：共享 Bell 对 → Alice 做 CX、H 并测量两位 → Bob 按结果做 X/Z 修正',
      '讲义的验证：对振幅分 3 种情形（都非零 / a=1,b=0 / a=0,b=1）；多次传送再对系统状态 S 做结构归纳'
    ],
    sections: [
      {
        id: 'L13.s1', title: '为什么函数式编程课会讲量子？',
        guide: {
          what: '把量子态写成代数项、把量子门写成等式，用本课的「重写 + 分情形 + 归纳」方法验证量子协议。',
          why: '说明这套方法不只适用于自然数和列表，也能验证真实世界里很难测试的系统。',
          how: '本章不要求懂量子物理。读的时候把 |0&gt;、|1&gt; 当成两个符号，把门当成改写规则即可。',
          use: '量子程序很难测试（测量会破坏状态），所以 IBM、微软等公司都在研究量子程序的形式化验证。',
          pitfalls: ['以为要会量子力学才能学这章：考试只考概念和状态推演']
        },
        html:'<p>因为<b>量子态本身就是一个代数结构，量子门就是等式</b>。整门课的方法完全适用：</p>' +
          '<table><tr><th>本课的概念</th><th>在量子里的对应</th></tr>' +
          '<tr><td>排序（sort）</td><td><code>QState</code>（量子态）、<code>Comp</code>（复数振幅）、<code>Bit</code></td></tr>' +
          '<tr><td>算子</td><td><code>_@_</code>（张量积 ⊗）、<code>_+_</code>（叠加）、<code>__</code>（振幅乘态）</td></tr>' +
          '<tr><td>等式</td><td>门的作用规则，例如 <code>H |0&gt; = ...</code></td></tr>' +
          '<tr><td>重写</td><td>「把电路一步步算下去」</td></tr>' +
          '<tr><td>结构归纳 / 分情形</td><td>验证协议正确性时对振幅 a、b 分 3 种情形，并对系统状态做结构归纳</td></tr></table>' +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>这是本课最「应用」的一章</div>' +
          '<p>它想说明的是：<b>「用代数规格描述系统 + 用重写推演 + 用归纳证明」这套方法，不局限于列表和自然数</b>。' +
          '量子协议、分布式协议（第 10 章前后的互斥协议）、安全协议，都可以这么干。</p>' +
          '<p>考试层面：这一章通常考<b>概念 + 状态推演</b>，不会让你证完整的量子定理（太长了）。</p></div>'
      },
      {
        id: 'L13.s2', title: '量子比特、叠加与张量积',
        guide: {
          what: '量子比特 a|0&gt; + b|1&gt; 是「0 和 1 的加权和」；多个比特用张量积 ⊗ 拼在一起。',
          why: '后面的门和协议都在这种表示上做改写，先要看懂它。',
          how: '把 a、b 当作「权重」，测量时得到 0 的概率是 |a|²，得到 1 的概率是 |b|²。下面的模拟器可以直接点。',
          use: '量子计算机（IBM Quantum、Google Sycamore）里的每个量子比特都用这种方式描述。',
          pitfalls: ['忘了归一化条件 |a|² + |b|² = 1', '把张量积 ⊗ 和叠加 + 混淆：⊗ 是「拼比特」，+ 是「叠加不同可能」']
        },
        html:'<p>一个<b>量子比特（qubit）</b>写成：</p>' +
          '<div class="codebox"><pre>a|0&gt; + b|1&gt;</pre></div>' +
          '<p>含义：测量前它「既不是 0 也不是 1」，而是以概率 |a|² 得 0、|b|² 得 1。<b>a, b 叫振幅（amplitude）</b>，是复数，必须满足<b>归一化条件</b>：</p>' +
          '<div class="codebox"><pre>|a|² + |b|² = 1</pre></div>' +
          '<p>多个量子比特用<b>张量积（tensor product）⊗</b> 组合。在 CafeOBJ 里 <code>_@_</code> 就是 ⊗：</p>' +
          '<div class="codebox"><pre>(a|0&gt; + b|1&gt;) @ |0&gt; @ |0&gt;\n  = a(|0&gt; @ |0&gt; @ |0&gt;) + b(|1&gt; @ |0&gt; @ |0&gt;)\n  = a|000&gt; + b|100&gt;</pre></div>' +
          '<div class="card"><div class="card-t"><span class="ico">📦</span>关键模块 QS</div>' +
          cbStatic('mod! QS {\n  pr(AMPLITUDE)  pr(BIT)\n  [ZeroState EmptyKet NzNekQState &lt; QState]\n  op 00 : -&gt; ZeroState {constr} .        -- 零态\n  op |&gt; : -&gt; EmptyKet {constr} .          -- 空态（空比特串）\n  op |_&gt; : Bit -&gt; NzNekQState {constr} .  -- |0&gt; 或 |1&gt;\n  op __ : Comp QState -&gt; QState {constr prec: 30} .   -- 振幅 × 态\n  op _@_ : QState QState -&gt; QState {constr r-assoc prec: 40 id: |&gt;} .  -- ⊗\n  op _+_ : QState QState -&gt; QState {constr r-assoc prec: 60 id: 00} .  -- 叠加\n  eq A |&gt; = 00 .\n  eq A 00 = 00 .\n  eq 0 NzNekS = 00 .\n  eq 1 NzNekS = NzNekS .\n  eq A (A1 NzNekS) = (A * A1) NzNekS .\n}', 'QS 模块（读懂即可）') +
          '<p>注意 <code>id: |&gt;</code>（空态是 ⊗ 的单位元）和 <code>id: 00</code>（零态是 + 的单位元），' +
          '以及 <code>eq 0 NzNekS = 00 .</code>（振幅 0 的项直接消失）—— 这几条等式就是「化简」的主力。</p></div>' +
          '<div class="widget" id="w-l13-gate"></div>'
      },
      {
        id: 'L13.s3', title: '四个门：H / CX / X / Z',
        guide: {
          what: '量子门是改变量子态的操作，隐形传态只用到 4 个：H、CX、X、Z。',
          why: '协议的每一步都是在某个比特上施加某个门，看懂门才能跟着推演。',
          how: '在上面的模拟器里按下面 4 步亲手点一遍，观察振幅和概率怎么变。',
          use: '所有量子算法（Shor 分解、Grover 搜索）都是由这些基本门组合出来的。',
          pitfalls: ['以为 Z 门会改变测量概率：它只改符号（相位），概率不变', 'CX 要分清哪个是控制位、哪个是目标位']
        },
        html:'<table><tr><th>门</th><th>作用</th><th>矩阵直觉</th></tr>' +
          '<tr><td><b>H</b>（Hadamard）</td><td><code>H|0&gt; = (1/√2)(|0&gt; + |1&gt;)</code>，<code>H|1&gt; = (1/√2)(|0&gt; - |1&gt;)</code></td><td>制造叠加，是「同时算所有可能」的来源</td></tr>' +
          '<tr><td><b>CX</b>（Controlled-NOT）</td><td>控制位为 1 时翻转目标位：<code>CX|10&gt; = |11&gt;</code>，<code>CX|00&gt;=|00&gt;</code></td><td>制造纠缠（Bell 对）</td></tr>' +
          '<tr><td><b>X</b>（Pauli-X）</td><td><code>X|0&gt; = |1&gt;</code>，<code>X|1&gt; = |0&gt;</code></td><td>经典 NOT</td></tr>' +
          '<tr><td><b>Z</b>（Pauli-Z）</td><td><code>Z|0&gt; = |0&gt;</code>，<code>Z|1&gt; = -|1&gt;</code></td><td>翻转 1 的相位（符号）</td></tr></table>' +
          '<p>用上面的互动面板亲手点一遍：</p>' +
          '<ol><li><code>H(0)</code> → 看到 |0&gt; 变成 (|0&gt;+|1&gt;)/√2，两个概率各 0.5</li>' +
          '<li><code>CX(0,1)</code> → 变成 (|00&gt;+|11&gt;)/√2，这就是 <b>Bell 对（纠缠态）</b></li>' +
          '<li>再点 <code>Z(1)</code> → 变成 (|00&gt;−|11&gt;)/√2，只有符号变了，概率不变</li>' +
          '<li>点 <code>measure(0)</code> → 会随机塌缩到 |00&gt; 或 |11&gt; 之一（概率各半）</li></ol>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>测量不可逆</div>' +
          '<p>测量后状态塌缩，叠加消失，无法恢复。这也是为什么量子计算要「算完再测」。</p></div>'
      },
      {
        id: 'L13.s4', title: '隐形传态：把量子态「传真」过去',
        guide: {
          what: '借助一对纠缠粒子和两比特的经典通信，把 Alice 的量子态搬到 Bob 那里。',
          why: '量子态不能复制，也不能直接测量后重建；隐形传态是唯一能「搬走」它的办法。',
          how: '先在模拟器里一步步看协议，再看讲义怎样用「分情形 + 结构归纳」证明它对任意 a、b 都正确。',
          use: '量子通信、量子互联网、分布式量子计算都以隐形传态为基础。',
          pitfalls: ['把「4 种测量结果」当成证明里的分情形：讲义的证明是对振幅 a、b 分 3 种情形', '以为隐形传态比光速快：Bob 必须等 Alice 的经典通信才能修正']
        },
        html:'<p><b>目标</b>：Alice 有一个量子态 <code>a|0&gt; + b|1&gt;</code>（她不知道 a、b），' +
          '想把它交给远处的 Bob。不能复制（量子不可克隆），但可以用<b>纠缠 + 经典通信</b>传过去。</p>' +
          '<h3 class="sub">协议三步</h3>' +
          '<ol><li><b>准备</b>：Alice 和 Bob 共享一对纠缠粒子（Bell 对）。Alice 手里有待传态 q0 和自己的纠缠粒子 q1，Bob 有 q2。</li>' +
          '<li><b>Alice 操作</b>：<code>CX(q0,q1)</code> 然后 <code>H(q0)</code>，再<b>测量 q0 和 q1</b>，得到两个经典比特 (m0,m1)。</li>' +
          '<li><b>经典通信 + 修正</b>：Alice 把 (m0,m1) 告诉 Bob。Bob 根据这两位：m1=1 就 <code>X(q2)</code>，m0=1 就 <code>Z(q2)</code>。' +
          '完成后 <b>q2 就变成了 <code>a|0&gt; + b|1&gt;</code></b>。</li></ol>' +
          '<div class="widget" id="w-l13-tele"></div>' +
          '<p>点「下一步」看每一阶段的量子态。关键观察：</p>' +
          '<ul><li>中间状态会有 4 个分支（对应 Alice 的 4 种测量结果），每个分支的概率都是 1/4。</li>' +
          '<li>每个分支里 Bob 的态「差一个修正」：不修正时分别是 <code>a|0&gt;+b|1&gt;</code>、<code>a|1&gt;+b|0&gt;</code>、' +
          '<code>a|0&gt;−b|1&gt;</code>、<code>a|1&gt;−b|0&gt;</code>。</li>' +
          '<li>施以正确的 X/Z 修正后，<b>4 个分支全都变成 <code>a|0&gt;+b|1&gt;</code></b> —— 这就是正确性。</li></ul>' +
          '<div class="card"><div class="card-t"><span class="ico">⚙️</span>讲义里的程序怎么组织</div>' +
          '<p>4 种测量结果（00、01、10、11）的处理写在函数 <code>measureAndCorrect</code> <b>内部</b>：它对每种结果做对应的 X/Z 修正，并给出这个分支的概率。' +
          '<code>teleportStep</code> 对一个态执行一次完整的协议，<code>teleportHop</code> 对一堆「(态, 概率)」对逐个执行，再用 <code>combine</code> 合并相同的态。' +
          '所以 4 种情形是<b>程序在计算</b>，不是证明时要分的情形。</p></div>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>「验证」在这里指什么（讲义第 39–47 页）</div>' +
          '<p>讲义把系统写成模块 <code>QT</code>：系统状态 <code>Sys</code> 有初始状态 <code>init</code> 和迁移 <code>teleport</code>，观察函数 <code>qs</code> 返回当前的「(态, 概率)」集合。' +
          '其中 <code>ops a b : -&gt; Comp</code> 是任意复数，满足归一化条件 <code>eq | a |^2 + | b |^2 = 1 .</code></p>' +
          '<p><b>定理 1</b>：<code>qs(teleport(init)) = [a | 0 &gt; + b | 1 &gt;, 1]</code>，即传一次之后，Bob 以概率 1 得到原来的态。</p>' +
          '<p><b>证明方法：对振幅 a、b 分 3 种情形</b>（case splitting）：</p>' +
          '<table><tr><th>情形</th><th>证明分数里怎么写</th><th>为什么要单独分出来</th></tr>' +
          '<tr><td>(i) a ≠ 0 且 b ≠ 0</td><td>声明新常量 <code>ops a\' b\' : -&gt; NzComp .</code>，写 <code>eq a = a\' .</code>、<code>eq b = b\' .</code> 和归一化条件</td><td>NzComp（非零复数）才能用「振幅 × 态」那些等式化简</td></tr>' +
          '<tr><td>(ii) a = 1，b = 0</td><td><code>eq a = 1 .</code>、<code>eq b = 0 .</code></td><td>b = 0 时 b|1&gt; 整项消失，化简路径不同。由归一化，a 只能是 1（讲义取 1）</td></tr>' +
          '<tr><td>(iii) a = 0，b = 1</td><td><code>eq a = 0 .</code>、<code>eq b = 1 .</code></td><td>同理，a|0&gt; 整项消失</td></tr></table>' +
          '<p>三种情形各写一段 <code>open QT . … red qs(teleport(init)) = [a | 0 &gt; + b | 1 &gt;, 1] . close</code>，都得到 true，就证明了对任意 a、b 都传对了。</p>' +
          '<p><b>多次传送</b>（讲义第 42–47 页）：要证对任意系统状态 S 都有 <code>qs(S) = [a | 0 &gt; + b | 1 &gt;, 1]</code>，就<b>对系统状态 S 做结构归纳</b>：' +
          'base 证 <code>qs(init)</code>；induction 声明新常量 <code>op s : -&gt; Sys .</code>、写 IH <code>eq qs(s) = [a | 0 &gt; + b | 1 &gt;, 1] .</code>，证 <code>qs(teleport(s))</code>。base 和 induction 里<b>又各自</b>分成上面 3 种振幅情形，一共 6 段证明分数。</p>' +
          '<p>这就是第 11、12 章方法的复用：<b>分情形（把 a、b 的可能性切成有限几类）+ 结构归纳（对系统状态）</b>。</p></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>本系统的引擎不能运行 QT 模块</div>' +
          '<p>讲义的 QT 依赖复数、有理数和多个辅助模块，本系统的简化引擎没有实现它们，所以上面的证明分数只能对照阅读，或者在官方 CafeOBJ 里运行。上面的模拟器演示的是同一个协议的数值计算。</p></div>' +
          cta('L13-quiz1', '随堂小测 · 量子基础（3 题）')
      }
    ],
    quiz: 'L13-quiz', flash: 'L13-flash'
  });

  QZ['L13-quiz1'] = {
    title: '随堂小测 · 量子隐形传态',
    items: [
      { q: '热身：量子比特 a|0&gt; + b|1&gt; 测量后得到 0 的概率是？', opts: ['a', '|a|²', 'a + b', '1/2'], a: 1, why: '概率是振幅绝对值的平方。',
        optWhy: ['振幅可以是负数或复数，不能直接当概率', '正确', '这不是概率', '只有 a、b 的绝对值相等时才是 1/2'] },
      { q: '归一化条件是？', opts: ['a + b = 1', '|a|² + |b|² = 1', 'a = b', 'a·b = 1'], a: 1, why: '所有结果的概率之和必须为 1。',
        optWhy: ['振幅之和没有意义，概率之和才要等于 1', '正确', 'a、b 可以不同', '这和概率无关'] },
      { q: 'CafeOBJ 里哪个算子表示张量积 ⊗？', opts: ['<code>_+_</code>', '<code>_@_</code>', '<code>__</code>', '<code>_*_</code>'], a: 1, why: 'QS 模块里 <code>op _@_ : QState QState -&gt; QState {id: |&gt;}</code>。',
        optWhy: ['_+_ 是叠加', '正确', '__ 是「振幅 × 态」', '_*_ 是复数乘法'] },
      { q: '隐形传态最后 Bob 需要做什么？', opts: ['再测一次', '根据 Alice 的两位测量结果施加 X 和/或 Z 修正', '复制量子态', '什么都不做'], a: 1, why: 'm1=1 则 X，m0=1 则 Z。',
        optWhy: ['再测量会破坏要传的态', '正确', '量子态不能复制（不可克隆定理）', '不修正的话，4 种情形里只有 1 种是对的'] }
    ]
  };
  QZ['L13-quiz'] = {
    title: 'L13 综合测验',
    items: [
      { q: 'H 门作用在 |0&gt; 上得到？', opts: ['|1&gt;', '<code>(|0&gt;+|1&gt;)/√2</code>', '<code>(|0&gt;-|1&gt;)/√2</code>', '|0&gt;'], a: 1, why: 'H|0&gt; = (|0&gt;+|1&gt;)/√2。',
        optWhy: ['这是 X 门的效果', '正确', '这是 H|1&gt; 的结果', 'H 会改变 |0&gt;'] },
      { q: 'CX 门的作用是？', opts: ['总是翻转目标', '控制位为 1 时翻转目标位', '制造相位', '测量'], a: 1, why: 'Controlled-NOT。',
        optWhy: ['总是翻转的是 X 门', '正确', '改相位的是 Z 门', '测量不是门'] },
      { q: '讲义验证隐形传态（传一次）时，证明分数是怎么分情形的？', opts: ['穷举 a、b 的所有取值', '按振幅分 3 种：a、b 都非零 / a=1,b=0 / a=0,b=1', '按 Alice 测量结果分 4 种', '不分情形，直接 red'], a: 1, why: '讲义第 40–41 页：The case is split into 3 sub-cases。4 种测量结果是 measureAndCorrect 内部的计算。',
        optWhy: ['复数有无穷多个，不可能穷举', '正确', '4 种测量结果由程序 measureAndCorrect 在内部处理，不是证明时分的情形', 'a 或 b 为 0 时化简路径不同，必须分开'] },
      { q: '多次传送的验证，在分情形之外还用了什么方法？', opts: ['对系统状态 S 做结构归纳', '对 a 做归纳', '随机测试', '不需要别的方法'], a: 0, why: 'base 证 qs(init)，induction 用 IH qs(s) = … 证 qs(teleport(s))；两个分支里又各分 3 种振幅情形。',
        optWhy: ['正确', 'a 是复数，不能做结构归纳', '测试不是证明', '传任意多次需要归纳才能覆盖'] },
      { q: 'Z 门的作用是？', opts: ['把 |0&gt; 变 |1&gt;', '保持 |0&gt; 不变但把 |1&gt; 变成 −|1&gt;', '测量', '制造纠缠'], a: 1, why: '相位翻转。',
        optWhy: ['这是 X 门', '正确', 'Z 是门，不是测量', '制造纠缠的是 CX'] }
    ]
  };
  QZ['L13-flash'] = {
    title: 'L13 闪卡',
    cards: [
      { q: 'qubit 的表示与归一化？', a: '<code>a|0&gt; + b|1&gt;</code>，且 |a|²+|b|²=1。' },
      { q: '四个门？', a: 'H（造叠加）、CX（造纠缠）、X（NOT）、Z（相位翻转）。' },
      { q: '隐形传态三步？', a: '① 共享 Bell 对 ② Alice 做 CX+H 并测量两位 ③ 经典通信后 Bob 施加 X/Z 修正。' },
      { q: '验证策略（讲义）？', a: '对振幅分 3 种情形：(i) a、b 都非零（新常量 a\' b\' : NzComp + 归一化）(ii) a=1, b=0 (iii) a=0, b=1。多次传送再对系统状态 S 做结构归纳。4 种测量结果是 measureAndCorrect 内部处理的。' }
    ]
  };

  /* =====================================================================
   * L14 证明助手
   * ===================================================================== */
  CH.push({
    id: 'L14', num: 'L14', group: '第 4 部分 · 验证（高分值）', short: 'L14 证明助手 CITP',
    title: '14. 证明助手（CafeOBJ CITP）',
    sub: '把「手写证明分数」升级成「交互式证明脚本」：机器帮你管新常量、管子目标、管 IH。',
    minutes: 40,
    goals: [
      '说清 CITP 解决什么问题（手写证明分数的人为错误）',
      '记住 7 个命令的作用与顺序',
      '能读懂一段 proof script 并说出每一步在做什么',
      '会解释 :apply (si) / (tc) / (rd) 的区别'
    ],
    pre: [
      'L11：手写证明分数（新常量、IH、red）——本章就是把这些步骤交给机器管理',
      'L11：rz+、rs+、comm+、assoc+ 的证明（本章用同样的例子）'
    ],
    summary: [
      'CITP 是交互式证明助手：自动引入新常量、自动生成 IH、自动管理子目标，减少手写错误',
      '命令：:goal 声明目标、:ind on 指定归纳变量、:apply (si) 结构归纳、:apply (tc) 把变量换成新常量、:apply (rd) 化简并解除子目标',
      '查看：:show proof 看证明概要、:desc proof 看全部子目标、:desc . 看当前子目标',
      '需要引理时：先证引理，再建一个包含引理的模块（如 PNAT1-RZRS+），open 它再证主定理',
      'CITP 不是全自动：归纳变量和引理仍然要人来选'
    ],
    sections: [
      {
        id: 'L14.s1', title: '手写证明分数的三个隐患',
        guide: {
          what: '手写证明分数时容易犯的三种错误，以及证明助手 CITP 为什么能避免它们。',
          why: '先知道问题，才明白下一节那些命令每一条在解决什么。',
          how: '对照 L11 自己写过的证明分数，想一想自己有没有犯过这三种错误。',
          use: 'Coq、Isabelle、Lean 这些工业级证明助手也是同一个思路，例如 CompCert 编译器就是用 Coq 证明的。',
          pitfalls: ['以为 red 得到 true 就一定证对了：IH 写错时也可能碰巧得到 true']
        },
        html:'<p>第 11、12 章我们都是手写证明分数。它有三个坑：</p>' +
          '<ol><li><b>新常量可能撞车</b>：<code>op x : -&gt; PNat .</code> 如果之前的 open 里已经用过 x，可能引入不该有的性质。</li>' +
          '<li><b>忘了写某个分支</b>：归纳法有两个分支，漏一个证不出来，但 CafeOBJ 不会提醒你。</li>' +
          '<li><b>IH 写错</b>：大小写写混（<code>eq (x+y)+z = ...</code>）时，<code>red</code> 可能碰巧返回 true，其实证明是错的。</li></ol>' +
          '<p><b>CafeOBJ CITP</b>（Proof Assistant for CafeOBJ）就是来解决这些的：它替你管理「当前目标、子目标、新常量、IH」，' +
          '你只需要下命令。</p>' +
          '<div class="card tip"><div class="card-t"><span class="ico">📌</span>术语</div>' +
          '<p>用 CITP 命令写的证明叫 <b>proof script</b>（证明脚本）；手写的叫 <b>proof score</b>（证明分数）。' +
          '两者本质相同，前者更可靠。</p></div>'
      },
      {
        id: 'L14.s2', title: '7 个命令（考试就考这些）',
        guide: {
          what: '课程里用到的 CITP 命令：声明目标、指定归纳变量、三种 :apply，以及查看证明状态的命令。',
          why: '考试常考「这个命令做了什么」，必须分清。',
          how: '记住缩写：si = structural induction（结构归纳），tc = theorem of constants（变量换常量），rd = reduce（化简）。',
          pitfalls: ['把 (si) 和 (tc) 搞混：si 是对归纳变量切分 base/induction，tc 是把其余变量换成常量', '忘了先 open 模块就写 :goal']
        },
        html:'<table><tr><th>命令</th><th>作用</th></tr>' +
          '<tr><td><code>:goal { eq [label] : 等式 . }</code></td><td>声明要证的目标（可以一次给多条）。模块要事先 open。</td></tr>' +
          '<tr><td><code>:ind on X:S</code></td><td>指定对哪个变量做（同时）结构归纳</td></tr>' +
          '<tr><td><code>:apply (si)</code></td><td><b>si</b> = structural induction。执行结构归纳，把当前目标换成 n 个子目标（n = 构造子个数），并为非常量构造子引入新常量</td></tr>' +
          '<tr><td><code>:apply (tc)</code></td><td><b>tc</b> = theorem of constants。把当前目标里<b>每个变量都换成新常量</b>（讲义：<i>Each variable in the sentences of the current goal is replaced with a fresh constant</i>），例如 Y、Z 变成 <code>Y@PNat</code>、<code>Z@PNat</code>。如果目标有 n 条等式，就切成 n 个子目标</td></tr>' +
          '<tr><td><code>:apply (rd)</code></td><td><b>rd</b> = reduce。把当前目标化简；若化成 <code>true</code>，该子目标被「解除（discharged）」</td></tr>' +
          '<tr><td><code>:show proof</code></td><td>显示已完成的证明概要，当前目标用 <code>&gt;</code> 标出</td></tr>' +
          '<tr><td><code>:desc proof</code> / <code>:desc .</code></td><td>列出所有子目标 / 显示当前子目标</td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>最容易记混的两个</div>' +
          '<p><code>:apply (si)</code> 是<b>切分成子目标</b>（base 和 ind 两个）；<code>:apply (rd)</code> 是<b>化简并尝试收尾</b>。' +
          '讲义的标准顺序：<code>open 模块 .</code> → <code>:goal</code> → <code>:ind on</code> → <code>:apply (si)</code> → 对每个子目标 <code>:apply (tc)</code> 再 <code>:apply (rd)</code> → <code>close</code>。' +
          '如果子目标里已经没有变量（例如 rz+ 的 base 是 <code>0 + 0 = 0</code>），可以省掉 <code>(tc)</code>，直接 <code>(rd)</code>。</p></div>'
      },
      {
        id: 'L14.s3', title: '完整走一遍：assoc+ 的 proof script',
        guide: {
          what: '用 CITP 重新证明 L11 的 assoc+，看每条命令执行后当前目标变成什么。',
          why: '对照手写版本，能看清 CITP 替你做了哪些事。',
          how: '点「📖 逐行解读」看每一行；再看下面讲义给出的每一步输出。',
          pitfalls: ['以为 (si) 之后可以直接 close：每个子目标都要 (rd) 解除']
        },
        html:cbStatic('open PNAT1 .\n:goal { eq [assoc+] : (X + Y) + Z = X + (Y + Z) . }\n:ind on (X:PNat)\n:apply (si)\n-- I. Base case\n:apply (tc)\n:apply (rd)\n-- II. Induction case\n:apply (tc)\n:apply (rd)\nclose', 'assoc+ 的 proof script（讲义第 10 页写法）', {
            'open PNAT1 .': '先打开要用的模块。CITP 的命令都在 open 里执行。',
            ':goal { eq [assoc+] : (X + Y) + Z = X + (Y + Z) . }': '声明要证的目标，[assoc+] 是给这条等式起的名字（标签）。',
            ':ind on (X:PNat)': '指定对变量 X 做结构归纳，X 的类型是 PNat。',
            ':apply (si)': '执行结构归纳：PNat 有两个构造子（0 和 s），所以切成两个子目标；同时自动引入归纳用的新常量 <code>X#PNat</code> 和 IH。',
            '-- I. Base case': '注释：现在的当前目标是基础情形 <code>(0 + Y) + Z = 0 + (Y + Z)</code>。',
            ':apply (tc)': '把目标里剩下的变量 Y、Z 换成新常量 <code>Y@PNat</code>、<code>Z@PNat</code>。',
            ':apply (rd)': '化简当前目标；化成 true，这个子目标就被解除（discharged），自动转到下一个子目标。',
            '-- II. Induction case': '注释：现在的当前目标是归纳情形 <code>(s(X#PNat) + Y) + Z = s(X#PNat) + (Y + Z)</code>，IH 已自动加入。',
            'close': '所有子目标都解除了，主目标也就证完了。关闭模块。'
          }) +
          '<p>每一步之后可以用 <code>:desc .</code> 查看当前子目标。讲义第 11–15 页给出的输出大致是：</p>' +
          '<div class="codebox"><pre>[si]=&gt;  ** 1   eq [assoc+]: (0 + Y:PNat) + Z:PNat = 0 + (Y + Z) .\n[tc]=&gt;  ** 1-1 eq [TC assoc+]: (0 + Y@PNat) + Z@PNat = 0 + (Y@PNat + Z@PNat) .\n(rd)    第一个目标解除\n[si]=&gt;  ** 2   constant for induction: X#PNat\n               introduced axiom (IH): (X#PNat + Y:PNat) + Z:PNat = X#PNat + (Y + Z)\n               eq [assoc+]: (s(X#PNat) + Y:PNat) + Z:PNat = s(X#PNat) + (Y + Z) .\n[tc]=&gt;  ** 2-1 Y、Z 换成 Y@PNat、Z@PNat\n(rd)    第二个目标解除 → 主目标解除</pre></div>' +
          '<div class="card"><div class="card-t"><span class="ico">🔍</span>对照第 11 章</div>' +
          '<table><tr><th>手写 proof score</th><th>CITP 命令</th></tr>' +
          '<tr><td>写定理文字</td><td><code>:goal { eq [label] : ... . }</code></td></tr>' +
          '<tr><td>「By structural induction on X」</td><td><code>:ind on (X:PNat)</code> + <code>:apply (si)</code></td></tr>' +
          '<tr><td><code>open ... ops x : -&gt; PNat .</code>（声明新常量）</td><td>由 <code>:apply (si)</code> 自动完成</td></tr>' +
          '<tr><td><code>eq (x + Y) + Z = x + (Y + Z) .</code>（IH）</td><td>由 <code>:apply (si)</code> 自动加入</td></tr>' +
          '<tr><td><code>red ... .</code></td><td><code>:apply (rd)</code></td></tr>' +
          '<tr><td><code>close</code></td><td>子目标解除后自动结束</td></tr></table></div>' +
          '<p>可以看到：CITP 把「新常量 + IH」这两步自动化了 —— 而这正是手写时最容易错的两步。</p>'
      },
      {
        id: 'L14.s4', title: '需要引理时怎么办',
        guide: {
          what: '证明需要引理时，CITP 的做法：先证引理，再把引理放进一个新模块，打开新模块证主定理。',
          why: '这样已证的事实和待证的目标分得很清楚，也和讲义考试的写法一致。',
          how: '照着下面的三步写；模块名习惯上写成「原模块名-引理名」，如 PNAT1-RZRS+。',
          pitfalls: ['在 :goal 之后直接写 eq 引理（不是讲义的写法）', '把还没证明的等式放进引理模块']
        },
        html:'<p>像第 11 章的 comm+ 那样需要引理时，讲义的做法分三步（第 16–19 页）：</p>' +
          '<ol><li>先用 proof script 分别证明引理 rz+、rs+；</li>' +
          '<li><b>新建一个模块</b>，把已证的引理作为等式写进去（讲义叫 <code>PNAT1-RZRS+</code>）；</li>' +
          '<li>打开这个新模块，再证 comm+。</li></ol>' +
          cbStatic('open PNAT1 .\n:goal { eq [rz+] : X + 0 = X . }\n:ind on (X:PNat)\n:apply (si)\n-- I. Base case\n:apply (rd)\n-- II. Induction case\n:apply (rd)\nclose\n\nmod! PNAT1-RZRS+ {\n  pr(PNAT1)\n  vars X Y : PNat .\n  eq X + 0 = X .\n  eq X + s(Y) = s(X + Y) .\n}\n\nopen PNAT1-RZRS+ .\n:goal { eq [comm+] : X + Y = Y + X . }\n:ind on (X:PNat)\n:apply (si)\n-- I. Base case\n:apply (tc)\n:apply (rd)\n-- II. Induction case\n:apply (tc)\n:apply (rd)\nclose', '带引理的 proof script（讲义写法；rs+ 的证明和 rz+ 同理，这里省略）', {
            'open PNAT1 .': '打开 PNAT1。',
            ':goal { eq [rz+] : X + 0 = X . }': '目标：引理 rz+。',
            ':ind on (X:PNat)': '对 X 归纳。',
            ':apply (si)': '切成 base 和 induction 两个子目标。',
            '-- I. Base case': '注释：基础情形。',
            ':apply (rd)': '化简当前子目标；rz+ 的子目标里没有其他变量，所以不需要 (tc)。',
            '-- II. Induction case': '注释：归纳情形。',
            'close': '关闭模块。',
            'mod! PNAT1-RZRS+ {': '新建模块，名字表示「PNAT1 加上 rz+ 和 rs+」。',
            'pr(PNAT1)': '导入 PNAT1。',
            'vars X Y : PNat .': '声明变量。',
            'eq X + 0 = X .': '已证的引理 rz+ 作为等式。',
            'eq X + s(Y) = s(X + Y) .': '已证的引理 rs+ 作为等式。',
            '}': '模块结束。',
            'open PNAT1-RZRS+ .': '打开带引理的新模块，这样 (rd) 化简时就能用上两个引理。',
            ':goal { eq [comm+] : X + Y = Y + X . }': '目标：交换律。',
            ':apply (tc)': '把剩下的变量 Y 换成新常量 Y@PNat。'
          }) +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>不要在 proof script 中间直接写 eq</div>' +
          '<p>讲义没有在 <code>:goal</code> 之后直接写 <code>eq</code> 引理，而是把引理放进一个单独的模块。这样哪些事实是「已证明的引理」一目了然，也不会和 CITP 自动生成的常量、IH 混在一起。</p></div>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>L14 常考题</div>' +
          '<ul><li>「<code>:apply (si)</code> 做了什么？」→ 对 <code>:ind on</code> 指定的变量做结构归纳，把目标切成构造子个数个子目标，并为非常量构造子引入新常量。</li>' +
          '<li>「<code>:apply (rd)</code> 做了什么？」→ 化简当前目标；若化成 true 则该子目标解除。</li>' +
          '<li>「CITP 相比手写 proof score 的好处？」→ 避免新常量重用、自动生成 IH、自动管理子目标，减少人为错误。</li>' +
          '<li>「证明助手能完全自动证明定理吗？」→ 不能。它需要人指定归纳变量、提供引理；它是<b>辅助</b>工具（assistant），不是全自动定理证明器。</li></ul></div>' +
          cta('L14-quiz1', '随堂小测 · 证明助手（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L14 必背</div>' +
          '<ul><li>7 个命令：<code>:goal</code> / <code>:ind on</code> / <code>:apply (si)</code> / <code>:apply (tc)</code> / <code>:apply (rd)</code> / <code>:show proof</code> / <code>:desc proof</code>、<code>:desc .</code></li>' +
          '<li>顺序：open → :goal → :ind on → :apply (si) → 每个子目标 :apply (tc) + :apply (rd) → close</li>' +
          '<li>需要引理：先证引理 → 建一个带引理的模块（如 PNAT1-RZRS+）→ open 它再证主定理</li>' +
          '<li>一句话：CITP 减少人为错误，但不是全自动</li></ul></div>'
      }
    ],
    quiz: 'L14-quiz', flash: 'L14-flash'
  });

  QZ['L14-quiz1'] = {
    title: '随堂小测 · 证明助手',
    items: [
      { q: '<code>:apply (si)</code> 的作用是？', opts: ['化简目标', '对指定变量做结构归纳，切成子目标并引入新常量', '显示证明', '声明目标'], a: 1, why: 'si = structural induction。',
        optWhy: ['化简是 (rd)', '正确', '显示证明是 :show proof', '声明目标是 :goal'] },
      { q: '<code>:apply (tc)</code> 的作用是？', opts: ['结构归纳', '把当前目标里的变量都换成新常量', '化简', '检查类型'], a: 1, why: '讲义：Each variable in the sentences of the current goal is replaced with a fresh constant。',
        optWhy: ['结构归纳是 (si)', '正确', '化简是 (rd)', 'tc 和类型检查无关'] },
      { q: '<code>:apply (rd)</code> 做了什么？', opts: ['重写整个模块', '化简当前目标，若为 true 则解除', '删除子目标', '读取文件'], a: 1, why: 'rd = reduce。',
        optWhy: ['只化简当前目标，不改模块', '正确', '只有化成 true 才解除，不是直接删除', '与读文件无关'] },
      { q: 'CITP 主要解决什么问题？', opts: ['证明太慢', '手写证明分数时的人为错误（常量重用、IH 写错）', '语法不熟', '自动发现定理'], a: 1, why: '它是 assistant，不是全自动。',
        optWhy: ['速度不是重点', '正确', '语法还是要会', '引理和归纳变量还要人来想'] }
    ]
  };
  QZ['L14-quiz'] = {
    title: 'L14 综合测验',
    items: [
      { q: '热身：CITP 命令都以什么符号开头？', opts: ['点 .', '冒号 :', '感叹号 !', '井号 #'], a: 1, why: ':goal、:ind on、:apply、:show、:desc 都以冒号开头。',
        optWhy: ['句号是 CafeOBJ 语句的结尾', '正确', '! 出现在 mod! 里，不是命令开头', '# 出现在 CITP 生成的常量名里（如 X#PNat）'] },
      { q: '声明要证的目标用哪个命令？', opts: [':goal', ':ind on', ':apply (rd)', ':show proof'], a: 0, why: ':goal { eq [label] : ... . }',
        optWhy: ['正确', '这是指定归纳变量', '这是化简', '这是显示证明概要'] },
      { q: '指定归纳变量用？', opts: [':goal', ':ind on X:S', ':apply (si)', ':desc .'], a: 1, why: ':ind on (X:PNat)。',
        optWhy: [':goal 只声明目标', '正确', '(si) 执行归纳，但要先用 :ind on 指定变量', '这是查看当前子目标'] },
      { q: '查看当前子目标用？', opts: [':show proof', ':desc .', ':apply (rd)', ':goal'], a: 1, why: ':desc . 显示当前子目标；:desc proof 列出全部。',
        optWhy: [':show proof 显示整个证明的概要', '正确', '(rd) 是化简', ':goal 是声明新目标'] },
      { q: '讲义里证 comm+ 时，引理 rz+、rs+ 是怎么提供的？', opts: ['在 :goal 后面直接写 eq', '建一个带引理的模块 PNAT1-RZRS+，open 它再证', '不需要引理', '用 :apply (rd) 自动发现'], a: 1, why: '讲义第 18–19 页的做法。',
        optWhy: ['讲义没有这样写', '正确', '不加引理 (rd) 会卡在 Y + 0 和 Y + s(x)', 'CITP 不会自动发现引理'] },
      { q: '正确的命令顺序是？', opts: [':goal → :ind on → :apply (si) → :apply (tc) → :apply (rd)', ':apply (rd) → :goal → :ind on', ':ind on → :goal → :apply (si)', '任意顺序'], a: 0, why: '先声明目标，再指定归纳变量，再切分，再把变量换成常量，最后化简。',
        optWhy: ['正确', '没有目标就没有东西可化简', '要先有目标，才能指定对目标里的哪个变量归纳', '顺序是固定的'] }
    ]
  };
  QZ['L14-flash'] = {
    title: 'L14 闪卡',
    cards: [
      { q: '7 个 CITP 命令？', a: ':goal / :ind on / :apply (si) / :apply (tc) / :apply (rd) / :show proof / :desc proof & :desc .' },
      { q: ':apply (tc) 做什么？', a: '把当前目标里每个变量换成新常量（如 Y → Y@PNat）；目标有 n 条等式就切成 n 个子目标。' },
      { q: '需要引理时讲义怎么写？', a: '先证引理 → 建模块 PNAT1-RZRS+ { pr(PNAT1) … eq 引理 . } → open PNAT1-RZRS+ 再 :goal 主定理。' },
      { q: ':apply (si) 做什么？', a: '结构归纳：目标切成 n（构造子数）个子目标，非常量构造子引入新常量，并自动生成 IH。' },
      { q: ':apply (rd) 做什么？', a: '化简当前目标；化成 true 则子目标解除（discharged）。' },
      { q: 'CITP 是「全自动」吗？', a: '不是。它需要人指定归纳变量与引理，属于交互式证明助手。' }
    ]
  };

  /* =====================================================================
   * 期末冲刺
   * ===================================================================== */
  CH.push({
    id: 'EX', num: '冲刺', group: '第 5 部分 · 考前', short: '期末冲刺：模板与模拟卷',
    title: '期末冲刺：答题模板 + 模拟卷',
    sub: '按题型组织的最后复习：语法速查、高频题模板、两套模拟卷。考前 3 天只看这一章。',
    minutes: 80,
    goals: [
      '能在 3 分钟内写出一个正确的 mod! 骨架',
      '看到题目就知道该套哪个模板',
      '用两套模拟卷检验自己（目标 80 分以上）'
    ],
    pre: ['学完 L1–L14（至少看过每章的小结）', '每章的随堂小测至少做过一遍'],
    summary: [
      '语法题必须全拿：句号、{constr}、prec、strat: (1 0)、IH 的大小写',
      '求值题写出每一步并标规则；解释题用术语说机制；证明题先写骨架再填步骤',
      '证不完也要写：归纳变量、base case、IH、手算步骤，以及「需要引理 L」'
    ],
    sections: [
      {
        id: 'EX.s1', title: '语法速查表（考前最后看的东西）',
        guide: {
          what: '把全课程的语法压缩成一张表，外加最容易丢分的 8 个细节。',
          why: '考试是手写，语法错一个符号就可能整题不得分。',
          how: '考前遮住右边一列，自己默写一遍，再对照。',
          pitfalls: ['模块结尾 } 后面多写句号', '变量没有声明就用']
        },
        html:'<table><tr><th>要素</th><th>写法</th></tr>' +
          '<tr><td>模块</td><td><code>mod! NAME { … }</code>（注意 <code>}</code> 后<b>没有</b>句号）</td></tr>' +
          '<tr><td>导入</td><td><code>pr(NAT)</code></td></tr>' +
          '<tr><td>排序</td><td><code>[Nat]</code> / <code>[Zero NzNat &lt; Nat]</code></td></tr>' +
          '<tr><td>常量</td><td><code>op nil : -&gt; List {constr}</code></td></tr>' +
          '<tr><td>中缀</td><td><code>op _+_ : Nat Nat -&gt; Nat {prec: 33}</code></td></tr>' +
          '<tr><td>前缀</td><td><code>op fact : Nat -&gt; Nat</code></td></tr>' +
          '<tr><td>混合</td><td><code>op if_then{_}else{_} : Bool Nat Nat -&gt; Nat</code></td></tr>' +
          '<tr><td>变量</td><td><code>vars X Y : Nat</code> / <code>var N : Nat</code></td></tr>' +
          '<tr><td>等式</td><td><code>eq 左边 = 右边 .</code></td></tr>' +
          '<tr><td>条件等式</td><td><code>ceq 左边 = 右边 if 条件 .</code></td></tr>' +
          '<tr><td>属性</td><td><code>{constr}</code> <code>{assoc}</code> <code>{comm}</code> <code>{id: emp}</code> <code>{prec: 33}</code> <code>{strat: (1 0)}</code></td></tr>' +
          '<tr><td>会话</td><td><code>open M .</code> / <code>red 项 .</code> / <code>close</code></td></tr>' +
          '<tr><td>证明</td><td><code>ops x : -&gt; PNat .</code> + <code>eq IH .</code> + <code>red 目标 .</code></td></tr></table>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🔴</span>最容易丢分的 8 个细节</div>' +
          '<ol><li>每条 <code>eq</code>/<code>ceq</code>/<code>op</code>/<code>var</code> 结尾<b>都要有句号</b>（<code>mod!</code> 的 <code>}</code> 不用）</li>' +
          '<li>变量必须声明，且<b>大小写敏感</b>（大写是变量，小写通常是常量）</li>' +
          '<li>等式左边不能是单个变量</li>' +
          '<li><code>ceq</code> 的条件里的变量必须在左边出现过</li>' +
          '<li>递归函数先写基础情形，再写递归情形</li>' +
          '<li>写了 <code>_+_</code> 和 <code>_*_</code> 就一定要给 <code>prec</code></li>' +
          '<li>无限列表的 <code>_|_</code> 必须加 <code>{strat: (1 0)}</code></li>' +
          '<li>IH 用「新常量 + 原变量」：<code>eq (x + Y) + Z = x + (Y + Z) .</code></li></ol></div>'
      },
      {
        id: 'EX.s2', title: '五个答题模板（照着套）',
        guide: {
          what: '按题型准备好的答题框架：写模块、求 red、解释、写证明分数、需要引理时怎么写。',
          why: '考试是手写，时间紧。有固定框架，就不会漏掉拿分的步骤。',
          how: '每个模板下面都写了「为什么这样写」。先理解原因，再用模拟卷练习套用。',
          pitfalls: ['只写最终答案、不写中间步骤：求值题和证明题的过程分占大头', '模板 1 漏掉基础情形，递归不会停']
        },
        html: '<h3 class="sub">模板 1：写一个模块（10 分）</h3>' +
          '<div class="codebox"><pre>mod! XXX {\n  pr(NAT)                       -- 1. 导入需要的模块\n  [Nil NnXXX &lt; XXX]              -- 2. 排序（含阶排序）\n  op nil : -&gt; Nil {constr}       -- 3. 构造子\n  op _|_ : Nat XXX -&gt; NnXXX {constr prec: 40}\n  op 函数 : XXX -&gt; Nat           -- 4. 要实现的函数签名\n  vars E : Nat                   -- 5. 变量声明\n  var L : XXX\n  eq 函数(nil) = 0 .             -- 6. 基础情形\n  eq 函数(E | L) = s(函数(L)) .  -- 7. 递归情形\n}</pre></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">❓</span>为什么按这个顺序写</div><ul>' +
          '<li><b>先导入</b>：后面要用到 Nat、Bool，不导入就没有这些类型。</li>' +
          '<li><b>再写排序和构造子</b>：先确定数据长什么样（空列表、非空列表），函数才知道要对哪几种形状分情形。</li>' +
          '<li><b>函数签名在等式之前</b>：CafeOBJ 要先知道算子的类型，才能解析等式。</li>' +
          '<li><b>变量要声明</b>：没声明的大写字母会被当成不认识的符号，等式就写错了。</li>' +
          '<li><b>先写基础情形再写递归情形</b>：对每个构造子各写一条，递归情形每次让参数变小，最后一定落到基础情形，计算才会停。</li></ul></div>' +
          '<h3 class="sub">模板 2：求 red 的结果（8 分）</h3>' +
          '<p>步骤：① 找出最外层能用哪条等式；② 写出全部中间项（<b>一步一行</b>，标上规则名）；③ 最后的范式就是答案。<br>' +
          '格式：<code>t → t1 (by (eq1)) → t2 (by (eq2)) → … → 答案</code></p>' +
          '<p class="dim">为什么要标规则名：阅卷老师要看你每一步是不是真的能用那条等式，标出来才能拿过程分；中间写错一步，后面的步骤还能按「方法正确」给分。</p>' +
          '<h3 class="sub">模板 3：解释为什么（6 分）</h3>' +
          '<p>套路：<b>先说结论（一句话）→ 再说机制（用术语：redex / E-strategy / AC 匹配 / 不变量）→ 最后说后果或修复。</b><br>' +
          '例：「<code>take(primes,10)</code> 能终止，因为 <code>_|_</code> 声明了 <code>strat: (1 0)</code>，' +
          '归约时先算头再试根，只算到第 10 个元素就停；若去掉该属性，则会试图把无限尾求成范式而发散。」</p>' +
          '<p class="dim">为什么用术语：解释题考的是你是否理解机制。「因为策略里没有 2，所以尾巴不会被主动计算」比「因为它是惰性的」具体得多，能直接看出你懂了。</p>' +
          '<h3 class="sub">模板 4：写证明分数（15–20 分）</h3>' +
          '<div class="codebox"><pre>Theorem. 目标等式\nProof. By structural induction on X.\n\nI. Base case\nopen 模块 .\nops y : -&gt; S .\nred l(0) = r(0) .\nclose\n\nII. Induction case\nopen 模块 .\nops x y : -&gt; S .\neq IH（新常量 + 原变量） .\nred l(s(x)) = r(s(x)) .\nclose</pre></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">❓</span>每一行为什么这样写</div><ul>' +
          '<li><b>By structural induction on X</b>：先说对谁归纳，选递归所依据的那个参数（_+_ 按第一个参数递归，所以对 X）。</li>' +
          '<li><b>两个 open … close</b>：IH 只属于归纳情形，放在一起会让 base case 也能用 IH，证明就不可信了。</li>' +
          '<li><b>ops 声明新常量</b>：对一无所知的常量证出结论，等于对任意值证出结论。</li>' +
          '<li><b>IH 只把归纳变量换成新常量</b>：其他变量保持大写，IH 才能在证明中对任何值使用。</li>' +
          '<li><b>red 得到 true</b>：说明两边化简后完全相同，这个分支证完。</li></ul></div>' +
          '<h3 class="sub">模板 5：需要引理时</h3>' +
          '<p>写：「这里 <code>r(...)</code> 无法继续化简，因此需要一个引理：<b>Lemma. 引理等式</b>（它比所需更一般）。' +
          '把引理作为等式加入后，<code>red</code> 得到 true。」然后（如果分值高）给出引理的归纳证明。</p>' +
          '<p class="dim">为什么要说清「哪里化不动」：这正是找引理的依据。写出来，阅卷老师能看到你的推理过程，即使引理没证完也能拿到大部分分数。</p>'
      },
      {
        id: 'EX.s3', title: '模拟卷 A（覆盖 L1–L7）',
        guide: {
          what: '按考试题型出的一套练习，覆盖 L1–L7，每题附解题思路、答案和评分要点。',
          why: '只看不写，考试时就写不出来。用模拟卷检查自己哪里还不熟。',
          how: '计时 50 分钟，先在纸上写完，再对照每题的「思路 / 答案 / 评分要点」给自己打分；错的题回到对应章节重看。',
          pitfalls: ['看一眼答案就觉得会了：要合上答案自己写一遍']
        },
        html:'<div class="card"><div class="card-t">一、语法（每题 4 分）</div>' +
          '<p class="dim">每道题先自己写在纸上，再展开下面的「解题思路 / 答案 / 评分要点」对照。</p>' +
          '<ol><li>写出声明「0 与 s 是 PNat 的构造子」的两行代码。<div class="rubric"><b>思路</b>：构造子 = 搭数据的算子，要标 {constr}。<br><b>答</b>：<code>op 0 : -&gt; PNat {constr} .</code> / <code>op s : PNat -&gt; PNat {constr} .</code><br><b>评分要点</b>：箭头方向和类型对（2 分）；{constr}（1 分）；句号（1 分）。</div></li>' +
          '<li><code>[Zero NzNat &lt; Nat]</code> 的作用是什么？为什么 <code>p_</code> 要声明成 <code>NzNat -&gt; Nat</code>？<div class="rubric"><b>思路</b>：先说声明了什么，再说这样声明带来什么好处。<br><b>答</b>：声明 Zero 和 NzNat 都是 Nat 的子排序；p_ 的定义域写成 NzNat，0 就不在定义域里，<code>p 0</code> 无法化简成 Nat，错误在类型层面就暴露出来。<br><b>评分要点</b>：说出「子排序」（2 分）；说出「定义域不含 0」（2 分）。</div></li>' +
          '<li>写出 <code>_@_</code>（列表连接）的两条等式。<div class="rubric"><b>思路</b>：对第一个列表按构造子分情形：nil 和 E | L。<br><b>答</b>：<code>eq nil @ L2 = L2 .</code> / <code>eq (E | L) @ L2 = E | (L @ L2) .</code><br><b>评分要点</b>：两条各 2 分。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">二、理解（每题 6 分）</div>' +
          '<ol start="4"><li>解释 redex 与 contractum 的区别，并举一个例子。<div class="rubric"><b>思路</b>：用「替换前 / 替换后」来区分。<br><b>答</b>：redex 是能与等式左边匹配的子项（要被替换的那块）；contractum 是把匹配得到的替换代入右边得到的新项（换上去的那块）。例：用 <code>fact(s(X)) = s(X) * fact(X)</code> 时，<code>fact(s(s(0)))</code> 是 redex，<code>s(s(0)) * fact(s(0))</code> 是 contractum。<br><b>评分要点</b>：两个定义各 2 分；例子 2 分。</div></li>' +
          '<li>为什么无限列表的 <code>_|_</code> 要写 <code>{strat: (1 0)}</code>？<div class="rubric"><b>思路</b>：结论 → 机制（策略的含义）→ 不写的后果。<br><b>答</b>：(1 0) 表示先把第 1 个参数（头）算成范式，再尝试在根部重写；策略里没有 2，所以第 2 个参数（尾巴）不会被主动计算，这就是惰性。不写的话默认会去算无限长的尾巴，归约不会停，take 也就无法终止。<br><b>评分要点</b>：说清 1 和 0 的含义（2 分）；点明「没有 2 所以尾巴不算」（2 分）；后果（2 分）。</div></li>' +
          '<li>多重集里天真的 <code>update</code> 有什么问题？怎么修？<div class="rubric"><b>思路</b>：多重集不在乎顺序，但天真的 update 的结果却和写法顺序有关。<br><b>答</b>：同一个多重集写成不同顺序（讲义例：<code>(\'a,1) (\'b,2) (\'a,3)</code> 与 <code>(\'a,3) (\'b,2) (\'a,1)</code>），update 会改到不同的元素，得到不同的结果，说明这个定义不良定义。修法：要求键唯一（isValid 为 true），在条件等式里加上这个条件。<br><b>评分要点</b>：举出「顺序不同结果不同」（3 分）；修法 isValid（3 分）。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">三、求值（8 分）</div>' +
          '<ol start="7"><li>写出 <code>red take(primes,6) .</code> 的结果与至少 4 步中间项。<div class="rubric"><b>思路</b>：每步只做一次重写，标上用的等式。<br><b>答</b>：<code>2 | 3 | 5 | 7 | 11 | 13 | nil</code>；中间项从 <code>take(sieve(mkNILFrom(2)),6)</code> 开始，依次取出 2、筛掉 2 的倍数、取出 3……<br><b>评分要点</b>：结果 4 分；中间项每步 1 分（最多 4 分）。</div></li>' +
          '<li><code>red #((\'a,1) (\'b,2) (\'a,3), \'a) .</code> 的结果？<div class="rubric"><b>思路</b>：# 数的是键为 \'a 的对有几个。<br><b>答</b>：2。<b>评分要点</b>：结果 2 分，过程 2 分。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">四、写模块（10 分）</div>' +
          '<ol start="9"><li>写一个模块，实现「求列表最大值」（列表非空，元素是自然数）。<div class="rubric"><b>思路</b>：套模板 1；非空列表的最小形状是 <code>E | nil</code>。<br><b>答（要点）</b>：<code>op max2 : Nat Nat -&gt; Nat .</code>、<code>op maxl : NnList -&gt; Nat .</code>、<code>eq maxl(E | nil) = E .</code>、<code>eq maxl(E | NL) = max2(E, maxl(NL)) .</code>（NL 是非空列表变量），max2 用 <code>if X &gt; Y then X else Y fi</code> 或两条 ceq 定义。<br><b>评分要点</b>：签名 3 分；基础情形 2 分；递归情形 3 分；max2 2 分。</div></li></ol></div>'
      },
      {
        id: 'EX.s4', title: '模拟卷 B（覆盖 L8–L14）',
        guide: {
          what: '第二套练习，覆盖 Minila 语言处理器和验证部分，包括两道完整的证明题。',
          why: '证明题分值最高，必须完整写过至少一次。',
          how: '证明题先套模板 4 的骨架，再填手算步骤；写完对照评分要点，看过程分拿到多少。',
          pitfalls: ['证明题只写代码不写手算', 'Minila 指令名写成自己编的（要用讲义的 push / load / add / store / jumpOnCond / jump / bjump / quit）']
        },
        html:'<div class="card"><div class="card-t">五、语言处理器（每题 8 分）</div>' +
          '<ol start="10"><li>写出解释器 <code>eval</code> 处理赋值、while 的两条等式，并用文字说明顺序语句 <code>S1 S2</code> 怎么解释。' +
          '<div class="rubric"><b>解题思路</b>：先想「这个语句执行完，环境变成什么」，再对照讲义的函数名写。<br>' +
          '<b>答</b>：<code>eq eval(V := E ;,EV) = evalAssign(V,evalExp(E,EV),EV) .</code>；<code>eq eval(while E {S1},EV) = evalWhile(E,S1,EV) .</code>；' +
          '<code>S1 S2</code>：先用 EV 解释 S1 得到新环境，再用新环境解释 S2，返回第二次的结果，即 <code>eval(S1 S2,EV) = eval(S2,eval(S1,EV))</code>。<br>' +
          '<b>评分要点</b>：函数名 eval / evalExp / evalAssign / evalWhile 写对（各 1 分）；顺序语句的先后关系写对（2 分）；末尾句号（1 分）。</div></li>' +
          '<li>把 <code>y := x + n(1) ;</code> 编译成指令列表。' +
          '<div class="rubric"><b>解题思路</b>：先编译右边的表达式（结果留在栈顶），再加 store；表达式按「先左、再右、最后运算」的顺序。<br>' +
          '<b>答</b>：<code>load(x) | push(1) | add | store(y) | iln</code>（compile 还会在最后加上 <code>quit</code>）。<br>' +
          '<b>评分要点</b>：顺序正确（3 分）；指令名与讲义一致（2 分）；以 iln 结尾（1 分）。</div></li>' +
          '<li><code>jumpOnCond(n)</code>、<code>jump(n)</code>、<code>bjump(n)</code> 的区别？编译 <code>while E {S}</code> 时各在哪里出现？' +
          '<div class="rubric"><b>解题思路</b>：三个都是<b>相对</b>跳转，区别在方向和有没有条件。<br>' +
          '<b>答</b>：<code>jumpOnCond(n)</code> 取出栈顶，非 0 则 pc 前进 n，否则前进 1；<code>jump(n)</code> 无条件前进 n；<code>bjump(n)</code> 无条件后退 n。' +
          'while 编译成：E 的指令（长 len1）、<code>jumpOnCond(2)</code>、<code>jump(len2+2)</code>、S 的指令（长 len2）、<code>bjump(len1+len2+2)</code>。条件为真时跳过 jump 进入循环体；为假时执行 jump 跳出循环；循环体结束后 bjump 回到条件。<br>' +
          '<b>评分要点</b>：三种语义各 1 分；while 布局 3 分；跳转距离 2 分。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">六、证明（20 分）</div>' +
          '<ol start="13"><li>证明 (X + Y) + Z = X + (Y + Z)。要求：说明对谁归纳、写出 base 与 ind 的手算步骤、给出证明分数。' +
          '<div class="rubric"><b>思路</b>：套模板 4。_+_ 按第一个参数递归，所以对 X 归纳。<br>' +
          '<b>答（骨架）</b>：base：<code>(0 + y) + z → y + z</code>，<code>0 + (y + z) → y + z</code>。ind：IH <code>(x + Y) + Z = x + (Y + Z)</code>；<code>(s(x) + y) + z → s(x + y) + z → s((x + y) + z) → s(x + (y + z))</code>；<code>s(x) + (y + z) → s(x + (y + z))</code>。证明分数见 L11 第 3 节。<br>' +
          '<b>评分要点</b>：归纳变量（2 分）；base 手算（4 分）；IH 写对（4 分）；ind 手算并标规则（6 分）；证明分数（4 分）。</div></li>' +
          '<li>证明 rev1(L1) = rev2(L1)。（提示：需要 p-sr2 与 assoc@）' +
          '<div class="rubric"><b>思路</b>：直接归纳会卡在 <code>sr2(l1,nil) @ (e | nil) = sr2(l1, e | nil)</code>，于是先证推广后的引理 p-sr2。<br>' +
          '<b>答</b>：说明依赖顺序 assoc@ → p-sr2 → ctrr；写出 p-sr2 的陈述和它的两个分支；最后 ctrr 的 base 与 ind（用 IH 和 p-sr2）。证明分数见 L12 第 3 节。<br>' +
          '<b>评分要点</b>：指出需要引理并写对 p-sr2（6 分）；ctrr 的 base 和 ind（各 4 分）；引理证明（6 分）。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">七、概念（每题 5 分）</div>' +
          '<ol start="15"><li>解释 <code>:apply (si)</code>、<code>:apply (tc)</code> 与 <code>:apply (rd)</code>，并说明 CITP 相比手写 proof score 的优势。' +
          '<div class="rubric"><b>答</b>：si 对 :ind on 指定的变量做结构归纳，按构造子个数切成子目标，并为非常量构造子引入新常量和 IH；tc 把当前目标里的变量换成新常量；rd 化简当前目标，化成 true 就解除。优势：自动生成新常量和 IH，自动管理子目标，避免常量重用和 IH 写错。<br>' +
          '<b>评分要点</b>：三个命令各 1 分；优势 2 分。</div></li>' +
          '<li>隐形传态为什么不会违反「不可克隆定理」？' +
          '<div class="rubric"><b>答</b>：原态在 Alice 测量时被破坏，Bob 得到的不是副本，而是「移动」过去的同一个态；而且必须等 Alice 的两比特经典通信才能完成修正。<br><b>评分要点</b>：原态被破坏（3 分）；需要经典通信（2 分）。</div></li>' +
          '</ol></div>' +
          cta('EX-quiz1', '模拟卷选择题（10 题，限时 15 分钟）', '综合检验，目标 8 题以上') +
          cta('EX-quiz2', '易错点清单（8 题）', '考前最后一遍')
      },
      {
        id: 'EX.s5', title: '考前 24 小时清单',
        guide: {
          what: '考前最后一天按时间排好的复习安排，以及分数策略。',
          why: '最后一天不适合学新东西，只适合巩固已经会的。',
          how: '照着表格的时间点做，进考场前只默念最后一行。'
        },
        html:'<div class="card exam"><div class="card-t"><span class="ico">⏰</span>按时间排的最后复习</div>' +
          '<table><tr><th>时间</th><th>做什么</th></tr>' +
          '<tr><td>考前 24h</td><td>通读 L11/L12 的两个完整证明，<b>手抄一遍</b>（不要只看）</td></tr>' +
          '<tr><td>考前 12h</td><td>手写三个模块：NATLIST、INF-LIST、MULTISET（不看答案）</td></tr>' +
          '<tr><td>考前 6h</td><td>看「语法速查表」+「8 个易错细节」，做易错点清单测验</td></tr>' +
          '<tr><td>考前 1h</td><td>只看三个模板：证明分数模板、red 结果写法、需要引理时怎么写</td></tr>' +
          '<tr><td>进考场前</td><td>默念：<b>句号！prec！strat: (1 0)！IH 用大写 Y！</b></td></tr></table></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🎯</span>分数策略（100 分怎么拿）</div>' +
          '<ul><li><b>语法题（约 20 分）</b>：必须全拿。会写 <code>{constr}</code>、<code>prec:</code> 就够了。</li>' +
          '<li><b>求值题（约 20 分）</b>：写出中间步骤就有分，别只写答案。</li>' +
          '<li><b>解释题（约 15 分）</b>：用术语（redex / strat / AC 匹配 / 不变量），别说大白话。</li>' +
          '<li><b>写模块（约 20 分）</b>：套模板 1，注意基础情形和递归情形都写。</li>' +
          '<li><b>证明题（约 25 分）</b>：哪怕证不完，把 base case、IH 声明、归纳情形的手算写出来就能拿一半以上。</li></ul>' +
          '<p><b>60 分及格 = 语法 + 求值 + 解释 + 一半证明。</b>所以先把简单题做稳，再攻证明。</p></div>' +
          '<div class="card"><div class="card-t"><span class="ico">🌱</span>最后一句</div>' +
          '<p>这门课的难点不在智商，而在<b>「手熟」</b>。你现在能读懂，还要能<b>闭卷写出来</b>。' +
          '把本文档里每个「▶ 运行」的代码都亲手敲一遍（而不是复制），考试时手就不会抖。</p></div>'
      }
    ],
    quiz: 'EX-quiz1', flash: 'EX-flash'
  });

  QZ['EX-quiz1'] = {
    title: '模拟卷 · 综合选择题',
    items: [
      { q: '下列哪个声明<b>错误</b>？', opts: ['<code>op nil : -&gt; List {constr}</code>', '<code>op _+_ : Nat Nat -&gt; Nat {prec: 33}</code>', '<code>eq X = 0 .</code>', '<code>vars X Y : Nat</code>'], a: 2, why: '等式左边不能是单个变量。',
        optWhy: ['这是正确的构造子声明','这是正确的带优先级的中缀算子声明','正确（是错误的声明）：左边只有一个变量 X，它能匹配任何项，会把一切都换成 0','这是正确的变量声明'] },
      { q: '<code>red (1 | 2 | nil) @ (3 | nil) .</code> 的结果？', opts: ['<code>1|2|3|nil</code>', '<code>3|1|2|nil</code>', '<code>nil</code>', '报错'], a: 0, why: '@ 是连接。',
        optWhy: ['正确：@ 把第二个列表接在第一个后面','@ 不会把后面的列表放到前面','两个列表都不空，结果不会是 nil','这是合法的项，可以化简'] },
      { q: '关于 E-strategy，正确的说法是？', opts: ['它决定等式顺序', '它决定算子的参数归约顺序与试根时机', '它是优先级', '它是排序'], a: 1, why: 'local strategy。',
        optWhy: ['等式的尝试顺序与策略无关','正确','优先级是 prec，决定的是解析时的括号','排序（sort）是类型'] },
      { q: '<code>take(primes,10)</code> 的第 7 个素数是？', opts: ['13', '17', '19', '23'], a: 1, why: '2,3,5,7,11,13,17 → 第 7 个是 17。',
        optWhy: ['13 是第 6 个','正确：2, 3, 5, 7, 11, 13, 17','19 是第 8 个','23 是第 9 个'] },
      { q: '多重集需要哪三个属性？', opts: ['assoc comm id:', 'prec strat constr', 'assoc comm prec', 'constr id: comm'], a: 0, why: '结合、交换、单位元。',
        optWhy: ['正确：结合律（不管括号）、交换律（不管顺序）、单位元 emp','prec、strat 与多重集无关','prec 与多重集无关','多重集的并置算子不是构造子的问题，关键是 assoc'] },
      { q: '解释器中环境的作用是？', opts: ['存指令', '存「变量→值」的映射', '存栈', '存程序计数'], a: 1, why: '表的应用。',
        optWhy: ['指令是虚拟机的概念','正确','栈是虚拟机的概念','程序计数器 pc 是虚拟机的概念'] },
      { q: '编译 <code>if E {S1} else {S2}</code> 时，紧跟在条件后面的指令是？', opts: ['<code>jump(len1+2)</code>', '<code>jumpOnCond(2)</code>', '<code>bjump(2)</code>', '<code>quit</code>'], a: 1, why: '讲义布局：E、jumpOnCond(2)、jump(len1+2)、S1、jump(len2+1)、S2。条件为真跳过下一条 jump，进入 S1。',
        optWhy: ['这条在 jumpOnCond(2) 之后，条件为假时执行，跳到 S2', '正确', 'bjump 只在 while 的末尾出现', 'quit 只在整个程序最后'] },
      { q: '结构归纳的 base case 是？', opts: ['l(s(x)) = r(s(x))', 'l(0) = r(0)', 'l(X) = r(X)', 'l(x) = r(x)'], a: 1, why: '代入最小构造子。',
        optWhy: ['这是归纳情形要证的','正确','这是最终结论','这是归纳假设 IH'] },
      { q: '证明 comm+ 的归纳情形需要哪个引理？', opts: ['<code>X + 0 = X</code>', '<code>X + s(Y) = s(X + Y)</code>', '<code>(X+Y)+Z = X+(Y+Z)</code>', '不需要'], a: 1, why: 'rs+。',
        optWhy: ['rz+ 是基础情形用的','正确','结合律在 comm+ 里用不上','不加引理 y + s(x) 化不动'] },
      { q: '<code>:apply (rd)</code> 之后目标化成 true，说明？', opts: ['程序算错了', '该子目标被解除（discharged）', '需要引理', '要重新 :goal'], a: 1, why: '证完一个分支。',
        optWhy: ['化成 true 是成功','正确','化成 true 说明不缺引理','不需要重新声明'] }
    ]
  };
  QZ['EX-quiz2'] = {
    title: '易错点清单',
    items: [
      { q: '<code>mod! M { ... }</code> 的右花括号后面要加句号吗？', opts: ['要', '不要', '视情况', '要加分号'], a: 1, why: '模块结尾不加句号；但模块内每条 eq/op 都要加。',
        optWhy: ['加了反而是语法错误','正确','规则是固定的','CafeOBJ 不用分号结尾'] },
      { q: '无限列表的 <code>_|_</code> 必须加什么属性？', opts: ['{assoc}', '{strat: (1 0)}', '{comm}', '{prec: 0}'], a: 1, why: '否则 take 发散。',
        optWhy: ['assoc 是结合律，与惰性无关','正确','comm 是交换律，与惰性无关','prec 只影响解析'] },
      { q: '证明分数里 IH 的正确写法？', opts: ['<code>eq (x + y) + z = x + (y + z) .</code>', '<code>eq (x + Y) + Z = x + (Y + Z) .</code>', '<code>eq (X + Y) + Z = X + (Y + Z) .</code>', '<code>red (x + Y) + Z = x + (Y + Z) .</code>'], a: 1, why: '小写新常量 + 大写原变量。',
        optWhy: ['全小写：IH 只对那一组具体值成立','正确','全大写：等于直接假设了结论','IH 要用 eq 加入，red 是检查'] },
      { q: '写 <code>_+_</code> 和 <code>_*_</code> 时如果都不写 prec 会怎样？', opts: ['不能用', '解析优先级相同，可能得到意外的括号结构', '自动正确', '报错'], a: 1, why: '必须给 prec。',
        optWhy: ['可以用，只是解析结果可能不对','正确','不会自动按数学习惯处理','不一定报错，更危险的是悄悄解析错'] },
      { q: '<code>ceq</code> 条件里的变量必须？', opts: ['是新变量', '在左边出现过', '在右边出现过', '声明成 constr'], a: 1, why: '否则无法代入。',
        optWhy: ['条件里不能出现左边没有的新变量','正确：匹配左边时才能确定这些变量的值','右边的变量也必须来自左边','constr 是算子的属性，和变量无关'] },
      { q: '要证的 <code>red</code> 结果是 <code>false</code>，说明？', opts: ['证明正确', '等式不成立或缺少引理', '语法错误', '模块没打开'], a: 1, why: 'false 表示两边化简后不相等。',
        optWhy: ['false 表示没证出来','正确','语法错误会直接报错，不会得到 false','模块没打开会报错'] },
      { q: '同一个算子名声明多次（参数排序不同）叫什么？', opts: ['递归', '重载', '多态', '继承'], a: 1, why: 'overloading，按最小排序选 rank。',
        optWhy: ['递归是函数调用自己','正确','多态通常指参数化（如 LIST(E)），课程里用的术语是重载','继承是面向对象的概念'] },
      { q: '考试时证明题完全证不出来，最该写什么？', opts: ['空着', '写出归纳变量、base case、IH 声明和手算步骤', '抄题目', '写「不会」'], a: 1, why: '过程分占大头。',
        optWhy: ['空着一分都没有','正确','抄题目不得分','写「不会」不得分'] }
    ]
  };
  QZ['EX-flash'] = {
    title: '冲刺闪卡',
    cards: [
      { q: '写模块的 7 行骨架？', a: 'mod! → pr → 排序 → 构造子 → 函数签名 → vars → eq(base, ind)' },
      { q: '三个「必带」属性？', a: '<code>{constr}</code>（构造子）、<code>{prec: n}</code>（+ 和 *）、<code>{strat: (1 0)}</code>（无限列表）' },
      { q: '证明分数的五步？', a: 'open / ops 新常量 / eq IH / red / close' },
      { q: '四个最常考的结论？', a: '①(1 0) 实现惰性（策略里没有 2，尾巴不会被主动计算）②多重集的 update 结果依赖写法顺序，需要 isValid ③eval(S1 S2,EV) 先解释 S1 再用新环境解释 S2 ④结构归纳 base + ind + IH' },
      { q: 'if / while 的编译布局？', a: 'if：E、jumpOnCond(2)、jump(len1+2)、S1、jump(len2+1)、S2。while：E、jumpOnCond(2)、jump(len2+2)、S、bjump(len1+len2+2)。len 用 len(generate(s)) 算。' }
    ]
  };
})();
