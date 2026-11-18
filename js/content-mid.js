/* =====================================================================
 * content-mid.js — L6 ~ L10
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});
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
  function cbStatic(src, cap, notes, id) {
    var nk = id || ('st-' + (window.__ST_SEQ = (window.__ST_SEQ || 0) + 1));
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
   * L6 无限列表
   * ===================================================================== */
  CH.push({
    id: 'L6', num: 'L6', group: '第 2 部分 · 进阶', short: 'L6 无限列表（重点）',
    title: '6. 无限列表（Infinite Lists）',
    sub: '重点章节。核心只有一个：E-strategy。理解 (1 0)，你就理解了「惰性」。',
    minutes: 65,
    goals: [
      '说清为什么默认策略会让 <code>take(primes,10)</code> 发散',
      '会用 <code>{strat: (1 0)}</code> 并解释它每一步在做什么',
      '默写 take / drop / zip / @ 的定义',
      '能写出 sieve 与 hamming 并算出前 10 项'
    ],
    pre: [
      'L3：一个项里可能有多个 redex；重写的顺序会影响步数',
      'L2：列表 <code>E | L</code> 和 take、@ 这类递归函数',
      'P0 实验 ②：「无限滚动」演示了惰性求值的直觉'
    ],
    summary: [
      'E-strategy：<code>{strat: (x1 … xm)}</code> 按顺序处理，数字 j 表示把第 j 个参数算到底，0 表示尝试重写整个项',
      '讲义例子：<code>1st((1 + 1,2 + 2,3 + 3))</code> 用 (1 0) 要 4 步，用 (0 1 0) 只要 2 步',
      '无限列表的 <code>_|_</code> 写 <code>{strat: (1 0)}</code>：策略里没有 2，尾巴不会被主动计算，这就是惰性',
      '用 take 截取有限部分；永远不要直接 red 一个无限列表',
      'primes = sieve(mkNILFrom(2))；ham = 1 | merge(merge(2*ham, 3*ham), 5*ham)',
      'if_then{_}else{_} 的默认策略是 (1 0 2 3)：先算条件，没被选中的分支不算'
    ],
    sections: [
      {
        id: 'L6.s1', title: '问题：无限列表不能「全部算完」',
        guide: {
          what: '无限列表是没有终点的列表，比如「所有自然数」。直接把它算完是不可能的。',
          why: '很多东西天然是无限的：所有素数、所有时刻的传感器数据、一直往下刷的信息流。',
          how: '先理解「为什么普通的计算顺序会卡死」，下一节再看 CafeOBJ 用什么办法解决。',
          use: 'Python 的生成器 <code>itertools.count()</code>、短视频 App 的无限下拉，都是只在需要时才产生下一个。',
          pitfalls: ['以为无限列表在内存里存了无限多个元素：它只存了「怎么算出下一个」']
        },
        html: '<p>有限列表 <code>1 | 2 | 3 | nil</code> 有终点。无限列表 <code>0 | 1 | 2 | …</code> 没有（这里的 <code>…</code> 只是示意写法，CafeOBJ 里不能这样写，实际要用 <code>mkNILFrom(0)</code> 这样的函数来生成）。</p>' +
          '<p>如果引擎的习惯是「先把参数完全算成范式，再算外层」，那么：</p>' +
          '<div class="codebox"><pre>take(0 | 1 | 2 | 3 | ..., 10)\n  → 要算第 2 个参数 0|1|2|… 的范式\n  → 它永远算不完\n  → 卡死</pre></div>' +
          '<p>所以必须有一种机制告诉引擎：<b>「别急着把参数算完，先试试外层的规则」</b>。这个机制就是 <b>E-strategy</b>。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🧠</span>直觉对比</div>' +
          '<table><tr><th>严格（strict）</th><th>惰性（lazy）</th></tr>' +
          '<tr><td>先把所有参数算成值，再算函数</td><td>先看函数能不能用规则化简，需要哪个参数才算哪个</td></tr>' +
          '<tr><td>Java / C 的普通函数调用</td><td>Haskell 的默认行为</td></tr>' +
          '<tr><td>遇到无限列表会发散</td><td>可以处理无限列表</td></tr></table>' +
          '<p>CafeOBJ 用 <b>E-strategy</b> 精确地控制「每个算子的每个参数，什么时候算」。比「惰性/严格」二选一更细。</p></div>'
      },
      {
        id: 'L6.s2', title: 'E-strategy：一个算子一个「计算顺序表」',
        guide: {
          what: 'E-strategy 是给每个算子配的一张「计算顺序表」<code>{strat: (…)}</code>：先算哪个参数、什么时候尝试重写自己。',
          why: '一个项里常常有好几个 redex，先换哪个会影响步数，甚至影响能不能停下来。',
          how: '从左到右读括号里的数字：数字 j 表示「把第 j 个参数算到底」，0 表示「试着重写整个项」。',
          use: 'Python 的 <code>a and b</code>（a 为假就不算 b）、<code>x if c else y</code>（只算选中的那边），就是语言内置的求值策略。',
          pitfalls: ['以为 0 是「第 0 个参数」：它表示整个项自己', '以为没写进括号的参数也会被算：没写的参数不会被主动计算']
        },
        html: '<p>每个算子可以带一个 <b>局部策略（local strategy）</b>，写法是 <code>{strat: (...)}</code>。' +
          '括号里的数字是「第几个参数」，<code>0</code> 是特殊值，表示<b>「试试把整个项重写一步」</b>。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">📐</span>讲义的精确定义（第 7 页）</div>' +
          '<p>给算子 f 的策略是 <code>(x1 … xm)</code>。归约 <code>t = f(a1,…,an)</code> 时，<b>按顺序</b>处理 j = x1, …, xm：</p>' +
          '<ol><li>如果 <code>j = 0</code>：若 t 是 redex，就做一步重写，然后<b>按新项顶层算子的策略</b>继续归约这个新项，并把它的结果作为最终结果返回；</li>' +
          '<li>否则：把 t 的第 j 个参数归约（用同样的方法，递归地）。</li></ol>' +
          '<p>全部处理完还没返回，就把当前的 t 作为结果（这时 t 里可能还留着 redex）。</p></div>' +
          '<table><tr><th>策略</th><th>读法</th><th>讲义里叫</th></tr>' +
          '<tr><td><code>(1 0)</code></td><td>先把第 1 个参数算到底，再尝试重写整个项</td><td>最左最内（left-most inner-most）</td></tr>' +
          '<tr><td><code>(0 1 0)</code></td><td>先尝试重写整个项；不行就和 (1 0) 一样：先算第 1 个参数，再试一次</td><td>最外（outer-most）</td></tr>' +
          '<tr><td><code>(1 2 … n 0)</code></td><td>先把所有参数算完，再试整个项</td><td>普通 n 元算子的默认策略</td></tr></table>' +
          '<p>下一节用讲义的同一个例子，看 <code>(1 0)</code> 和 <code>(0 1 0)</code> 的每一步有什么不同。</p>'
      },
      {
        id: 'L6.s3', title: '亲手对比 (1 0) 与 (0 1 0)',
        guide: {
          what: '用讲义的例子 <code>1st((1 + 1,2 + 2,3 + 3))</code>，对比两种策略的每一步。',
          why: '看到具体步骤，才能真正理解「策略决定先换哪一块」。',
          how: '先读下面的两段手算，再点运行，对照系统给出的步数；最后看无限列表为什么要用 (1 0)。',
          use: '同样的选择出现在所有语言里：参数先算（严格）还是用到再算（惰性）。',
          pitfalls: ['以为两种策略结果不同：这个例子里结果都是 2，只是步数不同（4 步 vs 2 步）', '以为 (1 0) 会算 _|_ 的尾巴：策略里没有 2，尾巴不会被主动计算']
        },
        html: '<p>讲义第 3–5 页的例子：<code>1st</code> 取三元组的第一个分量，<code>eq 1st((FE,SE,TE)) = FE .</code>。现在要化简 <code>1st((1 + 1,2 + 2,3 + 3))</code>，里面有 4 个 redex（三个加法和 1st 自己）。</p>' +
          '<div class="cols"><div class="card"><div class="card-t">策略 (1 0)：模块 NAT-TRIPLE-IMLM</div>' +
          '<div class="codebox"><pre>1st((1 + 1,2 + 2,3 + 3))\n→ 1st((2,2 + 2,3 + 3))    by (+)\n→ 1st((2,4,3 + 3))        by (+)\n→ 1st((2,4,6))            by (+)\n→ 2                       by (1st)</pre></div>' +
          '<p>先把第 1 个参数（三元组）算到底，三个加法全算了，最后才用 1st。共 <b>4 步</b>。</p></div>' +
          '<div class="card"><div class="card-t">策略 (0 1 0)：模块 NAT-TRIPLE-OMLM</div>' +
          '<div class="codebox"><pre>1st((1 + 1,2 + 2,3 + 3))\n→ 1 + 1                   by (1st)\n→ 2                       by (+)</pre></div>' +
          '<p>先试整个项：它已经能和 1st 的左边对上，直接取出第一个分量。<code>2 + 2</code>、<code>3 + 3</code> 根本没算。共 <b>2 步</b>。</p></div></div>' +
          cb('w-l6-tri', 'open NAT-TRIPLE-IMLM .\nred 1st((1 + 1,2 + 2,3 + 3)) .\nclose\nopen NAT-TRIPLE-OMLM .\nred 1st((1 + 1,2 + 2,3 + 3)) .\nclose', '运行看步数：(1 0) 用 4 步，(0 1 0) 用 2 步', {
            'open NAT-TRIPLE-IMLM .': '这个模块里 1st 的策略是 (1 0)。',
            'red 1st((1 + 1,2 + 2,3 + 3)) .': '化简同一个项。结果都是 2，看输出里的步数。',
            'close': '退出试算。',
            'open NAT-TRIPLE-OMLM .': '这个模块里 1st 的策略是 (0 1 0)。'
          }) +
          '<div class="card tip"><div class="card-t"><span class="ico">🔑</span>回到无限列表：惰性从哪里来</div>' +
          '<p>讲义给无限列表的 <code>_|_</code> 写的是 <code>{strat: (1 0)}</code>。<code>_|_</code> 有两个参数：头和尾巴。' +
          '策略里只有 1 和 0，<b>没有 2</b>，所以第 2 个参数（尾巴）<b>永远不会被主动计算</b>，只有等某个等式（比如 take）需要它的时候，它才会作为别的 redex 被算到。<b>惰性正是来自「策略里不写 2」</b>。</p>' +
          '<p>如果用默认策略 <code>(1 2 0)</code>，归约 <code>0 | mkNILFrom(1)</code> 时会先把尾巴 <code>mkNILFrom(1)</code> 算到底，而它是无限长的，于是永远停不下来。</p></div>' +
          '<p>下面的对比器在无限列表上演示同一件事：</p>' +
          '<div class="widget" id="w-l6-strat"></div>' +
          '<h3 class="sub">默认策略是什么</h3>' +
          '<table><tr><th>情况</th><th>默认策略</th></tr>' +
          '<tr><td>普通 n 元算子 <code>f</code></td><td><code>(1 2 … n 0)</code>，即先算所有参数再试根</td></tr>' +
          '<tr><td><code>if_then{_}else{_}</code></td><td><code>(1 0 2 3)</code>，先算条件，然后<b>只算被选中的分支</b></td></tr>' +
          '<tr><td><code>comm</code> 的二元算子</td><td><code>(1 0 2)</code></td></tr></table>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>为什么 if 的策略这么特别</div>' +
          '<p>因为 <code>if</code> 必须<b>短路</b>：<code>if true then {A} else {B}</code> 里如果先把 A、B 都算成范式，' +
          '那么当 B 是「无限循环」或「非法运算」时就会出事。<code>(1 0 2 3)</code> 表示先算条件(1)，试根(0)，' +
          '再算被选中的分支(2)，最后收尾(3)。<b>没被选中的分支永远不算</b>。</p></div>'
      },
      {
        id: 'L6.s4', title: 'take / drop / zip / @',
        guide: {
          what: '无限列表的四个基本操作：取前 n 个（take）、丢掉前 n 个（drop）、交错合并（zip）、有限列表接无限列表（@）。',
          why: '无限列表不能直接打印，要靠这些函数取出有限的一部分来看。',
          how: '每个函数都按「列表的头 | 尾」来写；take 的第二个参数用 0 和 NzNat 两种情形区分。',
          use: 'Python 的 <code>itertools.islice</code>（相当于 take）、<code>zip</code>。',
          pitfalls: ['直接 red drop(…) 或 mkNILFrom(…)：结果是无限列表，算不完', 'take 的第二条等式写成 Nat：会和第一条的 0 重叠']
        },
        html: '<p>这四个函数是无限列表的基本操作。定义和有限列表几乎一样，只是结果类型不同：</p>' +
          '<div class="codebox"><pre>eq take(IL,0) = nil .\neq take(X | IL,NzN) = X | take(IL,p NzN) .\neq drop(IL,0) = IL .\neq drop(X | IL,NzN) = drop(IL,p NzN) .\neq nil @ IL = IL .\neq (X | L) @ IL = X | (L @ IL) .\neq zip(X | IL,Y | IL2) = X | Y | zip(IL,IL2) .</pre></div>' +
          '<div class="widget" id="w-l6-take"></div>' +
          '<p>注意 <code>take</code> 的第二个参数类型是 <code>Nat</code>（第一条）和 <code>NzNat</code>（第二条）—— 又是<b>用排序做分情形</b>，' +
          '而不是写 <code>if</code>。这样两条规则互不重叠，重写更高效。</p>' +
          cb('w-l6-1', 'open NAT-INF-LIST .\nred take(mkNILFrom(0),5) .\nred take(mkNILFrom(10),3) .\nred take(drop(mkNILFrom(0),4),3) .\nclose', 'mkNILFrom：造一个无限列表', {
            'open NAT-INF-LIST .': '打开自然数无限列表模块（讲义第 13 页），里面有 mkNILFrom。',
            'red take(mkNILFrom(0),5) .': 'mkNILFrom(0) 是 0 | 1 | 2 | …；取前 5 个得到 0 | 1 | 2 | 3 | 4 | nil。',
            'red take(mkNILFrom(10),3) .': '从 10 开始取 3 个：10 | 11 | 12 | nil。',
            'red take(drop(mkNILFrom(0),4),3) .': '先丢掉前 4 个，再取 3 个：4 | 5 | 6 | nil。',
            'close': '退出试算。'
          }) +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>小心：drop 的结果还是无限列表</div>' +
          '<p><code>red drop(mkNILFrom(0),4)</code> 会打印出一个「无限长」的项，然后被引擎截断。' +
          '所以<b>永远不要直接 red 一个无限列表</b>，一定要套 <code>take</code>。</p></div>'
      },
      {
        id: 'L6.s5', title: '埃拉托斯特尼筛法：用无限列表求素数',
        guide: {
          what: '用无限列表实现两千年前的求素数方法：取出第一个数，划掉它的倍数，对剩下的重复。',
          why: '这是展示惰性求值威力的经典例子：定义的是「所有素数」，用多少算多少。',
          how: '先看动画理解算法，再读四条等式，最后运行 take(primes,10)。',
          use: '函数式语言教材（如 Haskell）里都有这个例子；实际的素数表生成也用筛法。',
          pitfalls: ['以为 sieve 会先把所有倍数都划掉：它只在 take 需要下一个数时才继续筛']
        },
        html: '<p>算法思想（两千年前就有了）：</p>' +
          '<ol><li>把所有 ≥2 的数排成无限列表 <code>2 3 4 5 6 7 …</code></li>' +
          '<li>取第一个数 p（它是素数），把它的所有倍数筛掉</li>' +
          '<li>对剩下的列表重复第 2 步</li></ol>' +
          '<div class="codebox"><pre>eq primes = sieve(mkNILFrom(2)) .\neq sieve(X | IL) = X | sieve(check(X,IL)) .\neq check(0,IL) = IL .\neq check(NzX,Y | IL) =\n     if NzX divides Y then {check(NzX,IL)} else {Y | check(NzX,IL)} .</pre></div>' +
          '<div class="widget" id="w-l6-sieve"></div>' +
          cb('w-l6-2', 'open ERATOSTHENES-SIEVE .\nred take(primes,10) .\nred take(primes,20) .\nclose', 'primes：前 10 / 20 个素数', {
            'open ERATOSTHENES-SIEVE .': '打开筛法模块。',
            'red take(primes,10) .': '前 10 个素数。注意看步数：只算了需要的部分。',
            'red take(primes,20) .': '前 20 个素数，步数明显变多，但仍然有限。',
            'close': '退出试算。'
          }) +
          '<p>你会看到 <code>2 | 3 | 5 | 7 | 11 | 13 | 17 | 19 | 23 | 29</code>。' +
          '这个定义<b>没有用任何循环</b>，纯靠递归 + 重写，这就是函数式的优雅之处。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">⚙️</span>为什么它能停下来</div>' +
          '<p>因为 <code>take</code> 只要 10 个元素。每次 <code>sieve</code> 只算到「够 10 个」就停，' +
          '后面的 <code>check</code> 永远不会被逼着算。这就是惰性求值的实际效果 —— 但注意，它靠的是 <code>_|_</code> 上的 <code>{strat:(1 0)}</code>；' +
          '如果去掉那个策略，<code>sieve</code> 会试图把整个无限列表算完，直接发散。</p></div>'
      },
      {
        id: 'L6.s6', title: 'Hamming 数：三个无限列表的归并',
        guide: {
          what: 'Hamming 数是只含素因子 2、3、5 的数。它的序列可以写成「自己乘 2、乘 3、乘 5 再归并」。',
          why: '这是一个引用自己的定义，只有在惰性求值下才能工作，很能体现无限列表的思维方式。',
          how: '重点看 merge 的三个分支，尤其是「相等时只取一个」。',
          pitfalls: ['merge 相等时两个都保留：结果会出现重复的数']
        },
        html: '<p><b>Hamming 数</b>（也叫 5-smooth 数）：只含素因子 2、3、5 的正整数，从小到大：</p>' +
          '<div class="codebox"><pre>1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30, ...</pre></div>' +
          '<p>关键洞察：<b>Hamming 数序列 ham 满足</b></p>' +
          '<div class="codebox"><pre>ham = 1 | merge( merge(2*ham, 3*ham), 5*ham )</pre></div>' +
          '<p>也就是「自己乘 2、乘 3、乘 5 之后归并，再在前面加个 1」。这是一个<b>自我引用</b>的定义，' +
          '只有在惰性求值下才成立（否则你要求 ham 就必须先求 ham）。</p>' +
          '<div class="codebox"><pre>eq 2*(X | IL) = 2 * X | 2*(IL) .\neq 3*(X | IL) = 3 * X | 3*(IL) .\neq 5*(X | IL) = 5 * X | 5*(IL) .\neq merge(X | IL,Y | IL2) =\n     if X &lt; Y then {X | merge(IL,Y | IL2)}\n     else {if Y &lt; X then {Y | merge(X | IL,IL2)}\n           else {X | merge(IL,IL2)}} .</pre></div>' +
          '<div class="widget" id="w-l6-ham"></div>' +
          cb('w-l6-3', 'open HAMMING .\nred take(ham,10) .\nred take(ham,15) .\nclose', 'ham：前 10 / 15 个 Hamming 数', {
            'open HAMMING .': '打开 Hamming 模块。',
            'red take(ham,10) .': '前 10 个：1 2 3 4 5 6 8 9 10 12。',
            'red take(ham,15) .': '前 15 个，多了 15 16 18 20 24。',
            'close': '退出试算。'
          }) +
          '<p>注意 <code>merge</code> 的三个分支：<code>X &lt; Y</code> 取 X、<code>Y &lt; X</code> 取 Y、' +
          '相等时<b>只取一个</b>（<code>X | merge(IL,IL2)</code> 把两个都扔掉了 —— 因为相等说明重复）。' +
          '这个「相等只取一个」是去重的关键，考试常考。</p>' +
          cta('L6-quiz1', '随堂小测 · 策略与无限列表') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L6 必背</div>' +
          '<ul><li><code>op _|_ : Elt.E InfList -&gt; InfList {strat: (1 0)} .</code>（讲义写法）—— 那一行里的 <code>(1 0)</code> 就是本章的命门</li>' +
          '<li>take / drop / zip / @ 的五条等式</li>' +
          '<li><code>primes = sieve(mkNILFrom(2))</code></li>' +
          '<li><code>ham = 1 | merge(merge(2*ham,3*ham),5*ham)</code></li>' +
          '<li>if 的默认策略是 <code>(1 0 2 3)</code>（短路）</li></ul></div>'
      }
    ],
    quiz: 'L6-quiz', flash: 'L6-flash'
  });

  QZ['L6-quiz1'] = {
    title: '随堂小测 · 无限列表',
    items: [
      { q: '热身：<code>take(mkNILFrom(0),3)</code> 的结果是？', opts: ['0 | 1 | 2 | nil', '1 | 2 | 3 | nil', '0 | 1 | 2 | 3 | nil', '算不完'], a: 0, why: 'mkNILFrom(0) 是 0 | 1 | 2 | …，取前 3 个。',
        optWhy: ['正确', '是从 0 开始，不是从 1', '只取 3 个', 'take 只要前 3 个，能算完'] },
      { q: '如果 <code>_|_ : Nat InfList -&gt; InfList</code> 不加 <code>{strat: (1 0)}</code>，<code>red take(primes,10)</code> 会怎样？', opts: ['正常得到 10 个素数', '发散（算不完）', '报排序错误', '返回 nil'], a: 1, why: '默认策略要求先把第 2 个参数（无限尾巴）算成范式，永远算不完。',
        optWhy: ['默认策略会去算无限长的尾巴', '正确', '排序没有问题，问题在计算顺序', '不会返回 nil'] },
      { q: '<code>(1 0 2 3)</code> 中 <code>0</code> 表示？', opts: ['参数 0（不存在）', '试试根节点自己能不能用规则重写', '停机', '第 0 层'], a: 1, why: '0 是特殊标记：把整个项当作 redex 试一次。',
        optWhy: ['参数从 1 开始编号，没有「参数 0」', '正确', '0 不表示停机', '和层数无关'] },
      { q: '<code>eq take(X | IL,NzN) = X | take(IL,p NzN) .</code> 里第二个参数为什么用 NzNat？', opts: ['为了快', '用排序做分情形，与 <code>take(IL,0)=nil</code> 互斥，避免用 if', '因为 0 不是自然数', '笔误'], a: 1, why: 'NzNat 排除了 0，两条等式自然覆盖所有情形。',
        optWhy: ['速度不是主要原因', '正确', '0 是自然数，只是不是 NzNat', '不是笔误，是有意为之'] },
      { q: 'Hamming 数的 merge 里，当 <code>X == Y</code> 时为什么要写成 <code>X | merge(IL,IL2)</code>？', opts: ['为了快', '因为 X 和 Y 相等说明重复，只保留一个并同时丢掉两个', '为了排序', '会死循环'], a: 1, why: '去重：相等时两边各前进一个。',
        optWhy: ['和速度无关', '正确', '两个列表本来就有序，不需要再排序', '不会死循环'] }
    ]
  };
  QZ['L6-quiz'] = {
    title: 'L6 综合测验',
    items: [
      { q: '热身：讲义里 <code>1st((1 + 1,2 + 2,3 + 3))</code> 用策略 (0 1 0) 要几步？', opts: ['1 步', '2 步', '4 步', '算不完'], a: 1, why: '先用 1st 直接取出 1 + 1，再算出 2。',
        optWhy: ['取出 1 + 1 之后还要再算一步', '正确', '4 步是策略 (1 0) 的步数', '能算完，结果是 2'] },
      { q: 'E-strategy 的作用是？', opts: ['决定等式用哪条', '决定算子的参数按什么顺序归约、何时试根', '决定排序', '决定优先级'], a: 1, why: '精确控制每个算子的计算顺序，从而实现惰性。',
        optWhy: ['等式按声明顺序尝试，和策略无关', '正确', '排序是类型', '优先级是 prec，影响的是解析'] },
      { q: '<code>red take(primes,10)</code> 的第 10 个素数是？', opts: ['23', '29', '31', '19'], a: 1, why: '2,3,5,7,11,13,17,19,23,29。',
        optWhy: ['23 是第 9 个', '正确', '31 是第 11 个', '19 是第 8 个'] },
      { q: '为什么不能直接 <code>red mkNILFrom(0)</code>？', opts: ['会报错', '无限列表永远算不完，必须用 take 截断', '语法错误', '会返回 nil'], a: 1, why: '一定要 take。',
        optWhy: ['不会报错，而是一直算下去', '正确', '语法没有问题', '不会返回 nil'] },
      { q: '<code>zip</code> 的作用是？', opts: ['排序', '把两个无限列表交错合并成一个', '去重', '求长度'], a: 1, why: '<code>zip(1|2|…,100|101|…) = 1|100|2|101|…</code>',
        optWhy: ['zip 不排序', '正确', 'zip 不去重', '无限列表没有长度'] }
    ]
  };
  QZ['L6-flash'] = {
    title: 'L6 闪卡',
    cards: [
      { q: '无限列表的关键属性？', a: '讲义写法：<code>op _|_ : Elt.E InfList -&gt; InfList {strat: (1 0)} .</code>（本系统内置模块额外加了 constr 和 prec: 40，考试按讲义写）' },
      { q: 'take 的两个等式？', a: '<code>eq take(IL,0) = nil .</code> / <code>eq take(X | IL,NzN) = X | take(IL,p NzN) .</code>' },
      { q: 'sieve 的两个核心等式？', a: '<code>eq primes = sieve(mkNILFrom(2)) .</code> / <code>eq sieve(X | IL) = X | sieve(check(X,IL)) .</code>' },
      { q: 'ham 的定义？', a: '<code>eq ham = 1 | merge(merge(2*(ham),3*(ham)),5*(ham)) .</code>' },
      { q: 'if 的默认策略？', a: '<code>(1 0 2 3)</code> —— 短路，没被选中的分支不算。' }
    ]
  };

  /* =====================================================================
   * L7 多重集
   * ===================================================================== */
  CH.push({
    id: 'L7', num: 'L7', group: '第 2 部分 · 进阶', short: 'L7 多重集（重点）',
    title: '7. 多重集（Multisets）',
    sub: '重点章节。assoc + comm + id 让「顺序无关、可重复」变成重写的自动行为，而 AC 匹配的多解性会产生 bug。',
    minutes: 70,
    goals: [
      '写出多重集模块并解释三个属性的作用',
      '说清 AC 匹配「可能多解」为什么会导致 update 出错',
      '能用 isValid 条件修复，并解释修复原理',
      '会手算 lecture 里 TEST / TEST2 的关键用例结果',
      '看懂用多重集表示 Mutex 协议状态的那套写法'
    ],
    pre: [
      'L2：排序与列表 <code>E | L</code> 的递归定义方式（多重集也要这样定义）',
      'L3：AC 匹配 —— <code>assoc</code> / <code>comm</code> / <code>id:</code> 到底是什么，为什么它可能匹配出多个解',
      'L5：表的「键互不相同」不变量；L7 要把这个想法搬到多重集上，并用 <code>isValid</code> 写出来',
      '一点耐心：这一章的 bug 是靠「同一个多重集两种写法结果不同」暴露的，需要你愿意逐步手算'
    ],
    summary: [
      '多重集 = <b>无序 + 可重复</b>，用 <code>op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}</code> 表达',
      '交换律<b>不要</b>写成等式（<code>eq X Y = Y X</code> 会死循环），要写成算子的属性，交给匹配器处理',
      'AC 匹配可能多解：模式 <code>(I,N) MS</code> 里的 <code>(I,N)</code> 可以是多重集中任意一个元素',
      '天真的 update 只在「键唯一」时才对；同一个多重集写成不同顺序，可能替换掉不同的元素',
      '修复 = 用 <code>isValid</code> 把「输入合法」写进条件等式的 <code>if</code> 里，让匹配的唯一性由条件保证',
      '结果不确定 = 重写系统不合流 = 后续所有证明失效，所以必须从定义上修，而不是绕过去',
      '同一个思路可以推到并发协议：状态 = 可观察分量的多重集，<code>#</code> 数线程、<code>#cs</code> 数临界区'
    ],
    sections: [
      {
        id: 'L7.s1', title: '多重集是什么：没有顺序、允许重复',
        guide: {
          what: '多重集（multiset）就是「一堆东西」：不看顺序、可以重复。列表看顺序，集合不允许重复。',
          why: '很多真实数据本来就没有顺序，也不该有顺序（购物车、库存、投票）。用列表表示会凭空造出一个「顺序」，让函数既复杂又容易错。',
          how: '用一个二元算子 <code>__</code> 表示「把两堆拼在一起」，给它 <code>assoc</code>、<code>comm</code>、<code>id: emp</code> 三个属性，多重集就自动获得了「无序、可重复、空单元消失」。',
          use: 'Python 的 <code>collections.Counter</code>、数据库里的多值字段、计票系统：都是「只看有几次、不看第几个」。',
          pitfalls: ['以为顺序不同就是不同的多重集：<code>comm</code> 让 <code>1 2</code> 和 <code>2 1</code> 在重写意义上是同一个项', '用 <code>eq X Y = Y X</code> 表达交换律：换了又换回来，永远不停，必须用算子属性']
        },
        html: '<table><tr><th>结构</th><th>有序？</th><th>可重复？</th></tr>' +
          '<tr><td>列表 list</td><td>是</td><td>是</td></tr>' +
          '<tr><td>集合 set</td><td>否</td><td>否</td></tr>' +
          '<tr><td><b>多重集 multiset</b></td><td><b>否</b></td><td><b>是</b></td></tr></table>' +
          '<p>所以 <code>1 2 3</code>、<code>3 1 2</code>、<code>2 3 1</code> 是同一个多重集；<code>1 1 2</code> 里 1 出现两次。</p>' +
          '<h3 class="sub">怎么用 CafeOBJ 表达</h3>' +
          '<div class="codebox"><pre>mod! MULTISET-NAT {\n  pr(NAT)\n  [Nat &lt; MSet]\n  op emp : -&gt; MSet {constr}\n  op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}\n}</pre></div>' +
          '<p>关键在 <code>op __</code> 的属性：</p>' +
          '<table><tr><th>属性</th><th>含义</th><th>于是</th></tr>' +
          '<tr><td><code>assoc</code></td><td>结合律</td><td><code>(1 2) 3</code> = <code>1 (2 3)</code>，括号没意义</td></tr>' +
          '<tr><td><code>comm</code></td><td>交换律</td><td><code>1 2</code> = <code>2 1</code>，顺序没意义</td></tr>' +
          '<tr><td><code>id: emp</code></td><td>单位元</td><td><code>1 emp</code> = <code>1</code>，空单元自动消失</td></tr></table>' +
          '<div class="card why"><div class="card-t"><span class="ico">✨</span>为什么要用属性而不是写等式</div>' +
          '<p>你也可以写 <code>eq X Y = Y X .</code> 来表达交换律 —— <b>但那会导致无限循环</b>（换了又换回来）。' +
          '把交换律作为<b>算子的属性</b>交给匹配器处理，就不会产生重写循环。这是 CafeOBJ 的一个重要设计。</p></div>' +
          cb('w-l7-1', 'open MULTISET-NAT .\nred 1 2 == 2 1 .\nred 1 2 3 == 3 1 2 .\nred 1 1 2 == 1 2 1 .\nred emp 5 emp 7 emp .\nred emp emp .\nred (3 4) 5 == 3 (4 5) .\nclose', '多重集：交换/结合/单位元') +
          '<p><code>emp 5 emp 7 emp</code> 会化简成 <code>5 7</code>（或 <code>7 5</code>，两者等价）。' +
          '<code>emp emp</code> 化简成 <code>emp</code>。</p>'
      },
      {
        id: 'L7.s2', title: '在多重集上写函数：计数 #',
        guide: {
          what: '在多重集上数「键 <code>I</code> 出现了几次」，写成函数 <code>#</code>。',
          why: '下一步的 <code>isValid</code> 要靠它判断「有没有重复的键」，所以它是修复 bug 的工具。',
          how: '从多重集里拿一个元素：键等于目标就 <code>1 +</code>，否则不加，然后递归处理剩下的；空多重集返回 0。',
          use: '统计词频、计票、库存数量，都是「同一个值出现几次」。',
          pitfalls: ['以为「拿到的那个」一定是第一个：<code>comm</code> 下它可以是任意一个，只是 <code>#</code> 的结果与选谁无关', '漏掉 <code>#(emp,J) = 0</code> 这个基础情形，递归停不下来']
        },
        html: '<p>「X 在多重集里出现几次」这个函数怎么写？靠 AC 匹配：</p>' +
          '<div class="codebox"><pre>op # : MSet Qid -&gt; Nat .\neq #(emp,J) = 0 .\neq #((I,N) MS,J) = if I == J then {1 + #(MS,J)} else {#(MS,J)} .</pre></div>' +
          '<p>读法：从多重集里<b>随便拿一个元素</b> <code>(I,N)</code>，剩下的叫 <code>MS</code>；' +
          '如果它的键等于 J，就 1+，否则不加；然后递归处理 <code>MS</code>。</p>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>注意「随便拿一个」</div>' +
          '<p>因为 comm，模式 <code>(I,N) MS</code> 匹配 <code>(a,1) (b,2) (c,3)</code> 时，' +
          '<code>(I,N)</code> 可以是其中<b>任意一个</b>，<code>MS</code> 是剩下的。匹配器会选一个解（通常是第一个），' +
          '由于最终要遍历所有元素，<b>选哪个都不影响 # 的结果</b>。</p>' +
          '<p>但下一节的 <code>update</code> 就没这么幸运了。</p></div>' +
          cb('w-l7-2', 'open TEST2 .\nred #((\u0027a,1) (\u0027b,2) (\u0027a,3), \u0027a) .\nred #((\u0027a,1) (\u0027b,2), \u0027c) .\nred isValid((\u0027a,1) (\u0027b,2)) .\nred isValid((\u0027a,1) (\u0027a,2)) .\nclose', '# 与 isValid') +
          '<p><code>isValid</code> 检查的「不变量」是：<b>同一个键最多出现一次</b>。' +
          '这就是第 5 章「表的键互不相同」在多重集上的对应。</p>'
      },
      {
        id: 'L7.s3', title: '核心 bug：update 在多重集上为什么会错',
        guide: {
          what: '在多重集上写「按键更新」函数 update，会得到一个<b>不确定</b>的结果。',
          why: '这是整章的核心：结果不确定，等于同一个项有两个范式，重写系统的数学意义就没了，后面第 11–14 章的证明全部不成立。',
          how: '看讲义第 7 页那两个 <code>red</code>：同一个多重集的两种写法，结果不同。再想清楚为什么（匹配器挑了不同的元素）。',
          use: '所有「按键更新」的结构（字典、库存、配置表）都依赖「键唯一」这条不变量；不检查它就等着出诡异 bug。',
          pitfalls: ['以为只是输出顺序不同：实际被替换掉的<b>元素都不一样</b>', '以为本系统能复现这个 bug：本系统会先排序再匹配，现象被藏起来了，考试仍以讲义输出为准']
        },
        html: '<p>先看「天真」的写法：</p>' +
          '<div class="codebox"><pre>eq update(emp,J,N2) = emp .\neq update((I,N) MS,J,N2) =\n     if I == J then {(I,N2) MS} else {(I,N) update(MS,J,N2)} .</pre></div>' +
          '<p>看起来没问题：找到键就替换，否则继续找。但在<b>多重集</b>上它会出错。原因有两层：</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">💣</span>第一层：AC 匹配是「猜」的</div>' +
          '<p>模式 <code>(I,N) MS</code> 匹配 <code>(a,1) (b,2) (a,3)</code> 时，匹配器可能挑 <code>(a,1)</code> 当 <code>(I,N)</code>，' +
          '也可能挑 <code>(a,3)</code>。如果目标是 update 键 a，<b>挑第一个就直接替换、返回</b>，' +
          '此时 <code>MS</code> 里还留着 <code>(a,3)</code> —— 结果里 a 出现了<b>两次</b>。</p></div>' +
          '<div class="card exam"><div class="card-t"><span class="ico">💣</span>第二层：缺少不变量检查</div>' +
          '<p>「替换后就返回」这个行为，只有在<b>保证键唯一</b>的前提下才正确。' +
          '如果输入本身就违反不变量（键重复），那么无论怎么替换，结果都可能不对。</p></div>' +
          '<p><b>讲义第 7 页的实际现象</b>（官方 CafeOBJ 的输出）：</p>' +
          '<div class="codebox"><pre>red update((\'a,1) (\'b,2) (\'a,3),\'a,99) .   →  (\'b , 2) (\'a , 3) (\'a , 99)\nred update((\'a,3) (\'b,2) (\'a,1),\'a,99) .   →  (\'b , 2) (\'a , 1) (\'a , 99)</pre></div>' +
          '<p><code>(\'a,1) (\'b,2) (\'a,3)</code> 和 <code>(\'a,3) (\'b,2) (\'a,1)</code> 是<b>同一个多重集</b>（只是写的顺序不同），' +
          '但 update 的结果却不一样：第一次改的是 <code>(\'a,1)</code>，第二次改的是 <code>(\'a,3)</code>。' +
          '<b>同一个多重集写成不同顺序，结果就不同</b> —— 说明这个 update 的定义有问题。</p>' +
          '<div class="card warn"><div class="card-t"><span class="ico">ℹ️</span>本系统的引擎看不到这个现象</div>' +
          '<p>本系统的引擎会先把多重集里的元素排成固定顺序再匹配，所以这两种写法在引擎里总是得到同一个结果，bug 被「藏」起来了。' +
          '考试和理解都以讲义的输出为准：官方 CafeOBJ 按写法顺序匹配，就会出现上面两个不同的结果。</p></div>' +
          '<div class="card why"><div class="card-t"><span class="ico">🔬</span>为什么「结果不确定」这么严重</div>' +
          '<p>因为整个课程建立在「重写系统 == 数学等式」的基础上：如果同一个项能归约到两个不同的范式，' +
          '那么这个系统就<b>不合流（not confluent）</b>，你也就无法用它做任何证明（第 11–13 章全部失效）。</p>' +
          '<p>所以这个 bug 不是「实现细节」，而是<b>理论问题</b>。修复方式也必须从理论上修。</p></div>'
      },
      {
        id: 'L7.s4', title: '修复：用 isValid 加条件，把「猜」变成「确定」',
        guide: {
          what: '用条件等式（<code>ceq ... if ...</code>）把「输入必须合法」写进规则里。',
          why: '只要输入合法（每个键最多出现一次），「匹配到哪个元素」就唯一了，多解性自然消失。',
          how: '先写 <code>isValid</code> 检查不变量；再用两条 <code>ceq</code>：合法且命中就替换，不合法或没命中就原样返回。',
          use: '就是防御式编程：先检查前置条件，再执行操作；条件不满足就原样返回，而不是让程序处于未定义状态。',
          pitfalls: ['把条件写成右边的 <code>if</code>：那是普通条件表达式，这里要用 <code>ceq ... if ...</code> 的<b>条件等式</b>', '漏掉「非法输入」那一支，结果会变成某个不确定的项']
        },
        html: '<p>修复思路：<b>只在输入合法（键唯一）时才允许替换</b>，否则返回原样（或错误）。</p>' +
          '<div class="codebox"><pre>op isValid : MSet -&gt; Bool .\neq isValid(emp) = true .\neq isValid((I,N) MS) = if #(MS,I) &gt; 0 then {false} else {isValid(MS)} .\n\nceq update((I,N) MS,I,N2) = (I,N2) MS if isValid((I,N) MS) .\nceq update(MS,J,N2) = MS if (not isValid(MS)) or #(MS,J) == 0 .</pre></div>' +
          '<p>两条条件等式，覆盖所有情况：</p>' +
          '<table><tr><th>情形</th><th>条件</th><th>结果</th></tr>' +
          '<tr><td>键命中且输入合法</td><td><code>isValid((I,N) MS)</code></td><td>替换成 <code>(I,N2) MS</code></td></tr>' +
          '<tr><td>输入非法 或 键不存在</td><td><code>not isValid(MS) or #(MS,J)==0</code></td><td>返回 <code>MS</code> 不变</td></tr></table>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔑</span>为什么这样就确定了</div>' +
          '<p>因为第一条 <code>ceq</code> 的<b>条件里出现了 <code>isValid((I,N) MS)</code></b>，' +
          '它会检查「整个输入里有没有重复键」。一旦输入合法，' +
          '「挑哪个元素做 <code>(I,N)</code>」就<b>只有一个可能</b>（因为匹配对象里没有两个同键元素），' +
          '所以 AC 匹配的多解性被消除了。</p>' +
          '<p>这是本课最精彩的一处：<b>用一个条件把「不确定的匹配」变成「确定的匹配」</b>。</p></div>' +
          cb('w-l7-3', 'open TEST2 .\nred update((\u0027a,1) (\u0027b,2),\u0027a,9) .\nred update((\u0027a,1) (\u0027a,2),\u0027a,9) .\nred update((\u0027a,1) (\u0027b,2),\u0027c,9) .\nred update(emp,\u0027a,9) .\nclose', '修复后的 update') +
          '<p>预期：第 1 个正确替换、第 2 个（非法输入）保持原样、第 3 个（键不存在）保持原样、第 4 个是 <code>emp</code>。</p>'
      },
      {
        id: 'L7.s5', title: '用例：自己核对一遍',
        guide: {
          what: '用一组用例把「修复前」和「修复后」的行为对照跑一遍。',
          why: '考试常直接给输入让你写结果；手算过一遍，考场上才不会犹豫。',
          how: '先在讲义第 7 页看 TEST（天真版）的两个结果，再到第 13 页看 TEST2（修复版）的五个结果，最后自己跑下面这 8 个用例。',
          use: '就是单元测试的思路：正常输入、边界输入、非法输入三类都要覆盖。',
          pitfalls: ['以为「键不存在」会返回 <code>emp</code>：<code>emp</code> 是单位元，结果其实是<b>原样</b>（这一点很容易记反）', '以为修复后遇到非法输入会报错：讲义的写法是<b>原样返回</b>，不报错']
        },
        html: '<p>讲义第 7 页（天真版 TEST）的两个结果，是整章的引爆点：<b>同一个多重集的两种写法，结果不同</b>。第 13 页（修复版 TEST2）的五个结果则完全稳定。下面把这五个，再补上三个边界用例，一共 8 个，一次跑完对答案：</p>' +
          cb('w-l7-4', 'open TEST .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027a,9) .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027b,9) .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027c,9) .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027d,9) .\nred update((\u0027a,1) (\u0027a,2),\u0027a,9) .\nred update((\u0027a,1) (\u0027a,1),\u0027a,9) .\nred update(emp,\u0027a,9) .\nred update((\u0027a,1),\u0027a,9) .\nclose', 'TEST：8 个 update 用例') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>怎么看「结果是不是对的」</div>' +
          '<p>用例 1–3：键存在且输入合法 → 对应元素被替换，其余不变。<br>' +
          '用例 4：键不存在 → 递归到 <code>emp</code> 后，<code>emp</code> 是单位元，所以结果<b>原样返回</b>（不是变成 <code>emp</code>，这是最容易记反的一点）。<br>' +
          '用例 5–6：输入非法（键重复）→ 结果取决于匹配器挑了哪个，<b>这正是要修的</b>。<br>' +
          '用例 7：空表 → <code>emp</code>。<br>' +
          '用例 8：单元素 → 正常替换。</p>' +
          '<p>考试若问「哪些用例暴露了 bug」，答案就是 <b>4、5、6</b>（键不存在时的丢失、以及非法输入的不确定性）。</p></div>' +
          cta('L7-quiz1', '随堂小测 · 多重集与 AC 匹配（4 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L7 必背</div>' +
          '<ul><li><code>op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}</code></li>' +
          '<li><code>isValid</code> 的三个等式</li>' +
          '<li>修复后的两条 <code>ceq</code>（能默写条件）</li>' +
          '<li>「AC 匹配可能多解 → 需要条件约束」这一句结论</li></ul></div>'
      },
      {
        id: 'L7.s6', title: '应用：用多重集重写 Mutex 协议模拟器',
        guide: {
          what: '把并发协议的状态表示成「可观察分量的多重集」，例如 <code>(locked: false) (pc[t1]: rs) (pc[t2]: rs)</code>。',
          why: '这是 L7 的落点：多重集不是玩具，它让「有几个线程在临界区」这类问题可以直接用计数函数问出来。',
          how: '先定义 STATE（多重集本身），再写 <code>#</code> 数某线程的 pc 分量、<code>#cs</code> 数处于 cs 的分量，最后给迁移函数 <code>trans</code> 加上 <code>isValid</code> 条件。',
          use: '并发协议建模、模型检验里的状态表示：状态是「一组事实」，而不是「一个固定字段的结构体」。',
          pitfalls: ['以为状态里可以有多个 <code>locked</code>：<code>isValid</code> 明确要求<b>恰好一个</b>', '以为 <code>trans</code> 是普通等式：它是条件等式，非法状态直接原样不动']
        },
        html: '<p>讲义第 14–16 页把这套东西用到真实问题上：之前用<b>元组</b>表示 Mutex 协议的状态（<code>(locked: false, pc1: rs, pc2: rs)</code>），现在改成用<b>多重集</b>表示（<code>(locked: false) (pc[t1]: rs) (pc[t2]: rs)</code>）。讲义把「两种表示各有什么优劣」留作练习。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🧩</span>为什么换成多重集</div>' +
          '<p>元组写法把「有两个线程」这件事<b>写死</b>在类型里：三元组只能表示两个线程。多重集写法里，状态就是「现在有哪些事实」：' +
          '<code>(locked: false)</code>、<code>(pc[t1]: rs)</code>、<code>(pc[t2]: cs)</code>。线程数变了，状态类型不用变；' +
          '而「有几个线程在临界区」这种问题，直接用计数函数数一数就行。</p></div>' +
          '<h3 class="sub">状态：可观察分量的多重集</h3>' +
          cbStatic('mod! STATE principal-sort State {\n  pr(OCOM)  pr(NAT-IF)  pr(BOOL-IF)\n  [OCom < State]\n  op void : -> State {constr} .\n  op _ _ : State State -> State {constr assoc comm id: void} .\n}\n\n-- #：数某线程的 pc 分量\nop # : State Tid -> Nat .\neq #(void,T) = 0 .\neq #((locked: B) S,T) = #(S,T) .\neq #((pc[T2]: L) S,T) = if T2 == T then {1 + #(S,T)} else {#(S,T)} .\n\n-- #cs：数处于 cs 的分量（用来表达互斥性）\nop #cs : State -> Nat .\neq #cs(void) = 0 .\neq #cs((locked: B) S) = #cs(S) .\neq #cs((pc[T2]: rs) S) = #cs(S) .\neq #cs((pc[T2]: ms) S) = #cs(S) .\neq #cs((pc[T2]: cs) S) = 1 + #cs(S) .', '讲义 p.18–21：STATE、#、#cs', {
            'op _ _ : State State -> State {constr assoc comm id: void} .': '和多重集一样：结合、交换、单位元 void。整个「状态」就是一个多重集。',
            'eq #((locked: B) S,T) = #(S,T) .': '遇到 locked 分量直接跳过（不计数）。',
            'eq #((pc[T2]: L) S,T) = if T2 == T then {1 + #(S,T)} else {#(S,T)} .': '遇到 pc 分量：是这个线程就加一，否则跳过。',
            'eq #cs((pc[T2]: cs) S) = 1 + #cs(S) .': '只有位于 cs 的分量才计数——这就是「临界区里有几个人」。'
          }, 'st-l7-state') +
          '<p>有了 <code>#cs</code>，互斥性就能写成一个可检验的命题：<b>任何可达状态都满足 <code>#cs(s) &lt;= 1</code></b>。这就是第 11–13 章要证的东西。</p>' +
          '<h3 class="sub">迁移：带 isValid 条件的 trans</h3>' +
          cbStatic('mod! FMUTEX {  pr(STATE)\n  op trans : State Tid -> State .\n  var T : Tid .  var S : State .  var B : Bool .\n  ceq trans((pc[T]: rs) (locked: true) S,T)  = (pc[T]: rs) (locked: true) S  if isValid((pc[T]: rs) (locked: true) S) .\n  ceq trans((pc[T]: rs) (locked: false) S,T) = (pc[T]: ms) (locked: false) S if isValid((pc[T]: rs) (locked: false) S) .\n  ceq trans((pc[T]: ms) (locked: B) S,T)     = (pc[T]: cs) (locked: true) S  if isValid((pc[T]: ms) (locked: B) S) .\n  ceq trans((pc[T]: cs) (locked: B) S,T)     = (pc[T]: rs) (locked: false) S if isValid((pc[T]: cs) (locked: B) S) .\n  ceq trans(S,T) = S if (not isValid(S)) or (not #(S,T) > 0) .\n}', '讲义 p.22：FMUTEX 的四条迁移 + 一条兜底', {
            'ceq trans((pc[T]: rs) (locked: true) S,T)  = (pc[T]: rs) (locked: true) S  if isValid((pc[T]: rs) (locked: true) S) .': '锁被占，留在 rs 不动（等待）。',
            'ceq trans((pc[T]: rs) (locked: false) S,T) = (pc[T]: ms) (locked: false) S if isValid((pc[T]: rs) (locked: false) S) .': '锁空闲：从 rs 进入 ms，并锁上（locked: true）。注意这里改的是 locked 分量。',
            'ceq trans((pc[T]: ms) (locked: B) S,T)     = (pc[T]: cs) (locked: true) S  if isValid((pc[T]: ms) (locked: B) S) .': '从 ms 进入临界区 cs。',
            'ceq trans(S,T) = S if (not isValid(S)) or (not #(S,T) > 0) .': '兜底：状态非法，或该线程不在状态里，就什么都不做。'
          }, 'st-l7-trans') +
          '<div class="card exam"><div class="card-t"><span class="ico">✍️</span>这道「练习」怎么答</div>' +
          '<p>讲义把「元组 vs 多重集」留作练习，答题可以从三个角度展开：</p>' +
          '<ol><li><b>可扩展性</b>：元组把线程数写进类型（三元组 = 2 个线程）；多重集天然支持任意多个线程。</li>' +
          '<li><b>可读性 / 可查询性</b>：多重集里「有几个线程在 cs」用 <code>#cs</code> 一数就有；元组里要写专门的投影函数，线程一多就爆炸。</li>' +
          '<li><b>代价</b>：多重集丢掉了「位置」——<code>(pc[t1]: rs)</code> 不在固定位置，所以要靠 <code>#</code> 和 <code>isValid</code> 把结构约束补回来；而且 AC 匹配可能多解（正是本章 bug 的来源）。</li></ol></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>这一段真正要记住的</div>' +
          '<p>不是背代码，而是这句话：<b>把「状态」看成一组事实（多重集），把「不变量」写成 <code>isValid</code>，把「一步操作」写成带 <code>isValid</code> 条件的 <code>ceq</code>。</b>' +
          '这套写法在第 8–10 章（Minila 的环境）和第 11–14 章（证明）里会反复出现。</p></div>'
      }
    ],
    quiz: 'L7-quiz', flash: 'L7-flash'
  });

  QZ['L7-quiz1'] = {
    title: '随堂小测 · 多重集',
    items: [
      { q: '表达「顺序无关、可重复、有单位元」需要哪三个属性？', opts: ['assoc comm id:', 'prec strat constr', 'assoc id: distrib', 'comm id: rassoc'], a: 0, why: '结合律 + 交换律 + 单位元 = 多重集。', optWhy: ['正确：assoc 管括号、comm 管顺序、id: 管空单元', '错：prec 是优先级、strat 是求值策略、constr 是构造子标记，都与「顺序无关」无关', '错：distrib 是分配律，多重集用不到；assoc 单独也不够', '错：rassoc 是右结合，管的是结合方向，不是「可重复」'] },
      { q: '为什么不用 <code>eq X Y = Y X</code> 表达交换律？', opts: ['语法不允许', '会造成无限重写循环', '会丢失元素', '排序会变'], a: 1, why: '换了又换回来，永不终止。属性交给匹配器处理才好。', optWhy: ['错：语法上完全合法，编译器不会拦', '正确：<code>X Y → Y X → X Y …</code> 来回换，永远停不下来', '错：不会丢元素，只是停不下来', '错：输出顺序是显示问题，不是这里的病根'] },
      { q: 'update 在多重集上出错的根本原因是？', opts: ['等式写错', 'AC 匹配可能选到不同元素，且缺少不变量检查', '排序不够', 'emp 写错'], a: 1, why: '多解 + 无约束 = 结果不确定。', optWhy: ['错：等式语法没错，错在它默认了「键唯一」这个前提', '正确：匹配有多解，又没有条件约束，结果就取决于匹配器挑谁', '错：排序只影响显示顺序，不改变语义', '错：<code>update(emp,J,N2) = emp</code> 是对的（空集里没有键可替换）'] },
      { q: '修复后第一条 ceq 的条件是？', opts: ['<code>#(MS,I) &gt; 0</code>', '<code>isValid((I,N) MS)</code>', '<code>I == J</code>', '<code>MS =/= emp</code>'], a: 1, why: '只有输入合法（键唯一）时才允许替换。', optWhy: ['错：这是 isValid 内部用的判断；单独用它只排除了「剩下还有同键」，不覆盖全局', '正确：整个输入合法，才保证同键最多一个，「挑哪个」也就唯一了', '错：<code>I == J</code> 由左边的模式匹配已经确定，不用再当条件', '错：MS 里还有别的键并不影响合法性'] }
    ]
  };
  QZ['L7-quiz'] = {
    title: 'L7 综合测验',
    items: [
      { q: '<code>red emp emp .</code> 的结果？', opts: ['<code>emp emp</code>', '<code>emp</code>', '<code>nil</code>', '报错'], a: 1, why: 'id: emp 让空单元消失。', optWhy: ['错：<code>id: emp</code> 会把多余的 emp 消掉', '正确：<code>id: emp</code> 让空单元消失', '错：<code>nil</code> 是列表的单位元，类型不对', '错：这是完全合法的重写，不会报错'] },
      { q: '<code>#((a,1) (b,2) (a,3), a)</code> 的结果？', opts: ['<code>1</code>', '<code>2</code>', '<code>3</code>', '<code>0</code>'], a: 1, why: 'a 出现两次。', optWhy: ['错：那不是数到第一个 a 就停了吗', '正确：a 出现了两次', '错：只有两个 a，不存在第三个', '错：至少出现了一次，不可能返回 0'] },
      { q: '<code>isValid((a,1) (a,2))</code> 的结果？', opts: ['<code>true</code>', '<code>false</code>', '<code>emp</code>', '不确定'], a: 1, why: '键 a 重复，违反不变量。', optWhy: ['错：合法（键唯一）才返回 true', '正确：键 a 重复，违反「同键最多一次」', '错：返回的是 Bool，不可能是多重集', '错：isValid 是确定的函数，结果唯一'] },
      { q: '如果一个重写系统不合流，最严重的后果是？', opts: ['速度慢', '同一个项可能有多个范式，无法用来做证明', '语法报错', '排序冲突'], a: 1, why: '范式不唯一 → 数学意义丢失。', optWhy: ['错：性能不是这里的要害', '正确：范式不唯一，等式就不再有确定的含义，后面的证明全部失效', '错：语法完全合法，问题出在语义', '错：和排序无关'] }
    ]
  };
  QZ['L7-flash'] = {
    title: 'L7 闪卡',
    cards: [
      { q: '多重集的算子声明？', a: '<code>op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}</code>' },
      { q: 'isValid 的定义？', a: '<code>eq isValid(emp) = true .</code> / <code>eq isValid((I,N) MS) = if #(MS,I) &gt; 0 then {false} else {isValid(MS)} .</code>' },
      { q: '修复后的两条 ceq？', a: '<code>ceq update((I,N) MS,I,N2) = (I,N2) MS if isValid((I,N) MS) .</code><br><code>ceq update(MS,J,N2) = MS if (not isValid(MS)) or #(MS,J) == 0 .</code>' },
      { q: '一句话总结 L7？', a: 'AC 匹配可能有多个解，必须用不变量条件把匹配「钉死」，否则结果不确定。' }
    ]
  };

  /* L7 逐行解读（手写，优先于自动生成） */
  var NOTES_L7 = {
    'w-l7-1': {
      'open MULTISET-NAT .': '打开多重集模块：这里的 <code>__</code> 带 <code>assoc comm id:</code>，所以下面的 <code>==</code> 都在「模 AC」的意义下比较。',
      'red 1 2 == 2 1 .': '结果 true：<code>comm</code> 让两个参数可以交换。',
      'red 1 2 3 == 3 1 2 .': '还是 true：<code>assoc</code> 让括号无所谓，<code>comm</code> 让顺序无所谓。',
      'red 1 1 2 == 1 2 1 .': 'true：允许重复，两个 1 各算各的。',
      'red emp 5 emp 7 emp .': '中间的 <code>emp</code> 会被 <code>id: emp</code> 消掉，结果只剩 <code>5 7</code>（等价的 <code>7 5</code> 也对）。',
      'red emp emp .': '结果 <code>emp</code>：单位元吃掉自己。',
      'red (3 4) 5 == 3 (4 5) .': 'true：<code>assoc</code>，括号没有意义。',
      'close': '退出试算模式。'
    },
    'w-l7-2': {
      'open TEST2 .': 'TEST2 里定义了 <code>#</code> 和 <code>isValid</code>（讲义第 5–6 页）。',
      "red #(('a,1) ('b,2) ('a,3), 'a) .": '数 a 出现几次，答案是 2。匹配时「随便拿一个」，但总数不受影响。',
      "red #(('a,1) ('b,2), 'c) .": 'c 不在里面，返回 0。',
      "red isValid(('a,1) ('b,2)) .": '键 a、b 各出现一次 → true。',
      "red isValid(('a,1) ('a,2)) .": '键 a 出现两次 → false。这就是 update 的前提条件。'
    },
    'w-l7-3': {
      'open TEST2 .': '这次打开的是<b>修复版</b> TEST2。',
      "red update(('a,1) ('b,2),'a,9) .": '键存在且唯一 → 替换成 <code>(a,9)</code>，其余不变。',
      "red update(('a,1) ('a,2),'a,9) .": '键重复（输入非法）→ 原样返回，不动。',
      "red update(('a,1) ('b,2),'c,9) .": '键不存在 → 原样返回。',
      "red update(emp,'a,9) .": '空多重集 → <code>emp</code>。'
    },
    'w-l7-4': {
      'open TEST .': '这次打开的是<b>天真版</b> TEST —— 有 bug 的那个。',
      "red update(('a,1) ('b,2) ('c,3),'a,9) .": '键 a 存在，看起来正常替换了。',
      "red update(('a,1) ('b,2) ('c,3),'b,9) .": '换 b，同样正常。',
      "red update(('a,1) ('b,2) ('c,3),'c,9) .": '换 c，同样正常。',
      "red update(('a,1) ('b,2) ('c,3),'d,9) .": '键不存在：递归到 <code>emp</code> 后原样返回，<b>不是</b>变成 <code>emp</code>（<code>emp</code> 是单位元）。',
      "red update(('a,1) ('a,2),'a,9) .": '键重复：结果取决于匹配器挑哪个 a。本系统会先把元素排序，所以看起来稳定，但定义本身是不确定的。',
      "red update(('a,1) ('a,1),'a,9) .": '两个完全相同的元素：同样有「挑哪个」的不确定性。',
      "red update(emp,'a,9) .": '空 → <code>emp</code>。',
      "red update(('a,1),'a,9) .": '单元素 → 正常替换。'
    }
  };
  Object.assign(window.CODE_NOTES = window.CODE_NOTES || {}, NOTES_L7);

  /* =====================================================================
   * L8 Minila 解释器
   * ===================================================================== */
  CH.push({
    id: 'L8', num: 'L8', group: '第 3 部分 · 语言处理器', short: 'L8 Minila 解释器',
    title: '8. 一个语言处理器：解释器（Interpreter）',
    sub: 'Minila 是讲义里那门「小到可以完整写出来」的命令式语言。解释器 = 拿着环境，按语法结构递归求值。',
    minutes: 70,
    goals: [
      '说出 Minila 的 6 种语句，并写出它们的 CafeOBJ 算子声明',
      '解释环境（environment）是什么，以及 <code>lookup</code> 找不到变量时为什么是 <code>errNat</code> 而不是 0',
      '写出 <code>evalExp</code> / <code>eval</code> 的递归骨架，并说清 <code>errNat</code> 怎么一路传播',
      '知道 <code>===</code> 返回的是 Nat 的 1/0，条件判断用「0 假、非 0 真」',
      '把 <code>for</code> 展开成 <code>while</code>，并手算一段程序的最终环境'
    ],
    pre: [
      'L2：模块与 <code>{constr}</code> 属性 —— Minila 的语法树就是用 <code>constr</code> 算子搭出来的',
      'L5：表（映射）—— 环境就是「变量 → 值」的表，讲义直接复用了这个想法',
      '会写简单的递归函数（P0 的「递归」那一节够用）',
      '愿意接受一件事：Minila 里<b>没有布尔类型</b>，条件就是自然数'
    ],
    summary: [
      'Minila 是 <b>imperative</b> 语言，数据类型只有自然数，写作 <code>n(3)</code>（<code>op n : Nat -&gt; Exp</code>）',
      '语句 6 种：<code>estm</code>（空）、赋值 <code>x := e ;</code>、<code>if e {s1} else {s2}</code>、<code>while e {s}</code>、<code>for i e1 e2 {s}</code>、顺序 <code>s1 s2</code>（<b>并列</b>，不是分号连接）',
      '分号只属于赋值语句本身：<code>op _:=_; : Var Exp -&gt; Stm</code>；顺序组合是 <code>op _ _ : Stm Stm -&gt; Stm {constr prec: 60 id: estm r-assoc}</code>',
      '环境 = 变量到自然数的表：<code>empEnv</code>、<code>lookup(EV,V)</code>、<code>update</code>；<b>查不到变量返回 <code>errNat</code></b>，不是 0',
      '条件：0 为假、非 0 为真；<code>===</code> 的结果是 Nat 的 1/0（不是 Bool）',
      '<code>interpret(S) = eval(S,empEnv)</code>，<code>eval</code> 返回<b>结束时的环境</b>',
      '<code>for i e1 e2 {s}</code> 等价于 <code>i := e1 ; while i &lt; e2 || i === e2 { s i := i + n(1) ; }</code>'
    ],
    sections: [
      {
        id: 'L8.s1', title: 'Minila 的语法：6 种语句、一种数据类型',
        guide: {
          what: 'Minila 是一门极小的命令式语言：只有自然数，只有 6 种语句。它的语法树可以直接用 CafeOBJ 的 <code>constr</code> 算子写出来。',
          why: '不先看清语言长什么样，后面的解释器、虚拟机、编译器就无从谈起；而考试让你「写模块」时，写的就是这套语法树。',
          how: '先看语句表，再看算式表，最后注意三件事：<code>n(k)</code>、并列顺序、<code>prec</code> 数值越大优先级越弱。',
          use: '任何语言的解析器都做同一件事：把文本变成这样的语法树。',
          pitfalls: ['以为 <code>S1 ; S2</code> 用分号连接：分号属于赋值语句，顺序组合是<b>并列</b>（中间空格）', '以为数字直接写 <code>3</code>：Minila 里是 <code>n(3)</code>；<code>3</code> 只是 host 语言的 Nat', '把 <code>prec</code> 数值当成「越大越强」：讲义明确「越大越弱」']
        },
        html: '<p>Minila 是 <b>imperative</b>（命令式）语言，数据类型只有自然数。数字不是直接写 <code>3</code>，而是写成 <code>n(3)</code>，因为 <code>n</code> 是语法树里的构造子：</p>' +
          cbStatic('mod* VAR principal-sort Var { [Var] }\nmod! EXP {\n  pr(VAR)  pr(NAT)\n  [Exp]\n  op n : Nat -> Exp {constr} .\n  op _+_ : Exp Exp -> Exp {constr prec: 33 l-assoc} .\n  op _-_ : Exp Exp -> Exp {constr prec: 33 l-assoc} .\n  op _*_ : Exp Exp -> Exp {constr prec: 31 l-assoc} .\n  op _/_ : Exp Exp -> Exp {constr prec: 31 l-assoc} .\n  op _%_ : Exp Exp -> Exp {constr prec: 31 l-assoc} .\n  op _===_ : Exp Exp -> Exp {constr prec: 40 l-assoc} .\n  op _=!=_ : Exp Exp -> Exp {constr prec: 40 l-assoc} .\n  op _<_ : Exp Exp -> Exp {constr prec: 40 l-assoc} .\n  op _>_ : Exp Exp -> Exp {constr prec: 40 l-assoc} .\n  op _&&_ : Exp Exp -> Exp {constr prec: 50 l-assoc} .\n  op _||_ : Exp Exp -> Exp {constr prec: 55 l-assoc} .\n}', '讲义 p.9–11：表达式（Exp）的语法', {
            'op n : Nat -> Exp {constr} .': '自然数常量。Minila 的 3 写成 <code>n(3)</code>。',
            'op _+_ : Exp Exp -> Exp {constr prec: 33 l-assoc} .': '<code>prec: 33</code> 是优先级数值，<b>越大越弱</b>；<code>l-assoc</code> 表示左结合。',
            'op _*_ : Exp Exp -> Exp {constr prec: 31 l-assoc} .': '<code>*</code> 的 prec 31 比 <code>+</code> 的 33 小，所以 <code>*</code> 结合得更紧。',
            'op _===_ : Exp Exp -> Exp {constr prec: 40 l-assoc} .': '相等比较也是一个 Exp —— 它的结果是 Nat（1/0），不是 Bool。'
          }, 'st-l8-exp') +
          '<h3 class="sub">语句：6 种</h3>' +
          cbStatic('mod! STM {\n  pr(EXP)\n  [Stm]\n  op estm : -> Stm {constr} .\n  op _:=_; : Var Exp -> Stm {constr} .\n  op if_{_}else{_} : Exp Stm Stm -> Stm {constr} .\n  op while_{_} : Exp Stm -> Stm {constr} .\n  op for_ _ _{_} : Var Exp Exp Stm -> Stm {constr} .\n  op _ _ : Stm Stm -> Stm {constr prec: 60 id: estm r-assoc} .\n}', '讲义 p.13：语句（Stm）的语法', {
            'op estm : -> Stm {constr} .': '空语句（empty statement），相当于「什么都不做」。顺序组合的单位元。',
            'op _:=_; : Var Exp -> Stm {constr} .': '赋值语句。<b>分号是它的一部分</b>：<code>x := e ;</code>。',
            'op if_{_}else{_} : Exp Stm Stm -> Stm {constr} .': '条件语句，写法 <code>if e {s1} else {s2}</code>。',
            'op while_{_} : Exp Stm -> Stm {constr} .': '循环，写法 <code>while e {s}</code>。',
            'op for_ _ _{_} : Var Exp Exp Stm -> Stm {constr} .': 'for 语句，写法 <code>for i e1 e2 {s}</code>（后面会展开成 while）。',
            'op _ _ : Stm Stm -> Stm {constr prec: 60 id: estm r-assoc} .': '顺序组合：两条语句<b>并列</b>写（空格分隔），右结合，单位元是 <code>estm</code>。'
          }, 'st-l8-stm') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>本系统的演示器用的是简化记法</div>' +
          '<p>页面里的 Minila 演示器为了方便输入，用了 <code>x := 1 ;</code>、<code>if … then … else … fi</code>、<code>while … do … od</code> 这种写法，数字也直接写。<b>讲义和考试用上面表格里的写法</b>。对照关系：</p>' +
          '<table><tr><th>演示器（能点）</th><th>讲义 / 考试</th></tr>' +
          '<tr><td><code>x := 1 ;</code></td><td><code>x := n(1) ;</code></td></tr>' +
          '<tr><td><code>if e then s1 else s2 fi</code></td><td><code>if e {s1} else {s2}</code></td></tr>' +
          '<tr><td><code>while e do s od</code></td><td><code>while e {s}</code></td></tr>' +
          '<tr><td><code>s1 ; s2</code></td><td><code>s1 s2</code>（并列，右结合）</td></tr></table></div>' +
          '<div class="card why"><div class="card-t"><span class="ico">🧠</span>为什么顺序组合要用「并列」</div>' +
          '<p>因为 <code>;</code> 已经被赋值语句占用了。CafeOBJ 里没有「语句分隔符」这种语法糖，<code>s1 s2</code> 只是一个二元算子，带 <code>id: estm</code> 和 <code>r-assoc</code>：' +
          '<code>s1 s2 s3</code> 自动等于 <code>s1 (s2 s3)</code>，而 <code>s estm</code> = <code>s</code>。这样「顺序执行」也变成了等式，可以参与重写。</p></div>'
      },
      {
        id: 'L8.s2', title: '环境（environment）：变量 → 值',
        guide: {
          what: '环境就是一张「变量 → 自然数」的表，用 L5 的表（表/映射）实现：<code>empEnv</code>、<code>lookup</code>、<code>update</code>。',
          why: '程序运行到某一步，每个变量的当前值就是环境；赋值改的也是环境。没有环境，解释器无从谈起。',
          how: '先看 <code>lookup</code> 在空表上的行为，记住它返回 <code>errNat</code>；再看 <code>update</code> 怎么产生新环境。',
          use: '所有语言的运行时都有「变量表」这一层：Python 的局部变量字典、C 的栈帧，本质都是环境。',
          pitfalls: ['以为查不到变量就返回 0：讲义是 <code>errNat</code>，再往上传播成 <code>errEnv</code>', '以为赋值会「修改」旧环境：重写世界里没有修改，只有「产生一个新环境」']
        },
        html: '<p>讲义把环境定义成一张表（L5 已经学过表），键是变量名，值是自然数：</p>' +
          cbStatic('mod! ENV {\n  pr(TABLE(VAR,NAT))\n  op empEnv : -> Env {constr} .\n  op lookup : Env Var -> Nat .\n  op update : Env Var Nat -> Env .\n}', '讲义 p.14：环境的类型', {
            'op empEnv : -> Env {constr} .': '空环境（相当于 L5 里的 emp 表）。',
            'op lookup : Env Var -> Nat .': '查变量。讲义里它可能返回 <code>errNat</code>，所以签名实际是 <code>Env Var -&gt; Nat&amp;Err</code>。',
            'op update : Env Var Nat -> Env .': '把变量绑定到新值，产生一个<b>新</b>环境（不是修改旧环境）。'
          }, 'st-l8-env') +
          '<p>关键在 <code>lookup</code> 的边界情形。配套代码 <code>misc.cafe</code> 里写的是：</p>' +
          cbStatic("eq lookup(empEnv,V) = errNat .", '讲义 p.16 / misc.cafe：查不到变量 → errNat', {
            "eq lookup(empEnv,V) = errNat .": '在空环境里查任何变量都是 <code>errNat</code>。它不是 0 —— 这一点是本章最容易记错的地方。'
          }, 'st-l8-lookup') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>为什么不能返回 0</div>' +
          '<p>如果未定义变量返回 0，那么 <code>while x =!= n(0) {…}</code> 在 x 未定义时会「安静地」不进入循环，程序看起来跑通了，其实有 bug。' +
          '讲义的错误模型是：<code>lookup</code> 给 <code>errNat</code> → 算术运算把 <code>errNat</code> 继续传下去 → 一路变成 <code>errEnv</code> → 整个 <code>eval</code> 返回错误。<b>宁可报错，不要猜。</b></p></div>'
      },
      {
        id: 'L8.s3', title: '表达式求值：evalExp 是结构递归',
        guide: {
          what: '<code>evalExp(E,EV)</code>：给表达式和环境，算出自然数（或错误）。',
          why: '解释器的核心就是这个函数；编译器的正确性也要拿它当基准。',
          how: '看三类等式：常量、变量、二元运算；再注意比较运算返回 1/0，以及 <code>errNat</code> 的传播。',
          use: '任何表达式求值器（Python 的 eval、Excel 的公式、模板引擎）都是这个形状。',
          pitfalls: ['以为比较返回 Bool：<code>===</code> 返回的是 <code>{1}</code> 或 <code>{0}</code>，类型是 Nat', '漏掉 <code>eq evalExp(E,errEnv) = errNat</code> 这个「环境已经是错」的分支']
        },
        html: '<p>讲义的签名是 <code>op evalExp : Exp Env&amp;Err -&gt; Nat&amp;Err</code>：返回「自然数或错误」。三类等式：</p>' +
          cbStatic('eq evalExp(n(N),EV) = N .\neq evalExp(V,EV) = lookup(EV,V) .\neq evalExp(E1 + E2,EV) = evalExp(E1,EV) + evalExp(E2,EV) .\neq evalExp(E,errEnv) = errNat .', '讲义 p.15–16：evalExp 的骨架', {
            'eq evalExp(n(N),EV) = N .': '常量：直接把里面的自然数拿出来。',
            'eq evalExp(V,EV) = lookup(EV,V) .': '变量：查环境。查不到就是 <code>errNat</code>。',
            'eq evalExp(E1 + E2,EV) = evalExp(E1,EV) + evalExp(E2,EV) .': '二元运算：两边递归求值再相加。<code>errNat + 任何数</code> 仍然是 <code>errNat</code>，错误就是这样传上去的。',
            'eq evalExp(E,errEnv) = errNat .': '环境本身已经是错 → 直接返回错误。'
          }, 'st-l8-evalexp') +
          '<div class="card exam"><div class="card-t"><span class="ico">📐</span>比较运算为什么这么啰嗦</div>' +
          '<p>讲义 p.17 的 <code>===</code> 是这么写的：</p>' +
          '<pre>eq evalExp(E1 === E2,EV) =\n  if evalExp(E1,EV) == errNat or evalExp(E2,EV) == errNat\n  then {errNat}\n  else {if evalExp(E1,EV) == evalExp(E2,EV) then {1} else {0}} .</pre>' +
          '<p>因为它必须先判断两边是不是 <code>errNat</code>，再比较，最后返回 <b>Nat 的 1 或 0</b>。' +
          '注意返回的不是 <code>true/false</code> —— Minila 里根本没有 Bool 类型。</p></div>'
      },
      {
        id: 'L8.s4', title: '语句执行：eval 返回「结束时的环境」',
        guide: {
          what: '<code>eval(S,EV)</code>：执行语句，返回执行完的环境；<code>interpret(S) = eval(S,empEnv)</code> 是入口。',
          why: '解释器的输出不是「栈」也不是「值」，而是<b>最终环境</b>——因为命令式程序的效果就体现在变量上。',
          how: '看四条：赋值、if、while、顺序；再注意 if/while 把工作交给辅助函数 <code>evalIf</code> / <code>evalWhile</code>。',
          use: 'VM 返回的也是环境（<code>quit</code> 时），这就是解释器和 VM 能对上的原因。',
          pitfalls: ['以为 <code>eval</code> 返回某个值：它返回环境', '把 <code>while</code> 写成「循环变量被修改」：重写里是递归调用，环境一份份换新']
        },
        html: '<p>签名：<code>op eval : Stm Env&amp;Err -&gt; Env&amp;Err</code>。四条主等式：</p>' +
          cbStatic('eq interpret(S) = eval(S,empEnv) .\neq eval(S,errEnv) = errEnv .\neq eval(estm,EV) = EV .\neq eval(V := E ;,EV) = evalAssign(V,evalExp(E,EV),EV) .\neq eval(if E {S1} else {S2},EV) = evalIf(evalExp(E,EV),S1,S2,EV) .\neq eval(while E {S1},EV) = evalWhile(E,S1,EV) .\neq eval(S1 S2,EV) = eval(S2, eval(S1,EV)) .', '讲义 p.19–25：eval 的骨架', {
            'eq interpret(S) = eval(S,empEnv) .': '入口：从空环境开始执行。',
            'eq eval(S,errEnv) = errEnv .': '环境已经错了，直接原样返回。',
            'eq eval(estm,EV) = EV .': '空语句什么都不做，环境不变。',
            'eq eval(V := E ;,EV) = evalAssign(V,evalExp(E,EV),EV) .': '先算右边表达式的值，再把变量绑定到新值（产生新环境）。',
            'eq eval(if E {S1} else {S2},EV) = evalIf(evalExp(E),S1,S2,EV) .': '先算条件：0 走 else、非 0 走 then。',
            'eq eval(while E {S1},EV) = evalWhile(E,S1,EV) .': '循环交给 evalWhile：条件为真就执行体，然后<b>再对整个 while 语句递归</b>。',
            'eq eval(S1 S2,EV) = eval(S2, eval(S1,EV)) .': '顺序：先执行 S1，用它的结果环境执行 S2。'
          }, 'st-l8-eval') +
          '<p>讲义 p.24 还给出 <code>for</code> 的展开式 —— 它不是新语义，只是 <code>while</code> 的糖：</p>' +
          cbStatic('for i e1 e2 {s}  等价于\ni := e1 ; while i < e2 || i === e2 { s i := i + n(1) ; }', '讲义 p.24：for 是 while 的糖', {
            'i := e1 ; while i < e2 || i === e2 { s i := i + n(1) ; }': '初始化一次；条件是 <code>i &lt; e2 || i === e2</code>（即 i ≤ e2）；每轮末尾把 i 加 1。'
          }, 'st-l8-for') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>为什么循环变量最后是 e2+1</div>' +
          '<p>条件写的是 <code>i &lt; e2 || i === e2</code>，也就是「<code>i &lt;= e2</code>」；每轮末尾还有 <code>i := i + n(1)</code>。' +
          '所以循环在 <code>i = e2</code> 那轮之后还会再加一次，最终 <code>i = e2 + 1</code>。讲义 p.27 的例子 <code>for y n(1) n(10)</code> 结束时 <code>y = 11</code>，就是这个原因。</p></div>'
      },
      {
        id: 'L8.s5', title: '跑一遍：讲义 p.4 的阶乘程序',
        guide: {
          what: '用讲义第 4 页的阶乘程序，看一段真实 Minila 程序的执行结果（最终环境）。',
          why: '考试常给一段程序问「最终环境是什么」；亲手算一遍比看十遍定义有用。',
          how: '先读懂程序在算什么，再看讲义给的环境；然后用下面的演示器跑同一段程序（注意演示器的简化记法）。',
          use: '这就是「解释器」这个职业的日常：给程序和环境，算出新环境。',
          pitfalls: ['把 <code>x</code> 和 <code>y</code> 的最终值记混：这段程序里 <code>x</code> 是累乘结果、<code>y</code> 是循环变量', '以为演示器的结果就是讲义结果：演示器用简化记法，但环境结构和讲义一致']
        },
        html: '<p>讲义 p.4 的程序（阶乘 10!）：</p>' +
          cbStatic('x := n(1) ;\ny := n(1) ;\nwhile y < n(10) || y === n(10) {\n  x := x * y ;\n  y := y + n(1) ;\n}', '讲义 p.4：计算 10! 的 Minila 程序', {
            'x := n(1) ;': 'x 用来累乘（阶乘结果），初值 1。',
            'y := n(1) ;': 'y 是循环变量，初值 1。',
            'while y < n(10) || y === n(10) {': '条件等价于 <code>y &lt;= 10</code>。注意 y=10 时仍然成立，所以还会多走一轮。',
            '  x := x * y ;': '把当前的 y 乘进 x。',
            '  y := y + n(1) ;': 'y 加一，进入下一轮。',
            '}': '循环体结束，回到条件重新判断。'
          }, 'st-l8-fact') +
          '<p>讲义的执行结果是这样一个环境（p.5）：</p>' +
          '<pre>((x , 3628800) | ((y , 11) | empEnv))</pre>' +
          '<p>读法：<code>x = 3628800</code>（10 的阶乘），<code>y = 11</code>（循环变量跑到 11 才停）。' +
          '注意 <code>y</code> 不是 10：条件 <code>y &lt; n(10) || y === n(10)</code> 在 y=10 时仍为真，所以还会再执行一轮，把 y 加到 11。</p>' +
          '<h3 class="sub">用演示器亲手跑</h3>' +
          '<p>下面这个实验台把同一段程序用<b>解释器 / 虚拟机 / 编译器</b>三种方式执行。现在只看第一个标签页（解释器）；另外两个是第 9、10 章的内容，先混个脸熟。</p>' +
          '<div class="widget" id="w-l8-lab"></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>演示器与讲义的两处差别</div>' +
          '<p>① 记法：演示器写 <code>x := 1 ;</code>，讲义写 <code>x := n(1) ;</code>；<code>if … then … else … fi</code> 对应讲义的 <code>if … {…} else {…}</code>。' +
          '② 错误模型：演示器为了演示方便，未定义变量按 0 处理、除零按 JS 行为；<b>讲义是 <code>errNat</code> 传播</b>。答题一律以讲义为准。</p></div>' +
          cta('L8-quiz1', '随堂小测 · 解释器（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L8 必背</div>' +
          '<ul><li>6 种语句的算子声明（尤其 <code>estm</code>、<code>_:=_;</code>、并列 <code>_ _</code>）</li>' +
          '<li><code>lookup(empEnv,V) = errNat</code></li>' +
          '<li><code>interpret(S) = eval(S,empEnv)</code></li>' +
          '<li><code>===</code> 返回 Nat 的 1/0；0 假非 0 真</li>' +
          '<li>for 展开式</li></ul></div>'
      }
    ],
    quiz: 'L8-quiz', flash: 'L8-flash'
  });

  QZ['L8-quiz1'] = {
    title: '随堂小测 · 解释器',
    items: [
      { q: 'Minila 里自然数 3 怎么写？', opts: ['<code>3</code>', '<code>n(3)</code>', '<code>Nat(3)</code>', '<code>#3</code>'], a: 1, why: '<code>op n : Nat -&gt; Exp {constr}</code>，数字是语法树里的构造子。',
        optWhy: ['错：<code>3</code> 是 host 语言的 Nat，不是 <code>Exp</code> 类型的项', '正确：<code>n</code> 是 <code>Exp</code> 的构造子，所以常量写成 <code>n(3)</code>', '错：Minila 没有 <code>Nat</code> 这个算子', '错：没有这种写法'] },
      { q: '<code>S1 ; S2</code> 里的分号属于谁？', opts: ['顺序组合算子', '赋值语句 <code>_:=_;</code>', '注释符', '语句结束符'], a: 1, why: '分号是赋值语句的一部分；顺序组合是并列 <code>_ _</code>。',
        optWhy: ['错：顺序组合是并列写法 <code>s1 s2</code>，不带分号', '正确：<code>op _:=_; : Var Exp -&gt; Stm</code>，分号属于赋值语句', '错：注释是 <code>--</code> 或 <code>** **</code>', '错：CafeOBJ 没有「语句结束符」这个概念，每条 op/eq 末尾的句号才是终结符'] },
      { q: '<code>lookup(empEnv,V)</code> 返回什么？', opts: ['0', '<code>errNat</code>', '<code>errEnv</code>', '<code>empEnv</code>'], a: 1, why: '空环境里查不到变量，返回 errNat，再往上传播。',
        optWhy: ['错：返回 0 会让「未定义变量」安静地变成合法值，讲义的错误模型不允许', '正确：<code>errNat</code>，随后的算术运算继续传播它', '错：<code>errEnv</code> 是环境层面的错误，这里还没到那一层', '错：返回类型是 Nat&amp;Err，不可能是环境'] }
    ]
  };
  QZ['L8-quiz'] = {
    title: 'L8 综合测验',
    items: [
      { q: 'Minila 一共有几种语句？', opts: ['5 种', '6 种', '7 种', '4 种'], a: 1, why: 'estm、赋值、if、while、for、顺序，共 6 种。',
        optWhy: ['错：漏了 <code>for</code> 或 <code>estm</code>', '正确：estm / 赋值 / if / while / for / 顺序', '错：讲义只列了 6 种', '错：少于讲义列出的种类'] },
      { q: '<code>===</code> 的结果类型与取值？', opts: ['Bool 的 true/false', 'Nat 的 1/0', 'Nat 的原值', 'Err 类型'], a: 1, why: 'Minila 没有 Bool，比较返回 Nat 的 1/0。',
        optWhy: ['错：Minila 里根本没有 Bool 排序', '正确：相同返回 <code>1</code>、不同返回 <code>0</code>；任一侧是 errNat 则返回 errNat', '错：不是把左值照抄回来', '错：正常情况下不返回错误'] },
      { q: '<code>interpret(S)</code> 的定义是？', opts: ['<code>eval(S,empEnv)</code>', '<code>eval(empEnv,S)</code>', '<code>lookup(S,empEnv)</code>', '直接返回 S'], a: 0, why: '入口就是「从空环境开始执行」。',
        optWhy: ['正确：<code>eq interpret(S) = eval(S,empEnv) .</code>', '错：参数顺序反了（语句在前、环境在后）', '错：<code>lookup</code> 是查变量，不执行语句', '错：那样就没有执行过程了'] },
      { q: '<code>prec: 55</code> 与 <code>prec: 31</code> 相比？', opts: ['55 结合更紧', '55 结合更松（优先级更弱）', '一样紧', '不能比较'], a: 1, why: '讲义：数值越大，优先级越弱。',
        optWhy: ['错：正好相反', '正确：所以 <code>||</code>(55) 比 <code>*</code>(31) 松', '错：数值不同，结合强弱就不同', '错：同一套 prec 数值可以直接比较'] }
    ]
  };
  QZ['L8-flash'] = {
    title: 'L8 闪卡',
    cards: [
      { q: 'Minila 的 6 种语句？', a: '<code>estm</code>、<code>x := e ;</code>、<code>if e {s1} else {s2}</code>、<code>while e {s}</code>、<code>for i e1 e2 {s}</code>、<code>s1 s2</code>（并列）' },
      { q: '顺序组合的算子声明？', a: '<code>op _ _ : Stm Stm -&gt; Stm {constr prec: 60 id: estm r-assoc}</code>' },
      { q: 'lookup 在空环境上返回什么？', a: '<code>errNat</code>（不是 0）' },
      { q: 'for 的展开式？', a: '<code>i := e1 ; while i &lt; e2 || i === e2 { s i := i + n(1) ; }</code>' },
      { q: '为什么 y 最后是 e2+1？', a: '条件含 <code>i === e2</code>（即 i&lt;=e2），每轮末尾再加 1，所以多走一轮。' }
    ]
  };
  /* =====================================================================
   * L9 Minila 虚拟机
   * ===================================================================== */
  CH.push({
    id: 'L9', num: 'L9', group: '第 3 部分 · 语言处理器', short: 'L9 Minila 虚拟机',
    title: '9. 一个语言处理器：虚拟机（Virtual Machine）',
    sub: '虚拟机把「树」拉成「线」：一条条指令、一个 pc、一个栈、一个环境。慢，但状态一目了然。',
    minutes: 65,
    goals: [
      '说出 VM 的三个部件（pc、stk、env）和它的执行循环',
      '默写 18 条指令的语义，尤其是 <code>jump</code> / <code>bjump</code> / <code>jumpOnCond</code> 三条',
      '会算跳转后的 pc（相对偏移，不是绝对编号）',
      '能逐步模拟讲义那段 2^16 的程序，说出每一步的栈和环境',
      '知道 <code>quit</code> 返回的是环境，<code>iln</code> 不是指令'
    ],
    pre: [
      'L8：Minila 的语法、环境、<code>evalExp</code> / <code>eval</code> 的递归求值',
      'L5：表（环境就是表）',
      'L2：列表 —— 指令表本身就是个列表，<code>iln</code> 是它的 <code>nil</code>',
      '注意：这一章的所有跳转都是<b>相对偏移</b>，不是「跳到第几条」'
    ],
    summary: [
      'VM 的状态 = <code>(pc, stk, env)</code>，入口 <code>run(IL) = exec(IL,0,empstk,empEnv)</code>',
      '执行循环：取 <code>nth(IL,pc)</code> 的指令 → 改栈 / 改环境 / 改 pc → 直到遇到 <code>quit</code>',
      '<code>jump(n)</code>：<code>pc ← pc + n</code>；<code>bjump(n)</code>：<code>pc ← pc − n</code>；两者都<b>无条件</b>、都<b>不弹栈</b>',
      '<code>jumpOnCond(n)</code>：弹栈顶 m；<code>m ≠ 0</code> 则 <code>pc ← pc + n</code>，否则 <code>pc ← pc + 1</code>；栈空 → <code>errEnv</code>',
      '<code>quit</code> 把<b>环境</b>作为结果返回；<code>iln</code> 是指令表的终止符（列表的 nil），不是一条指令',
      '栈规则：先压的在下（n1），后压的在上（n2）；<code>minus</code> 是 <code>|n1−n2|</code>，<code>divide</code> 是 <code>n1 quo n2</code>，<code>mod</code> 是 <code>n1 rem n2</code>',
      '错误链：<code>errNat</code> → <code>errStack</code> → <code>errEnv</code>；栈不够、除零、pc 越界都返回 <code>errEnv</code>'
    ],
    sections: [
      {
        id: 'L9.s1', title: '为什么要虚拟机：把「树」拉成「线」',
        guide: {
          what: '解释器处理的是语法树（递归、嵌套）；虚拟机处理的是<b>线性的指令序列</b> + 一个程序计数器 pc。',
          why: '线性表示更容易机械执行、更容易证明「和解释器等价」，也解释了真实 CPU 是怎么跑的。',
          how: '先理解 VM 的三个部件和它的执行循环「取指令 → 改状态」，再对照解释器的递归。',
          use: 'Python / Java 的字节码虚拟机、浏览器的 JS 引擎，都是这个结构。',
          pitfalls: ['以为 VM 比解释器「更高级」：它们只是两种组织形式，计算的东西完全一样', '以为 pc 是「第几条指令」的意思——它确实是下标，但跳转参数是相对偏移，两者别混']
        },
        html: '<table><tr><th></th><th>解释器（L8）</th><th>虚拟机（L9）</th></tr>' +
          '<tr><td>输入</td><td>语法树</td><td>线性指令数组</td></tr>' +
          '<tr><td>控制流</td><td>递归调用</td><td>pc 跳转</td></tr>' +
          '<tr><td>中间结果</td><td>函数调用栈（隐式）</td><td>栈（显式）</td></tr>' +
          '<tr><td>变量</td><td>环境</td><td>环境</td></tr></table>' +
          '<p>讲义 p.3–4：虚拟机维护三个东西 —— <b>pc</b>（program counter，程序计数器）、<b>stk</b>（自然数栈）、<b>env</b>（环境）。' +
          '整个 VM 就是一个循环：<b>取 <code>nth(IL,pc)</code> 的指令 → 根据它改栈 / 改环境 / 改 pc</b>，直到遇到 <code>quit</code>。</p>' +
          cbStatic('run(IL) = exec(IL, 0, empstk, empEnv)', '讲义 p.22：入口', {
            'run(IL) = exec(IL, 0, empstk, empEnv)': '初始 pc=0、栈空、环境空。'
          }, 'st-l9-run') +
          '<div class="card why"><div class="card-t"><span class="ico">🧠</span>为什么「拉成线」很有用</div>' +
          '<p>树是递归的，递归的执行顺序藏在调用栈里，看不见；线性指令把「下一步执行哪条」显式写成 pc，' +
          '跳转、循环、if 全都变成「改 pc」。这样每一步的状态都是<b>三个变量</b>，可以一笔一笔画出来 —— 也就可以被形式化证明。</p></div>'
      },
      {
        id: 'L9.s2', title: '指令集：18 条 + 一个终止符',
        guide: {
          what: 'Minila 的 VM 有 18 条指令，分四类：压栈、变量、算术/比较、跳转与停机。',
          why: '考试会直接问某条指令的语义，或者给你指令表让你算 pc / 栈。',
          how: '按类别记：压栈 <code>push</code>、变量 <code>load/store</code>、算术 <code>add minus multiply divide mod</code>、比较 <code>lessThan greaterThan equal notEqual</code>、逻辑 <code>and or</code>、跳转 <code>jump bjump jumpOnCond</code>、停机 <code>quit</code>。',
          use: '这就是「指令集架构」的雏形：真实 CPU 也是这样分类的。',
          pitfalls: ['把 <code>iln</code> 当成一条指令：它是指令表这个列表的 <code>nil</code>', '把 <code>minus</code> 想成普通减法：Minila 是 Nat，<code>minus</code> 返回 <code>|n1−n2|</code>', '把 <code>jump</code> 的参数当绝对下标：它是相对增量']
        },
        html: '<p>讲义 p.6 的指令集（按类别整理）：</p>' +
          '<table><tr><th>类别</th><th>指令</th><th>语义</th></tr>' +
          '<tr><td>压栈</td><td><code>push(n)</code></td><td>把 n 压栈，<code>pc ← pc+1</code></td></tr>' +
          '<tr><td>变量</td><td><code>load(x)</code></td><td>把 env 中 x 的值压栈；x 不在 env 里就压 <code>errNat</code>，栈变成 <code>errStack</code>，最终返回 <code>errEnv</code></td></tr>' +
          '<tr><td></td><td><code>store(x)</code></td><td>弹栈顶 n，把 x 绑定到 n；栈空 → <code>errEnv</code></td></tr>' +
          '<tr><td>算术</td><td><code>add</code></td><td>弹出 n2、n1，压回 <code>n1+n2</code></td></tr>' +
          '<tr><td></td><td><code>minus</code></td><td>压回 <code>|n1−n2|</code>（Nat，没有负数）</td></tr>' +
          '<tr><td></td><td><code>multiply</code></td><td>压回 <code>n1*n2</code></td></tr>' +
          '<tr><td></td><td><code>divide</code></td><td>压回 <code>n1 quo n2</code>（除零 → <code>errEnv</code>）</td></tr>' +
          '<tr><td></td><td><code>mod</code></td><td>压回 <code>n1 rem n2</code></td></tr>' +
          '<tr><td>比较</td><td><code>lessThan</code> / <code>greaterThan</code> / <code>equal</code> / <code>notEqual</code></td><td>比较 n1、n2，<b>真压 1、假压 0</b>（还是 Nat）</td></tr>' +
          '<tr><td>逻辑</td><td><code>and</code> / <code>or</code></td><td>非 0 视为真，压回 1/0</td></tr>' +
          '<tr><td>跳转</td><td><code>jump(n)</code></td><td><code>pc ← pc+n</code></td></tr>' +
          '<tr><td></td><td><code>bjump(n)</code></td><td><code>pc ← pc−n</code></td></tr>' +
          '<tr><td></td><td><code>jumpOnCond(n)</code></td><td>弹栈顶 m；<code>m≠0</code> → <code>pc ← pc+n</code>，否则 <code>pc ← pc+1</code></td></tr>' +
          '<tr><td>停机</td><td><code>quit</code></td><td>把 <b>env</b> 作为结果返回</td></tr>' +
          '<tr><td>终止符</td><td><code>iln</code></td><td><b>不是指令</b>：它是指令表（IList）的 <code>nil</code>，标记列表结束</td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>栈的方向</div>' +
          '<p>先压进去的在下面、后压的在上面。<code>add</code> 弹出的是 n2（栈顶）和 n1（次栈顶），结果是 <code>n1+n2</code>。' +
          '所以「先算左、再算右、再运算」这个顺序，正好让 <code>n1</code> 是左操作数 —— 这就是为什么 <code>genForExp</code> 总是先生成左边（L10 会用到）。</p></div>'
      },
      {
        id: 'L9.s3', title: '三条跳转：jump、bjump、jumpOnCond（重点）',
        guide: {
          what: '三条跳转指令：<code>jump(n)</code> 向前、<code>bjump(n)</code> 向后，两条都无条件；<code>jumpOnCond(n)</code> 看栈顶决定跳不跳。',
          why: '循环和分支全靠它们；而且它们的参数是<b>相对偏移</b>，算错一位整个程序就崩 —— 这是考试最爱考的点。',
          how: '记住两个式子：<code>jump</code>：<code>pc ← pc+n</code>；<code>bjump</code>：<code>pc ← pc−n</code>。再看例子算具体数字。',
          use: '任何机器的分支指令都是这个模式；相对偏移让代码可以整体搬移而不改跳转。',
          pitfalls: ['把 <code>bjump</code> 记成「条件为假则跳」：它<b>无条件</b>，只是往回跳', '忘了 <code>jumpOnCond</code> 的 else 分支是 <code>pc+1</code>', '把偏移当绝对下标：<code>bjump(12)</code> 在 pc=16 时到 <b>4</b>，不是 12']
        },
        html: '<p>讲义 p.19–20 的三条式子，请按原文记住：</p>' +
          '<table><tr><th>指令</th><th>语义</th><th>方向</th><th>弹栈？</th></tr>' +
          '<tr><td><code>jump(n)</code></td><td><code>pc ← pc + n</code></td><td>向前</td><td>否</td></tr>' +
          '<tr><td><code>bjump(n)</code></td><td><code>pc ← pc − n</code></td><td><b>向后</b></td><td><b>否</b></td></tr>' +
          '<tr><td><code>jumpOnCond(n)</code></td><td><code>m≠0</code> 时 <code>pc ← pc + n</code>；否则 <code>pc ← pc + 1</code></td><td>向前</td><td>是</td></tr></table>' +
          '<div class="card exam"><div class="card-t"><span class="ico">📐</span>用讲义 p.5 的程序算一遍</div>' +
          '<p>那段程序（编号 0–17）：<code>… equal | jumpOnCond(2) | bjump(12) | quit | iln</code>。' +
          '其中 <code>equal</code> 在 14、<code>jumpOnCond(2)</code> 在 15、<code>bjump(12)</code> 在 16。</p>' +
          '<ul><li>若栈顶是 1（条件真）：<code>pc ← 15+2 = 17</code>，跳过 <code>bjump</code>，执行 <code>quit</code> → 停机。</li>' +
          '<li>若栈顶是 0（条件假）：<code>pc ← 15+1 = 16</code>，执行 <code>bjump(12)</code> → <code>pc ← 16−12 = 4</code>，回到循环开头。</li></ul>' +
          '<p>所以循环的骨架是：<b>条件真 → 跳过回跳 → 停机；条件假 → bjump 回去 → 再来一轮</b>。' +
          '注意 <code>bjump</code> 是「往回跳」，退出的活是 <code>jumpOnCond</code> 干的一半和 <code>jump</code> 干的另一半（下一章编译器会看到完整骨架）。</p></div>' +
          cbStatic('pc=15  jumpOnCond(2)   栈顶 1 → pc=17\npc=15  jumpOnCond(2)   栈顶 0 → pc=16\npc=16  bjump(12)        → pc=4  （16-12）', '三个具体数字，先算熟', {
            'pc=15  jumpOnCond(2)   栈顶 1 → pc=17': '条件真：跳过下一条（bjump），直接停机。',
            'pc=15  jumpOnCond(2)   栈顶 0 → pc=16': '条件假：走 else 分支 <code>pc+1</code>。',
            'pc=16  bjump(12)        → pc=4  （16-12）': '无条件往回跳 12 条，回到循环开头。'
          }, 'st-l9-jumps') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>一句话记法</div>' +
          '<p><b>jump 向前、bjump 向后、jumpOnCond 看栈顶向前</b>；三个都是相对增量。' +
          '看到 <code>bjump</code> 就想到「回到循环开头」，看到 <code>jumpOnCond</code> 就想到「条件跳转」。</p></div>'
      },
      {
        id: 'L9.s4', title: '逐步执行：讲义那段 2^16 的程序',
        guide: {
          what: '讲义 p.5 给了一段 18 条指令的程序，循环 4 轮算出 2^16。我们逐轮看状态变化。',
          why: '会「跟着 pc 走」是这一章唯一真正的技能；考试给你一段指令表让你写结果，靠的就是这个。',
          how: '只看每轮的 env 变化（x 翻倍、y 平方），再看最后一轮条件为真、quit 返回环境。',
          use: '调试器、单步执行、性能分析，本质都是这个「逐条看状态」。',
          pitfalls: ['以为 x 是 2 的幂、y 是平方数：这段程序里 x 每轮乘 2，y 每轮平方', '忘了 quit 返回的是<b>环境</b>，不是栈顶的值']
        },
        html: '<p>讲义 p.26–45 完整走了 56 步。这里只抓关键节点：</p>' +
          '<table><tr><th>轮次</th><th>进入循环时</th><th>循环体做完</th><th>条件 <code>16 == x</code></th></tr>' +
          '<tr><td>1</td><td>x=1, y=2</td><td>y=4, x=2</td><td>0 → bjump 回 4</td></tr>' +
          '<tr><td>2</td><td>x=2, y=4</td><td>y=16, x=4</td><td>0 → bjump 回 4</td></tr>' +
          '<tr><td>3</td><td>x=4, y=16</td><td>y=256, x=8</td><td>0 → bjump 回 4</td></tr>' +
          '<tr><td>4</td><td>x=8, y=256</td><td>y=65536, x=16</td><td>1 → 跳过 bjump，quit</td></tr></table>' +
          '<p>程序是：<code>y := y*y ; x := x*2 ;</code>，条件 <code>push(16) load(x) equal</code>。所以循环体里 y 每轮平方、x 每轮翻倍。' +
          '最后一轮 x 变成 16，<code>16 == 16</code> 得 1，<code>jumpOnCond(2)</code> 跳过 <code>bjump</code> 到 <code>quit</code>。</p>' +
          '<p>最终结果（讲义 p.5 / p.45）：</p>' +
          '<pre>((x , 16) | ((y , 65536) | empEnv))</pre>' +
          '<h3 class="sub">用演示器看每一步</h3>' +
          '<p>下面这个实验台会把指令、pc、栈、环境都显示出来。看的时候注意两件事：' +
          '① 演示器为了看得清楚，把跳转目标显示成<b>指令序号</b>；讲义写的是<b>相对偏移</b>（偏移 = 目标序号 − 当前序号）。' +
          '② 循环回到开头用的那条指令，在讲义里是 <code>bjump</code>。</p>' +
          '<div class="widget" id="w-l9-lab"></div>' +
          cta('L9-quiz1', '随堂小测 · 虚拟机（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L9 必背</div>' +
          '<ul><li>VM 状态 <code>(pc, stk, env)</code> 与 <code>run(IL) = exec(IL,0,empstk,empEnv)</code></li>' +
          '<li><code>jump(n)</code> = <code>pc+n</code>；<code>bjump(n)</code> = <code>pc−n</code>；<code>jumpOnCond(n)</code> 条件 <code>+n</code></li>' +
          '<li><code>quit</code> 返回 env；<code>iln</code> 是列表终止符</li>' +
          '<li><code>minus</code> = <code>|n1−n2|</code>、<code>divide</code> = <code>n1 quo n2</code>、<code>mod</code> = <code>n1 rem n2</code></li>' +
          '<li>错误链 errNat → errStack → errEnv</li></ul></div>'
      }
    ],
    quiz: 'L9-quiz', flash: 'L9-flash'
  });

  QZ['L9-quiz1'] = {
    title: '随堂小测 · 虚拟机',
    items: [
      { q: '虚拟机的三个部件是？', opts: ['pc、栈、环境', 'pc、堆、寄存器', '栈、堆、环境', 'pc、栈、缓存'], a: 0, why: '讲义 p.3–4：pc、stk、env。',
        optWhy: ['正确：程序计数器、自然数栈、环境', '错：Minila 的 VM 没有堆和寄存器', '错：少了 pc，虚拟机就没法知道下一条执行哪', '错：没有缓存这一层'] },
      { q: '<code>bjump(12)</code> 在 pc=16 时执行后，pc 是多少？', opts: ['12', '4', '28', '16'], a: 1, why: '<code>pc ← pc−12 = 4</code>。',
        optWhy: ['错：12 是偏移量，不是目标地址', '正确：<code>16 − 12 = 4</code>', '错：那是 <code>jump(12)</code> 的结果', '错：无条件跳转一定会改 pc'] },
      { q: '<code>quit</code> 返回什么？', opts: ['栈顶的值', '环境 env', '<code>empEnv</code>', '整条指令表'], a: 1, why: '讲义 p.21：quit 返回环境。',
        optWhy: ['错：栈只是计算中间值的地方', '正确：程序的效果体现在环境上', '错：返回的是当前环境，不是初始空环境', '错：指令表是输入，不是结果'] }
    ]
  };
  QZ['L9-quiz'] = {
    title: 'L9 综合测验',
    items: [
      { q: '<code>jumpOnCond(2)</code> 在栈顶为 0 时？', opts: ['<code>pc ← pc+2</code>', '<code>pc ← pc+1</code>', '<code>pc ← pc−2</code>', '停机'], a: 1, why: '只有栈顶非 0 才跳 +n，否则就是 +1。',
        optWhy: ['错：那是栈顶非 0 的情形', '正确：条件不成立时走 else 分支 <code>pc+1</code>', '错：<code>jumpOnCond</code> 只向前跳', '错：停机是 <code>quit</code> 的事'] },
      { q: '<code>minus</code> 的语义是？', opts: ['<code>n1−n2</code>', '<code>|n1−n2|</code>', '<code>n1+n2</code>', '<code>n2−n1</code>'], a: 1, why: 'Minila 只有 Nat，减法取绝对值。',
        optWhy: ['错：Nat 上没有负数，不能直接相减', '正确：<code>|n1−n2|</code>（即 <code>sd</code>）', '错：那是 <code>add</code>', '错：操作数顺序不影响绝对值，但写法不是这个'] },
      { q: '<code>iln</code> 是什么？', opts: ['一条停机指令', '指令表的终止符（nil）', '空栈', '空环境'], a: 1, why: '它是 IList 的 nil，不是指令。',
        optWhy: ['错：停机是 <code>quit</code>', '正确：列表的终止符，靠它判断 pc 越界', '错：空栈是 <code>empstk</code>', '错：空环境是 <code>empEnv</code>'] },
      { q: '<code>load(x)</code> 时 x 不在环境里会怎样？', opts: ['压入 0', '压入 <code>errNat</code>，最终返回 <code>errEnv</code>', '停机', '跳过这条指令'], a: 1, why: '错误会一路传播成 errEnv。',
        optWhy: ['错：那就把「未定义」当成了合法值', '正确：errNat 进栈 → 栈变 errStack → 最终 errEnv', '错：不是停机，是返回错误', '错：不会跳过，错误必须传播'] }
    ]
  };
  QZ['L9-flash'] = {
    title: 'L9 闪卡',
    cards: [
      { q: 'VM 的状态与入口？', a: '<code>(pc, stk, env)</code>；<code>run(IL) = exec(IL,0,empstk,empEnv)</code>' },
      { q: '三条跳转的式子？', a: '<code>jump(n)</code>: pc←pc+n；<code>bjump(n)</code>: pc←pc−n；<code>jumpOnCond(n)</code>: 栈顶≠0 时 pc←pc+n，否则 pc+1' },
      { q: 'pc=16 执行 bjump(12) 后？', a: 'pc=4' },
      { q: 'quit 返回什么？', a: '环境 env（不是栈顶值）' },
      { q: '错误链？', a: '<code>errNat</code> → <code>errStack</code> → <code>errEnv</code>' }
    ]
  };
  /* =====================================================================
   * L10 Minila 编译器
   * ===================================================================== */
  CH.push({
    id: 'L10', num: 'L10', group: '第 3 部分 · 语言处理器', short: 'L10 Minila 编译器',
    title: '10. 一个语言处理器：编译器（Compiler）',
    sub: '编译 = 结构递归地翻译。难的不是「翻译」，而是把 if / while 的跳转偏移算准。',
    minutes: 65,
    goals: [
      '写出 <code>compile</code> / <code>generate</code> / <code>genForExp</code> 三层结构',
      '默写 <code>genForExp</code> 的三条规则，并解释「为什么左操作数要先编译」',
      '默写 if 与 while 的指令骨架和它们的偏移公式（<code>len1</code> / <code>len2</code> 到底是谁的长度）',
      '能对着 p.15 的 18 条指令逐条说出它对应源码的哪一部分',
      '说清 while 里哪条指令负责退出、哪条负责回跳'
    ],
    pre: [
      'L9：18 条指令、栈序、三条跳转的相对偏移语义（这一章全部建立在它上面）',
      'L8：<code>evalExp</code> / <code>eval</code> 的语义 —— 编译器要「和它等价」',
      'L2：列表的 <code>@</code>（连接）与 <code>|</code>（cons），以及 <code>iln</code>',
      '先算熟 <code>bjump(12)</code> 在 pc=16 到 4 这种题，再看偏移公式会轻松很多'
    ],
    summary: [
      '三层结构：<code>genForExp : Exp -&gt; IList</code>（表达式）、<code>generate : Stm -&gt; IList</code>（语句）、<code>compile(S) = generate(S) @ (quit | iln)</code>',
      '表达式编译完，<b>结果留在栈顶</b>；二元运算按「先左、后右、再运算」生成',
      'if 的骨架：<code>[E] jumpOnCond(2) jump(len1+2) ｜ [S1] jump(len2+1) ｜ [S2]</code>，<b>then 在前、else 在后</b>（<code>len1=len(generate(S1))</code>，<code>len2=len(generate(S2))</code>）',
      'while 的骨架：<code>[E] jumpOnCond(2) jump(len2+2) ｜ [S1] bjump(len1+len2+2)</code>（<code>len1=len(genForExp(E))</code>，<code>len2=len(generate(S1))</code>）',
      'while 里 <b>退出靠 <code>jump</code></b>（条件假时跳出），<b>回跳靠 <code>bjump</code></b>（无条件回到开头）',
      '<code>jumpOnCond</code> 的参数恒为 <b>2</b>：跳过紧跟其后的那条 <code>jump</code>',
      '偏移全部是<b>相对</b>的，所以公式里可以直接用 <code>len(...)</code> 算，不需要事后回填',
      '正确性定理 <code>M(C(p)) = I(p)</code> 属于 L13，本章只要理解「编译 + 执行 = 解释」这个直觉'
    ],
    sections: [
      {
        id: 'L10.s1', title: '编译 = 结构递归地翻译',
        guide: {
          what: '编译就是把语法树翻译成指令表：每个语法构造对应一段固定形状的指令。',
          why: '这是「语言处理器」三部曲的最后一步：解释器直接算、编译器先翻译再交给 VM 算。',
          how: '看三层签名：表达式一层、语句一层，最后 <code>compile</code> 补上 <code>quit</code> 和 <code>iln</code>。',
          use: '所有编译器都是这个骨架：语法树 → 递归下降生成中间代码。',
          pitfalls: ['以为 <code>compile</code> 和 <code>generate</code> 是一回事：<code>compile</code> 末尾多加 <code>quit | iln</code>', '忘了指令表的终点是 <code>iln</code>']
        },
        html: '<p>三层结构，签名先记住：</p>' +
          cbStatic('op genForExp : Exp -> IList .\nop generate  : Stm -> IList .\neq compile(S) = generate(S) @ (quit | iln) .', '讲义 p.4 / p.8：三层结构', {
            'op genForExp : Exp -> IList .': '表达式 → 指令表。执行完结果在栈顶。',
            'op generate  : Stm -> IList .': '语句 → 指令表。执行完效果体现在环境上。',
            'eq compile(S) = generate(S) @ (quit | iln) .': '最终的编译产物末尾补上 <code>quit</code>（停机）和 <code>iln</code>（表尾）。'
          }, 'st-l10-compile') +
          '<div class="card why"><div class="card-t"><span class="ico">🧠</span>为什么「结构递归」就够了</div>' +
          '<p>因为语法树是归纳定义的：只要给出「每个构造怎么翻译」，整棵树就自动翻译完了。' +
          '真正需要动脑的只有一处 —— <b>跳转的偏移量怎么算</b>。下一节开始就是算这个。</p></div>'
      },
      {
        id: 'L10.s2', title: 'genForExp：表达式 → 后缀指令',
        guide: {
          what: '把表达式编译成指令，执行完结果留在栈顶。',
          why: '这是所有语句编译的基础：条件、赋值右边都靠它。',
          how: '三条规则：常量 <code>push</code>、变量 <code>load</code>、二元运算 <code>先左 @ 先右 @ (op | iln)</code>。',
          use: '就是「后缀表达式」求值：先压操作数，再执行操作。',
          pitfalls: ['把左右顺序写反：减法/除法会算出相反的结果', '漏掉 <code>| iln</code>：指令表没有终止符', '以为 <code>genForExp</code> 返回的是值：它返回的是<b>指令表</b>']
        },
        html: '<p>讲义 p.5–7 的三条规则：</p>' +
          cbStatic('eq genForExp(n(N)) = push(N) | iln .\neq genForExp(V) = load(V) | iln .\neq genForExp(E1 + E2) = genForExp(E1) @ genForExp(E2) @ (add | iln) .', '讲义 p.5–6：genForExp', {
            'eq genForExp(n(N)) = push(N) | iln .': '常量：直接压栈。',
            'eq genForExp(V) = load(V) | iln .': '变量：把值从环境加载到栈。',
            'eq genForExp(E1 + E2) = genForExp(E1) @ genForExp(E2) @ (add | iln) .': '二元运算：<b>先左后右</b>，再把 <code>add</code> 接在后面。'
          }, 'st-l10-genexp') +
          '<p>其余运算「同样处理」（讲义 p.7 只说了一句 likewise），写成通式就是：</p>' +
          '<pre>genForExp(E1 op E2) = genForExp(E1) @ genForExp(E2) @ (指令(op) | iln)</pre>' +
          '<table><tr><th>运算</th><th>指令</th><th>运算</th><th>指令</th></tr>' +
          '<tr><td><code>+</code></td><td><code>add</code></td><td><code>===</code></td><td><code>equal</code></td></tr>' +
          '<tr><td><code>-</code></td><td><code>minus</code></td><td><code>=!=</code></td><td><code>notEqual</code></td></tr>' +
          '<tr><td><code>*</code></td><td><code>multiply</code></td><td><code>&lt;</code></td><td><code>lessThan</code></td></tr>' +
          '<tr><td><code>/</code></td><td><code>divide</code></td><td><code>&gt;</code></td><td><code>greaterThan</code></td></tr>' +
          '<tr><td><code>%</code></td><td><code>mod</code></td><td><code>&amp;&amp;</code> / <code>||</code></td><td><code>and</code> / <code>or</code></td></tr></table>' +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>为什么必须先左后右</div>' +
          '<p>因为 VM 的二元指令是「先弹出栈顶 n2、再弹出 n1，算 <code>n1 op n2</code>」。' +
          '如果先编译右边，栈里就变成 <code>[n2, n1]</code>，减法和除法会算反。<b>加法乘法虽然可交换，也不要赌。</b></p></div>'
      },
      {
        id: 'L10.s3', title: 'if 与 while：偏移怎么算（重点）',
        guide: {
          what: 'if 和 while 的指令骨架，以及每个跳转的偏移量公式。',
          why: '这是整章唯一的难点，也是考试最爱考的地方：偏移算错一位，程序就飞了。',
          how: '先记住骨架形状，再记住 len1 / len2 各是谁的长度，最后用 <code>jumpOnCond</code> 恒为 2 这条「定海神针」去推其他偏移。',
          use: '任何编译器的控制流生成都是这个模式：条件跳转 + 两条跳转会合。',
          pitfalls: ['把 if 的 then 和 else 顺序写反：讲义是 then 在前', '把 while 的退出写成 <code>bjump</code>：退出是 <code>jump</code>，<code>bjump</code> 是回跳', 'while 的 <code>bjump</code> 参数少算 2（它是 <code>len1+len2+2</code>，不是 <code>+1</code>）', '把偏移当绝对地址：所有公式都是相对增量']
        },
        html: '<h3 class="sub">if：then 在前，else 在后</h3>' +
          '<p>讲义 p.10 的公式（<code>len1 = len(generate(S1))</code>，<code>len2 = len(generate(S2))</code>）：</p>' +
          '<pre>[E]  jumpOnCond(2)  jump(len1+2)  ｜ [S1]  jump(len2+1) ｜ [S2]</pre>' +
          '<p>读法：</p>' +
          '<ul><li>条件为真：<code>jumpOnCond(2)</code> 跳过紧跟着的 <code>jump(len1+2)</code>，进入 <b>then</b>（S1）。</li>' +
          '<li>条件为假：不跳，执行 <code>jump(len1+2)</code> —— 越过 S1 和它后面的 <code>jump(len2+1)</code>，落到 <b>else</b>（S2）。</li>' +
          '<li>S1 执行完，<code>jump(len2+1)</code> 越过 S2，直接到出口。</li></ul>' +
          '<div class="card exam"><div class="card-t"><span class="ico">📐</span>为什么是 len1+2 和 len2+1</div>' +
          '<p><code>jump(len1+2)</code> 这条指令执行时 pc 指向它自己：往后数 <code>len1</code> 条是 S1 的全部指令，再加 1 条是 S1 后面的 <code>jump(len2+1)</code>，再加 1 条正好落到 S2 的第一条 —— 所以是 <code>len1+2</code>。</p>' +
          '<p>同理 S1 末尾的 <code>jump(len2+1)</code>：越过 <code>len2</code> 条 else 指令，正好到出口。</p></div>' +
          '<h3 class="sub">while：jump 退出，bjump 回跳</h3>' +
          '<p>讲义 p.14 的公式（<code>len1 = len(genForExp(E))</code>，<code>len2 = len(generate(S1))</code>）：</p>' +
          '<pre>[E]  jumpOnCond(2)  jump(len2+2)  ｜ [S1]  bjump(len1+len2+2)</pre>' +
          '<p>读法：</p>' +
          '<ul><li>条件为真：<code>jumpOnCond(2)</code> 跳过 <code>jump(len2+2)</code>，进入循环体 S1。</li>' +
          '<li>条件为假：执行 <code>jump(len2+2)</code> —— 越过 S1 和末尾的 <code>bjump</code>，<b>退出循环</b>。</li>' +
          '<li>循环体做完：<code>bjump(len1+len2+2)</code> <b>无条件回到开头</b>（越过条件本身的 len1 条指令）。</li></ul>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>最容易记反的一条</div>' +
          '<p>很多人以为「退出循环用 bjump」。<b>正好相反</b>：<code>bjump</code> 是「往后跳」，只能回到开头；退出要「往前跳」，是 <code>jump</code>。' +
          '<code>jumpOnCond</code> 只负责「条件真就跳过退出跳转」。</p></div>'
      },
      {
        id: 'L10.s4', title: '完整例子：p.15 的 18 条指令',
        guide: {
          what: '讲义 p.15 把 <code>while y &lt; n(10) || y === n(10) {x := x*y ; y := y+n(1) ;}</code> 编译成了 18 条指令。',
          why: '看懂这 18 条，前面所有公式才算真的会了；考试也喜欢给一段小程序让你写指令或算偏移。',
          how: '按块对照：先认条件（0–6）、再认两条控制指令（7–8）、再认循环体（9–16）、最后认回跳（17）。',
          use: '这就是「反编译」的思路：看到指令表能还原出源码结构。',
          pitfalls: ['把 <code>jump(10)</code> 当成绝对地址 10：它是从第 8 条跳到第 18 条（8+10）', '忘了 <code>bjump(17)</code> 从 17 回到 0', '以为 <code>jumpOnCond(2)</code> 的 2 是「第 2 个参数」']
        },
        html: '<p>源码：<code>while y &lt; n(10) || y === n(10) { x := x * y ; y := y + n(1) ; }</code>（<code>len1 = 7</code>，<code>len2 = 8</code>）</p>' +
          '<pre>0  load(y)       1  push(10)    2  lessThan\n3  load(y)       4  push(10)    5  equal\n6  or\n7  jumpOnCond(2)\n8  jump(10)\n9  load(x)      10  load(y)     11  multiply   12  store(x)\n13  load(y)      14  push(1)     15  add        16  store(y)\n17  bjump(17)</pre>' +
          '<table><tr><th>指令</th><th>对应源码</th><th>说明</th></tr>' +
          '<tr><td>0–6</td><td><code>y &lt; 10 || y === 10</code></td><td>先算左比较、再算右比较、最后 <code>or</code>；结果在栈顶</td></tr>' +
          '<tr><td>7</td><td>—</td><td><code>jumpOnCond(2)</code>：条件真就跳过第 8 条</td></tr>' +
          '<tr><td>8</td><td>—</td><td><code>jump(10)</code>：8+10=18，越过循环体与回跳，退出</td></tr>' +
          '<tr><td>9–12</td><td><code>x := x * y ;</code></td><td>先左后右，再 <code>multiply</code>，最后 <code>store(x)</code></td></tr>' +
          '<tr><td>13–16</td><td><code>y := y + n(1) ;</code></td><td>同上，<code>store(y)</code> 收尾</td></tr>' +
          '<tr><td>17</td><td>—</td><td><code>bjump(17)</code>：17−17=0，回到循环开头</td></tr></table>' +
          '<p>验证一下偏移：第 8 条 <code>jump(10)</code> → 18 正好是表尾（循环结束后的位置）；第 17 条 <code>bjump(17)</code> → 0 正好是循环头。两个数字都对得上。</p>' +
          '<h3 class="sub">用演示器看编译产物</h3>' +
          '<div class="widget" id="w-l10-lab"></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>关于「正确性」</div>' +
          '<p>编译器要能证明「编译后执行 = 直接解释」，这个定理（<code>M(C(p)) = I(p)</code>）在 L13 才正式讲。' +
          '本章只要相信一件事：<b>编译只是换了一种执行方式，算出来的环境必须一样</b>。</p></div>' +
          cta('L10-quiz1', '随堂小测 · 编译器（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L10 必背</div>' +
          '<ul><li><code>compile(S) = generate(S) @ (quit | iln)</code></li>' +
          '<li><code>genForExp(E1 op E2) = genForExp(E1) @ genForExp(E2) @ (op | iln)</code></li>' +
          '<li>if：<code>[E] jumpOnCond(2) jump(len1+2) [S1] jump(len2+1) [S2]</code></li>' +
          '<li>while：<code>[E] jumpOnCond(2) jump(len2+2) [S1] bjump(len1+len2+2)</code></li>' +
          '<li>while 退出用 <code>jump</code>、回跳用 <code>bjump</code></li></ul></div>'
      }
    ],
    quiz: 'L10-quiz', flash: 'L10-flash'
  });

  QZ['L10-quiz1'] = {
    title: '随堂小测 · 编译器',
    items: [
      { q: '<code>genForExp(E1 - E2)</code> 的正确翻译是？', opts: ['<code>genForExp(E2) @ genForExp(E1) @ (minus | iln)</code>', '<code>genForExp(E1) @ genForExp(E2) @ (minus | iln)</code>', '<code>minus | genForExp(E1)</code>', '<code>genForExp(E1 - E2)</code>'], a: 1, why: '左先右后，否则减法会反。',
        optWhy: ['错：先右后左会让栈里顺序反过来，<code>minus</code> 算出的绝对值虽然一样，但除法就会错', '正确：先编译左、再编译右、最后接指令', '错：指令不能凭空出现，两个操作数都要先压栈', '错：这不是递归定义，等于没翻译'] },
      { q: 'if 语句中，紧跟在条件指令后面的两条是？', opts: ['<code>jumpOnCond(2)</code> 和 <code>jump(len1+2)</code>', '<code>jump</code> 和 <code>bjump</code>', '<code>quit</code> 和 <code>iln</code>', '只有 <code>jumpOnCond</code>'], a: 0, why: '条件真跳过 jump 进 then，假则 jump 到 else。',
        optWhy: ['正确：这正是讲义 p.10 的骨架', '错：if 不需要回跳', '错：那是编译入口 <code>compile</code> 的结尾', '错：缺了跳到 else 的那条 <code>jump</code>'] },
      { q: 'while 循环用哪条指令退出？', opts: ['<code>bjump</code>', '<code>jump</code>（条件为假时跳出去）', '<code>jumpOnCond</code>', '<code>quit</code>'], a: 1, why: '退出向前跳用 jump；bjump 是回到开头。',
        optWhy: ['错：<code>bjump</code> 是往后跳，只能回循环开头', '正确：条件假时不跳过 <code>jump(len2+2)</code>，于是跳出去', '错：<code>jumpOnCond</code> 只负责「条件真时跳过退出跳转」', '错：<code>quit</code> 是整段程序结束'] }
    ]
  };
  QZ['L10-quiz'] = {
    title: 'L10 综合测验',
    items: [
      { q: '<code>compile</code> 与 <code>generate</code> 的差别？', opts: ['没有差别', '<code>compile</code> 在结果后面补 <code>quit | iln</code>', '<code>generate</code> 更快', '<code>compile</code> 不处理 while'], a: 1, why: '<code>compile(S) = generate(S) @ (quit | iln)</code>。',
        optWhy: ['错：<code>compile</code> 多了一步「补停机与表尾」', '正确：编译产物要能自己停下来', '错：与速度无关，是产物形状不同', '错：<code>compile</code> 调用 <code>generate</code>，while 当然处理'] },
      { q: 'while 里 <code>bjump</code> 的参数是多少？', opts: ['<code>len1+len2+1</code>', '<code>len1+len2+2</code>', '<code>len2+2</code>', '<code>len1</code>'], a: 1, why: '要越过条件、退出跳转、循环体，再回到开头。',
        optWhy: ['错：少算了一条', '正确：<code>len1</code>(条件) + <code>len2</code>(循环体) + 2(两条控制指令) —— 其实键是「回到第一条」这一步', '错：那是 <code>jump</code> 的偏移', '错：<code>len1</code> 只是条件的长度'] },
      { q: 'p.15 例子里第 8 条 <code>jump(10)</code> 执行后 pc 是？', opts: ['10', '18', '9', '0'], a: 1, why: '8+10=18，正好越过循环体到表尾。',
        optWhy: ['错：10 是偏移量，不是目标', '正确：<code>8+10=18</code>', '错：<code>jump</code> 不会只走一步', '错：往回跳是 <code>bjump</code>'] },
      { q: '为什么 <code>genForExp</code> 要先编译左操作数？', opts: ['为了好看', '因为 VM 先弹出 n2 再弹出 n1，算 n1 op n2', '因为左结合', '因为栈是先进先出'], a: 1, why: '栈序决定操作数顺序。',
        optWhy: ['错：跟格式无关', '正确：后压的在栈顶，先压的在下，指令才能按 n1 op n2 算', '错：结合性是语法层面的事', '错：栈是后进先出'] }
    ]
  };
  QZ['L10-flash'] = {
    title: 'L10 闪卡',
    cards: [
      { q: '<code>genForExp(E1+E2)</code>？', a: '<code>genForExp(E1) @ genForExp(E2) @ (add | iln)</code>（左先右后）' },
      { q: 'if 的指令骨架？', a: '<code>[E] jumpOnCond(2) jump(len1+2) [S1] jump(len2+1) [S2]</code>（then 在前）' },
      { q: 'while 的指令骨架？', a: '<code>[E] jumpOnCond(2) jump(len2+2) [S1] bjump(len1+len2+2)</code>' },
      { q: 'while 里谁退出、谁回跳？', a: '退出 = <code>jump</code>（条件假时）；回跳 = <code>bjump</code>（无条件）' },
      { q: 'compile 与 generate 的关系？', a: '<code>compile(S) = generate(S) @ (quit | iln)</code>' }
    ]
  };
})();
