/* =====================================================================
 * content-core.js — L0 ~ L5
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* 可运行的代码块 */
  function cb(id, src, cap) {
    return '<div class="codebox" id="' + id + '">' +
      '<div class="codebox-h"><span>' + esc(cap || 'CafeOBJ') + '</span>' +
      '<button class="btn-run" data-run="' + id + '">▶ 运行</button></div>' +
      '<pre>' + esc(src) + '</pre>' +
      '<div class="run-out">点「运行」，本机引擎会真的执行这段代码</div></div>';
  }
  function cta(id, title, sub) {
    return '<div class="quiz-cta" data-quiz="' + id + '"><span class="q-ico">✍️</span>' +
      '<span class="q-txt"><b>' + title + '</b><span>' + (sub || '检查一下刚才学的') + '</span></span>' +
      '<span class="q-go">开始 →</span></div>';
  }

  /* =====================================================================
   * L0 导学
   * ===================================================================== */
  CH.push({
    id: 'L0', num: 'L0', group: '第 0 部分 · 导学', short: '课程导学：这门课在学什么',
    title: '课程导学：I217E 到底在学什么',
    sub: '先搞清楚「这门课是什么、为什么这么学、考试怎么考」，再开始学细节。',
    minutes: 25,
    goals: [
      '用一句话说清 I217E 的核心：<b>用代数规格描述程序，用重写来计算，用归纳来证明</b>',
      '知道 CafeOBJ 是什么、为什么用它、它和 C/Java 的差别',
      '知道考试的形式、分值、时间，和最容易拿分的章节',
      '掌握本系统「读 → 跑 → 测 → 复习」的学习闭环'
    ],
    sections: [
      {
        id: 'L0.s1', title: '一句话概括：这门课在学什么',
        html: '<p class="lead">I217E 是「函数式编程」，但它真正的主角是一个叫 <b>CafeOBJ</b> 的语言，和一套叫 <b>代数规格（algebraic specification）+ 项重写（term rewriting）</b> 的思想。</p>' +
          '<p>整门课可以浓缩成三件事：</p>' +
          '<table><tr><th>你在做什么</th><th>CafeOBJ 里对应什么</th><th>考试怎么考</th></tr>' +
          '<tr><td>描述一个东西「是什么」</td><td><code>mod!</code> 模块、排序 <code>sort</code>、算子 <code>op</code></td><td>手写模块</td></tr>' +
          '<tr><td>描述「怎么算」</td><td>等式 <code>eq</code> / 条件等式 <code>ceq</code>，用重写来算</td><td>手写等式 + 写出 <code>red</code> 结果</td></tr>' +
          '<tr><td>证明「永远对」</td><td>结构归纳 + 证明分数（proof score）</td><td>手写证明过程</td></tr></table>' +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>为什么是「函数式」</div>' +
          '<p>在 CafeOBJ 里没有「变量赋值」「for 循环」。你只写<b>函数（算子）</b>和<b>等式</b>：' +
          '<code>fact(0) = 1</code>、<code>fact(s(N)) = s(N) * fact(N)</code>。' +
          '计算不是「一步步改变内存」，而是「不停地用等式把项换成另一个项」，直到换不动为止。' +
          '这个「换」的过程叫 <b>重写（rewriting）</b>，是整个课程的技术核心（第 3 章）。</p></div>' +
          '<div class="card"><div class="card-t"><span class="ico">🎬</span>先感受一下（点运行）</div>' +
          cb('w-l0-1', 'mod! HELLO {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _+_ : PNat PNat -> PNat {prec: 33}\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n}\nopen HELLO .\nred s(s(0)) + s(s(s(0))) .\nred 0 + s(0) .\nclose', '第一个例子：2 + 3') +
          '<p>你会看到 <code>s(s(0)) + s(s(s(0)))</code> 被一步步换成 <code>s(s(s(s(s(0)))))</code>，' +
          '这就是「5」。这里没有数字 2 和 3，只有 <code>0</code> 和「后继」<code>s</code> —— 这叫做<b>皮亚诺自然数</b>，第 11 章会用它做证明。</p></div>'
      },
      {
        id: 'L0.s2', title: '为什么用 CafeOBJ：三个真实的理由',
        html: '<p>很多同学第一反应是「为什么不直接用 Python/Java？」这门课选 CafeOBJ 有三个理由，理解了它们，你就明白课程为什么这么安排：</p>' +
          '<div class="card"><div class="card-t">① 规格即程序（executable specification）</div>' +
          '<p>写下来的就是「定义」，而定义本身可以被执行。所以同一份文本，既能当文档，又能当程序跑，还能拿来做证明。' +
          '这就是第 5 章的「表（table）」、第 8–10 章的「Minila 语言处理器」能写得那么短的原因。</p></div>' +
          '<div class="card"><div class="card-t">② 计算 = 重写，所以「为什么算出这个结果」完全可见</div>' +
          '<p>在 CafeOBJ 里可以用 <code>set trace whole on</code> 看到每一步替换，' +
          '这在教学上非常宝贵：你能亲眼看到「第 3 步用哪条等式、替换了哪个位置」。本系统里每个归约都能单步播放，就是这个原因。</p></div>' +
          '<div class="card"><div class="card-t">③ 可以证明，而不只是测试</div>' +
          '<p>测试只能说明「这几个输入对」，而<b>结构归纳 + 重写</b>能说明「所有输入都对」。第 11–14 章讲的就是这个，' +
          '也是考试里分值最高、最能拉开差距的部分。</p></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>先建立一个正确预期</div>' +
          '<p>CafeOBJ 不是「工业级编程语言」，它的语法有点古怪（<code>op _+_</code>、<code>{constr}</code>、<code>pr(...)</code>）。' +
          '这门课考的不是「你能不能背语法」，而是「你能不能用重写和归纳把一件事说清楚」。语法必须熟，但它是手段。</p></div>'
      },
      {
        id: 'L0.s3', title: '考试怎么考：分值、时间、拿分策略',
        html: '<table><tr><th>项目</th><th>细节</th></tr>' +
          '<tr><td>期末考试</td><td><b>2026-12-01（周二）10:50–12:30，100 分钟</b>，石川校区 IS 讲义室</td></tr>' +
          '<tr><td>成绩构成</td><td>作业 30% + 考试 70%，<b>60 分及格</b></td></tr>' +
          '<tr><td>形式</td><td><b>不是选择题</b>：手写 CafeOBJ 模块、手写 <code>red</code> 的结果、手写归纳证明</td></tr>' +
          '<tr><td>允许带的东西</td><td>按往年：闭卷（以授课老师最终说明为准）</td></tr></table>' +
          '<h3 class="sub">按「性价比」排序的章节攻略</h3>' +
          '<table><tr><th>优先级</th><th>章节</th><th>为什么</th></tr>' +
          '<tr><td>★★★★★</td><td>L3 项重写、L11–L13 验证</td><td>必考，且 L3 是所有题的基础；验证题分值最高</td></tr>' +
          '<tr><td>★★★★☆</td><td>L6 无限列表、L7 多重集</td><td>几乎每年一道「写出 <code>red</code> 结果 / 解释为什么」</td></tr>' +
          '<tr><td>★★★★☆</td><td>L8–L10 Minila</td><td>解释器/虚拟机/编译器三连，常考「补全代码 / 写执行过程」</td></tr>' +
          '<tr><td>★★★☆☆</td><td>L1–L2 基础、L4 参数化、L5 表</td><td>送分题，但语法错就全错，必须零失误</td></tr>' +
          '<tr><td>★★☆☆☆</td><td>L14 证明助手</td><td>考概念（<code>:ind</code>、<code>:apply</code> 是什么意思）</td></tr></table>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>一句忠告</div>' +
          '<p>这门课最大的坑是<b>「看得懂但写不出」</b>。看懂 <code>eq fact(s(N)) = s(N) * fact(N)</code> 只要 3 秒，' +
          '但考试时让你从零写一个 <code>qsort</code> 或一个 <code>sieve</code>，很多人会卡在 <code>{constr}</code> 放哪、变量怎么声明。' +
          '所以本系统每一节都要求你<b>亲手把代码跑一遍</b>，再<b>做小测</b>。</p></div>'
      },
      {
        id: 'L0.s4', title: '这个系统怎么用：学习闭环',
        html: '<p>左侧是按课程顺序排的章节。每一节的结构都一样，养成固定节奏就不会迷路：</p>' +
          '<ol><li><b>读</b>：看讲解（每个概念都给了「为什么」和「图」）</li>' +
          '<li><b>跑</b>：点代码块里的「▶ 运行」，<b>然后改一改再跑</b>（改数字、改等式，看结果怎么变）</li>' +
          '<li><b>测</b>：做每节的随堂小测（错了会自动进复习队列）</li>' +
          '<li><b>标</b>：点「✓ 我学会了这一节」，进度会记在本地</li>' +
          '<li><b>复</b>：右上角「复习队列」按 1/3/7/21 天的间隔提醒你重看</li></ol>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔁</span>关键动作：改代码</div>' +
          '<p>「跑一遍」只是看懂，「改一行再跑」才是学会。比如把 <code>take(primes,10)</code> 改成 <code>take(primes,20)</code>，' +
          '或者把 <code>+</code> 改成 <code>*</code>，看结果怎么变 —— 你会立刻发现自己哪里理解错了。</p></div>' +
          cb('w-l0-2', 'open NATLIST .\nred hd(3 | 2 | 1 | nil) .\nred tl(3 | 2 | 1 | nil) .\nred len(1 | 2 | 3 | 4 | 5 | nil) .\nred [2 .. 6] .\nclose', '试试改数字：hd / tl / len / 区间') +
          '<div class="card"><div class="card-t"><span class="ico">🧭</span>四个按钮</div>' +
          '<ul><li><b>上一节 / 下一节</b>：按顺序推进（也可以 Alt+← / Alt+→）</li>' +
          '<li><b>复习队列</b>：红色数字表示今天到期的条目</li>' +
          '<li>左侧条目前面的 ✓：这一章所有小节都标了「已掌握」才会出现</li>' +
          '<li>倒数牌：距考试还有几天，别让它少于 7 天</li></ul></div>'
      },
      {
        id: 'L0.s5', title: '冲刺路线图（假设你从零开始）',
        html: '<p>如果现在离考试还有 3 周左右，建议按下面这条线走。<b>不要按章节顺序平均用力</b>，L3 和 L11–13 要多花一倍时间。</p>' +
          '<table><tr><th>阶段</th><th>做什么</th><th>目标</th></tr>' +
          '<tr><td>第 1 周<br>（打地基）</td><td>L1 → L2 → L3，每节的代码都手敲一遍；把 <code>term / redex / contract / position</code> 的定义背下来</td><td>能独立写出 NAT、NATLIST 和一个递归函数</td></tr>' +
          '<tr><td>第 2 周<br>（拿分点）</td><td>L4 → L5 → L6 → L7，重点 L6 无限列表和 L7 多重集</td><td>看到 <code>take(primes,10)</code> 能说出结果和前几步</td></tr>' +
          '<tr><td>第 3 周<br>（大头）</td><td>L8 → L9 → L10（Minila 三连），再做 L11 → L12 → L13 的证明</td><td>能默写出结构归纳的两个分支，并写完整证明分数</td></tr>' +
          '<tr><td>最后 2 天</td><td>L14 概念 + 「期末冲刺」章的模拟题，只看错题</td><td>手不生，重点全在身上</td></tr></table>' +
          '<div class="card tip"><div class="card-t"><span class="ico">📌</span>每天的最低温饱线</div>' +
          '<p>就算很忙，也保证每天：<b>读 1 节 + 跑 1 段代码 + 做 1 组小测</b>（20 分钟）。语言类的东西，间断一天要花三天补回来。</p></div>'
      }
    ],
    quiz: 'L0-quiz', flash: 'L0-flash'
  });

  QZ['L0-quiz'] = {
    title: 'L0 导学 · 综合测验',
    items: [
      { q: 'I217E 这门课的核心技术是下面哪一个？', opts: ['面向对象建模', '项重写（term rewriting）+ 代数规格', '关系数据库设计', '编译原理中的词法分析'], a: 1, why: '课程用 CafeOBJ 写代数规格，靠<b>重写</b>来计算，靠<b>归纳</b>来证明。' },
      { q: '在 CafeOBJ 里，「计算」本质上是：', opts: ['修改变量的值', '不停地用等式把项替换成新项，直到不能再换', '把程序编译成机器码', '在内存里分配对象'], a: 1, why: 'CafeOBJ 没有赋值语句。归约（reduction）= 反复找 redex、做一步重写，直到范式（normal form）。' },
      { q: '考试形式是：', opts: ['全部选择题', '手写模块、手写 red 结果、手写归纳证明', '上机编程', '写一篇小论文'], a: 1, why: '这是本课最容易失分的地方：必须能手写，不能只「看懂」。' },
      { q: '按性价比，最该多花时间的两个部分是哪两个？', opts: ['L0 导学 + L14 证明助手', 'L3 项重写 + L11–L13 验证', 'L4 参数化 + L5 表', '只看作业答案'], a: 1, why: 'L3 是所有题的地基，L11–L13 的验证题分值最高。' }
    ]
  };
  QZ['L0-flash'] = {
    title: 'L0 闪卡',
    cards: [
      { q: '这门课的三件核心事？', a: '① 用模块/排序/算子描述「是什么」② 用等式重写描述「怎么算」③ 用结构归纳证明「永远对」' },
      { q: 'CafeOBJ 的「计算」叫什么？', a: '归约（reduction）：反复做一步重写（one-step rewrite），直到范式。' },
      { q: '成绩构成？', a: '作业 30% + 考试 70%，60 分及格。' },
      { q: '考试时间？', a: '2026-12-01（周二）10:50–12:30，100 分钟，石川校区 IS 讲义室。' }
    ]
  };

  /* =====================================================================
   * L1 Sorts, Operators, Terms & Equations
   * ===================================================================== */
  CH.push({
    id: 'L1', num: 'L1', group: '第 1 部分 · 基础', short: 'L1 排序·算子·项·等式',
    title: '1. 排序、算子、项与等式',
    sub: 'Sorts, Operators, Terms & Equations —— 这是整门课的地基，语法必须一次记牢。',
    minutes: 45,
    goals: [
      '能写出一个合法的 <code>mod!</code> 模块：排序、算子、变量、等式</br>',
      '分清「排序（sort）」和「项（term）」，能画出项的语法树',
      '会写前缀、中缀、混合（mixfix）三种算子',
      '知道 <code>{constr}</code>、<code>prec:</code>、<code>assoc/comm</code> 分别是什么意思'
    ],
    sections: [
      {
        id: 'L1.s1', title: '排序（sort）：先给「东西」分类',
        html: '<p>在 CafeOBJ 里，每个值都属于一个<b>排序（sort）</b>。你可以把它想成「类型」，但更接近数学里「集合」的概念：排序就是一个集合的名字。</p>' +
          cb('w-l1-1', 'mod! SORT-DEMO {\n  [Bool PNat]\n  ops true false : -> Bool {constr}\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n}\nopen SORT-DEMO .\nred true .\nred s(0) .\nclose', '声明两个排序') +
          '<p>写法要点：</p><ul>' +
          '<li><code>[Bool Nat]</code>：一次声明两个排序。<b>排序名不是关键字</b>（不像 <code>int</code>），你写 <code>[Hat]</code> 也合法。</li>' +
          '<li><code>op true : -> Bool {constr}</code>：<code>true</code> 是一个<b>不带参数</b>的算子，也就是常量（constant）。箭头的左边是参数，右边是结果排序。</li>' +
          '<li><code>op s_ : Nat -> Nat {constr}</code>：<code>s_</code> 的后缀式写法，表示「在参数后面接一个 s」。所以 <code>s(0)</code> 要写成 <code>s(0)</code> 也行（CafeOBJ 两种都接受）。</li></ul>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔑</span>为什么排序这么重要</div>' +
          '<p>因为<b>重写是有排序约束的</b>：等式 <code>0 + Y = Y</code> 里，<code>Y</code> 必须是 <code>Nat</code>，' +
          '所以匹配和计算都在排序的约束下进行。第 2 章的「阶排序」和第 3 章的重写都建立在这上面，' +
          '写错一个排序，后面的 <code>red</code> 全部出错。</p></div>' +
          '<div class="widget" id="w-l1-lat"></div>'
      },
      {
        id: 'L1.s2', title: '算子（operator）与 arity：三种写法',
        html: '<p>算子 = 函数名 + 参数个数（arity）。CafeOBJ 最反直觉的地方是<b>名字里带下划线</b>表示参数位置。</p>' +
          '<table><tr><th>形式</th><th>写法</th><th>用法</th></tr>' +
          '<tr><td>前缀 / 常量</td><td><code>op fact : Nat -> Nat</code></td><td><code>fact(3)</code></td></tr>' +
          '<tr><td>中缀（infix）</td><td><code>op _+_ : Nat Nat -> Nat</code></td><td><code>1 + 2</code>（下划线处放参数）</td></tr>' +
          '<tr><td>混合（mixfix）</td><td><code>op if_then{_}else{_} : Bool Nat Nat -> Nat</code></td><td><code>if c then {1} else {2}</code></td></tr>' +
          '<tr><td>后缀</td><td><code>op s_ : Nat -> Nat</code></td><td><code>s(0)</code> 或 <code>s 0</code></td></tr>' +
          '<tr><td>括号式</td><td><code>op (_,_) : Nat Nat -> Pair</code></td><td><code>(1,2)</code></td></tr></table>' +
          '<p>下划线的数量 = 参数个数。<code>_+_</code> 有两个下划线 → 二元；<code>s_</code> 一个 → 一元；<code>nil</code> 没有 → 常量。</p>' +
          cb('w-l1-2', 'mod! OPDEMO {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _+_ : PNat PNat -> PNat {prec: 33}\n  op _*_ : PNat PNat -> PNat {prec: 31}\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n  eq 0 * Y = 0 .\n  eq s(X) * Y = (X * Y) + Y .\n}\nopen OPDEMO .\nred s(0) + s(s(0)) .\nred s(s(0)) * s(s(0)) .\nclose', '中缀算子 + 优先级') +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>prec 是干嘛的</div>' +
          '<p><code>prec:</code> 越小，绑定越紧。乘法的 prec 比加法小，所以 <code>1 + 2 * 3</code> 会先算乘法 —— 和你从小学数学的规则一致。' +
          '<b>考试写模块时，如果同时有 + 和 *，一定要写 prec，否则解析会出乎意料。</b></p></div>'
      },
      {
        id: 'L1.s3', title: '项（term）：把表达式看成树',
        html: '<p>项是「算子的应用」递归拼起来的东西。<code>s(s(0)) + s(0)</code> 不是一串字符，而是一棵树：</p>' +
          '<div class="widget" id="w-l1-tree"></div>' +
          '<p>树上的每个节点是一个算子，叶子是常量或变量。这个视角非常重要，因为第 3 章的「重写」就是<b>在树上某个节点做替换</b>：</p>' +
          '<ul><li><b>子项（subterm）</b>：树上任意一个节点连同它下面的一切</li>' +
          '<li><b>位置（position）</b>：从根开始往第几个子节点走，例如 <code>2.1</code> 表示「根的第二个子节点的第一个子节点」</li>' +
          '<li><b>redex</b>：能和某条等式左边匹配的子项</li></ul>' +
          '<div class="card why"><div class="card-t"><span class="ico">🌳</span>为什么必须用树来想</div>' +
          '<p>因为「同一个项」可以画出很多不同的树（取决于怎么加括号）。CafeOBJ 靠 <code>prec:</code> 和 <code>assoc</code> 来决定唯一的解析方式，' +
          '而重写的「位置」正是定义在这棵树上的。考试里问「第 3 步重写了哪个位置」时，答案一定是树上的一个位置。</p></div>'
      },
      {
        id: 'L1.s4', title: '等式（equation）与变量',
        html: '<p>等式是 CafeOBJ 的「程序」，形如 <code>eq 左边 = 右边 .</code>，结尾的<b>句号不能漏</b>。</p>' +
          cb('w-l1-3', 'mod! FACT-DEMO {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _*_ : PNat PNat -> PNat {prec: 31}\n  op _+_ : PNat PNat -> PNat {prec: 33}\n  op fact : PNat -> PNat\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n  eq 0 * Y = 0 .\n  eq s(X) * Y = (X * Y) + Y .\n  eq fact(0) = s(0) .\n  eq fact(s(X)) = s(X) * fact(X) .\n}\nopen FACT-DEMO .\nred fact(s(s(s(0)))) .\nred fact(s(s(s(s(0))))) .\nclose', '阶乘：3! 与 4!') +
          '<p>读法等式的三条铁律：</p>' +
          '<ol><li><b>变量必须先声明</b>：<code>vars X Y : Nat</code> 或 <code>var N : Nat</code>。没声明的大写名字会被当成未定义变量，可能报错，也可能悄悄算出奇怪结果。</li>' +
          '<li><b>左边不能只是一个变量</b>：<code>eq X = 0 .</code> 是非法的（否则什么都变成 0）。左边必须「有结构」，比如 <code>fact(s(X))</code>。</li>' +
          '<li><b>等式的方向是从左到右</b>：<code>eq fact(0) = s(0)</code> 表示「看到 <code>fact(0)</code> 就换成 <code>s(0)</code>」，反过来不成立。</li></ol>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>考试最爱考的细节</div>' +
          '<ul><li>每条 <code>eq</code> 末尾要有 <code>.</code>；<code>mod!</code> 里的 <code>}</code> 后面<b>没有</b>句号</li>' +
          '<li>定义递归函数时，<b>先写基础情形</b>（<code>fact(0)</code>），再写递归情形（<code>fact(s(X))</code>）—— 顺序会影响重写的效率甚至结果</li>' +
          '<li><code>s(s(0))</code> 表示 2，<code>0</code> 表示 0。用「后继」表示自然数是没有内置数字时的标准做法（第 11 章验证时必用）</li></ul></div>'
      },
      {
        id: 'L1.s5', title: '把这段代码拆开看：BOOL 模块',
        html: '<p>下面是一个完整的、真正会被用到的模块。逐行读一遍，这是你后面所有模块的模板：</p>' +
          cb('w-l1-4', 'mod! MY-BOOL {\n  [Bool]\n  ops true false : -> Bool {constr}\n  op not_ : Bool -> Bool\n  op _and_ : Bool Bool -> Bool\n  vars B1 B2 : Bool\n  eq not true = false .\n  eq not false = true .\n  eq true and B2 = B2 .\n  eq false and B2 = false .\n}\nopen MY-BOOL .\nred not false .\nred true and false .\nred false and true .\nclose', 'BOOL：最完整的模板') +
          '<ul><li><code>[Bool]</code> 声明排序；<code>ops true false : -> Bool</code> 一次声明两个常量（<code>ops</code> 是复数形式，只声明一个时用 <code>op</code>）</li>' +
          '<li><code>{constr}</code>：标记这是<b>构造子（constructor）</b>，意思是「这个排序的值就是由这些算子造出来的」。它不改变计算，但说明「值长什么样」。</li>' +
          '<li><code>true and B2 = B2</code>：不用写 <code>true and true = true</code> 和 <code>true and false = false</code> —— 用变量 <code>B2</code> 一条顶两条。这是函数式写法的精髓：<b>用变量覆盖所有情形</b>。</li></ul>' +
          cta('L1-quiz1', '随堂小测 · 排序与算子（3 题）', '检查语法细节') +
          '<div class="card"><div class="card-t"><span class="ico">✏️</span>动手改</div>' +
          '<p>把 <code>red true and false .</code> 改成 <code>red false and false .</code>，再运行；' +
          '然后试着删掉 <code>eq false and B2 = false .</code> 这一行，看结果怎么变（会不会变成「卡住」）。</p></div>'
      }
    ],
    quiz: 'L1-quiz', flash: 'L1-flash',
    extra: '',
    afterWrap: null
  });

  QZ['L1-quiz1'] = {
    title: '随堂小测 · 排序与算子',
    items: [
      { q: '<code>op _+_ : Nat Nat -> Nat</code> 里的两个下划线表示什么？', opts: ['两个排序', '两个参数位置（二元算子）', '两个等式', '优先级'], a: 1, why: '下划线是参数的「占位符」，数量 = arity。' },
      { q: '下面哪个声明是<b>常量</b>？', opts: ['<code>op nil : -> List</code>', '<code>op s_ : Nat -> Nat</code>', '<code>op _+_ : Nat Nat -> Nat</code>', '<code>op hd_ : List -> Nat</code>'], a: 0, why: '箭头左边为空 = 没有参数 = 常量。' },
      { q: '<code>eq X = 0 .</code>（X 是变量）为什么非法？', opts: ['少了句号', '左边不能只是一个变量，否则会把所有东西都改写成 0', 'X 没有声明排序', '0 不是常量'], a: 1, why: '等式的左边必须有结构（redex 的形状），这是重写系统的基本要求。' }
    ]
  };
  QZ['L1-quiz'] = {
    title: 'L1 综合测验',
    items: [
      { q: '要给 <code>fact</code> 写递归定义，基础情形应该是哪一条？', opts: ['<code>eq fact(X) = s(0) .</code>', '<code>eq fact(0) = s(0) .</code>', '<code>eq fact(s(X)) = s(X) * fact(X) .</code>', '<code>eq 0 = fact(0) .</code>'], a: 1, why: '先写最小输入（0）的情形，再写 s(X) 的递归情形。' },
      { q: '<code>{constr}</code> 的含义是：', opts: ['这条等式优先使用', '该算子是构造子，说明这个排序的值由它构造', '该算子是私有的', '该算子可以交换'], a: 1, why: 'constr 标注构造子，描述「值长什么样」，不影响重写方向。' },
      { q: '<code>prec:</code> 数值越小表示：', opts: ['优先级越低', '优先级越高（绑定越紧）', '参数越少', '排序越小'], a: 1, why: 'prec 越小绑定越紧，所以 <code>*</code> 的 prec 比 <code>+</code> 小。' },
      { q: '<code>s(s(s(0)))</code> 表示哪个自然数？', opts: ['0', '1', '3', 's 的个数无关紧要'], a: 2, why: '0 的后继三次 = 3。这是第 11 章验证的核心表示法。' }
    ]
  };
  QZ['L1-flash'] = {
    title: 'L1 闪卡',
    cards: [
      { q: '<code>op _+_ : Nat Nat -> Nat</code> 怎么用？', a: '中缀：<code>1 + 2</code>；下划线是参数占位符，数量 = arity。' },
      { q: '声明变量？', a: '<code>vars X Y : Nat</code>（多个）或 <code>var N : Nat</code>（单个）' },
      { q: '等式的两条铁律？', a: '① 左边不能是单个变量；② 方向固定从左到右（左 → 右）。' },
      { q: '<code>{constr}</code> 是什么意思？', a: '构造子声明：该排序的值由这些算子构造而成。' },
      { q: 'prec 的规则？', a: '数值越小，绑定越紧（先算）。<code>_*_</code> 的 prec 比 <code>_+_</code> 小。' }
    ]
  };

  /* =====================================================================
   * L2 Modules, Order Sorts & Lists of Natural Numbers
   * ===================================================================== */
  CH.push({
    id: 'L2', num: 'L2', group: '第 1 部分 · 基础', short: 'L2 模块·阶排序·自然数列表',
    title: '2. 模块、阶排序与自然数列表',
    sub: 'Modules, Order Sorts & Lists of Natural Numbers —— 学会用「子排序」表达部分性，写出真正的列表模块。',
    minutes: 55,
    goals: [
      '说清模块的两个组成部分：signature（签名）与 axioms（公理）',
      '会用 <code>[Zero NzNat &lt; Nat]</code> 写阶排序，并解释为什么要这样做',
      '理解重载（overloading）与 kind（同 kind 的排序可以互相匹配）',
      '能写出 NATLIST 的 <code>hd / tl / len / @ / [X..Y]</code>'
    ],
    sections: [
      {
        id: 'L2.s1', title: '模块 = 签名 + 公理',
        html: '<p>CafeOBJ 的模块（module）只有两部分，看懂这个结构，任何模块都不怕：</p>' +
          '<table><tr><th>部分</th><th>内容</th><th>作用</th></tr>' +
          '<tr><td><b>signature</b>（签名）</td><td>排序声明 + 算子声明</td><td>说明「有哪些东西」</td></tr>' +
          '<tr><td><b>axioms</b>（公理）</td><td>等式 <code>eq</code> / 条件等式 <code>ceq</code></td><td>说明「它们怎么算」</td></tr></table>' +
          '<p>模块有两种：<code>mod!</code>（可执行，strict）和 <code>mod*</code>（宽松，允许构造子之间没有等式）。' +
          '课程里<b>写程序用 <code>mod!</code></b>，写<b>参数化模块的模板</b>用 <code>mod*</code>。</p>' +
          cb('w-l2-1', 'mod! ANAT {\n  [Zero NzNat < Nat]\n  op 0 : -> Zero {constr}\n  op s_ : Nat -> NzNat {constr}\n  op p_ : NzNat -> Nat\n  op _+_ : Nat Nat -> Nat {prec: 33}\n  var N : Nat\n  eq p(s(N)) = N .\n  eq N + 0 = N .\n}\nopen ANAT .\nred p(s(s(s(0)))) .\nred s(s(0)) + 0 .\nclose', 'NAT 的骨架：阶排序') +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>为什么需要 <code>Zero</code> 和 <code>NzNat</code></div>' +
          '<p>因为 <code>p_</code>（前驱）只对<b>非零</b>的数有意义。<code>p(0)</code> 应该没有定义。' +
          '有了 <code>[Zero NzNat &lt; Nat]</code>，我们就可以把 <code>p_</code> 的签名写成 <code>NzNat -> Nat</code>，' +
          '于是 <b><code>p(0)</code> 在语法上就是非法的</b>，不需要运行时检查。这叫「用类型把错误挡在门外」。</p>' +
          '<p>同理，<code>hd</code>（取列表头）只对非空列表有意义，所以它的签名写成 <code>NnNatList -> Nat</code>。</p></div>'
      },
      {
        id: 'L2.s2', title: '阶排序（order sorts）与最小上界',
        html: '<p><code>[Zero NzNat &lt; Nat]</code> 读作「Zero 和 NzNat 是 Nat 的<b>子排序</b>」—— 反过来 Nat 是它们的<b>父排序</b>。图形上是：</p>' +
          '<div class="widget" id="w-l2-lat"></div>' +
          '<p>这套偏序关系带来两个关键能力：</p>' +
          '<ol><li><b>向上兼容（subsume）</b>：<code>Zero</code> 的值也是 <code>Nat</code> 的值，所以 <code>p_</code> 接受不了 <code>0</code>，但 <code>_+_</code> 两个都接受。</li>' +
          '<li><b>最小排序（least sort）</b>：每个项都有唯一的最小排序。<code>0</code> 的最小排序是 <code>Zero</code>，<code>s(0)</code> 是 <code>NzNat</code>，' +
          '它们的<b>最小上界</b>是 <code>Nat</code>。CafeOBJ 报结果时写的是<b>具体排序或最精确排序</b>（这就是为什么 <code>red 0 + 0</code> 可能显示 <code>Zero</code>）。</li></ol>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔑</span>考试常问</div>' +
          '<p>「为什么要写 <code>[Zero NzNat &lt; Nat]</code> 而不是只写 <code>[Nat]</code>？」' +
          '标准答案：<b>为了用排序表达函数的定义域，让非法调用（如 <code>p(0)</code>、<code>hd(nil)</code>）在签名层面就被排除。</b></p></div>' +
          '<div class="card"><div class="card-t"><span class="ico">🧩</span>kind 是什么</div>' +
          '<p>互相连通的排序（通过 &lt; 关系）属于同一个 <b>kind</b>。同一个 kind 里的排序可以出现在同一个「位置」上，' +
          '所以变量可以是 kind 而不是具体排序 —— 这在参数化模块（第 4 章）和错误处理里很重要。</p></div>'
      },
      {
        id: 'L2.s3', title: '重载（overloading）：同名算子的多个 rank',
        html: '<p>同一个算子名可以声明多次，每次参数/结果排序不同 —— 这叫<b>重载</b>。CafeOBJ 会按参数的<b>最小排序</b>自动选出合适的那个（rank）。</p>' +
          cb('w-l2-2', 'open NATLIST .\nred hd(2 | 1 | 0 | nil) .\nred hd(nil) .\nred tl(2 | 1 | 0 | nil) .\nred len(nil) .\nred len(1 | 2 | 3 | nil) .\nclose', '重载：hd 有三个 rank') +
          '<p>NATLIST 里的 <code>hd_</code> 实际上是三条声明：</p>' +
          '<table><tr><th>rank</th><th>含义</th><th>结果排序</th></tr>' +
          '<tr><td><code>hd_ : Nil -> ErrNat</code></td><td>对空表取头 → 错误值</td><td><code>ErrNat</code></td></tr>' +
          '<tr><td><code>hd_ : NnNatList -> Nat</code></td><td>对非空表取头 → 头元素</td><td><code>Nat</code>（最精确）</td></tr>' +
          '<tr><td><code>hd_ : NatList -> Nat&amp;Err</code></td><td>一般情况（可能出错）</td><td><code>Nat&amp;Err</code></td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>重载 + 策略 = 一个坑</div>' +
          '<p>第 6 章会踩到这个坑：<code>_|_</code> 在「有限列表」和「无限列表」里各有一个 rank，' +
          '而无限列表那个带 <code>{strat: (1 0)}</code>。<b>属性是跟着 rank 走的，不是跟着算子名走的</b>，' +
          '所以同一个 <code>|</code> 在不同上下文里的归约顺序不同。</p></div>'
      },
      {
        id: 'L2.s4', title: 'NATLIST：列表的完整定义',
        html: '<p>列表是函数式编程的主角。它由两个构造子造出来：空表 <code>nil</code>，和「头 + 尾」<code>_|_</code>。</p>' +
          cb('w-l2-3', 'mod! MYLIST {\n  pr(NAT)\n  [Nil NnNatList < NatList]\n  op nil : -> Nil {constr}\n  op _|_ : Nat NatList -> NnNatList {constr prec: 40}\n  vars E E2 : Nat\n  vars L L2 : NatList\n  op hd_ : NatList -> Nat\n  op tl_ : NatList -> NatList\n  op len : NatList -> Nat\n  eq hd(E | L) = E .\n  eq tl(E | L) = L .\n  eq len(nil) = 0 .\n  eq len(E | L) = s(len(L)) .\n  op _@_ : NatList NatList -> NatList {prec: 40}\n  eq nil @ L2 = L2 .\n  eq (E | L) @ L2 = E | (L @ L2) .\n}\nopen MYLIST .\nred hd(7 | 8 | nil) .\nred tl(7 | 8 | nil) .\nred len(7 | 8 | 9 | nil) .\nred (1 | 2 | nil) @ (3 | 4 | nil) .\nclose', '列表：hd / tl / len / @') +
          '<p>注意 <code>_@_</code>（append，连接）的两个等式，这是<b>结构递归</b>的标准形态：</p>' +
          '<ul><li>基础情形：<code>nil @ L2 = L2</code> —— 空表接任何表还是那个表</li>' +
          '<li>递归情形：<code>(E | L) @ L2 = E | (L @ L2)</code> —— 头不动，把「尾巴接 L2」交给自己递归</li></ul>' +
          '<div class="card why"><div class="card-t"><span class="ico">🔁</span>记住这个套路</div>' +
          '<p>几乎所有列表函数都是这个形状：<b>对 nil 给一个答案，对 E|L 用「E」和「递归(l)」拼出答案</b>。' +
          '第 5 章的 lookup、第 6 章的 take、第 12 章的证明，全是这个套路。会写这一条，等于会写一半的题。</p></div>'
      },
      {
        id: 'L2.s5', title: '区间 [X..Y] 与更多列表函数',
        html: '<p>有了 <code>if</code> 和比较，就能写出很有趣的东西，比如「从 X 到 Y 的列表」：</p>' +
          cb('w-l2-4', 'open NATLIST .\nred [2 .. 6] .\nred [5 .. 5] .\nred [6 .. 2] .\nred (1 | 2 | 3 | nil) @ (4 | nil) .\nclose', '区间与连接') +
          '<p><code>[X .. Y]</code> 的定义是：</p>' +
          '<div class="codebox"><pre>op [_.._] : Nat Nat -&gt; NatList {prec: 41}\neq [X .. Y] = if X &gt; Y then {nil} else {X | [X + 1 .. Y]} .</pre></div>' +
          '<p>注意 <code>[6 .. 2]</code> 返回 <code>nil</code>，不是错误 —— 这是<b>用条件处理边界</b>的典型写法。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>L2 必须能默写的东西</div>' +
          '<ul><li><code>[Zero NzNat &lt; Nat]</code> 这一行的三种变体（列表是 <code>[Nil NnNatList &lt; NatList]</code>）</li>' +
          '<li><code>len</code>、<code>@</code>、<code>[X..Y]</code> 的定义</li>' +
          '<li><code>hd</code> 为什么需要重载（空表要返回错误值）</li></ul></div>' +
          cta('L2-quiz1', '随堂小测 · 阶排序与列表（3 题）') +
          '<div class="widget" id="w-l2-tree"></div>'
      }
    ],
    quiz: 'L2-quiz', flash: 'L2-flash'
  });

  QZ['L2-quiz1'] = {
    title: '随堂小测 · 阶排序与列表',
    items: [
      { q: '<code>[Zero NzNat &lt; Nat]</code> 中，<code>s(0)</code> 的最小排序是？', opts: ['Zero', 'NzNat', 'Nat', 'NatList'], a: 1, why: '<code>s_ : Nat -&gt; NzNat</code>，所以结果排序是 NzNat。' },
      { q: '为什么 <code>p_ : NzNat -&gt; Nat</code> 要写成接受 NzNat 而不是 Nat？', opts: ['为了快', '为了让 <code>p(0)</code> 在签名层面非法，不需要运行时检查', '因为 0 不是自然数', '为了支持重载'], a: 1, why: '用排序表达定义域，是这门课反复强调的「用类型排除非法值」。' },
      { q: '<code>len(1 | 2 | nil)</code> 的结果是？', opts: ['<code>0</code>', '<code>1</code>', '<code>2</code>', '<code>s(s(0))</code>'], a: 3, why: '<code>len(nil)=0</code>，每层加一个 <code>s</code>，所以是 <code>s(s(0))</code>（即 2）。' }
    ]
  };
  QZ['L2-quiz'] = {
    title: 'L2 综合测验',
    items: [
      { q: '模块由哪两部分组成？', opts: ['imports 和 exports', 'signature（排序+算子）和 axioms（等式）', '变量和常量', '注释和代码'], a: 1, why: '签名说「有什么」，公理说「怎么算」。' },
      { q: '同名算子声明多次、参数排序不同，这叫？', opts: ['递归', '重载（overloading）', '多态', '继承'], a: 1, why: 'CafeOBJ 按参数的最小排序选 rank。' },
      { q: '<code>eq (E | L) @ L2 = E | (L @ L2) .</code> 属于哪种情形？', opts: ['基础情形', '递归情形（结构递归）', '条件等式', '交换律'], a: 1, why: '对 <code>E|L</code> 这种结构做递归，是标准的结构递归。' },
      { q: '<code>red [6 .. 2] .</code> 的结果？', opts: ['报错', '<code>nil</code>', '<code>6 | 5 | 4 | 3 | 2 | nil</code>', '<code>2 | 3 | 4 | 5 | 6 | nil</code>'], a: 1, why: '<code>if X &gt; Y then {nil}</code>，6 &gt; 2 所以返回 nil。' }
    ]
  };
  QZ['L2-flash'] = {
    title: 'L2 闪卡',
    cards: [
      { q: '阶排序写法？', a: '<code>[Zero NzNat &lt; Nat]</code>；列表是 <code>[Nil NnNatList &lt; NatList]</code>。' },
      { q: 'append 的两个等式？', a: '<code>eq nil @ L2 = L2 .</code> / <code>eq (E | L) @ L2 = E | (L @ L2) .</code>' },
      { q: 'len 的定义？', a: '<code>eq len(nil) = 0 .</code> / <code>eq len(E | L) = s(len(L)) .</code>' },
      { q: 'kind 是什么？', a: '互相连通（通过子排序关系）的排序集合；同一个 kind 的排序可出现在同一位置。' }
    ]
  };

  /* =====================================================================
   * L3 Term Rewriting（核心）
   * ===================================================================== */
  CH.push({
    id: 'L3', num: 'L3', group: '第 1 部分 · 基础', short: 'L3 项重写（核心）',
    title: '3. 项重写（Term Rewriting）',
    sub: '整门课的技术核心：替换、匹配、redex、一步重写、归约、条件等式、AC 匹配。考卷上最常出现的名词都在这一章。',
    minutes: 70,
    goals: [
      '精确说出 substitution / pattern match / subterm / position / redex / contract 的定义',
      '能手算「第 n 步重写了哪个位置、用的哪条等式」',
      '会写条件等式 <code>ceq</code> 并说明什么时候它是 redex',
      '理解 assoc / comm / id: 为什么能表示多重集，以及 AC 匹配为什么难'
    ],
    sections: [
      {
        id: 'L3.s1', title: '替换（substitution）与模式匹配（pattern match）',
        html: '<p>一条等式 <code>eq fact(s(X)) = s(X) * fact(X)</code> 里有变量 <code>X</code>。要让这条等式作用到一个具体的项上，' +
          '必须先决定 <code>X</code> 代表什么 —— 这个「给变量赋值」的动作叫<b>替换（substitution）</b>，记作 σ。</p>' +
          '<p><b>模式匹配</b>就是：找一个替换 σ，使得 σ(等式左边) 和某个子项<b>完全相同</b>。</p>' +
          '<div class="card"><div class="card-t"><span class="ico">🧩</span>例子</div>' +
          '<p>等式左 <code>fact(s(X))</code>，目标项 <code>fact(s(s(0)))</code>。<br>' +
          '令 σ = {X ↦ s(0)}，则 σ(左边) = <code>fact(s(s(0)))</code>，与目标相同 → <b>匹配成功</b>。<br>' +
          '替换后的右边 σ(右边) = <code>s(s(0)) * fact(s(0))</code>，这就是<b>contract</b>（替换结果）。</p></div>' +
          '<p>三个必须分清的概念：</p>' +
          '<table><tr><th>概念</th><th>是什么</th><th>在本例中</th></tr>' +
          '<tr><td><b>替换 σ</b></td><td>变量 → 项 的映射</td><td>{X ↦ s(0)}</td></tr>' +
          '<tr><td><b>redex</b></td><td>能和某条等式左边匹配的<b>子项</b></td><td><code>fact(s(s(0)))</code></td></tr>' +
          '<tr><td><b>contract</b></td><td>把 σ 作用到等式右边得到的项</td><td><code>s(s(0)) * fact(s(0))</code></td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>注意区分</div>' +
          '<p>redex 是<b>被换掉的东西</b>（在左边），contract 是<b>换上去的东西</b>（右边经过替换）。' +
          '考试里这两个词经常被问，写反了就丢分。</p></div>' +
          cta('L3-quiz1', '随堂小测 · 术语（3 题）')
      },
      {
        id: 'L3.s2', title: '子项、位置（position）与项树',
        html: '<p>「位置」是从根往下走的一串下标，空串记作 <code>ε</code>（根）。' +
          '<code>2.1</code> 表示「根的第二个子项的第一个子项」。</p>' +
          '<div class="widget" id="w-l3-tree"></div>' +
          '<p>看这个项：<code>s(0) + (s(0) * s(s(0)))</code>。它的位置有：</p>' +
          '<table><tr><th>位置</th><th>子项</th></tr>' +
          '<tr><td>ε</td><td><code>s(0) + (s(0) * s(s(0)))</code></td></tr>' +
          '<tr><td>1</td><td><code>s(0)</code></td></tr>' +
          '<tr><td>2</td><td><code>s(0) * s(s(0))</code></td></tr>' +
          '<tr><td>2.2</td><td><code>s(s(0))</code></td></tr>' +
          '<tr><td>2.2.1</td><td><code>s(0)</code></td></tr></table>' +
          '<p>重写的「一步」= 选一个位置 p，把 p 处的 redex 换成 contract，其它地方<b>一个字符都不动</b>。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🎯</span>为什么考试爱考位置</div>' +
          '<p>因为「同一时刻往往有多个 redex」，选哪一个决定了后面的归约过程。' +
          '而「选哪一个」是由 <b>E-strategy（第 6 章）</b>决定的。所以位置 + 策略 = 完全确定的归约过程。</p></div>'
      },
      {
        id: 'L3.s3', title: '一步重写与归约：看引擎怎么走',
        html: '<p>下面用真正的引擎跑一遍，<b>每一步都标出了用的规则和位置</b>：</p>' +
          '<div class="widget" id="w-l3-reduce"></div>' +
          '<p>术语链条要记牢：</p>' +
          '<ol><li><b>一步重写（one-step rewrite）</b>：t →<sub>p</sub> t′，把一个 redex 换掉</li>' +
          '<li><b>归约（reduction）</b>：t →* t′，零步或多步</li>' +
          '<li><b>范式（normal form）</b>：再也找不到 redex 的项，归约的终点</li></ol>' +
          '<div class="card"><div class="card-t"><span class="ico">🔍</span>自己在真 CafeOBJ 里看</div>' +
          '<div class="codebox"><pre>open FACT .\nset trace whole on .\nred fact(3) .\nset trace whole off .\nclose</pre></div>' +
          '<p>真 CafeOBJ 会把每一步打印出来。本系统里上面的播放器是等价的，而且更清楚。</p></div>'
      },
      {
        id: 'L3.s4', title: '条件等式（conditional equation）',
        html: '<p>有时候「能不能换」取决一个条件：<code>ceq 左边 = 右边 if 条件 .</code></p>' +
          '<p>语义：先匹配左边 → 得到 σ → <b>把 σ(条件) 归约</b> → 如果结果是 <code>true</code>，才允许替换。</p>' +
          '<div class="card"><div class="card-t"><span class="ico">📋</span>写 ceq 的三条规则（考试会考）</div>' +
          '<ul><li>① 左边不能是单个变量</li><li>② 右边出现的变量必须在左边出现过</li>' +
          '<li>③ <b>条件里的变量也必须在左边出现过</b></li></ul>' +
          '<p>第三条最容易忘。原因：条件是在匹配之后才求值的，如果条件里出现了左边没有的变量，就没有值可以代入。</p></div>' +
          cb('w-l3-ceq2', 'mod! MIN-DEMO {\n  pr(BOOL-IF)\n  pr(NAT-IF)\n  op min : Nat Nat -> Nat\n  vars X Y : Nat\n  eq min(X,X) = X .\n  ceq min(X,Y) = X if X < Y .\n  ceq min(X,Y) = Y if Y < X .\n}\nopen MIN-DEMO .\nred min(3,5) .\nred min(5,3) .\nred min(4,4) .\nclose', '条件等式：min 的三条规则') +
          '<p>三条规则互不重叠：相等走第一条；小于走第二条；大于走第三条。' +
          '<b>没有任何一条用 <code>if</code> 嵌套</b> —— 这就是条件等式的威力。</p>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>写 ceq 时的常见坑</div>' +
          '<p>条件里的「不等于」不要写 <code>!=</code>。本引擎与 CafeOBJ 都用 <code>=/=</code> 或 <code>not (... == ...)</code>。' +
          '另外条件最好用<b>已经定义了等式</b>的运算（如 <code>&lt;</code>、<code>==</code>），否则条件永远化不成 true，规则就永远不触发。</p></div>'
      },
      {
        id: 'L3.s5', title: 'AC 匹配：assoc / comm / id 与多重集',
        html: '<p>给算子加属性，就能让「重写」自动获得数学性质：</p>' +
          '<table><tr><th>属性</th><th>含义</th><th>效果</th></tr>' +
          '<tr><td><code>assoc</code></td><td>结合律</td><td><code>(a+b)+c</code> 和 <code>a+(b+c)</code> 视为同一个项</td></tr>' +
          '<tr><td><code>comm</code></td><td>交换律</td><td><code>a+b</code> 和 <code>b+a</code> 视为同一个项</td></tr>' +
          '<tr><td><code>id: emp</code></td><td>单位元</td><td><code>x emp</code> 自动变成 <code>x</code></td></tr></table>' +
          '<p>三个一起用，<code>_ _</code> 就变成了<b>多重集（multiset）</b>：元素无序、可重复、有单位元。</p>' +
          cb('w-l3-ac', 'open MULTISET-NAT .\nred (1 2) 3 == 1 (2 3) .\nred 1 2 == 2 1 .\nred 1 1 2 == 1 2 .\nred emp 1 emp 2 emp 1 emp 1 emp 2 emp .\nred emp emp .\nclose', '多重集：结合律/交换律/单位元一次看全') +
          '<p>注意第 1、2 行：打印出来时两边已经变成<b>同一个规范形式</b>了（<code>1 2 3 == 1 2 3</code>）—— ' +
          '这正是 assoc/comm 的效果：它们在<b>构造项的时候</b>就把括号和顺序抹平了。' +
          '第 3 行则是 <code>false</code>：数量不同就是不同的多重集。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🤔</span>AC 匹配为什么难</div>' +
          '<p>普通的模式匹配是「一个一个位置对下去」。但有了 assoc/comm，' +
          '模式 <code>E S</code> 要匹配 <code>1 2 3</code> 时，<b>哪个元素给 E、哪些给 S</b> 有 3 种分法；' +
          '如果模式里有两个变量、元素有 n 个，组合数爆炸。这就是 AC 匹配（AC matching）的难点，第 7 章整章都在处理它。</p>' +
          '<p>更麻烦的是：AC 匹配可能<b>有多个解</b>，选哪个解会影响结果 —— 这正是第 7 章「update 结果不一致」bug 的根源。</p></div>' +
          cta('L3-quiz2', '随堂小测 · 重写机制（4 题）')
      },
      {
        id: 'L3.s6', title: '终止性与合流性（概念题，考选择题）',
        html: '<p>这两个性质决定了「归约一定停得下来」和「结果唯一」：</p>' +
          '<table><tr><th>性质</th><th>含义</th><th>反例</th></tr>' +
          '<tr><td><b>终止性</b>（termination）</td><td>不存在无限长的重写序列</td><td><code>eq f(X) = f(s(X)) .</code> 会不停增长</td></tr>' +
          '<tr><td><b>合流性</b>（confluence）</td><td>不管按什么顺序重写，最终范式相同</td><td><code>eq f(X) = a . eq f(X) = b .</code> 两个结果</td></tr></table>' +
          '<p>两个都满足时，系统是<b>收敛的（convergent）</b>：任何归约顺序都终止，且结果唯一。这时 <code>red</code> 才有「标准答案」。</p>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>答题模板</div>' +
          '<p>被问到「为什么这个归约有唯一结果」时，答：<b>因为该重写系统终止且合流（或：因为等式左边两两不重叠、递归结构递减）。</b>' +
          '被问到「举一个不终止的例子」时，答：<b><code>eq f(X) = f(X)</code> 或 <code>eq f(X) = f(s(X))</code>。</b></p></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L3 自查清单</div>' +
          '<ul><li>能默写：替换 / 匹配 / redex / contract / 位置 / 一步重写 / 归约 / 范式</li>' +
          '<li>能对着一个项说出第 1、2、3 步重写的位置</li>' +
          '<li>能写出一条合法 ceq 并解释三条规则</li>' +
          '<li>能解释 assoc+comm+id 为什么能表示多重集</li></ul></div>'
      }
    ],
    quiz: 'L3-quiz', flash: 'L3-flash'
  });

  QZ['L3-quiz1'] = {
    title: '随堂小测 · 重写术语',
    items: [
      { q: '「能与等式左边匹配的子项」叫什么？', opts: ['contract', 'redex', 'position', 'substitution'], a: 1, why: 'redex = reducible expression，可归约表达式。' },
      { q: '把替换 σ 作用到等式<b>右边</b>得到的东西叫？', opts: ['redex', 'contract', '范式', '公理'], a: 1, why: 'contract 是替换上去的新项。' },
      { q: '位置 ε 表示？', opts: ['最左边的子项', '整棵树（根）', '叶子', '不存在的项'], a: 1, why: 'ε 是空串，表示根位置。' }
    ]
  };
  QZ['L3-quiz2'] = {
    title: '随堂小测 · 重写机制',
    items: [
      { q: '条件等式 <code>ceq L = R if C .</code> 什么时候可以重写？', opts: ['只要 L 匹配成功', 'L 匹配成功且 σ(C) 归约到 true', 'C 与 L 相同', '总是可以'], a: 1, why: '先匹配左边，再把条件归约，必须得到 true。' },
      { q: '写 ceq 时，条件里出现的变量必须？', opts: ['任意命名', '也在左边出现过', '在右边出现过', '声明为常量'], a: 1, why: '否则匹配后无法代入具体值。' },
      { q: '<code>assoc</code> 属性带来的效果是？', opts: ['交换顺序', '去掉单位元', '<code>(a+b)+c</code> 与 <code>a+(b+c)</code> 视为同一项', '自动排序'], a: 2, why: 'assoc = 结合律。comm = 交换律，id: = 单位元。' },
      { q: 'AC 匹配为什么可能没有唯一解？', opts: ['因为项太长', '因为元素无序、分组方式有多个，可能产生多组不同的变量绑定', '因为 CafeOBJ 有 bug', '因为等式没有句号'], a: 1, why: '这正是第 7 章 update 结果不一致的原因，需要靠 isValid 之类的条件来约束。' }
    ]
  };
  QZ['L3-quiz'] = {
    title: 'L3 综合测验',
    items: [
      { q: '对上式 <code>fact(s(s(0)))</code> 应用 <code>eq fact(s(X)) = s(X) * fact(X)</code>，σ 是？', opts: ['{X ↦ 0}', '{X ↦ s(0)}', '{X ↦ s(s(0))}', '{X ↦ fact(0)}'], a: 1, why: 's(X) 要等于 s(s(0))，所以 X = s(0)。' },
      { q: '归约的终点叫？', opts: ['redex', 'contract', '范式（normal form）', '公理'], a: 2, why: '找不到 redex 时的项叫范式。' },
      { q: '一个重写系统「收敛」是指？', opts: ['只有一条等式', '终止且合流（结果唯一）', '没有变量', '能编译'], a: 1, why: '终止性 + 合流性。' },
      { q: '<code>eq f(X) = f(s(X)) .</code> 会导致什么问题？', opts: ['合流但不终止', '不终止', '排序错误', '没有问题'], a: 1, why: '每步都变大，永不停止 —— 终止性被破坏。' }
    ]
  };
  QZ['L3-flash'] = {
    title: 'L3 闪卡',
    cards: [
      { q: 'redex vs contract？', a: 'redex = 能匹配等式左边的子项（要被换掉的）；contract = σ(右边)，换上去的新项。' },
      { q: '一步重写的三要素？', a: '① 选位置 p ② 该处是 redex ③ 用某条等式替换成 contract。' },
      { q: '条件等式的三条规则？', a: '① 左边不是单变量 ② 右边变量 ⊆ 左边变量 ③ 条件变量 ⊆ 左边变量' },
      { q: 'assoc / comm / id 分别是什么？', a: '结合律 / 交换律 / 单位元（<code>id: emp</code>）。三个合起来可表示多重集。' },
      { q: '范式是什么？', a: '再也没有 redex 的项，即归约停下来的结果。' }
    ]
  };

  /* =====================================================================
   * L4 Parameterized Modules
   * ===================================================================== */
  CH.push({
    id: 'L4', num: 'L4', group: '第 1 部分 · 基础', short: 'L4 参数化模块与视图',
    title: '4. 参数化模块与视图',
    sub: 'Parameterized Modules —— 写一次列表模块，Elem 类型可以换成 Nat、Qid、Pair 等任何东西。',
    minutes: 50,
    goals: [
      '会写 <code>mod* GLIST(E :: TRIV)</code> 形式的参数化模块',
      '会写 view（把抽象排序映射到具体排序）并实例化',
      '说清 <code>pr(...)</code> 导入、<code>E &lt;= TRIV2NAT</code> 的含义',
      '理解 TABLE 为什么需要参数化（第 5 章的铺垫）'
    ],
    sections: [
      {
        id: 'L4.s1', title: '为什么要参数化：一份代码，多种类型',
        html: '<p>第 2 章写的列表只能放 <code>Nat</code>。但「表」需要放 (Qid,String) 对，第 8 章的环境需要放 (变量,值) 对。' +
          '如果每个都重写一遍，代码量爆炸。</p>' +
          '<p>参数化模块（parameterized module）就是<b>带参数的模块</b>：把「元素类型」抽出来当参数。</p>' +
          '<div class="codebox"><pre>mod* GLIST(E :: TRIV) {\n  [Nil NnList &lt; List]\n  op nil : -&gt; Nil {constr}\n  op _|_ : Elt.E List -&gt; NnList {constr prec: 40}\n  ...\n}</pre></div>' +
          '<p>这里 <code>E :: TRIV</code> 的意思是：<b>E 是一个模块，它必须满足 TRIV 这个「接口」</b>。' +
          '<code>Elt.E</code> 表示「E 里的 Elt 排序」。</p>' +
          '<table><tr><th>写法</th><th>含义</th></tr>' +
          '<tr><td><code>mod* GLIST(E :: TRIV)</code></td><td>声明参数 E，约束是 TRIV</td></tr>' +
          '<tr><td><code>Elt.E</code></td><td>参数模块 E 里的排序 Elt</td></tr>' +
          '<tr><td><code>pr(NAT)</code></td><td>导入模块 NAT（protected）</td></tr>' +
          '<tr><td><code>GLIST(NAT)</code></td><td>把 NAT 作为参数实例化</td></tr>' +
          '<tr><td><code>E &lt;= TRIV2NAT</code></td><td>用一个 view 作为参数（见下节）</td></tr></table>' +
          '<div class="card"><div class="card-t"><span class="ico">📦</span>TRIV 是什么</div>' +
          '<p>TRIV 是最小的模块：只有一个排序 <code>Elt</code>，没有任何算子。</p>' +
          '<div class="codebox"><pre>mod* TRIV { [Elt] }</pre></div>' +
          '<p>它像一个「插座」：任何模块只要能提供 <code>Elt</code>，就能插进去。</p></div>'
      },
      {
        id: 'L4.s2', title: 'view：把抽象排序映射到具体排序',
        html: '<p>TRIV 里的排序叫 <code>Elt</code>，但 NAT 里的自然数排序叫 <code>Nat</code>。要插上，需要一个<b>视图（view）</b>说明对应关系：</p>' +
          '<div class="codebox"><pre>view TRIV2NAT from TRIV to NAT {\n  sort Elt -&gt; Nat\n}</pre></div>' +
          '<p>然后把 view 作为参数传进去：<code>GLIST(E &lt;= TRIV2NAT)</code>，或者直接 <code>GLIST(NAT)</code>（当名字恰好一致时）。</p>' +
          '<h3 class="sub">更复杂的 view：连算子一起映射</h3>' +
          '<div class="codebox"><pre>view TRIV2QID from TRIV to QID {\n  sort Elt -&gt; Qid\n}\nview TRIV-ERR-IF2STRING-ERR\n  from TRIV-ERR-IF to STRING-ERR {\n  sort Elt -&gt; String,\n  sort Err -&gt; ErrString,\n  sort Elt&amp;Err -&gt; String&amp;Err,\n  op err -&gt; errStr,\n  op (if_then{_}else{_}) -&gt; (if_then{_}else{_}),\n}</pre></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>两个易错点</div>' +
          '<ul><li>view 里的 sort 映射用 <code>-&gt;</code>，条目之间用<b>逗号</b>分隔（最后一项后面也常有逗号）</li>' +
          '<li><b>mixfix 算子要加括号</b>：<code>op (if_then{_}else{_}) -&gt; (if_then{_}else{_})</code>，否则解析器会晕</li></ul></div>' +
          '<div class="card why"><div class="card-t"><span class="ico">🧠</span>一句话理解 view</div>' +
          '<p>view 就是「改名表 + 改运算符表」：告诉 CafeOBJ「参数模块里的 Elt，在这里请当成 Nat 用」。</p></div>'
      },
      {
        id: 'L4.s3', title: '在引擎里怎么看参数化（限制与替代）',
        html: '<div class="card exam"><div class="card-t"><span class="ico">📌</span>先说明：本引擎不支持参数化</div>' +
          '<p>本系统的引擎是教学用的简化版，<b>不执行 <code>mod*</code> 参数化模块和 view</b>（那需要完整的模块表达式求解）。' +
          '所以第 4、5 章的概念用<b>图 + 等价的手写实例化模块</b>来演示，考试时你仍要会写参数化版本。</p></div>' +
          '<p>「手工实例化」就是：把参数换成具体排序，其它照抄。例如 GLIST(NAT) 手写成：</p>' +
          cb('w-l4-1', 'mod! GLIST-NAT {\n  pr(NAT)\n  [Nil NnList < List]\n  op nil : -> Nil {constr}\n  op _|_ : Nat List -> NnList {constr prec: 40}\n  op len : List -> Nat\n  vars E : Nat\n  vars L L2 : List\n  eq len(nil) = 0 .\n  eq len(E | L) = s(len(L)) .\n  op _@_ : List List -> List {prec: 40}\n  eq nil @ L2 = L2 .\n  eq (E | L) @ L2 = E | (L @ L2) .\n}\nopen GLIST-NAT .\nred len(1 | 2 | 3 | nil) .\nred (1 | 2 | nil) @ (3 | nil) .\nclose', 'GLIST(NAT) 的手工实例化') +
          '<p>对比一下参数化版本，你会发现<b>唯一的差别就是 <code>Nat</code> 写成了 <code>Elt.E</code></b>。' +
          '理解这一点，考试时写参数化模块就不会慌。</p>' +
          '<div class="card tip"><div class="card-t"><span class="ico">✍️</span>考试模板（背下来）</div>' +
          '<div class="codebox"><pre>mod* GLIST(E :: TRIV) {\n  [Nil NnList &lt; List]\n  op nil : -&gt; Nil {constr}\n  op _|_ : Elt.E List -&gt; NnList {constr prec: 40}\n  op len : List -&gt; Nat\n  op _@_ : List List -&gt; List {prec: 40}\n  vars E : Elt.E\n  vars L L2 : List\n  eq len(nil) = 0 .\n  eq len(E | L) = s(len(L)) .\n  eq nil @ L2 = L2 .\n  eq (E | L) @ L2 = E | (L @ L2) .\n}</pre></div></div>'
      },
      {
        id: 'L4.s4', title: '多参数与嵌套：TABLE 的由来',
        html: '<p>参数化模块可以有多个参数，也可以<b>把一个参数化模块作为另一个的参数</b>，这是第 5 章 TABLE 的关键：</p>' +
          '<div class="codebox"><pre>mod! ENTRY(K :: TRIV, V :: TRIV-ERR-IF) {\n  pr(PAIR(K,V) * {sort Pair -&gt; Entry})\n  [Entry ErrEntry &lt; Entry&amp;Err]\n  op errEntry : -&gt; ErrEntry {constr}\n  op (_,_) : Elt.K Elt&amp;Err.V -&gt; Entry&amp;Err\n  var K : Elt.K\n  eq (K,err.V) = errEntry .\n}</pre></div>' +
          '<p>读法：</p>' +
          '<ul><li><code>ENTRY</code> 有两个参数：<code>K</code>（键）和 <code>V</code>（值，允许出错）。</li>' +
          '<li><code>pr(PAIR(K,V) * {sort Pair -&gt; Entry})</code>：导入 <code>PAIR(K,V)</code>，同时<b>把 Pair 改名为 Entry</b>。' +
          '这就是 <b>renaming（重命名）</b>，用 <code>* { ... }</code> 表示。</li>' +
          '<li><code>[Entry ErrEntry &lt; Entry&amp;Err]</code>：用 <code>&amp;</code> 命名「可能出错」的排序（第 5 章的错误处理模式）。</li></ul>' +
          '<p>然后 TABLE 这样用它：</p>' +
          '<div class="codebox"><pre>mod! TABLE {\n  pr(BOOL-ERR)\n  pr(GLIST-ERR(E &lt;= view from TRIV-ERR to ENTRY {\n      sort Elt -&gt; Entry, sort Err -&gt; ErrEntry,\n      sort Elt&amp;Err -&gt; Entry&amp;Err, op err -&gt; errEntry })\n    * { sort List -&gt; Table, sort Nil -&gt; EmpTable,\n        sort NnList -&gt; NeTable, sort ErrList -&gt; ErrTable,\n        sort List&amp;Err -&gt; Table&amp;Err,\n        op errList -&gt; errTable, op nil -&gt; empTable } )\n  ...\n}</pre></div>' +
          '<div class="card why"><div class="card-t"><span class="ico">🏗️</span>这一段在干什么</div>' +
          '<p>一句话：<b>把「元素是 Entry 的列表」改名成「表」</b>，并把 <code>nil</code> 改名 <code>empTable</code>、' +
          '<code>errList</code> 改名 <code>errTable</code>。于是「表的操作」全部可以直接复用列表的等式 —— 这就是参数化的威力。</p></div>' +
          cta('L4-quiz1', '随堂小测 · 参数化与视图（3 题）')
      }
    ],
    quiz: 'L4-quiz', flash: 'L4-flash'
  });

  QZ['L4-quiz1'] = {
    title: '随堂小测 · 参数化模块',
    items: [
      { q: '<code>mod* GLIST(E :: TRIV)</code> 中 <code>E :: TRIV</code> 表示？', opts: ['E 是排序名', 'E 是模块参数，必须满足 TRIV 的接口', 'E 是变量', 'E 是常量'], a: 1, why: ':: 声明参数模块及其约束接口。' },
      { q: '<code>Elt.E</code> 的含义？', opts: ['E 的父排序', '参数模块 E 里的排序 Elt', 'E 类型的变量', 'Elt 的子排序'], a: 1, why: '参数模块里的排序用「模块名.排序名」引用。' },
      { q: 'view 里对 mixfix 算子做映射时要注意？', opts: ['直接写名字', '用括号包起来：<code>op (if_then{_}else{_}) -&gt; (...)</code>', '不能用 mixfix', '要加 constr'], a: 1, why: '课件的注意事项：mixfix 算子出现在 view 中必须加括号。' }
    ]
  };
  QZ['L4-quiz'] = {
    title: 'L4 综合测验',
    items: [
      { q: '参数化模块的主要好处？', opts: ['运行更快', '一份定义可复用于多种元素类型（Nat/Qid/Pair…）', '避免语法错误', '支持递归'], a: 1, why: '抽象出元素类型。' },
      { q: '<code>pr(PAIR(K,V) * {sort Pair -&gt; Entry})</code> 里的 <code>* {...}</code> 是？', opts: ['乘法', '重命名（renaming）', '注释', '优先级'], a: 1, why: '把一个模块的排序/算子改名后导入。' },
      { q: 'TABLE 里为什么要给 <code>nil</code> 改名成 <code>empTable</code>？', opts: ['名字好听', '因为表的「空」在语义上与列表的 nil 不同，改名后更清楚且避免冲突', '为了通过编译', 'nil 是关键字'], a: 1, why: '复用列表结构，但用表自己的术语命名。' },
      { q: 'TRIV 模块包含什么？', opts: ['只有 <code>[Elt]</code>', 'Bool 和 Nat', '列表算子', 'if-then-else'], a: 0, why: 'TRIV 是最小接口：一个排序 Elt，无算子。' }
    ]
  };
  QZ['L4-flash'] = {
    title: 'L4 闪卡',
    cards: [
      { q: '参数化模块的写法？', a: '<code>mod* GLIST(E :: TRIV) { ... }</code>，用 <code>Elt.E</code> 引用参数里的排序。' },
      { q: 'view 的作用？', a: '把抽象排序/算子映射到具体排序/算子，使参数化模块可被实例化。' },
      { q: 'renaming 的语法？', a: '<code>pr(MOD * {sort A -&gt; B, op f -&gt; g})</code>' },
      { q: 'TRIV 的内容？', a: '<code>mod* TRIV { [Elt] }</code>' }
    ]
  };

  /* =====================================================================
   * L5 Tables
   * ===================================================================== */
  CH.push({
    id: 'L5', num: 'L5', group: '第 1 部分 · 基础', short: 'L5 表（映射/字典）',
    title: '5. 表（Tables / Maps / Dictionaries）',
    sub: '用列表实现「键 → 值」的表：singleton / isReg / lookup / update / insert / remove / delete，以及错误处理模式。',
    minutes: 55,
    goals: [
      '说清表的数学定义（键的子集 + 函数）与列表表示',
      '默写 7 个基本操作的定义',
      '理解 <code>Err</code> 排序与 <code>&amp;</code> 错误处理模式（errEntry / errTable / err.V）',
      '看懂计费程序（catalog + cart → bill）的结构'
    ],
    sections: [
      {
        id: 'L5.s1', title: '表是什么：键、值、条目',
        html: '<p>一张<b>表（table）</b>由「键的子集 A′」和「函数 f : A′ → B」组成。每个 <code>(a′, f(a′))</code> 叫一个<b>条目（entry）</b>。</p>' +
          '<p>例子：从 Qid 到 (String, Nat) 对的表</p>' +
          '<div class="codebox"><pre>(\'a,("apple",150))  (\'o,("orange",100))  (\'t,("tomato",90))</pre></div>' +
          '<p>三条性质：<b>键互不相同</b>、<b>顺序无关</b>、<b>可以有任意多个条目</b>。</p>' +
          '<div class="widget" id="w-l5-table"></div>' +
          '<p>表在别处叫什么：Java 的 map、Python 的 dict、AI 里的 association list（a-list）。' +
          '第 8 章的<b>环境（environment）</b>就是一张从变量到值的表 —— 这就是为什么这一章要放在语言处理器前面。</p>' +
          '<h3 class="sub">用列表表示表</h3>' +
          '<div class="codebox"><pre>(k1,v1) | (k2,v2) | ... | (kn,vn) | nil</pre></div>' +
          '<p>因为键互不相同、顺序无关，所以「表」= 「条目的列表」+ 「不变量（invariant）：键不重复」。</p>'
      },
      {
        id: 'L5.s2', title: '错误处理：Err 排序模式',
        html: '<p>查一个不存在的键怎么办？CafeOBJ 的惯用法是引入<b>错误值</b>：</p>' +
          '<table><tr><th>原排序</th><th>错误排序</th><th>合并</th><th>错误常量</th></tr>' +
          '<tr><td><code>Nat</code></td><td><code>ErrNat</code></td><td><code>Nat&amp;Err</code></td><td><code>errNat</code></td></tr>' +
          '<tr><td><code>Entry</code></td><td><code>ErrEntry</code></td><td><code>Entry&amp;Err</code></td><td><code>errEntry</code></td></tr>' +
          '<tr><td><code>Table</code></td><td><code>ErrTable</code></td><td><code>Table&amp;Err</code></td><td><code>errTable</code></td></tr></table>' +
          '<div class="codebox"><pre>[Entry ErrEntry &lt; Entry&amp;Err]\nop errEntry : -&gt; ErrEntry {constr}\nvar K : Elt.K\neq (K,err.V) = errEntry .   -- 值出错，条目也出错</pre></div>' +
          '<p>注意最后一条等式：<b>它把错误「往上传播」</b>。于是错误一旦产生，就会顺着结构一路传出去，最后变成一个可识别的错误值。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🧯</span>为什么不用异常</div>' +
          '<p>CafeOBJ 是纯函数式的，没有 try/catch。用「错误值 + 排序」表达错误，' +
          '既保持了「所有函数都是全函数（total）」的数学性质，又能让错误在类型层面可见。这是本课反复出现的模式。</p></div>'
      },
      {
        id: 'L5.s3', title: '七个操作：能默写就赢一半',
        html: '<p>下面用<b>本引擎能跑的简化版</b>（把参数固定成 Qid 和 Nat）演示同样的逻辑：</p>' +
          cb('w-l5-1', 'mod! TABLE-DEMO {\n  pr(NAT)\n  pr(QID)\n  pr(BOOL-IF)\n  pr(NAT-IF)\n  [Entry]\n  op (_,_) : Qid Nat -> Entry {constr}\n  [Nil NeTable < Table]\n  op empT : -> Nil {constr}\n  op _|_ : Entry Table -> NeTable {constr prec: 40}\n  op if_then{_}else{_} : Bool Table Table -> Table\n  op singleton : Qid Nat -> Table\n  op isReg : Table Qid -> Bool\n  op lookup : Table Qid -> Nat\n  op update : Table Qid Nat -> Table\n  op insert : Table Qid Nat -> Table\n  op remove : Table Qid -> Table\n  vars K K2 : Qid\n  vars V V2 : Nat\n  var T : Table\n  vars T1 T2 : Table\n  eq if true then {T1} else {T2} = T1 .\n  eq if false then {T1} else {T2} = T2 .\n  eq singleton(K,V) = (K,V) | empT .\n  eq isReg(empT,K2) = false .\n  eq isReg((K,V) | T,K2) = if K == K2 then {true} else {isReg(T,K2)} .\n  eq lookup(empT,K2) = 0 .\n  eq lookup((K,V) | T,K2) = if K == K2 then {V} else {lookup(T,K2)} .\n  eq update(empT,K2,V2) = (K2,V2) | empT .\n  eq update((K,V) | T,K2,V2) = if K == K2 then {(K,V2) | T} else {(K,V) | update(T,K2,V2)} .\n  eq insert(T,K2,V2) = if isReg(T,K2) then {T} else {(K2,V2) | T} .\n  eq remove(empT,K2) = empT .\n  eq remove((K,V) | T,K2) = if K == K2 then {T} else {(K,V) | remove(T,K2)} .\n}\nopen TABLE-DEMO .\nred isReg((\u0027a,1) | (\u0027b,2) | empT,\u0027a) .\nred isReg((\u0027a,1) | (\u0027b,2) | empT,\u0027c) .\nred lookup((\u0027a,1) | (\u0027b,2) | empT,\u0027b) .\nred update((\u0027a,1) | (\u0027b,2) | empT,\u0027a,99) .\nred insert((\u0027a,1) | empT,\u0027a,5) .\nred remove((\u0027a,1) | (\u0027b,2) | empT,\u0027a) .\nclose', '表的六个操作（简化版）') +
          '<div class="card"><div class="card-t"><span class="ico">📌</span>七个操作速记</div>' +
          '<table><tr><th>操作</th><th>作用</th><th>关键等式</th></tr>' +
          '<tr><td><code>singleton</code></td><td>造只有一个条目的表</td><td><code>= (K,V) | empT</code></td></tr>' +
          '<tr><td><code>isReg</code></td><td>键是否已登记</td><td>空 → false；命中 → true</td></tr>' +
          '<tr><td><code>lookup</code></td><td>查值</td><td>空 → 错误值；命中 → V</td></tr>' +
          '<tr><td><code>update</code></td><td>有则改，无则加</td><td>空 → 新建；命中 → 替换</td></tr>' +
          '<tr><td><code>insert</code></td><td>只加不改（已存在则报错）</td><td><code>if isReg then {T} else {...}</code></td></tr>' +
          '<tr><td><code>remove</code></td><td>删掉某个键（不存在也不报错）</td><td>命中 → T（扔掉该条目）</td></tr>' +
          '<tr><td><code>delete</code></td><td>删掉（不存在则报错）</td><td><code>if isReg then {remove} else {err}</code></td></tr></table></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>update vs insert 的区别</div>' +
          '<p><code>update</code> 无论键在不在都能用（在就改，不在就加）；<code>insert</code> 在键已存在时返回错误。' +
          '这是考试最爱出的辨析题。</p></div>'
      },
      {
        id: 'L5.s4', title: '计费程序：表的一个真实应用',
        html: '<p>计费程序（billing program）用两张「表」算出账单：</p>' +
          '<table><tr><th>输入</th><th>表示</th><th>例子</th></tr>' +
          '<tr><td>catalog（商品目录）</td><td>Qid → (String, Nat)：表</td><td><code>(\'a,("apple",150)) | (\'o,("orange",100)) | empTable</code></td></tr>' +
          '<tr><td>cart（购物车）</td><td>(Qid, Nat) 的列表</td><td><code>(\'o,4) | (\'t,10) | (\'o,6) | nil</code></td></tr>' +
          '<tr><td>bill（账单）</td><td>(账单条目列表, 总额)</td><td><code>(("orange",10,1000) | ("tomato",10,900) | nil, 1900)</code></td></tr></table>' +
          '<p>算法很简单：对购物车里的每个 <code>(id, n)</code>，用 <code>lookup(catalog, id)</code> 查名字和单价，' +
          '算小计 <code>n * price</code>，生成一个账单条目，最后把所有小计加起来。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">💰</span>为什么这个例子重要</div>' +
          '<p>它把「表 + 列表 + 递归 + 元组」全用上了，而且<b>结构非常像考试题</b>：给你一个输入，让你写出结果项。' +
          '注意例子里 <code>(\'o,4)</code> 和 <code>(\'o,6)</code> 出现了两次 —— 表会把它们合并成 <code>("orange",10,1000)</code>（4+6=10）。' +
          '这个细节经常被考。</p></div>' +
          cta('L5-quiz1', '随堂小测 · 表（3 题）') +
          '<div class="card tip"><div class="card-t"><span class="ico">✅</span>L5 自查</div>' +
          '<ul><li>能写出表在数学上的定义（键子集 + 函数）</li>' +
          '<li>能默写 isReg / lookup / update / insert / remove 的等式</li>' +
          '<li>能解释 <code>(K,err.V) = errEntry</code> 为什么叫「错误传播」</li></ul></div>'
      }
    ],
    quiz: 'L5-quiz', flash: 'L5-flash'
  });

  QZ['L5-quiz1'] = {
    title: '随堂小测 · 表',
    items: [
      { q: '一张表由什么组成？', opts: ['只是一组值', '键的子集 A′ 加一个函数 f : A′ → B', '两个列表', '一个多重集'], a: 1, why: '表 = 键集合 + 映射。' },
      { q: '<code>update</code> 与 <code>insert</code> 的关键差别？', opts: ['没有差别', 'update 有则改、无则加；insert 在键已存在时返回错误', 'insert 更快', 'update 只能用在空表'], a: 1, why: '这是最常考的辨析点。' },
      { q: '<code>eq (K,err.V) = errEntry .</code> 的作用是？', opts: ['阻止错误', '把错误从值传播到条目，使错误在结构中一路传出去', '删除条目', '排序声明'], a: 1, why: '错误传播（error propagation）模式。' }
    ]
  };
  QZ['L5-quiz'] = {
    title: 'L5 综合测验',
    items: [
      { q: '用列表表示表时，必须满足的不变量是？', opts: ['键递增', '键互不相同', '值递增', '长度固定'], a: 1, why: '否则同一个键会有两个值。' },
      { q: '<code>lookup(empTable,K2)</code> 应该返回？', opts: ['0', '错误值 <code>err.V</code>', '空表', 'true'], a: 1, why: '键不存在是错误，用错误值表示。' },
      { q: '计费程序里购物车 <code>(\'o,4) | (\'t,10) | (\'o,6) | nil</code> 中 orange 的总数量是？', opts: ['4', '6', '10', '两个条目'], a: 2, why: '4 + 6 = 10，账单里合并成一个条目 ("orange",10,1000)。' },
      { q: '第 8 章解释器的「环境」本质上是什么？', opts: ['一个列表', '一张从变量到值的表', '一个栈', '一个虚拟机'], a: 1, why: '环境 = 变量 → 值的表，所以本课先讲表再讲解释器。' }
    ]
  };
  QZ['L5-flash'] = {
    title: 'L5 闪卡',
    cards: [
      { q: '表的数学定义？', a: '键的子集 A′ 与函数 f : A′ → B；每个 (a′,f(a′)) 叫条目。' },
      { q: 'isReg 的两个等式？', a: '<code>eq isReg(empTable,K2) = false .</code> / <code>eq isReg((K,V)|T,K2) = if K == K2 then {true} else {isReg(T,K2)} .</code>' },
      { q: 'update vs insert？', a: 'update：有则改、无则加；insert：键已存在时返回错误。' },
      { q: '错误传播的等式？', a: '<code>eq (K,err.V) = errEntry .</code>' }
    ]
  };
})();
