/* =====================================================================
 * content-mid.js — L6 ~ L10
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function cb(id, src, cap) {
    return '<div class="codebox" id="' + id + '">' +
      '<div class="codebox-h"><span>' + esc(cap || 'CafeOBJ') + '</span>' +
      '<button class="btn-run" data-run="' + id + '">▶ 运行</button></div>' +
      '<pre>' + esc(src) + '</pre>' +
      '<div class="run-out">点「运行」，本机引擎会真的执行这段代码</div></div>';
  }
  function cbStatic(src, cap) {
    return '<div class="codebox"><div class="codebox-h"><span>' + esc(cap || '代码（读懂即可）') + '</span>' +
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
    sections: [
      {
        id: 'L6.s1', title: '问题：无限列表不能「全部算完」',
        html: '<p>有限列表 <code>1 | 2 | 3 | nil</code> 有终点。无限列表 <code>0 | 1 | 2 | …</code> 没有。</p>' +
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
        html: '<p>每个算子可以带一个 <b>局部策略（local strategy）</b>，写法是 <code>{strat: (...)}</code>。' +
          '括号里的数字是「第几个参数」，<code>0</code> 是特殊值表示<b>「试试根节点自己」</b>。</p>' +
          '<table><tr><th>策略</th><th>含义</th><th>效果</th></tr>' +
          '<tr><td><code>(1 0)</code></td><td>先算第 1 个参数，然后试根</td><td>… 不对，见下</td></tr>' +
          '<tr><td><code>(0 1)</code></td><td>先试根，再算第 1 个参数</td><td>outermost（最外层优先）</td></tr>' +
          '<tr><td><code>(1 2 0)</code></td><td>先算参数 1、2，再试根</td><td>innermost（最内层优先）</td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>先纠正一个常见误解</div>' +
          '<p><code>(1 0)</code> 的精确语义是：<b>「先算第 1 个参数；如果第 1 个参数算不动了，再试根」</b>？' +
          '不是。正确读法是<b>按顺序执行表里的每一项</b>：</p>' +
          '<ul><li>看到 <code>j ≠ 0</code>：把第 j 个参数<b>归约到范式</b>（递归地用同样的机制）；</li>' +
          '<li>看到 <code>0</code>：把<b>整个项</b>当作 redex 试一次，成功就一步重写，然后<b>立刻返回</b>（后面的项不再执行）。</li></ul>' +
          '<p>所以 <code>(1 0)</code> = 「先把第 1 个参数算成范式，再试根」；<code>(0 1)</code> = 「先试根，不行再算第 1 个参数」。</p></div>' +
          '<p>那么对无限列表，该用哪个？答案是 <code>(1 0)</code>。为什么？看下一节的实际对比。</p>'
      },
      {
        id: 'L6.s3', title: '亲手对比 (1 0) 与 (0 1)',
        html: '<p>下面用同一个项、只改策略，看归约步数和结果：</p>' +
          '<div class="widget" id="w-l6-strat"></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔍</span>结论</div>' +
          '<p><code>(1 0)</code>：先算参数，能算出具体值，于是 <code>1st((1,2,3))</code> 能一路化到 <code>1</code>。<br>' +
          '<code>(0 1 0)</code>：先试根 —— 但根的规则 <code>1st((FE,SE,TE)) = FE</code> 要求参数已经是三元组形式；' +
          '如果参数里还有可算的东西，先算根可能「过早」或「过晚」，步数不同。</p>' +
          '<p>对无限列表的 <code>_|_</code>，写成 <code>{strat: (1 0)}</code> 的效果是：' +
          '<b>先把头（第 1 个参数）算出来，然后才去碰尾巴</b>。这正是 <code>take</code> 需要的顺序：' +
          '取 N 个时，每次只需要头部，尾巴可以晚点算。</p></div>' +
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
        html: '<p>这四个函数是无限列表的基本操作。定义和有限列表几乎一样，只是结果类型不同：</p>' +
          '<div class="codebox"><pre>eq take(IL,0) = nil .\neq take(X | IL,NzN) = X | take(IL,p NzN) .\neq drop(IL,0) = IL .\neq drop(X | IL,NzN) = drop(IL,p NzN) .\neq nil @ IL = IL .\neq (X | L) @ IL = X | (L @ IL) .\neq zip(X | IL,Y | IL2) = X | Y | zip(IL,IL2) .</pre></div>' +
          '<div class="widget" id="w-l6-take"></div>' +
          '<p>注意 <code>take</code> 的第二个参数类型是 <code>Nat</code>（第一条）和 <code>NzNat</code>（第二条）—— 又是<b>用排序做分情形</b>，' +
          '而不是写 <code>if</code>。这样两条规则互不重叠，重写更高效。</p>' +
          cb('w-l6-1', 'open NAT-INF-LIST .\nred take(mkNILFrom(0),5) .\nred take(mkNILFrom(10),3) .\nred take(drop(mkNILFrom(0),4),3) .\nclose', 'mkNILFrom：造一个无限列表') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>小心：drop 的结果还是无限列表</div>' +
          '<p><code>red drop(mkNILFrom(0),4)</code> 会打印出一个「无限长」的项，然后被引擎截断。' +
          '所以<b>永远不要直接 red 一个无限列表</b>，一定要套 <code>take</code>。</p></div>'
      },
      {
        id: 'L6.s5', title: '埃拉托斯特尼筛法：用无限列表求素数',
        html: '<p>算法思想（两千年前就有了）：</p>' +
          '<ol><li>把所有 ≥2 的数排成无限列表 <code>2 3 4 5 6 7 …</code></li>' +
          '<li>取第一个数 p（它是素数），把它的所有倍数筛掉</li>' +
          '<li>对剩下的列表重复第 2 步</li></ol>' +
          '<div class="codebox"><pre>eq primes = sieve(mkNILFrom(2)) .\neq sieve(X | IL) = X | sieve(check(X,IL)) .\neq check(0,IL) = IL .\neq check(NzX,Y | IL) =\n     if NzX divides Y then {check(NzX,IL)} else {Y | check(NzX,IL)} .</pre></div>' +
          '<div class="widget" id="w-l6-sieve"></div>' +
          cb('w-l6-2', 'open ERATOSTHENES-SIEVE .\nred take(primes,10) .\nred take(primes,20) .\nclose', 'primes：前 10 / 20 个素数') +
          '<p>你会看到 <code>2 | 3 | 5 | 7 | 11 | 13 | 17 | 19 | 23 | 29</code>。' +
          '这个定义<b>没有用任何循环</b>，纯靠递归 + 重写，这就是函数式的优雅之处。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">⚙️</span>为什么它能停下来</div>' +
          '<p>因为 <code>take</code> 只要 10 个元素。每次 <code>sieve</code> 只算到「够 10 个」就停，' +
          '后面的 <code>check</code> 永远不会被逼着算。这就是惰性求值的实际效果 —— 但注意，它靠的是 <code>_|_</code> 上的 <code>{strat:(1 0)}</code>；' +
          '如果去掉那个策略，<code>sieve</code> 会试图把整个无限列表算完，直接发散。</p></div>'
      },
      {
        id: 'L6.s6', title: 'Hamming 数：三个无限列表的归并',
        html: '<p><b>Hamming 数</b>（也叫 5-smooth 数）：只含素因子 2、3、5 的正整数，从小到大：</p>' +
          '<div class="codebox"><pre>1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30, ...</pre></div>' +
          '<p>关键洞察：<b>Hamming 数序列 ham 满足</b></p>' +
          '<div class="codebox"><pre>ham = 1 | merge( merge(2*ham, 3*ham), 5*ham )</pre></div>' +
          '<p>也就是「自己乘 2、乘 3、乘 5 之后归并，再在前面加个 1」。这是一个<b>自我引用</b>的定义，' +
          '只有在惰性求值下才成立（否则你要求 ham 就必须先求 ham）。</p>' +
          '<div class="codebox"><pre>eq 2*(X | IL) = 2 * X | 2*(IL) .\neq 3*(X | IL) = 3 * X | 3*(IL) .\neq 5*(X | IL) = 5 * X | 5*(IL) .\neq merge(X | IL,Y | IL2) =\n     if X &lt; Y then {X | merge(IL,Y | IL2)}\n     else {if Y &lt; X then {Y | merge(X | IL,IL2)}\n           else {X | merge(IL,IL2)}} .</pre></div>' +
          '<div class="widget" id="w-l6-ham"></div>' +
          cb('w-l6-3', 'open HAMMING .\nred take(ham,10) .\nred take(ham,15) .\nclose', 'ham：前 10 / 15 个 Hamming 数') +
          '<p>注意 <code>merge</code> 的三个分支：<code>X &lt; Y</code> 取 X、<code>Y &lt; X</code> 取 Y、' +
          '相等时<b>只取一个</b>（<code>X | merge(IL,IL2)</code> 把两个都扔掉了 —— 因为相等说明重复）。' +
          '这个「相等只取一个」是去重的关键，考试常考。</p>' +
          cta('L6-quiz1', '随堂小测 · s策略与无限列表（4 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L6 必背</div>' +
          '<ul><li><code>_|_ : Nat InfList -&gt; InfList {constr strat: (1 0)}</code> —— 那一行里的 <code>(1 0)</code> 就是本章的命门</li>' +
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
      { q: '如果 <code>_|_ : Nat InfList -&gt; InfList</code> 不加 <code>{strat: (1 0)}</code>，<code>red take(primes,10)</code> 会怎样？', opts: ['正常得到 10 个素数', '发散（算不完）', '报排序错误', '返回 nil'], a: 1, why: '默认策略要求先把第 2 个参数（无限尾巴）算成范式，永远算不完。' },
      { q: '<code>(1 0 2 3)</code> 中 <code>0</code> 表示？', opts: ['参数 0（不存在）', '试试根节点自己能不能用规则重写', '停机', '第 0 层'], a: 1, why: '0 是特殊标记：把整个项当作 redex 试一次。' },
      { q: '<code>eq take(X | IL,NzN) = X | take(IL,p NzN) .</code> 里第二个参数为什么用 NzNat？', opts: ['为了快', '用排序做分情形，与 <code>take(IL,0)=nil</code> 互斥，避免用 if', '因为 0 不是自然数', '笔误'], a: 1, why: 'NyNat 排除了 0，两条等式自然覆盖所有情形。' },
      { q: 'Hamming 数的 merge 里，当 <code>X == Y</code> 时为什么要写成 <code>X | merge(IL,IL2)</code>？', opts: ['为了快', '因为 X 和 Y 相等说明重复，只保留一个并同时丢掉两个', '为了排序', '会死循环'], a: 1, why: '去重：相等时两边各前进一个。' }
    ]
  };
  QZ['L6-quiz'] = {
    title: 'L6 综合测验',
    items: [
      { q: 'E-strategy 的作用是？', opts: ['决定等式用哪条', '决定算子的参数按什么顺序归约、何时试根', '决定排序', '决定优先级'], a: 1, why: '精确控制每个算子的计算顺序，从而实现惰性。' },
      { q: '<code>red take(primes,10)</code> 的第 10 个素数是？', opts: ['23', '29', '31', '19'], a: 1, why: '2,3,5,7,11,13,17,19,23,29。' },
      { q: '为什么不能直接 <code>red mkNILFrom(0)</code>？', opts: ['会报错', '无限列表永远算不完，必须用 take 截断', '语法错误', '会返回 nil'], a: 1, why: '一定要 take。' },
      { q: '<code>zip</code> 的作用是？', opts: ['排序', '把两个无限列表交错合并成一个', '去重', '求长度'], a: 1, why: '<code>zip(1|2|…,100|101|…) = 1|100|2|101|…</code>' }
    ]
  };
  QZ['L6-flash'] = {
    title: 'L6 闪卡',
    cards: [
      { q: '无限列表的关键属性？', a: '<code>op _|_ : Nat InfList -&gt; InfList {constr strat: (1 0) prec: 40}</code>' },
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
    minutes: 60,
    goals: [
      '写出多重集模块并解释三个属性的作用',
      '说清 AC 匹配「可能多解」为什么会导致 update 出错',
      '能用 isValid 条件修复，并解释修复原理',
      '会手算 lecture 里 TEST / TEST2 的 8 个用例结果'
    ],
    sections: [
      {
        id: 'L7.s1', title: '多重集是什么：没有顺序、允许重复',
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
          '<p>实际现象（课件里的例子）：对 <code>(a,1) (a,3)</code> 做 <code>update(...,a,2)</code>，结果可能是</p>' +
          '<div class="codebox"><pre>(a,2) (a,3)      -- 只换了一个\n(a,1) (a,2)      -- 换了另一个\n(a,2)            -- 正确（但只是碰巧）</pre></div>' +
          '<p><b>同一份输入，不同次运行结果可能不同</b> —— 这在纯函数式世界里是不可接受的，因为重写系统应该是确定的。</p></div>' +
          '<div class="card why"><div class="card-t"><span class="ico">🔬</span>为什么「结果不确定」这么严重</div>' +
          '<p>因为整个课程建立在「重写系统 == 数学等式」的基础上：如果同一个项能归约到两个不同的范式，' +
          '那么这个系统就<b>不合流（not confluent）</b>，你也就无法用它做任何证明（第 11–13 章全部失效）。</p>' +
          '<p>所以这个 bug 不是「实现细节」，而是<b>理论问题</b>。修复方式也必须从理论上修。</p></div>'
      },
      {
        id: 'L7.s4', title: '修复：用 isValid 加条件，把「猜」变成「确定」',
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
        id: 'L7.s5', title: '八个用例：自己核对一遍',
        html: '<p>课件里给了 8 个用例（A–H）。你可以用下面的代码一次跑完，对照结果：</p>' +
          cb('w-l7-4', 'open TEST .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027a,9) .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027b,9) .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027c,9) .\nred update((\u0027a,1) (\u0027b,2) (\u0027c,3),\u0027d,9) .\nred update((\u0027a,1) (\u0027a,2),\u0027a,9) .\nred update((\u0027a,1) (\u0027a,1),\u0027a,9) .\nred update(emp,\u0027a,9) .\nred update((\u0027a,1),\u0027a,9) .\nclose', 'TEST：8 个 update 用例') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>怎么看「结果是不是对的」</div>' +
          '<p>用例 1–3：键存在且输入合法 → 对应元素被替换，其余不变。<br>' +
          '用例 4：键不存在 → 按 TEST 的天真定义，会一路递归到 <code>emp</code>，结果变成 <code>emp</code>（这就是 bug 的一种表现）。<br>' +
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
      }
    ],
    quiz: 'L7-quiz', flash: 'L7-flash'
  });

  QZ['L7-quiz1'] = {
    title: '随堂小测 · 多重集',
    items: [
      { q: '表达「顺序无关、可重复、有单位元」需要哪三个属性？', opts: ['assoc comm id:', 'prec strat constr', 'assoc id: distrib', 'comm id: rassoc'], a: 0, why: '结合律 + 交换律 + 单位元 = 多重集。' },
      { q: '为什么不用 <code>eq X Y = Y X</code> 表达交换律？', opts: ['语法不允许', '会造成无限重写循环', '会丢失元素', '排序会变'], a: 1, why: '换了又换回来，永不终止。属性交给匹配器处理才好。' },
      { q: 'update 在多重集上出错的根本原因是？', opts: ['等式写错', 'AC 匹配可能选到不同元素，且缺少不变量检查', '排序不够', 'emp 写错'], a: 1, why: '多解 + 无约束 = 结果不确定。' },
      { q: '修复后第一条 ceq 的条件是？', opts: ['<code>#(MS,I) &gt; 0</code>', '<code>isValid((I,N) MS)</code>', '<code>I == J</code>', '<code>MS =/= emp</code>'], a: 1, why: '只有输入合法（键唯一）时才允许替换。' }
    ]
  };
  QZ['L7-quiz'] = {
    title: 'L7 综合测验',
    items: [
      { q: '<code>red emp emp .</code> 的结果？', opts: ['<code>emp emp</code>', '<code>emp</code>', '<code>nil</code>', '报错'], a: 1, why: 'id: emp 让空单元消失。' },
      { q: '<code>#((a,1) (b,2) (a,3), a)</code> 的结果？', opts: ['<code>1</code>', '<code>2</code>', '<code>3</code>', '<code>0</code>'], a: 1, why: 'a 出现两次。' },
      { q: '<code>isValid((a,1) (a,2))</code> 的结果？', opts: ['<code>true</code>', '<code>false</code>', '<code>emp</code>', '不确定'], a: 1, why: '键 a 重复，违反不变量。' },
      { q: '如果一个重写系统不合流，最严重的后果是？', opts: ['速度慢', '同一个项可能有多个范式，无法用来做证明', '语法报错', '排序冲突'], a: 1, why: '范式不唯一 → 数学意义丢失。' }
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

  /* =====================================================================
   * L8 Minila 解释器
   * ===================================================================== */
  CH.push({
    id: 'L8', num: 'L8', group: '第 3 部分 · 语言处理器', short: 'L8 Minila 解释器',
    title: '8. 一个语言处理器：解释器（Interpreter）',
    sub: 'Minila —— 一门只有赋值、if、while 的小语言。先写它的解释器：直接遍历语法树。',
    minutes: 55,
    goals: [
      '说清 Minila 的语句与表达式语法',
      '理解「环境（environment）」就是把变量映射到值的表',
      '会写 eval / execute 的递归定义',
      '能手算一段程序的执行轨迹和环境'
    ],
    sections: [
      {
        id: 'L8.s1', title: 'Minila：小到可以完整写出来的语言',
        html: '<p>要讲「语言处理器」，得有一个语言。Minila 是这门课自造的小语言，只有 5 种语句：</p>' +
          '<table><tr><th>语句</th><th>语法</th><th>含义</th></tr>' +
          '<tr><td>空语句</td><td><code>skip</code></td><td>什么都不做</td></tr>' +
          '<tr><td>赋值</td><td><code>x := E</code></td><td>把表达式 E 的值存进变量 x</td></tr>' +
          '<tr><td>顺序</td><td><code>S1 ; S2</code></td><td>先执行 S1，再执行 S2</td></tr>' +
          '<tr><td>条件</td><td><code>if B then S1 else S2</code></td><td>B 为真执行 S1，否则 S2</td></tr>' +
          '<tr><td>循环</td><td><code>while B do S</code></td><td>B 为真就反复执行 S</td></tr></table>' +
          '<p>表达式（expression）就是整数、变量、加减乘除、比较、逻辑运算。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>为什么用这么小的语言</div>' +
          '<p>因为它<b>小到可以在黑板上完整推导</b>。整门课的目标不是「写一个真编译器」，而是让你看清：' +
          '「解释器 / 虚拟机 / 编译器」这三种东西各自是什么、它们之间有什么关系、为什么它们等价。' +
          '语言一大，细节就淹没思想了。</p></div>'
      },
      {
        id: 'L8.s2', title: '环境（environment）：变量 → 值',
        html: '<p>程序运行到某一步，每个变量都有值。这份「变量到值」的对应关系就叫<b>环境</b>。' +
          '而「变量到值」正是第 5 章的<b>表</b>！所以在 CafeOBJ 里，环境就是一张表：</p>' +
          '<div class="codebox"><pre>((x,3628800) | ((y,11) | empEnv))</pre></div>' +
          '<p>读法：x 的值是 3628800，y 的值是 11，其余变量未定义（用 <code>empEnv</code> 结尾）。</p>' +
          '<p>三个基本操作：</p>' +
          '<table><tr><th>操作</th><th>作用</th></tr>' +
          '<tr><td><code>lookup(Env, X)</code></td><td>查变量 X 的值</td></tr>' +
          '<tr><td><code>update(Env, X, V)</code></td><td>把 X 的值改成 V（没有就新增）</td></tr>' +
          '<tr><td><code>empEnv</code></td><td>空环境（所有变量都未定义）</td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>lookup 未定义的变量</div>' +
          '<p>按 Minila 的约定，未定义变量的值取 <code>0</code>（课件里 <code>lookup</code> 对 <code>empEnv</code> 返回 0）。' +
          '这样就不用处理「未定义」错误，解释器更简单。</p></div>'
      },
      {
        id: 'L8.s3', title: '求值：eval 是一个递归函数',
        html: '<p>表达式求值 <code>eval(E, Env)</code> 完全按语法结构递归：</p>' +
          cbStatic('eq eval(N, Env) = N .                          -- 整数\n' +
            'eq eval(X, Env) = lookup(Env,X) .             -- 变量\n' +
            'eq eval(E1 + E2, Env) = eval(E1,Env) + eval(E2,Env) .\n' +
            'eq eval(E1 * E2, Env) = eval(E1,Env) * eval(E2,Env) .\n' +
            'eq eval(E1 < E2, Env) = eval(E1,Env) < eval(E2,Env) .\n' +
            'eq eval(! E, Env) = not eval(E,Env) .', 'eval 的部分等式') +
          '<p>这就是「结构递归」：<b>对每种语法结构写一条等式，递归处理子结构</b>。和列表的 len / @ 完全同构。</p>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔁</span>看到了吗，还是那个套路</div>' +
          '<p>第 2 章的列表：<code>nil</code> 给一个答案，<code>E|L</code> 用 E 和递归(L)。<br>' +
          '这里的表达式：<code>整数</code> 给一个答案，<code>E1+E2</code> 用递归(E1) 和递归(E2)。<br>' +
          '语言不同，形状相同。<b>这就是函数式编程的核心思维</b>：数据长什么样，函数就长什么样。</p></div>'
      },
      {
        id: 'L8.s4', title: '执行：execute 处理语句',
        html: '<p>语句执行 <code>execute(S, Env)</code> 返回<b>新的环境</b>（因为语句会改变变量）：</p>' +
          cbStatic('eq execute(skip, Env) = Env .\neq execute(X := E, Env) = update(Env, X, eval(E,Env)) .\n' +
            'eq execute(S1 ; S2, Env) = execute(S2, execute(S1, Env)) .\n' +
            'eq execute(if B then S1 else S2, Env) =\n     if eval(B,Env) then {execute(S1,Env)} else {execute(S2,Env)} .\n' +
            'eq execute(while B do S, Env) =\n     if eval(B,Env) then {execute(while B do S, execute(S,Env))} else {Env} .',
            'execute 的五条等式') +
          '<p>注意 <code>;</code> 那一条：<b><code>execute(S1;S2, Env) = execute(S2, execute(S1, Env))</code></b> —— ' +
          '先执行 S1 得到新环境，再在这个新环境上执行 S2。顺序在参数里体现。这是本课最漂亮的一行等式之一。</p>' +
          '<p>还有 <code>while</code>：如果条件为真，就<b>执行一次循环体，然后递归地再执行整个 while</b>。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>考试常问</div>' +
          '<p>「<code>execute(S1;S2,Env)</code> 为什么是 <code>execute(S2, execute(S1,Env))</code> 而不是 <code>execute(S1, execute(S2,Env))</code>？」<br>' +
          '答：因为要让 S2 在 S1 <b>修改后</b>的环境上执行，否则赋值不会生效。</p></div>'
      },
      {
        id: 'L8.s5', title: '跑一遍：三种视角看同一段程序',
        html: '<p>下面这个实验台把同一段 Minila 程序用<b>解释器 / 虚拟机 / 编译器</b>三种方式执行。' +
          '现在只看第一个标签页（解释器），另外两个标签页是第 9、10 章的内容，先混个脸熟。</p>' +
          '<div class="widget" id="w-l8-lab"></div>' +
          '<div class="card"><div class="card-t"><span class="icon">🧪</span>建议自己改程序</div>' +
          '<p>把程序改成 <code>x := 1 ; y := 0 ; while x &lt; 5 do y := y + x ; x := x + 1 od</code>，' +
          '算算 y 最后是多少（1+2+3+4=10）。然后改成 <code>x := 5 ; while x &gt; 0 do x := x - 1 od</code> 看它怎么退出。</p></div>' +
          cta('L8-quiz1', '随堂小测 · 解释器（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L8 必背</div>' +
          '<ul><li><code>execute(X := E, Env) = update(Env, X, eval(E,Env))</code></li>' +
          '<li><code>execute(S1;S2, Env) = execute(S2, execute(S1,Env))</code></li>' +
          '<li><code>while</code> 的等式（条件真就执行循环体再递归）</li></ul></div>'
      }
    ],
    quiz: 'L8-quiz', flash: 'L8-flash'
  });

  QZ['L8-quiz1'] = {
    title: '随堂小测 · 解释器',
    items: [
      { q: '环境（environment）在 CafeOBJ 里被表示成什么？', opts: ['一个栈', '一张从变量到值的表（list of pairs）', '一棵树', '一个整数'], a: 1, why: '((x,3628800) | ((y,11) | empEnv))。' },
      { q: '<code>execute(S1 ; S2, Env)</code> 的正确等式是？', opts: ['<code>execute(S1, execute(S2,Env))</code>', '<code>execute(S2, execute(S1,Env))</code>', '<code>execute(S2,Env)</code>', '<code>Env</code>'], a: 1, why: 'S2 必须在 S1 修改后的环境上执行。' },
      { q: '<code>eval(X, Env)</code> 做的是？', opts: ['返回变量名', '返回 X 在环境中的值', '修改环境', '报错'], a: 1, why: 'lookup(Env, X)。' }
    ]
  };
  QZ['L8-quiz'] = {
    title: 'L8 综合测验',
    items: [
      { q: 'Minila 有哪 5 种语句？', opts: ['skip / 赋值 / 顺序 / if / while', 'if / while / for / return / print', '赋值 / 函数调用', '只有 if'], a: 0, why: '最小完备的指令集。' },
      { q: '未定义变量的值取什么？', opts: ['报错', '0', 'nil', '随机'], a: 1, why: 'lookup(empEnv,X) = 0。' },
      { q: '<code>while</code> 的等式体现了什么？', opts: ['迭代被写成递归', '循环是特殊的赋值', 'while 无法定义', '条件总为真'], a: 0, why: '函数式语言里没有循环，用递归实现迭代。' },
      { q: '解释器的核心结构是？', opts: ['遍历语法树（结构递归）', '字节码循环', '寄存器分配', '垃圾回收'], a: 0, why: 'eval / execute 都是按语法结构递归。' }
    ]
  };
  QZ['L8-flash'] = {
    title: 'L8 闪卡',
    cards: [
      { q: '解释器 execute 的四条核心等式？', a: '<code>skip → Env</code>；<code>X:=E → update(Env,X,eval(E,Env))</code>；<code>S1;S2 → execute(S2,execute(S1,Env))</code>；<code>if</code> 按 eval(B,Env) 选分支。' },
      { q: '环境是什么？', a: '变量 → 值的表，例如 <code>((x,3628800)|((y,11)|empEnv))</code>' },
      { q: 'while 的等式？', a: '<code>eq execute(while B do S, Env) = if eval(B,Env) then {execute(while B do S, execute(S,Env))} else {Env} .</code>' },
      { q: 'Minila 的五种语句？', a: 'skip、赋值、顺序（;）、if-then-else、while-do' }
    ]
  };

  /* =====================================================================
   * L9 Minila 虚拟机
   * ===================================================================== */
  CH.push({
    id: 'L9', num: 'L9', group: '第 3 部分 · 语言处理器', short: 'L9 Minila 虚拟机',
    title: '9. 语言处理器：虚拟机（Virtual Machine）',
    sub: 'pc + 栈 + 环境 三个部件，18 条指令。没有语法树，只有一个指令数组和一个循环。',
    minutes: 55,
    goals: [
      '说清 VM 的三个部件各自存什么',
      '记住关键指令：push / load / store / jump / jumpOnCond / bjump',
      '能画出执行一段指令时 pc 和栈的变化',
      '解释为什么 VM 不需要树'
    ],
    sections: [
      {
        id: 'L9.s1', title: '为什么要虚拟机：把「树」拉成「线」',
        html: '<p>解释器的输入是一棵语法树（if 有分支、while 有循环）。虚拟机完全不同：它执行一个<b>线性的指令数组</b>，' +
          '靠 <code>pc</code>（program counter，程序计数器）指着「现在执行第几条」。</p>' +
          '<table><tr><th></th><th>解释器</th><th>虚拟机</th></tr>' +
          '<tr><td>输入</td><td>语法树</td><td>指令数组</td></tr>' +
          '<tr><td>控制流</td><td>递归调用</td><td><code>pc</code> 跳转</td></tr>' +
          '<tr><td>中间结果</td><td>函数调用栈（隐式）</td><td><b>栈（显式）</b></td></tr>' +
          '<tr><td>变量</td><td>环境</td><td>环境</td></tr></table>' +
          '<p>两种方式<b>计算的东西完全一样</b>，只是组织方式不同。第 10 章会证明它们等价。</p>'
      },
      {
        id: 'L9.s2', title: '三个部件：pc、栈、环境',
        html: '<div class="card"><div class="card-t"><span class="ico">🧱</span>VM 的状态 = (pc, stack, env)</div>' +
          '<ul><li><b>pc</b>：整数，下一条要执行的指令编号</li>' +
          '<li><b>stack</b>：整数列表，用来算表达式（后缀/栈式计算）</li>' +
          '<li><b>env</b>：变量 → 值的表（和第 8 章一样）</li></ul>' +
          '<p>整个 VM 就是一个循环：<b>「取指令 → 改状态」</b>，直到遇到 <code>halt</code>。</p></div>' +
          '<p>用栈算 <code>x + 1</code> 的过程：</p>' +
          '<table><tr><th>指令</th><th>栈（左边是栈顶）</th><th>env</th></tr></table>' +
          '<div class="codebox"><pre>push 1        [1]        {}\nload x        [x的值, 1]  {x: 5}\nadd           [6]        {x: 5}\nstore y       []         {x: 5, y: 6}</pre></div>' +
          '<p>注意顺序：先 <code>push 1</code> 再 <code>load x</code>，栈里是 <code>[x, 1]</code>。' +
          '<code>add</code> 弹出两个相加。<b>操作数的顺序会影响减法和除法的结果</b>，这是考试常考的细节。</p>'
      },
      {
        id: 'L9.s3', title: '指令集：18 条就够',
        html: '<table><tr><th>类别</th><th>指令</th><th>语义</th></tr>' +
          '<tr><td>压栈</td><td><code>push n</code></td><td>把整数 n 压栈</td></tr>' +
          '<tr><td>变量</td><td><code>load x</code> / <code>store x</code></td><td>读变量压栈 / 弹栈写变量</td></tr>' +
          '<tr><td>算术</td><td><code>add sub mul div</code></td><td>弹两个，运算，压回</td></tr>' +
          '<tr><td>比较</td><td><code>lt eq</code></td><td>弹两个，比较，压 1/0</td></tr>' +
          '<tr><td>逻辑</td><td><code>and or not</code></td><td>布尔运算</td></tr>' +
          '<tr><td>跳转</td><td><code>jump n</code></td><td>pc ← n（无条件）</td></tr>' +
          '<tr><td>条件跳转</td><td><code>jumpOnCond n</code></td><td>弹栈，<b>为真</b>则 pc ← n（用于 if 的 then 分支）</td></tr>' +
          '<tr><td>条件跳转</td><td><code>bjump n</code></td><td>弹栈，<b>为假</b>则 pc ← n（用于 while 退出）</td></tr>' +
          '<tr><td>停机</td><td><code>halt</code></td><td>停止</td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>jumpOnCond 与 bjump 的差别</div>' +
          '<p>名字里的 <b>b</b> 是 backward/branch？其实是「<b>branch if false</b>」的意思：' +
          '<code>bjump n</code> = 「若栈顶为假，跳转」。而 <code>jumpOnCond n</code> = 「若栈顶为真，跳转」。</p>' +
          '<p>为什么 while 用 bjump？因为 while 的逻辑是「<b>条件不成立就出去</b>」，正好对应「假则跳转」。</p></div>'
      },
      {
        id: 'L9.s4', title: '看一段真实指令序列',
        html: '<p>把 <code>y := 0 ; while x &lt; 3 do y := y + x ; x := x + 1 od</code> 编译后的指令是：</p>' +
          '<div class="widget" id="w-l9-lab"></div>' +
          '<div class="card"><div class="card-t"><span class="ico">🔍</span>读法</div>' +
          '<p>把「③ 编译器」标签页打开，你会看到一个带编号的指令表。重点看：</p>' +
          '<ul><li><code>bjump k</code>：k 是「循环结束后第一条指令」的编号 —— 它是<b>向前</b>跳（编号变大）</li>' +
          '<li><code>jump top</code>：跳回循环开头 —— 它是<b>向后</b>跳（编号变小）</li>' +
          '<li>if 语句用 <code>jumpOnCond</code>（真→then）+ <code>jump</code>（跳过 else）</li></ul>' +
          '<p>在「② 虚拟机」标签页里，你能看到每一步 pc、指令、栈、环境 —— 这三个东西就是全部。</p></div>' +
          cta('L9-quiz1', '随堂小测 · 虚拟机（3 题）')
      }
    ],
    quiz: 'L9-quiz', flash: 'L9-flash'
  });

  QZ['L9-quiz1'] = {
    title: '随堂小测 · 虚拟机',
    items: [
      { q: 'VM 的三个部件是？', opts: ['pc / 栈 / 环境', '语法树 / 环境', '寄存器 / 内存 / 磁盘', '指令 / 数据'], a: 0, why: 'program counter、stack、environment。' },
      { q: '<code>bjump n</code> 的语义是？', opts: ['栈顶为真则跳到 n', '栈顶为假则跳到 n', '无条件跳到 n', '弹栈'], a: 1, why: 'branch if false。while 用它退出循环。' },
      { q: '栈式计算 <code>3 - 1</code>，正确的指令顺序是？', opts: ['<code>push 1</code> 然后 <code>push 3</code>', '<code>push 3</code> 然后 <code>push 1</code>', '<code>push 2</code>', '<code>load 3</code>'], a: 1, why: '先压被减数 3，再压减数 1，<code>sub</code> 弹两次算 3-1=2。' }
    ]
  };
  QZ['L9-quiz'] = {
    title: 'L9 综合测验',
    items: [
      { q: '虚拟机为什么不需要语法树？', opts: ['因为语法树是错的', '因为控制流已被编译成跳转指令（线性指令 + pc）', '因为不需要计算', '因为栈代替了树'], a: 1, why: 'if/while 变成 jumpOnCond/jump/bjump。' },
      { q: 'if 语句通常用哪些指令实现？', opts: ['只有 jump', 'jumpOnCond（真则跳 then）+ jump（跳过 else）', '只用 bjump', '不用跳转'], a: 1, why: '一个条件跳转 + 一个无条件跳转。' },
      { q: '<code>store x</code> 做什么？', opts: ['把 x 压栈', '弹栈并把值写入变量 x', '清空环境', '跳转'], a: 1, why: '和 load 相反。' },
      { q: 'VM 停机时用哪条指令？', opts: ['stop', 'halt', 'end', 'close'], a: 1, why: 'halt。' }
    ]
  };
  QZ['L9-flash'] = {
    title: 'L9 闪卡',
    cards: [
      { q: 'VM 状态由什么组成？', a: '(pc, stack, env) —— 程序计数器、栈、环境' },
      { q: 'jumpOnCond vs bjump？', a: 'jumpOnCond n：栈顶为<b>真</b>则 pc←n；bjump n：栈顶为<b>假</b>则 pc←n。' },
      { q: 'while 的指令骨架？', a: 'top: 计算条件; bjump end; 循环体; jump top; end: halt' },
      { q: 'if 的指令骨架？', a: '计算条件; jumpOnCond then; else分支; jump end; then: then分支; end:' }
    ]
  };

  /* =====================================================================
   * L10 Minila 编译器
   * ===================================================================== */
  CH.push({
    id: 'L10', num: 'L10', group: '第 3 部分 · 语言处理器', short: 'L10 Minila 编译器',
    title: '10. 语言处理器：编译器（Compiler）',
    sub: '把语法树翻译成指令数组：genForExp / generate / compile。外加一个「为什么它对的」的证明思路。',
    minutes: 50,
    goals: [
      '说清编译器的输入输出（语法树 → 指令序列）',
      '会写 genForExp 的递归等式',
      '理解 generate 里「回填地址」的技巧（len 的作用）',
      '能说明「编译后执行 == 直接解释」这个正确性定理'
    ],
    sections: [
      {
        id: 'L10.s1', title: '编译 = 结构递归地翻译',
        html: '<p>编译器 <code>compile(S)</code> 把语句（语法树）变成指令序列（指令的表）。' +
          '方法和 eval 一样：<b>对每种语法结构写一条等式</b>。</p>' +
          '<table><tr><th>函数</th><th>输入</th><th>输出</th></tr>' +
          '<tr><td><code>genForExp(E)</code></td><td>表达式</td><td>指令序列（算完后结果在栈顶）</td></tr>' +
          '<tr><td><code>generate(S)</code></td><td>语句</td><td>指令序列</td></tr>' +
          '<tr><td><code>compile(S)</code></td><td>语句</td><td>指令序列 + <code>halt</code></td></tr>' +
          '<tr><td><code>len(L)</code></td><td>指令序列</td><td>长度（用来算跳转地址）</td></tr></table>' +
          '<div class="card why"><div class="card-t"><span class="ico">🧩</span>关键难点：跳转地址从哪来</div>' +
          '<p>编译 <code>if</code> 时，你要写一条 <code>jumpOnCond ?</code>，但「跳到哪」要等 then 分支编译完才知道。' +
          '解决办法：<b>先占位，再回填</b>（backpatching）。而回填的地址 = 当前指令数 + 分支长度，所以需要 <code>len</code>。</p></div>'
      },
      {
        id: 'L10.s2', title: 'genForExp：表达式 → 后缀式指令',
        html: '<p>思路非常经典（和栈式计算机一样）：<b>左操作数先入栈、右操作数再入栈、然后执行运算</b>。</p>' +
          cbStatic('eq genForExp(N) = push(N) .\neq genForExp(X) = load(X) .\neq genForExp(E1 + E2) = genForExp(E1) ++ genForExp(E2) ++ add .\neq genForExp(E1 - E2) = genForExp(E1) ++ genForExp(E2) ++ sub .\neq genForExp(E1 * E2) = genForExp(E1) ++ genForExp(E2) ++ mul .\neq genForExp(E1 &lt; E2) = genForExp(E1) ++ genForExp(E2) ++ lt .\neq genForExp(! E) = genForExp(E) ++ not .',
            'genForExp 的部分等式（++ 是连接）') +
          '<p>对照一下 <code>y := y + x</code>：</p>' +
          '<div class="codebox"><pre>genForExp(y + x) = genForExp(y) ++ genForExp(x) ++ add\n                = load y :: load x :: add :: nil\n\n执行：load y → 栈 [y]\n      load x → 栈 [x, y]\n      add    → 栈 [y+x]     ← 栈顶就是结果\ngenerate(y := y + x) = load y ++ load x ++ add ++ store y .</pre></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>顺序陷阱</div>' +
          '<p>如果写成 <code>genForExp(E2) ++ genForExp(E1) ++ sub</code>，减法就反了（变成 E2 - E1）。' +
          '考试里让人「补全 genForExp」时，<b>左先右后</b>是送分点，也是送命点。</p></div>'
      },
      {
        id: 'L10.s3', title: 'generate：if 与 while 的指令骨架',
        html: '<p>用 <code>n</code> 表示「指令序列的长度」，<code>++</code> 表示连接，<code>|</code> 表示把元素放到表头。' +
          '课件里的写法大致是：</p>' +
          cbStatic('-- if B then S1 else S2：\n--   genForExp(B) ++ (jumpOnCond(len(genForExp(B)) + 1) |\n--     generate(S1) ++ (jump(len(generate(S1)) + 1) | generate(S2)))\n\n-- while B do S：\n--   genForExp(B) ++ (bjump(len(genForExp(B)) + len(generate(S)) + 1) |\n--     generate(S) ++ (jump(1) | nil))',
            'generate 的两个骨架（看懂结构即可）') +
          '<p>不要被公式吓到，画出指令骨架就懂了：</p>' +
          '<table><tr><th>if B then S1 else S2</th><th>while B do S</th></tr>' +
          '<tr><td><pre>  [算 B]        ← 0..k-1\n  jumpOnCond A  ← k，真则跳到 A\n  [S2 的指令]   ← else 分支\n  jump END      ← 跳过 then\nA:[S1 的指令]   ← A = k+1+len(S2)+1\nEND:</pre></td>' +
          '<td><pre>TOP:[算 B]        ← 循环开头\n    bjump END     ← 假则退出\n    [S 的指令]\n    jump TOP      ← 回去\nEND:</pre></td></tr></table>' +
          '<p>注意 if 的骨架里，<b>else 分支在前、then 分支在后</b>（因为 jumpOnCond 是「真则跳」）。' +
          '这个顺序很容易记反，考试时先画骨架再写地址。</p>' +
          '<div class="widget" id="w-l10-lab"></div>'
      },
      {
        id: 'L10.s4', title: '正确性：编译后执行 == 直接解释',
        html: '<p>第 8 章有解释器，第 10 章有编译器，两者算出来的结果必须一样。这个性质叫<b>正确性（correctness）</b>：</p>' +
          '<div class="codebox"><pre>execute(P, Env)  ==  executeVM(compile(P), Env)\n\n（左边：直接解释程序 P；右边：编译后交给 VM 执行）</pre></div>' +
          '<p>要证明它，需要一条更强的「辅助命题」：</p>' +
          '<div class="codebox"><pre>eval(E, Env) == top(run(genForExp(E), emptyStack, Env))</pre></div>' +
          '<p>因为表达式编译后，结果在栈顶，所以必须连「栈」一起说。' +
          '这叫<b>加强归纳假设（strengthening the induction hypothesis）</b> —— 第 11–13 章会反复用到这个技巧。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>考试怎么答「三者关系」</div>' +
          '<p>解释器：直接按语法树递归求值，最直观。<br>' +
          '虚拟机：执行线性指令，靠 pc 跳转 + 显式栈，更接近真实机器。<br>' +
          '编译器：把树翻译成指令，让 VM 去执行。<br>' +
          '<b>三者计算的函数相同，差别只在「中间表示」和「控制流组织形式」。</b></p></div>' +
          cta('L10-quiz1', '随堂小测 · 编译器（3 题）')
      }
    ],
    quiz: 'L10-quiz', flash: 'L10-flash'
  });

  QZ['L10-quiz1'] = {
    title: '随堂小测 · 编译器',
    items: [
      { q: '<code>genForExp(E1 - E2)</code> 的正确翻译是？', opts: ['genForExp(E2) ++ genForExp(E1) ++ sub', 'genForExp(E1) ++ genForExp(E2) ++ sub', 'sub ++ genForExp(E1)', 'genForExp(E1 - E2)'], a: 1, why: '左先右后，否则减法反了。' },
      { q: '编译 if 时为什么需要「回填地址」？', opts: ['因为指令太长', '因为跳转目标要等分支编译完才知道长度', '因为 pc 会变', '因为要排序'], a: 1, why: '先占位，用 len 算出地址再填。' },
      { q: 'while 循环用哪条指令退出？', opts: ['jumpOnCond', '<code>bjump</code>（假则跳）', 'halt', 'store'], a: 1, why: '条件不成立就跳出循环。' }
    ]
  };
  QZ['L10-quiz'] = {
    title: 'L10 综合测验',
    items: [
      { q: 'compile 与 generate 的差别？', opts: ['没有差别', 'compile 在 generate 的结果后面加 halt', 'generate 更快', 'compile 不处理 while'], a: 1, why: '编译的产物要能停机。' },
      { q: '正确性定理说的是？', opts: ['编译比解释快', 'execute(P,Env) == executeVM(compile(P),Env)', 'VM 不需要环境', '编译器不会出错'], a: 1, why: '两种执行方式结果相同。' },
      { q: '为什么证明正确性时需要加强归纳假设？', opts: ['因为原命题不成立', '因为表达式编译后结果在栈上，必须连栈一起陈述', '为了简洁', '因为 VM 有 bug'], a: 1, why: '加强假设：eval(E,Env) == top(run(genForExp(E), emptyStack, Env))。' },
      { q: 'genForExp 的递归结构体现了什么？', opts: ['结构递归', '循环', '动态规划', '回溯'], a: 0, why: '对语法结构递归翻译。' }
    ]
  };
  QZ['L10-flash'] = {
    title: 'L10 闪卡',
    cards: [
      { q: 'genForExp(E1+E2) 的等式？', a: '<code>genForExp(E1) ++ genForExp(E2) ++ (add | nil)</code>（左先右后）' },
      { q: 'if 的指令骨架？', a: '算 B; jumpOnCond A; [else 指令]; jump END; A:[then 指令]; END:' },
      { q: 'while 的指令骨架？', a: 'TOP: 算 B; bjump END; [循环体]; jump TOP; END:' },
      { q: '正确性定理？', a: '<code>execute(P,Env) == executeVM(compile(P),Env)</code>' },
      { q: '加强归纳假设的形式？', a: '<code>eval(E,Env) == top(run(genForExp(E), emptyStack, Env))</code>' }
    ]
  };
})();
