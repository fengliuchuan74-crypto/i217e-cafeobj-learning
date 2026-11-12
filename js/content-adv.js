/* =====================================================================
 * content-adv.js — L11 ~ L14 + 期末冲刺
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});
  var W = window.W;
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
    sections: [
      {
        id: 'L11.s1', title: '皮亚诺自然数 PNAT1',
        html: '<p>验证的对象是这个模块（第 11 章的全部定理都关于它）：</p>' +
          cbStatic('mod! PNAT1 {\n  [PNat]\n  op 0 : -> PNat {constr} .\n  op s : PNat -> PNat {constr} .\n  vars X Y Z : PNat .\n  eq (0 = s(Y)) = false .\n  eq (s(X) = s(Y)) = (X = Y) .\n  op _+_ : PNat PNat -> PNat .\n  eq 0 + Y = Y .                -- (+1)\n  eq s(X) + Y = s(X + Y) .      -- (+2)\n  op _*_ : PNat PNat -> PNat .\n  eq 0 * Y = 0 .                -- (*1)\n  eq s(X) * Y = (X * Y) + Y .   -- (*2)\n  op fact1 : PNat -> PNat .\n  eq fact1(0) = s(0) .          -- (f1-1)\n  eq fact1(s(X)) = s(X) * fact1(X) .  -- (f1-2)\n  op fact2 : PNat -> PNat .\n  op sfact2 : PNat PNat -> PNat .\n  eq fact2(X) = sfact2(X,s(0)) .     -- (f2)\n  eq sfact2(0,Y) = Y .               -- (sf2-1)\n  eq sfact2(s(X),Y) = sfact2(X,s(X) * Y) .  -- (sf2-2)\n}', 'PNAT1 完整源码（背下来）') +
          '<p>要点：</p><ul>' +
          '<li><code>0</code> 和 <code>s</code> 是<b>构造子</b>：所有自然数都是 <code>s(s(...0))</code> 这个形状。</li>' +
          '<li><code>_=_</code> 由内建模块提供基本规则（<code>X = X</code> 为 true，<code>true = false</code> 为 false），' +
          '再加上两条：<code>0 = s(Y)</code> 为 false、<code>s(X) = s(Y)</code> 化成 <code>X = Y</code>。</li>' +
          '<li><code>fact2</code> 是<b>尾递归</b>版本：靠累加器 <code>Y</code>。它的正确性就是本章最后一道大题。</li></ul>' +
          cb('w-l11-1', 'open PNAT1 .\nred s(s(0)) + s(s(s(0))) .\nred s(s(0)) * s(s(0)) .\nred fact1(s(s(s(0)))) .\nred fact2(s(s(s(s(0))))) .\nclose', '先跑一跑，热身') +
          '<p>注意 <code>red s(s(0)) + s(s(s(0)))</code> 的中间步骤：<code>s(s(0)) + s(s(s(0))) → s(s(0) + s(s(s(0)))) → …</code>，' +
          '每用一次 <code>(+2)</code> 就去掉一个 <code>s</code>，最后靠 <code>(+1)</code> 收尾。<b>这就是归纳法的计算对应物</b>。</p>'
      },
      {
        id: 'L11.s2', title: '结构归纳法：一段话讲清',
        html: '<div class="card exam"><div class="card-t"><span class="ico">📐</span>核心命题（必须一字不差记住）</div>' +
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
        html: '<p><b>证明分数（proof score）</b>= 用 CafeOBJ 写的证明。核心套路只有三步：</p>' +
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
          cb('w-l11-2', 'open PNAT1 .\n-- I. base case\nops y z : -> PNat .\nred (0 + y) + z = 0 + (y + z) .\nclose\n\nopen PNAT1 .\n-- II. induction case\nops x y z : -> PNat .\neq (x + Y) + Z = x + (Y + Z) .\nred (s(x) + y) + z = s(x) + (y + z) .\nclose', 'assoc+ 的完整证明分数') +
          '<p>两个 <code>red</code> 都会输出 <code>true</code> —— 这就是「定理证完了」的标志。</p>' +
          cta('L11-quiz1', '随堂小测 · 归纳法基础（3 题）')
      },
      {
        id: 'L11.s4', title: '定理 2：交换律，以及「为什么要引理」',
        html: '<p><b>X + Y = Y + X</b>。直接做归纳会卡住，这是全章最重要的一课。</p>' +
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
          cb('w-l11-3', 'open PNAT1 .\n-- Lemma 1 (rz+): X + 0 = X\nop x : -> PNat .\nred 0 + 0 = 0 .\nclose\nopen PNAT1 .\nop x : -> PNat .\neq x + 0 = x .\nred s(x) + 0 = s(x) .\nclose', '引理 1（rz+）的两半') +
          cb('w-l11-4', 'open PNAT1 .\n-- Lemma 2 (rs+): X + s(Y) = s(X + Y)\nop y : -> PNat .\nred 0 + s(y) = s(0 + y) .\nclose\nopen PNAT1 .\nops x y : -> PNat .\neq x + s(Y) = s(x + Y) .\nred s(x) + s(y) = s(s(x) + y) .\nclose', '引理 2（rs+）的两半') +
          cb('w-l11-5', 'open PNAT1 .\n-- Theorem 2 (comm+) base case\nop y : -> PNat .\neq X + 0 = X .            -- (rz+)\nred 0 + y = y + 0 .\nclose\n\nopen PNAT1 .\n-- Theorem 2 (comm+) induction case\nops x y : -> PNat .\neq X + s(Y) = s(X + Y) .  -- (rs+)\neq x + Y = Y + x .        -- (IH)\nred s(x) + y = y + s(x) .\nclose', 'comm+ 的完整证明（含两个引理）') +
          '<div class="card tip"><div class="card-t"><span class="ico">💡</span>从这个例子学到的通用方法</div>' +
          '<ol><li>归纳证明卡住时，<b>看是哪一项化不动</b>。</li>' +
          '<li>把「化不动的那个等式」<b>猜成引理</b>（例如 <code>y + 0 = y</code> → 一般化成 <code>X + 0 = X</code>）。</li>' +
          '<li>引理要<b>比需要的更一般</b>（把 y 换成变量 X），否则单独证不出来。</li>' +
          '<li>引理本身用归纳法证明，或者作为「已知定理」引用。</li></ol>' +
          '<p>这就是数学证明的真实过程：<b>不是一次成功，而是不断发现「我还需要另一个事实」</b>。</p></div>'
      },
      {
        id: 'L11.s5', title: '定理 3：乘法结合律与分配律',
        html: '<p><b>assoc*：(X * Y) * Z = X * (Y * Z)</b></p>' +
          '<p>基础情形：两边都 <code>→ 0</code>（用 *1）✓</p>' +
          '<p>归纳情形：(s(x) * y) * z 和 s(x) * (y * z)：</p>' +
          '<div class="codebox"><pre>左边 (s(x) * y) * z → ((x * y) + y) * z      by (*2)\n右边 s(x) * (y * z) → (x * (y * z)) + (y * z)  by (*2)</pre></div>' +
          '<p>这两个项没法化成同一个，需要<b>分配律</b>：</p>' +
          '<p><b>Lemma 3 (d*o+)　(X + Y) * Z = (X * Z) + (Y * Z)</b></p>' +
          '<p>用分配律：左边 <code>((x*y) + y) * z → ((x*y)*z) + (y*z) → (x*(y*z)) + (y*z)</code>（第二步用 IH），正好等于右边。</p>' +
          '<p>分配律本身也要对 X 归纳（base 用 +1、*1；ind 用 *2 和 IH）。</p>' +
          cb('w-l11-6', 'open PNAT1 .\n-- assoc* base\nops y z : -> PNat .\nred (0 * y) * z = 0 * (y * z) .\nclose\n\nopen PNAT1 .\n-- assoc* induction, with distributivity as lemma\nops x y z : -> PNat .\neq (X + Y) * Z = (X * Z) + (Y * Z) .   -- (d*o+)\neq (x * Y) * Z = x * (Y * Z) .           -- (IH)\nred (s(x) * y) * z = s(x) * (y * z) .\nclose', 'assoc*（借助分配律）') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>引理的顺序很重要</div>' +
          '<p>必须先证 <code>d*o+</code>，才能用它证 <code>assoc*</code>。证明是有<b>依赖顺序</b>的：' +
          '后面的定理可以用前面的定理/引理，反之不行。</p></div>'
      },
      {
        id: 'L11.s6', title: '定理 5：尾递归阶乘的正确性（压轴）',
        html: '<p><b>要证：fact1(X) = fact2(X)</b>（两个实现算的是同一个函数）</p>' +
          '<p>基础情形：<code>fact1(0) → s(0)</code>；<code>fact2(0) → sfact2(0,s(0)) → s(0)</code>。✓</p>' +
          '<p>归纳情形：假设 <code>fact1(x) = fact2(x)</code>，要证 <code>fact1(s(x)) = fact2(s(x))</code>。</p>' +
          '<div class="codebox"><pre>左边 fact1(s(x)) → s(x) * fact1(x) → s(x) * fact2(x)\n                → s(x) * sfact2(x,s(0))        by (f1-2), IH, (f2)\n\n右边 fact2(s(x)) → sfact2(s(x),s(0))\n                → sfact2(x,s(x) * s(0))        by (f2), (sf2-2)</pre></div>' +
          '<p>还差一步：<code>s(x) * sfact2(x,s(0))</code> 要等于 <code>sfact2(x,s(x) * s(0))</code>。' +
          '这个等式太具体了，推广成：</p>' +
          '<p><b>Lemma 6 (p-sf2)　Y * sfact2(X,Z) = sfact2(X,Y * Z)</b></p>' +
          '<p>它的归纳证明（对 X）会用到 <code>assoc*</code> 和 <code>comm*</code>，所以要在 <b>PNAT3</b>（已声明 + 和 * 都是 assoc comm 的模块）里做。</p>' +
          cb('w-l11-7', 'open PNAT3 .\n-- p-sf2 base\nops y z : -> PNat .\nred y * sfact2(0,z) = sfact2(0,y * z) .\nclose\n\nopen PNAT3 .\n-- p-sf2 induction\nops x y z : -> PNat .\neq Y * sfact2(x,Z) = sfact2(x,Y * Z) .   -- (IH)\nred y * sfact2(s(x),z) = sfact2(s(x),y * z) .\nclose', 'p-sf2 的两个分支') +
          cb('w-l11-8', 'open PNAT3 .\n-- ctrf base case\nred fact1(0) = fact2(0) .\nclose', 'ctrf 的基础情形') +
          '<div class="card exam"><div class="card-t"><span class="ico">🏆</span>这道题为什么是压轴</div>' +
          '<p>它同时用到了：结构归纳、IH 的正确写法、引理的构造与泛化、assoc/comm 属性、以及「两个不同实现的等价性」这个真实目标。' +
          '考试如果出一道 20 分的证明题，大概率就是这个形状（换了函数而已，比如求和、幂、或列表的 reverse）。</p>' +
          '<p><b>答题顺序建议：</b>先写定理 → 说明对谁归纳 → 写 base（含手算步骤）→ 写 ind（含 IH 声明和手算步骤）→ ' +
          '如果卡住就说「需要引理 L，其内容为…，证明略/附后」→ 给出证明分数代码。</p></div>' +
          cta('L11-quiz2', '随堂小测 · 证明技巧（4 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L11 必背</div>' +
          '<ul><li>结构归纳的 (A)(B) 等价表述（一字不差）</li>' +
          '<li>IH 的写法：<code>eq (x + Y) + Z = x + (Y + Z) .</code>（小写常量 + 大写变量）</li>' +
          '<li>四个引理：rz+ <code>X+0=X</code>、rs+ <code>X+s(Y)=s(X+Y)</code>、d*o+、p-sf2</li>' +
          '<li>证明分数的五步：open / ops / eq IH / red / close</li></ul></div>'
      }
    ],
    quiz: 'L11-quiz', flash: 'L11-flash'
  });

  QZ['L11-quiz1'] = {
    title: '随堂小测 · 归纳法',
    items: [
      { q: '结构归纳法的 induction case 是什么？', opts: ['证 l(0)=r(0)', '假设 l(x)=r(x)，证 l(s(x))=r(s(x))', '证 l(X)=r(X)', '证 X 存在'], a: 1, why: '基础情形 + 归纳情形（含 IH）= 全称命题。' },
      { q: '证明分数里 IH 的正确写法是？', opts: ['<code>eq (x + y) + z = x + (y + z) .</code>', '<code>eq (x + Y) + Z = x + (Y + Z) .</code>', '<code>eq (X + Y) + Z = X + (Y + Z) .</code>', '<code>eq x = y .</code>'], a: 1, why: '新常量 x 配原变量 Y Z，才能对任意 Y Z 使用。' },
      { q: '证明分数最后用什么检查？', opts: ['<code>show</code>', '<code>red 目标等式 .</code>，结果为 true 即证完', '<code>close</code>', '<code>eq</code>'], a: 1, why: 'red 归约到 true。' }
    ]
  };
  QZ['L11-quiz2'] = {
    title: '随堂小测 · 证明技巧',
    items: [
      { q: '证 comm+ 的基础情形时卡在 <code>y + 0</code>，该怎么办？', opts: ['换一个变量', '猜引理 <code>X + 0 = X</code> 并单独证明', '放弃', '改成归纳 Y'], a: 1, why: 'rz+ 就是为此而生的引理。' },
      { q: '证 comm+ 的归纳情形卡在 <code>y + s(x)</code>，需要哪个引理？', opts: ['rz+', 'rs+ <code>X + s(Y) = s(X + Y)</code>', 'assoc+', 'd*o+'], a: 1, why: '让「右后继」能化开。' },
      { q: '引理为什么要写得比实际需要「更一般」？', opts: ['为了好看', '因为太具体的等式无法单独用归纳法证明', '为了减少代码', '因为 CafeOBJ 要求'], a: 1, why: '例如把 y+0=y 泛化成 X+0=X。' },
      { q: 'p-sf2 的证明为什么要在 PNAT3 而不是 PNAT1 里做？', opts: ['PNAT1 没有 sfact2', '因为要用到 + 和 * 的 assoc/comm 属性', '因为更快', 'PNAT3 才有 bool'], a: 1, why: 'PNAT2/PNAT3 逐步加上了 assoc/comm。' }
    ]
  };
  QZ['L11-quiz'] = {
    title: 'L11 综合测验',
    items: [
      { q: 'assoc+ 的归纳情形最后两边化成什么？', opts: ['<code>s(x + (y + z))</code>', '<code>s(s(x))</code>', '<code>0</code>', '<code>x + y</code>'], a: 0, why: '左 → s((x+y)+z) → s(x+(y+z))；右 → s(x+(y+z))。' },
      { q: 'comm+ 需要几个引理？', opts: ['0 个', '1 个', '2 个（rz+ 和 rs+）', '3 个'], a: 2, why: '基础情形要 rz+，归纳情形要 rs+。' },
      { q: 'assoc* 需要哪个引理？', opts: ['rz+', 'rs+', 'd*o+（分配律）', 'p-sf2'], a: 2, why: '需要 (X+Y)*Z = (X*Z)+(Y*Z)。' },
      { q: '尾递归阶乘正确性的辅助引理是？', opts: ['rz*', 'p-sf2 <code>Y * sfact2(X,Z) = sfact2(X,Y*Z)</code>', 'assoc+', '没有'], a: 1, why: '把 s(x)*sfact2(x,s(0)) 化成 sfact2(x, s(x)*s(0))。' }
    ]
  };
  QZ['L11-flash'] = {
    title: 'L11 闪卡',
    cards: [
      { q: '结构归纳法两个分支？', a: 'base: l(0) = r(0)；ind: 若 l(x)=r(x) 则 l(s(x))=r(s(x))，x 为新常量。' },
      { q: '证明分数的五步？', a: 'open 模块 / ops 新常量 / eq IH / red 目标 / close' },
      { q: '四个引理？', a: 'rz+ X+0=X；rs+ X+s(Y)=s(X+Y)；d*o+ (X+Y)*Z=(X*Z)+(Y*Z)；p-sf2 Y*sfact2(X,Z)=sfact2(X,Y*Z)' },
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
    sections: [
      {
        id: 'L12.s1', title: 'LIST1 与 LIST2',
        html: cbStatic('mod! LIST1 {\n  pr(BOOL)\n  [Elt]\n  [List]\n  op nil : -> List {constr}\n  op _|_ : Elt List -> List {constr prec: 40}\n  vars E E2 : Elt\n  vars L1 L2 : List\n  eq (nil = E | L1) = false .\n  eq (E | L1 = E2 | L2) = (E = E2) and (L1 = L2) .\n  op _@_ : List List -> List {prec: 40}\n  eq nil @ L2 = L2 .                        -- (@1)\n  eq (E | L1) @ L2 = E | (L1 @ L2) .         -- (@2)\n  op rev1 : List -> List\n  eq rev1(nil) = nil .\n  eq rev1(E | L1) = rev1(L1) @ (E | nil) .\n  op rev2 : List -> List\n  op sr2 : List List -> List\n  eq rev2(L1) = sr2(L1,nil) .\n  eq sr2(nil,L2) = L2 .                      -- (sr2-1)\n  eq sr2(E | L1,L2) = sr2(L1,E | L2) .       -- (sr2-2)\n}\n\nmod! LIST2 {\n  pr(LIST1)\n  op _@_ : List List -> List {assoc prec: 40}\n}', 'LIST1 / LIST2 源码') +
          '<p>两个 reverse 实现：</p>' +
          '<ul><li><code>rev1</code>：递归地把头搬到「已经反转的尾巴」的后面。直观，但每次 <code>@</code> 都要遍历，慢。</li>' +
          '<li><code>rev2</code>：用累加器 <code>sr2(L, acc)</code>，把元素依次塞到 acc 前面。快（尾递归）。</li></ul>' +
          '<p>问题：<b>它们相等吗？</b>这就是 Theorem 2 (ctrr)。</p>' +
          cb('w-l12-1', 'open LIST2 .\nops a b c d : -> Elt .\nred rev1(a | b | c | nil) .\nred rev2(a | b | c | nil) .\nred (a | b | nil) @ (c | d | nil) .\nred sr2(a | b | nil, c | nil) .\nclose', '先跑一跑（Elt 是抽象排序，所以用常量 a b c d）') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>LIST1 里没有 assoc</div>' +
          '<p><code>LIST1</code> 的 <code>@</code> 没有 assoc 属性，所以 <code>(L1 @ L2) @ L3</code> 和 <code>L1 @ (L2 @ L3)</code> 是<b>不同的项</b>，' +
          '需要证明它们相等。<code>LIST2</code> 里加了 <code>{assoc}</code>，这时它们自动相同 —— 证明就变成了一行。</p>' +
          '<p><b>考点</b>：为什么有时要证结合律、有时不用？<b>答：取决于模块里有没有声明 assoc 属性。</b></p></div>'
      },
      {
        id: 'L12.s2', title: '列表上的结构归纳',
        html: '<p>列表的构造子是 <code>nil</code> 和 <code>_|_</code>，所以归纳法变成：</p>' +
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
          cb('w-l12-2', 'open LIST1 .\n-- assoc@ base\nops l2 l3 : -> List .\nred (nil @ l2) @ l3 = nil @ (l2 @ l3) .\nclose\n\nopen LIST1 .\n-- assoc@ induction\nops e : -> Elt .\nops l1 l2 l3 : -> List .\neq (l1 @ L2) @ L3 = l1 @ (L2 @ L3) .   -- (IH)\nred ((e | l1) @ l2) @ l3 = (e | l1) @ (l2 @ l3) .\nclose', 'assoc@ 的证明分数') +
          '<p>顺便验证：在 LIST2 里同一件事只要一行 <code>red (l1 @ l2) @ l3 = l1 @ (l2 @ l3) .</code> 就得到 true，因为 assoc 属性直接处理了。</p>'
      },
      {
        id: 'L12.s3', title: '定理 2：尾递归 reverse 的正确性',
        html: '<p><b>要证：rev1(L1) = rev2(L1)</b></p>' +
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
          cb('w-l12-3', 'open LIST2 .\n-- p-sr2 base\nop l2 : -> List .\nop e2 : -> Elt .\nred sr2(nil,e2 | l2) = sr2(nil,nil) @ (e2 | l2) .\nclose\n\nopen LIST2 .\n-- p-sr2 induction\nops e e2 : -> Elt .\nops l1 l2 : -> List .\neq sr2(l1,E2 | L2) = sr2(l1,nil) @ (E2 | L2) .   -- (IH)\nred sr2(e | l1,e2 | l2) = sr2(e | l1,nil) @ (e2 | l2) .\nclose', 'p-sr2 的证明分数') +
          cb('w-l12-4', 'open LIST2 .\n-- ctrr base\nred rev1(nil) = rev2(nil) .\nclose\n\nopen LIST2 .\n-- ctrr induction\nops e : -> Elt .\nop l1 : -> List .\neq sr2(L1,E2 | L2) = sr2(L1,nil) @ (E2 | L2) .  -- (p-sr2)\nop l : -> List .\neq rev1(l1) = rev2(l1) .                       -- (IH)\nred rev1(e | l1) = rev2(e | l1) .\nclose', 'ctrr 的证明分数') +
          '<div class="card tip"><div class="card-t"><span class="ico">🧠</span>三个定理的依赖顺序</div>' +
          '<p><code>assoc@</code> → <code>p-sr2</code> → <code>ctrr</code>。考试里如果只让你证 ctrr，' +
          '你可以说「设 assoc@ 与 p-sr2 已证，现证 ctrr」，然后直接用它们 —— 这是允许的。</p></div>'
      },
      {
        id: 'L12.s4', title: '自然数 vs 列表：证明结构对照',
        html: '<table><tr><th></th><th>自然数 PNat</th><th>列表 List</th></tr>' +
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
      { q: '对列表做归纳，归纳情形需要引入几个新常量？', opts: ['1 个', '2 个（头和尾）', '3 个', '0 个'], a: 1, why: '构造子 <code>_|_</code> 有两个参数：<code>e</code> 和 <code>l1</code>。' },
      { q: 'LIST2 里不用证 assoc@ 的原因是？', opts: ['因为已经证明过', '@ 有 assoc 属性，匹配时自动视为同一个项', '因为 @ 是构造子', '因为列表有限'], a: 1, why: '属性让匹配器处理结合律，不会产生重写循环。' },
      { q: 'p-sr2 说的是？', opts: ['<code>sr2(L1,E2|L2) = sr2(L1,nil) @ (E2|L2)</code>', '<code>rev1 = rev2</code>', '<code>(L1@L2)@L3 = L1@(L2@L3)</code>', '<code>sr2(nil,L) = L</code>'], a: 0, why: '「往累加器塞元素」= 「算完后接上」。' }
    ]
  };
  QZ['L12-quiz'] = {
    title: 'L12 综合测验',
    items: [
      { q: '三个定理的正确证明顺序？', opts: ['ctrr → p-sr2 → assoc@', 'assoc@ → p-sr2 → ctrr', 'p-sr2 → ctrr → assoc@', '任意顺序'], a: 1, why: '后面的用前面的。' },
      { q: 'rev2 比 rev1 好的地方是？', opts: ['更短', '尾递归，用累加器，效率更高', '不需要 @ ', '不需要归纳'], a: 1, why: 'sr2 是尾递归。' },
      { q: 'assoc@ 的基础情形两边都化成？', opts: ['<code>nil</code>', '<code>l2 @ l3</code>', '<code>e | l1</code>', '<code>l1</code>'], a: 1, why: 'nil @ x = x 用两次。' },
      { q: '列表归纳与自然数归纳的共同点是？', opts: ['都要用 IH', '都要两个引理', '都只对 nil 成立', '都用到乘法'], a: 0, why: 'base + ind + IH 是通用骨架。' }
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
    sections: [
      {
        id: 'L13.s1', title: '为什么函数式编程课会讲量子？',
        html: '<p>因为<b>量子态本身就是一个代数结构，量子门就是等式</b>。整门课的方法完全适用：</p>' +
          '<table><tr><th>本课的概念</th><th>在量子里的对应</th></tr>' +
          '<tr><td>排序（sort）</td><td><code>QState</code>（量子态）、<code>Comp</code>（复数振幅）、<code>Bit</code></td></tr>' +
          '<tr><td>算子</td><td><code>_@_</code>（张量积 ⊗）、<code>_+_</code>（叠加）、<code>__</code>（振幅乘态）</td></tr>' +
          '<tr><td>等式</td><td>门的作用规则，例如 <code>H |0&gt; = ...</code></td></tr>' +
          '<tr><td>重写</td><td>「把电路一步步算下去」</td></tr>' +
          '<tr><td>结构归纳 / 分情形</td><td>验证协议正确性时对测量结果分类讨论</td></tr></table>' +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>这是本课最「应用」的一章</div>' +
          '<p>它想说明的是：<b>「用代数规格描述系统 + 用重写推演 + 用归纳证明」这套方法，不局限于列表和自然数</b>。' +
          '量子协议、分布式协议（第 10 章前后的互斥协议）、安全协议，都可以这么干。</p>' +
          '<p>考试层面：这一章通常考<b>概念 + 状态推演</b>，不会让你证完整的量子定理（太长了）。</p></div>'
      },
      {
        id: 'L13.s2', title: '量子比特、叠加与张量积',
        html: '<p>一个<b>量子比特（qubit）</b>写成：</p>' +
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
        html: '<table><tr><th>门</th><th>作用</th><th>矩阵直觉</th></tr>' +
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
        html: '<p><b>目标</b>：Alice 有一个量子态 <code>a|0&gt; + b|1&gt;</code>（她不知道 a、b），' +
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
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>「验证」在这里指什么</div>' +
          '<p>用 CafeOBJ 写出量子态与门，然后把「电路执行完」表示成一个项，' +
          '<b>对测量结果的 4 种情形分别化简</b>，得到 4 个形如 <code>1/4 * (a|0&gt;+b|1&gt;)</code> 的项，' +
          '加起来用<b>归一化</b>化简成 <code>a|0&gt;+b|1&gt;</code>。于是证明「不管测到什么都传对了」。</p>' +
          '<p>这就是第 11、12 章的「分情形（case splitting）」+ 「结构归纳」思想的复用：<b>把无限/不可控的情况切成有限几类，逐类验证</b>。</p></div>' +
          cta('L13-quiz1', '随堂小测 · 量子基础（3 题）')
      }
    ],
    quiz: 'L13-quiz', flash: 'L13-flash'
  });

  QZ['L13-quiz1'] = {
    title: '随堂小测 · 量子隐形传态',
    items: [
      { q: '归一化条件是？', opts: ['a + b = 1', '|a|² + |b|² = 1', 'a = b', 'a·b = 1'], a: 1, why: '所有结果的概率之和必须为 1。' },
      { q: 'CafeOBJ 里哪个算子表示张量积 ⊗？', opts: ['<code>_+_</code>', '<code>_@_</code>', '<code>__</code>', '<code>_*_</code>'], a: 1, why: 'QS 模块里 <code>op _@_ : QState QState -&gt; QState {id: |&gt;}</code>。' },
      { q: '隐形传态最后 Bob 需要做什么？', opts: ['再测一次', '根据 Alice 的两位测量结果施加 X 和/或 Z 修正', '复制量子态', '什么都不做'], a: 1, why: 'm1=1 则 X，m0=1 则 Z。' }
    ]
  };
  QZ['L13-quiz'] = {
    title: 'L13 综合测验',
    items: [
      { q: 'H 门作用在 |0&gt; 上得到？', opts: ['|1&gt;', '<code>(|0&gt;+|1&gt;)/√2</code>', '<code>(|0&gt;-|1&gt;)/√2</code>', '|0&gt;'], a: 1, why: 'H|0&gt; = (|0&gt;+|1&gt;)/√2。' },
      { q: 'CX 门的作用是？', opts: ['总是翻转目标', '控制位为 1 时翻转目标位', '制造相位', '测量'], a: 1, why: 'Controlled-NOT。' },
      { q: '验证隐形传态时的关键方法是？', opts: ['穷举 a、b 的所有取值', '对 Alice 测量的 4 种情形分别化简 + 用归一化', '只需要测一次', '用归纳法对 a 归纳'], a: 1, why: '分情形（case splitting）。' },
      { q: 'Z 门的作用是？', opts: ['把 |0&gt; 变 |1&gt;', '保持 |0&gt; 不变但把 |1&gt; 变成 −|1&gt;', '测量', '制造纠缠'], a: 1, why: '相位翻转。' }
    ]
  };
  QZ['L13-flash'] = {
    title: 'L13 闪卡',
    cards: [
      { q: 'qubit 的表示与归一化？', a: '<code>a|0&gt; + b|1&gt;</code>，且 |a|²+|b|²=1。' },
      { q: '四个门？', a: 'H（造叠加）、CX（造纠缠）、X（NOT）、Z（相位翻转）。' },
      { q: '隐形传态三步？', a: '① 共享 Bell 对 ② Alice 做 CX+H 并测量两位 ③ 经典通信后 Bob 施加 X/Z 修正。' },
      { q: '验证策略？', a: '对 4 种测量结果分情形化简，再用归一化合并。' }
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
    sections: [
      {
        id: 'L14.s1', title: '手写证明分数的三个隐患',
        html: '<p>第 11、12 章我们都是手写证明分数。它有三个坑：</p>' +
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
        html: '<table><tr><th>命令</th><th>作用</th></tr>' +
          '<tr><td><code>:goal { eq [label] : 等式 . }</code></td><td>声明要证的目标（可以一次给多条）。模块要事先 open。</td></tr>' +
          '<tr><td><code>:ind on X:S</code></td><td>指定对哪个变量做（同时）结构归纳</td></tr>' +
          '<tr><td><code>:apply (si)</code></td><td><b>si</b> = structural induction。执行结构归纳，把当前目标换成 n 个子目标（n = 构造子个数），并为非常量构造子引入新常量</td></tr>' +
          '<tr><td><code>:apply (tc)</code></td><td><b>tc</b> = theorem of constants？/ 把目标里的变量换成新常量（实例化）</td></tr>' +
          '<tr><td><code>:apply (rd)</code></td><td><b>rd</b> = reduce。把当前目标化简；若化成 <code>true</code>，该子目标被「解除（discharged）」</td></tr>' +
          '<tr><td><code>:show proof</code></td><td>显示已完成的证明概要，当前目标用 <code>&gt;</code> 标出</td></tr>' +
          '<tr><td><code>:desc proof</code> / <code>:desc .</code></td><td>列出所有子目标 / 显示当前子目标</td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>最容易记混的两个</div>' +
          '<p><code>:apply (si)</code> 是<b>切分成子目标</b>（base 和 ind 两个）；<code>:apply (rd)</code> 是<b>化简并尝试收尾</b>。' +
          '顺序永远是：<code>:goal</code> → <code>:ind on</code> → <code>:apply (si)</code> → 对每个子目标 <code>:apply (rd)</code>（必要时先 <code>:apply (tc)</code>）。</p></div>'
      },
      {
        id: 'L14.s3', title: '完整走一遍：assoc+ 的 proof script',
        html: cbStatic('-- 前提：PNAT1 已打开（或 :def 定义）\n:goal { eq [assoc+] : (X + Y) + Z = X + (Y + Z) . }\n:ind on (X:PNat)\n:apply (si)\n\n-- 现在有两个子目标：\n--   1. base:  (0 + y) + z = 0 + (y + z)\n--   2. ind:   (s(x) + y) + z = s(x) + (y + z)，IH 为 (x + Y) + Z = x + (Y + Z)\n\n:apply (rd)     -- 化解第一个子目标（自动化成 true）\n:apply (rd)     -- 化解第二个子目标\n\n:show proof\n:desc .', 'assoc+ 的 proof script（读懂每一行）') +
          '<p>输出大致是：</p>' +
          '<div class="codebox"><pre>&gt; 1  (0 + y) + z = 0 + (y + z)      ...  discharged\n&gt; 2  (s(x) + y) + z = s(x) + (y + z) ...  discharged\n\nProof completed.</pre></div>' +
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
        html: '<p>像第 11 章的 comm+ 那样需要引理时，proof script 里这样写：</p>' +
          cbStatic(':goal { eq [rz+] : X + 0 = X . }\n:ind on (X:PNat)\n:apply (si)\n:apply (rd)\n:apply (rd)\n:show proof\n\n:goal { eq [comm+] : X + Y = Y + X . }\n:ind on (X:PNat)\n:apply (si)\n-- 直接 :apply (rd) 会卡住，需要先加入引理作为等式（用 eq 声明，或假定 rz+ 已证）\neq X + 0 = X .\neq X + s(Y) = s(X + Y) .\n:apply (rd)\n:apply (rd)', '带引理的 proof script（思路）') +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>L14 常考题</div>' +
          '<ul><li>「<code>:apply (si)</code> 做了什么？」→ 对 <code>:ind on</code> 指定的变量做结构归纳，把目标切成构造子个数个子目标，并为非常量构造子引入新常量。</li>' +
          '<li>「<code>:apply (rd)</code> 做了什么？」→ 化简当前目标；若化成 true 则该子目标解除。</li>' +
          '<li>「CITP 相比手写 proof score 的好处？」→ 避免新常量重用、自动生成 IH、自动管理子目标，减少人为错误。</li>' +
          '<li>「证明助手能完全自动证明定理吗？」→ 不能。它需要人指定归纳变量、提供引理；它是<b>辅助</b>工具（assistant），不是全自动定理证明器。</li></ul></div>' +
          cta('L14-quiz1', '随堂小测 · 证明助手（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L14 必背</div>' +
          '<ul><li>7 个命令：<code>:goal</code> / <code>:ind on</code> / <code>:apply (si)</code> / <code>:apply (tc)</code> / <code>:apply (rd)</code> / <code>:show proof</code> / <code>:desc proof</code>、<code>:desc .</code></li>' +
          '<li>顺序：goal → ind on → si → rd…</li>' +
          '<li>一句话：CITP 减少人为错误，但不是全自动</li></ul></div>'
      }
    ],
    quiz: 'L14-quiz', flash: 'L14-flash'
  });

  QZ['L14-quiz1'] = {
    title: '随堂小测 · 证明助手',
    items: [
      { q: '<code>:apply (si)</code> 的作用是？', opts: ['化简目标', '对指定变量做结构归纳，切成子目标并引入新常量', '显示证明', '声明目标'], a: 1, why: 'si = structural induction。' },
      { q: '<code>:apply (rd)</code> 做了什么？', opts: ['重写整个模块', '化简当前目标，若为 true 则解除', '删除子目标', '读取文件'], a: 1, why: 'rd = reduce。' },
      { q: 'CITP 主要解决什么问题？', opts: ['证明太慢', '手写证明分数时的人为错误（常量重用、IH 写错）', '语法不熟', '自动发现定理'], a: 1, why: '它是 assistant，不是全自动。' }
    ]
  };
  QZ['L14-quiz'] = {
    title: 'L14 综合测验',
    items: [
      { q: '声明要证的目标用哪个命令？', opts: [':goal', ':ind on', ':apply (rd)', ':show proof'], a: 0, why: ':goal { eq [label] : ... . }' },
      { q: '指定归纳变量用？', opts: [':goal', ':ind on X:S', ':apply (si)', ':desc .'], a: 1, why: ':ind on (X:PNat)。' },
      { q: '查看当前子目标用？', opts: [':show proof', ':desc .', ':apply (rd)', ':goal'], a: 1, why: ':desc . 显示当前子目标；:desc proof 列出全部。' },
      { q: '正确的命令顺序是？', opts: [':goal → :ind on → :apply (si) → :apply (rd)', ':apply (rd) → :goal → :ind on', ':ind on → :goal → :apply (si)', '任意顺序'], a: 0, why: '先声明目标，再指定归纳变量，再切分，再化简。' }
    ]
  };
  QZ['L14-flash'] = {
    title: 'L14 闪卡',
    cards: [
      { q: '7 个 CITP 命令？', a: ':goal / :ind on / :apply (si) / :apply (tc) / :apply (rd) / :show proof / :desc proof & :desc .' },
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
    sections: [
      {
        id: 'EX.s1', title: '语法速查表（考前最后看的东西）',
        html: '<table><tr><th>要素</th><th>写法</th></tr>' +
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
        html: '<h3 class="sub">模板 1：写一个模块（10 分）</h3>' +
          '<div class="codebox"><pre>mod! XXX {\n  pr(NAT)                       -- 1. 导入需要的模块\n  [Nil NnXXX &lt; XXX]              -- 2. 排序（含阶排序）\n  op nil : -&gt; Nil {constr}       -- 3. 构造子\n  op _|_ : Nat XXX -&gt; NnXXX {constr prec: 40}\n  op 函数 : XXX -&gt; Nat           -- 4. 要实现的函数签名\n  vars E : Nat                   -- 5. 变量声明\n  var L : XXX\n  eq 函数(nil) = 0 .             -- 6. 基础情形\n  eq 函数(E | L) = s(函数(L)) .  -- 7. 递归情形\n}</pre></div>' +
          '<h3 class="sub">模板 2：求 red 的结果（8 分）</h3>' +
          '<p>步骤：① 找出最外层能用哪条等式；② 写出全部中间项（<b>一步一行</b>，标上规则名）；③ 最后的范式就是答案。<br>' +
          '格式：<code>t → t1 (by (eq1)) → t2 (by (eq2)) → … → 答案</code></p>' +
          '<h3 class="sub">模板 3：解释为什么（6 分）</h3>' +
          '<p>套路：<b>先说结论（一句话）→ 再说机制（用术语：redex / E-strategy / AC 匹配 / 不变量）→ 最后说后果或修复。</b><br>' +
          '例：「<code>take(primes,10)</code> 能终止，因为 <code>_|_</code> 声明了 <code>strat: (1 0)</code>，' +
          '归约时先算头再试根，只算到第 10 个元素就停；若去掉该属性，则会试图把无限尾求成范式而发散。」</p>' +
          '<h3 class="sub">模板 4：写证明分数（15–20 分）</h3>' +
          '<div class="codebox"><pre>Theorem. 目标等式\nProof. By structural induction on X.\n\nI. Base case\nopen 模块 .\nops y : -&gt; S .\nred l(0) = r(0) .\nclose\n\nII. Induction case\nopen 模块 .\nops x y : -&gt; S .\neq IH（新常量 + 原变量） .\nred l(s(x)) = r(s(x)) .\nclose</pre></div>' +
          '<h3 class="sub">模板 5：需要引理时</h3>' +
          '<p>写：「这里 <code>r(...)</code> 无法继续化简，因此需要一个引理：<b>Lemma. 引理等式</b>（它比所需更一般）。' +
          '把引理作为等式加入后，<code>red</code> 得到 true。」然后（如果分值高）给出引理的归纳证明。</p>'
      },
      {
        id: 'EX.s3', title: '模拟卷 A（覆盖 L1–L7）',
        html: '<div class="card"><div class="card-t">一、语法（每题 4 分）</div>' +
          '<ol><li>写出声明「0 与 s 是 PNat 的构造子」的两行代码。<div class="rubric">答：<code>op 0 : -&gt; PNat {constr} .</code> / <code>op s : PNat -&gt; PNat {constr} .</code></div></li>' +
          '<li><code>[Zero NzNat &lt; Nat]</code> 的作用是什么？为什么 <code>p_</code> 要声明成 <code>NzNat -&gt; Nat</code>？<div class="rubric">答：声明子排序；用排序表达定义域，使 <code>p(0)</code> 在签名层面非法。</div></li>' +
          '<li>写出 <code>_@_</code>（列表连接）的两条等式。<div class="rubric">答：<code>eq nil @ L2 = L2 .</code> / <code>eq (E | L) @ L2 = E | (L @ L2) .</code></div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">二、理解（每题 6 分）</div>' +
          '<ol start="4"><li>解释 redex 与 contract 的区别，并举一个例子。<div class="rubric">答：redex 是能与等式左边匹配的子项（要被替换）；contract 是把替换作用到右边得到的新项（替换上去）。例：<code>fact(s(s(0)))</code> 是 redex，contract 是 <code>s(s(0))*fact(s(0))</code>。</div></li>' +
          '<li>为什么 <code>_|_ : Nat InfList -&gt; InfList</code> 要写 <code>{strat: (1 0)}</code>？<div class="rubric">答：默认策略会先把无限的第 2 个参数求成范式而发散；(1 0) 先算头再试根，实现惰性，使 take 能终止。</div></li>' +
          '<li>多重集里 <code>update</code> 为什么会出错？怎么修？<div class="rubric">答：AC 匹配可能选到不同元素产生多解，且未检查键唯一不变量；用 <code>isValid</code> 作为 ceq 条件把匹配钉死。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">三、求值（8 分）</div>' +
          '<ol start="7"><li>写出 <code>red take(primes,6) .</code> 的结果与至少 4 步中间项。<div class="rubric">答：<code>2|3|5|7|11|13|nil</code>；中间项：<code>sieve(mkNILFrom(2)) → 2|sieve(check(2,mkNILFrom(3))) → …</code></div></li>' +
          '<li><code>red #((a,1) (b,2) (a,3), a) .</code> 的结果？<div class="rubric">答：2</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">四、写模块（10 分）</div>' +
          '<ol start="9"><li>写一个模块，实现「求列表最大值」（列表非空，元素是自然数）。<div class="rubric">要点：<code>max2 : Nat Nat -&gt; Nat</code>，<code>maxl : NnList -&gt; Nat</code>，<code>eq maxl(E|nil) = E .</code>，<code>eq maxl(E|L) = max2(E, maxl(L)) .</code></div></li></ol></div>'
      },
      {
        id: 'EX.s4', title: '模拟卷 B（覆盖 L8–L14）',
        html: '<div class="card"><div class="card-t">五、语言处理器（每题 8 分）</div>' +
          '<ol start="10"><li>写出 <code>execute</code> 处理赋值、顺序、while 的三条等式。<div class="rubric">答：<code>execute(X := E, Env) = update(Env,X,eval(E,Env))</code>；<code>execute(S1;S2,Env) = execute(S2,execute(S1,Env))</code>；while 见第 8 章。</div></li>' +
          '<li>把 <code>y := x + 1</code> 编译成指令。<div class="rubric">答：<code>load x</code>, <code>push 1</code>, <code>add</code>, <code>store y</code></div></li>' +
          '<li><code>jumpOnCond</code> 与 <code>bjump</code> 的区别？各用于什么语句？<div class="rubric">答：前者真则跳、用于 if；后者假则跳、用于 while 退出。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">六、证明（20 分）</div>' +
          '<ol start="13"><li>证明 (X + Y) + Z = X + (Y + Z)。要求：说明对谁归纳、写出 base 与 ind 的手算步骤、给出证明分数。<div class="rubric">见 L11 第 3 节完整答案。</div></li>' +
          '<li>证明 rev1(L1) = rev2(L1)。（提示：需要 p-sr2 与 assoc@）<div class="rubric">见 L12 第 3 节。</div></li>' +
          '</ol></div>' +
          '<div class="card"><div class="card-t">七、概念（每题 5 分）</div>' +
          '<ol start="15"><li>解释 <code>:apply (si)</code> 与 <code>:apply (rd)</code>，并说明 CITP 相比手写 proof score 的优势。<div class="rubric">答：si 做结构归纳并切子目标/引入新常量/生成 IH；rd 化简并在化成 true 时解除子目标；CITP 避免常量重用与 IH 写错，自动管理子目标。</div></li>' +
          '<li>隐形传态为什么不会违反「不可克隆定理」？<div class="rubric">答：原态在 Alice 测量时被破坏，Bob 得到的不是副本而是「移动」过去的同一个态（且需要经典通信）。</div></li>' +
          '</ol></div>' +
          cta('EX-quiz1', '模拟卷选择题（10 题，限时 15 分钟）', '综合检验，目标 8 题以上') +
          cta('EX-quiz2', '易错点清单（8 题）', '考前最后一遍')
      },
      {
        id: 'EX.s5', title: '考前 24 小时清单',
        html: '<div class="card exam"><div class="card-t"><span class="ico">⏰</span>按时间排的最后复习</div>' +
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
      { q: '下列哪个声明<b>错误</b>？', opts: ['<code>op nil : -&gt; List {constr}</code>', '<code>op _+_ : Nat Nat -&gt; Nat {prec: 33}</code>', '<code>eq X = 0 .</code>', '<code>vars X Y : Nat</code>'], a: 2, why: '等式左边不能是单个变量。' },
      { q: '<code>red (1 | 2 | nil) @ (3 | nil) .</code> 的结果？', opts: ['<code>1|2|3|nil</code>', '<code>3|1|2|nil</code>', '<code>nil</code>', '报错'], a: 0, why: '@ 是连接。' },
      { q: '关于 E-strategy，正确的说法是？', opts: ['它决定等式顺序', '它决定算子的参数归约顺序与试根时机', '它是优先级', '它是排序'], a: 1, why: 'local strategy。' },
      { q: '<code>take(primes,10)</code> 的第 7 个素数是？', opts: ['13', '17', '19', '23'], a: 1, why: '2,3,5,7,11,13,17 → 第 7 个是 17。' },
      { q: '多重集需要哪三个属性？', opts: ['assoc comm id:', 'prec strat constr', 'assoc comm prec', 'constr id: comm'], a: 0, why: '结合、交换、单位元。' },
      { q: '解释器中环境的作用是？', opts: ['存指令', '存「变量→值」的映射', '存栈', '存程序计数'], a: 1, why: '表的应用。' },
      { q: '编译 <code>if B then S1 else S2</code> 时，<code>jumpOnCond</code> 的目标地址应该是？', opts: ['S2 的开头', 'S1（then 分支）的开头', '程序结尾', '循环开头'], a: 1, why: '真则跳去执行 then。' },
      { q: '结构归纳的 base case 是？', opts: ['l(s(x)) = r(s(x))', 'l(0) = r(0)', 'l(X) = r(X)', 'l(x) = r(x)'], a: 1, why: '代入最小构造子。' },
      { q: '证明 comm+ 的归纳情形需要哪个引理？', opts: ['<code>X + 0 = X</code>', '<code>X + s(Y) = s(X + Y)</code>', '<code>(X+Y)+Z = X+(Y+Z)</code>', '不需要'], a: 1, why: 'rs+。' },
      { q: '<code>:apply (rd)</code> 之后目标化成 true，说明？', opts: ['程序算错了', '该子目标被解除（discharged）', '需要引理', '要重新 :goal'], a: 1, why: '证完一个分支。' }
    ]
  };
  QZ['EX-quiz2'] = {
    title: '易错点清单',
    items: [
      { q: '<code>mod! M { ... }</code> 的右花括号后面要加句号吗？', opts: ['要', '不要', '视情况', '要加分号'], a: 1, why: '模块结尾不加句号；但模块内每条 eq/op 都要加。' },
      { q: '无限列表的 <code>_|_</code> 必须加什么属性？', opts: ['{assoc}', '{strat: (1 0)}', '{comm}', '{prec: 0}'], a: 1, why: '否则 take 发散。' },
      { q: '证明分数里 IH 的正确写法？', opts: ['<code>eq (x + y) + z = x + (y + z) .</code>', '<code>eq (x + Y) + Z = x + (Y + Z) .</code>', '<code>eq (X + Y) + Z = X + (Y + Z) .</code>', '<code>red (x + Y) + Z = x + (Y + Z) .</code>'], a: 1, why: '小写新常量 + 大写原变量。' },
      { q: '写 <code>_+_</code> 和 <code>_*_</code> 时如果都不写 prec 会怎样？', opts: ['不能用', '解析优先级相同，可能得到意外的括号结构', '自动正确', '报错'], a: 1, why: '必须给 prec。' },
      { q: '<code>ceq</code> 条件里的变量必须？', opts: ['是新变量', '在左边出现过', '在右边出现过', '声明成 constr'], a: 1, why: '否则无法代入。' },
      { q: '要证的 <code>red</code> 结果是 <code>false</code>，说明？', opts: ['证明正确', '等式不成立或缺少引理', '语法错误', '模块没打开'], a: 1, why: 'false 表示两边化简后不相等。' },
      { q: '同一个算子名声明多次（参数排序不同）叫什么？', opts: ['递归', '重载', '多态', '继承'], a: 1, why: 'overloading，按最小排序选 rank。' },
      { q: '考试时证明题完全证不出来，最该写什么？', opts: ['空着', '写出归纳变量、base case、IH 声明和手算步骤', '抄题目', '写「不会」'], a: 1, why: '过程分占大头。' }
    ]
  };
  QZ['EX-flash'] = {
    title: '冲刺闪卡',
    cards: [
      { q: '写模块的 7 行骨架？', a: 'mod! → pr → 排序 → 构造子 → 函数签名 → vars → eq(base, ind)' },
      { q: '三个「必带」属性？', a: '<code>{constr}</code>（构造子）、<code>{prec: n}</code>（+ 和 *）、<code>{strat: (1 0)}</code>（无限列表）' },
      { q: '证明分数的五步？', a: 'open / ops 新常量 / eq IH / red / close' },
      { q: '四个最常考的结论？', a: '①(1 0) 实现惰性 ②AC 匹配多解需 isValid ③execute(S1;S2)=execute(S2,execute(S1)) ④结构归纳 base+ind+IH' }
    ]
  };
})();
