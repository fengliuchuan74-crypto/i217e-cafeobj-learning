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
  /* notes：可选，{ '这一行代码(去掉首尾空格)': '这一行的中文解释' }，供「逐行解读」使用 */
  function cb(id, src, cap, notes) {
    if (notes) (window.CODE_NOTES = window.CODE_NOTES || {})[id] = notes;
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
    pre: [
      '不需要任何前置章节，这是第一章',
      '会一点 Python 就够了：知道什么是函数、参数、返回值、递归（函数调用自己）',
      '不需要懂数学证明，后面用到时会从头讲'
    ],
    summary: [
      'I217E 用 CafeOBJ 语言学三件事：写规格（模块/排序/算子）、用等式重写来计算、用结构归纳来证明',
      'CafeOBJ 里没有赋值和循环，「计算」= 反复用等式把项换成新项，直到换不动（这个结果叫范式）',
      '第一个例子里没有数字，只有 <code>0</code> 和后继 <code>s</code>：<code>s(s(0))</code> 就是 2，<code>2 + 3</code> 用两条等式三步算完',
      '考试是手写（模块、<code>red</code> 结果、证明），作业 30% + 考试 70%，60 分及格',
      '学习节奏：读 → 跑（改代码再跑）→ 测 → 标记 → 复习'
    ],
    goals: [
      '用一句话说清 I217E 的核心：<b>用代数规格描述程序，用重写来计算，用归纳来证明</b>',
      '知道 CafeOBJ 是什么、为什么用它、它和 C/Java 的差别',
      '知道考试的形式、分值、时间，和最容易拿分的章节',
      '掌握本系统「读 → 跑 → 测 → 复习」的学习闭环'
    ],
    sections: [
      {
        id: 'L0.s1', title: '一句话概括：这门课在学什么',
        guide: {
          what: '这门课教你用<b>等式</b>来写程序：写下「什么等于什么」，电脑自己反复套用等式算出结果。好比做化简题：<code>2+3</code> 按规则一步步化简到 <code>5</code>，每一步都有依据。',
          why: '平时写 Python 时，我们只能「跑几个例子」看程序对不对。用等式写的程序可以像数学题一样<b>证明</b>它对所有输入都正确，这是测试做不到的。',
          how: '先点下面第一个代码块的「▶ 运行」，再打开「逐行解读」，对照下方的「手算过程」看懂每一步用了哪条等式。',
          use: 'Rust 和 TypeScript 的编译器用类似的「按规则化简」来检查和简化类型；SQL 数据库的查询优化器用重写规则把查询改成更快的等价形式；Python 的 <code>ast</code> 模块也是把代码看成树再做变换。',
          pitfalls: ['以为 CafeOBJ 和 Python 一样是「一行一行执行」的：其实它是不断找能套用的等式，和书写顺序无关', '看到 <code>s(s(0))</code> 不知道是什么：它就是数字 2，<code>s</code> 表示「加一」', '只看不跑：一定要点运行，再改一改数字自己试']
        },
        html:'<p class="lead">I217E 是「函数式编程」，但它真正的主角是一个叫 <b>CafeOBJ</b> 的语言，和一套叫 <b>代数规格（algebraic specification）+ 项重写（term rewriting）</b> 的思想。</p>' +
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
          cb('w-l0-1', 'mod! HELLO {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _+_ : PNat PNat -> PNat {prec: 33}\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n}\nopen HELLO .\nred s(s(0)) + s(s(s(0))) .\nred 0 + s(0) .\nclose', '第一个例子：2 + 3', {
            'mod! HELLO {': '定义一个名叫 HELLO 的模块（module）。模块就像 Python 里的一个 .py 文件，里面放类型、函数和规则。<code>mod!</code> 是关键字，<code>{</code> 表示模块内容开始。',
            '[PNat]': '声明一种「类型」，名字叫 PNat（Peano Natural number，皮亚诺自然数）。方括号 <code>[ ]</code> 就是「声明排序（sort）」的写法，排序 ≈ 类型，第 1 章细讲。',
            'op 0 : -> PNat {constr}': '声明一个常量 <code>0</code>，它是 PNat 类型。<code>op</code> = operator（算子，≈ 函数）；冒号后写「参数类型 -&gt; 结果类型」，箭头左边什么都没有，表示不需要参数（所以是常量）。<code>{constr}</code> 现在只需知道「0 是一个最基本的值，不会再被化简」，第 1 章第 5 节细讲。',
            'op s_ : PNat -> PNat {constr}': '声明「后继」函数 <code>s</code>：输入一个 PNat，输出一个 PNat，意思是「加一」。下划线 <code>_</code> 标出参数的位置，<code>s_</code> 表示参数写在 s 后面：<code>s 0</code> 或 <code>s(0)</code>。它也是 <code>{constr}</code>：<code>s(0)</code> 本身就是一个值（表示 1）。',
            'op _+_ : PNat PNat -> PNat {prec: 33}': '声明加法：两个下划线 = 两个参数，参数分别写在 + 的左右两边，所以能写成 <code>X + Y</code>。<code>{prec: 33}</code> 是优先级，现在只需知道「数字越小越先算」，第 1 章第 2 节细讲。',
            'vars X Y : PNat': '声明两个变量 X 和 Y，类型都是 PNat。等式里的变量必须先声明。变量的意思是「这里可以填任何 PNat 值」，类似 Python 函数的形参。',
            'eq 0 + Y = Y .': '第 1 条等式（下面叫 eq1）：「0 加任何数 Y，等于 Y」。<code>eq</code> 是关键字，末尾的句号 <code>.</code> 不能漏。引擎看到形如 <code>0 + 某数</code> 的东西，就把它换成「某数」。',
            'eq s(X) + Y = s(X + Y) .': '第 2 条等式（eq2）：「(X+1) + Y = (X + Y) + 1」。左边的 X 是比左操作数少一的那个数，所以每用一次，<code>+</code> 左边就少一个 s，直到变成 0，再交给 eq1。这就是递归。',
            '}': '模块定义结束（注意 <code>}</code> 后面没有句号）。',
            'open HELLO .': '打开 HELLO 模块，之后的命令都在这个模块里执行。类似 Python 的 <code>from hello import *</code>。末尾句号必须写。',
            'red s(s(0)) + s(s(s(0))) .': '<code>red</code> = reduce（归约）：把后面这个式子用等式反复化简，直到化不动，再打印结果。这里算的是 2 + 3。',
            'red 0 + s(0) .': '再算一个 0 + 1：只需要用 eq1 一步，结果是 <code>s(0)</code>（也就是 1）。',
            'close': '关闭当前打开的模块，结束这一段测试。'
          }) +
          '<p>你会看到 <code>s(s(0)) + s(s(s(0)))</code> 被一步步换成 <code>s(s(s(s(s(0)))))</code>，' +
          '这就是「5」。这里没有数字 2 和 3，只有 <code>0</code> 和「后继」<code>s</code> —— 这叫做<b>皮亚诺自然数</b>，第 11 章会用它做证明。' +
          '（从第 2 章起，我们会在模块里写 <code>pr(NAT)</code> 导入系统自带的自然数模块，那时就能直接写 <code>2</code>、<code>3</code> 这样的普通数字了。）</p>' +
          '<h3 class="sub">手算过程：2 + 3 是怎么变成 5 的</h3>' +
          '<p>为了好读，先把 <code>s(s(0))</code> 记作 2，<code>s(s(s(0)))</code> 记作 3。每一步只做一件事：找到一处能套用等式左边的地方，换成等式右边。</p>' +
          '<table><tr><th>步</th><th>当前的式子</th><th>用的等式</th><th>变量取什么值</th></tr>' +
          '<tr><td>0</td><td><code>s(s(0)) + 3</code>（即 2+3）</td><td>—</td><td>—</td></tr>' +
          '<tr><td>1</td><td><code>s(s(0) + 3)</code>（即 s(1+3)）</td><td>eq2：<code>s(X) + Y = s(X + Y)</code></td><td>X = <code>s(0)</code>，Y = 3</td></tr>' +
          '<tr><td>2</td><td><code>s(s(0 + 3))</code>（即 s(s(0+3))）</td><td>eq2（作用在里层的 <code>s(0) + 3</code> 上）</td><td>X = <code>0</code>，Y = 3</td></tr>' +
          '<tr><td>3</td><td><code>s(s(s(s(s(0)))))</code>（即 5）</td><td>eq1：<code>0 + Y = Y</code></td><td>Y = 3</td></tr></table>' +
          '<p>第 3 步之后，式子里已经没有 <code>+</code> 了，没有任何等式的左边能对上，计算停止。运行结果右边的「[3]」就是这 3 步。</p>' +
          '<h3 class="sub">同样的事用 Python 怎么写</h3>' +
          '<div class="codebox"><pre># 用元组模仿皮亚诺自然数：0 写成 ("0",)，s(x) 写成 ("s", x)\nZERO = ("0",)\ndef s(x):\n    return ("s", x)\n\ndef add(x, y):\n    if x == ZERO:          # 对应 eq 0 + Y = Y .\n        return y\n    _, x1 = x              # x 一定形如 s(x1)，取出 x1\n    return s(add(x1, y))   # 对应 eq s(X) + Y = s(X + Y) .\n\ntwo = s(s(ZERO))\nthree = s(s(s(ZERO)))\nprint(add(two, three))\n# 输出 (\'s\', (\'s\', (\'s\', (\'s\', (\'s\', (\'0\',))))))  也就是 5</pre></div>' +
          '<p>对照一下：Python 版要自己写 <code>if</code> 判断「是 0 还是 s(x1)」，再手动拆开 x；CafeOBJ 版只写两条等式，<b>「该用哪条」由引擎通过匹配等式左边自动决定</b>。这个「匹配」的过程第 3 章会细讲。</p></div>'
      },
      {
        id: 'L0.s2', title: '为什么用 CafeOBJ：三个真实的理由',
        guide: {
          what: 'CafeOBJ 是一种「可执行的规格语言」：你写下的定义本身就能运行。好比菜谱写得足够精确，机器人照着就能做菜，人也能拿它检查菜做得对不对。',
          why: '用 Python 讲「重写」和「证明」，中间隔着变量赋值、循环、内存这些细节，很难看清。CafeOBJ 去掉了这些，每一步计算都看得见、能证明。',
          how: '这一节没有代码，读三张卡片，记住三个理由：规格即程序、计算过程可见、可以证明。',
          use: '同类思想的工具：Maude（重写逻辑）、Coq / Lean（证明助手）、TLA+（亚马逊等公司用来验证分布式系统设计）。Rust 编译器内部的 Chalk / trait 求解器也用类似的规则推导。',
          pitfalls: ['把 CafeOBJ 当成工业语言去追求「能做什么应用」：它是教学和验证用的', '觉得语法古怪就跳过：<code>op _+_</code>、<code>{constr}</code> 必须熟练，考试要手写']
        },
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
        guide: {
          what: '这一节是「考试说明书」：考什么、怎么考、先学哪章最划算。好比去一个陌生城市前先看地图。',
          why: '时间有限时平均用力最亏。不知道考试是手写，就会只练「看懂」而不练「写出」，到考场才发现写不出来。',
          how: '记住两张表：第一张是考试形式（手写、100 分钟），第二张是章节优先级（L3 和 L11–L13 最重要）。',
          use: '这和准备任何技术面试一样：先弄清考察范围和形式（白板手写还是上机），再分配时间。',
          pitfalls: ['以为是选择题，只背概念不练手写', '平均分配时间，L3 和 L11–L13 没吃透', '忽视 L1–L2 的语法细节：句号、空格写错整题都会错']
        },
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
        guide: {
          what: '本系统每一节都按「读 → 跑 → 测 → 标 → 复」五步走。好比学游泳：看示范、下水试、教练检查、记录进度、隔几天再练。',
          why: '只读不跑，会以为自己懂了；只跑不改，不知道哪一行起什么作用；不复习，过一周就忘。',
          how: '下面的代码块用的是系统自带的列表模块 NATLIST，先点运行，再把数字改一改重新运行。',
          use: '这就是「间隔重复」（spaced repetition），Anki 等记忆软件就是按 1/3/7/21 天这类间隔安排复习的。',
          pitfalls: ['代码一字不改地跑一遍就走', '小测错了不看解析', '忘记点「我学会了这一节」，复习队列就不会提醒你']
        },
        html: '<p>左侧是按课程顺序排的章节。每一节的结构都一样，养成固定节奏就不会迷路：</p>' +
          '<ol><li><b>读</b>：看讲解（每个概念都给了「为什么」和「图」）</li>' +
          '<li><b>跑</b>：点代码块里的「▶ 运行」，<b>然后改一改再跑</b>（改数字、改等式，看结果怎么变）</li>' +
          '<li><b>测</b>：做每节的随堂小测（错了会自动进复习队列）</li>' +
          '<li><b>标</b>：点「✓ 我学会了这一节」，进度会记在本地</li>' +
          '<li><b>复</b>：右上角「复习队列」按 1/3/7/21 天的间隔提醒你重看</li></ol>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔁</span>关键动作：改代码</div>' +
          '<p>「跑一遍」只是看懂，「改一行再跑」才是学会。比如把上面 2 + 3 例子里的 <code>red 0 + s(0) .</code> 改成 <code>red s(0) + s(0) .</code>，' +
          '或者把下面的 <code>[2 .. 6]</code> 改成 <code>[2 .. 10]</code>，看结果怎么变 —— 你会立刻发现自己哪里理解错了。</p></div>' +
          '<p>下面这段用的是系统<b>自带</b>的列表模块 <code>NATLIST</code>（不用自己定义，直接 <code>open</code>）。' +
          '<code>3 | 2 | 1 | nil</code> 是一个列表，相当于 Python 的 <code>[3, 2, 1]</code>：<code>|</code> 把元素连起来，<code>nil</code> 表示「列表到此结束」。第 2 章会从零讲它是怎么定义的，现在只看结果、改数字即可。</p>' +
          cb('w-l0-2', 'open NATLIST .\nred hd(3 | 2 | 1 | nil) .\nred tl(3 | 2 | 1 | nil) .\nred len(1 | 2 | 3 | 4 | 5 | nil) .\nred [2 .. 6] .\nclose', '试试改数字：hd / tl / len / 区间', {
            'open NATLIST .': '打开系统自带的自然数列表模块 NATLIST。里面已经定义好了列表和 hd / tl / len 等函数。',
            'red hd(3 | 2 | 1 | nil) .': '<code>hd</code> = head，取列表的第一个元素。相当于 Python 的 <code>[3, 2, 1][0]</code>，结果是 3。',
            'red tl(3 | 2 | 1 | nil) .': '<code>tl</code> = tail，去掉第一个元素后剩下的列表。相当于 Python 的 <code>[3, 2, 1][1:]</code>，结果是 <code>2 | 1 | nil</code>。',
            'red len(1 | 2 | 3 | 4 | 5 | nil) .': '<code>len</code> 求列表长度，相当于 Python 的 <code>len([1, 2, 3, 4, 5])</code>，结果是 5。',
            'red [2 .. 6] .': '<code>[X .. Y]</code> 生成从 X 到 Y 的列表，相当于 Python 的 <code>list(range(2, 7))</code>，结果是 <code>2 | 3 | 4 | 5 | 6 | nil</code>。',
            'close': '关闭 NATLIST 模块。'
          }) +
          '<div class="card"><div class="card-t"><span class="ico">🧭</span>四个按钮</div>' +
          '<ul><li><b>上一节 / 下一节</b>：按顺序推进（也可以 Alt+← / Alt+→）</li>' +
          '<li><b>复习队列</b>：红色数字表示今天到期的条目</li>' +
          '<li>左侧条目前面的 ✓：这一章所有小节都标了「已掌握」才会出现</li>' +
          '<li>倒数牌：距考试还有几天，别让它少于 7 天</li></ul></div>'
      },
      {
        id: 'L0.s5', title: '冲刺路线图（假设你从零开始）',
        guide: {
          what: '一份三周的学习计划，告诉你每周学哪几章、学到什么程度算过关。好比健身计划表。',
          why: '没有计划容易在简单章节上花太多时间，到最后几天才碰最难也最值钱的验证章节。',
          how: '照表推进：第 1 周打地基（L1–L3），第 2 周拿分点（L4–L7），第 3 周攻大头（L8–L13）。表里提到的术语（redex、take、primes 等）现在看不懂没关系，学到对应章节自然会懂。',
          use: '软件项目也这样排期：先做所有功能都依赖的基础模块，再做上层功能。',
          pitfalls: ['跳过 L1–L3 直接看验证章节：验证题全建立在重写之上', '每天学很久但隔几天才学一次：语言类知识要每天碰']
        },
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
      { q: '（热身）在第一个例子里，<code>s(s(0))</code> 表示哪个数？', opts: ['0', '1', '2', '3'], a: 2, why: '<code>s</code> 表示「加一」。0 加一两次，就是 2。',
        optWhy: ['错：0 就是 <code>0</code> 本身，没有 s', '错：1 是 <code>s(0)</code>，只有一个 s', '对：两个 s，表示 0 加一两次 = 2', '错：3 是 <code>s(s(s(0)))</code>，要三个 s'] },
      { q: '（热身）<code>red</code> 命令的作用是？', opts: ['定义一个新模块', '把一个式子用等式反复化简，并打印结果', '关闭模块', '声明变量'], a: 1, why: '<code>red</code> = reduce（归约）。',
        optWhy: ['错：定义模块用 <code>mod!</code>', '对：red 会一直套用等式，直到化不动为止，然后打印结果', '错：关闭模块用 <code>close</code>', '错：声明变量用 <code>var</code> / <code>vars</code>'] },
      { q: 'I217E 这门课的核心技术是下面哪一个？', opts: ['面向对象建模', '项重写（term rewriting）+ 代数规格', '关系数据库设计', '编译原理中的词法分析'], a: 1, why: '课程用 CafeOBJ 写代数规格，靠<b>重写</b>来计算，靠<b>归纳</b>来证明。',
        optWhy: ['错：CafeOBJ 里没有类和对象，课程不讲面向对象', '对：写规格 + 用等式重写来计算，是整门课的主线', '错：课程不涉及数据库表设计', '错：词法分析是编译原理的内容，这门课不讲'] },
      { q: '在 CafeOBJ 里，「计算」本质上是：', opts: ['修改变量的值', '不停地用等式把项替换成新项，直到不能再换', '把程序编译成机器码', '在内存里分配对象'], a: 1, why: 'CafeOBJ 没有赋值语句。计算（归约）= 反复用等式做一步替换，直到换不动；换不动的结果叫范式（normal form）。这些术语第 3 章细讲。',
        optWhy: ['错：CafeOBJ 没有赋值，变量只是等式里的「占位符」', '对：这就是重写（rewriting），例如 2+3 三步换成 5', '错：CafeOBJ 程序不需要编译成机器码，引擎直接重写', '错：没有对象，也不需要管内存'] },
      { q: '考试形式是：', opts: ['全部选择题', '手写模块、手写 red 结果、手写归纳证明', '上机编程', '写一篇小论文'], a: 1, why: '这是本课最容易失分的地方：必须能手写，不能只「看懂」。',
        optWhy: ['错：考试不是选择题，本系统的选择题只是帮你自查', '对：三类手写题，所以要练「写出来」', '错：考场不能上机运行 CafeOBJ', '错：没有论文题'] },
      { q: '按性价比，最该多花时间的两个部分是哪两个？', opts: ['L0 导学 + L14 证明助手', 'L3 项重写 + L11–L13 验证', 'L4 参数化 + L5 表', '只看作业答案'], a: 1, why: 'L3 是所有题的地基，L11–L13 的验证题分值最高。',
        optWhy: ['错：L0 没有考点，L14 只考概念，优先级最低', '对：L3 是所有题的基础，L11–L13 分值最高', '错：L4、L5 是送分题，但不是拉分的部分', '错：只看答案练不出手写能力'] }
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
    pre: [
      'L0 第 1 节的第一个例子（2 + 3）：知道 <code>s(s(0))</code> 表示 2，<code>red</code> 会反复套用等式',
      'Python 里「函数有参数类型和返回值」的概念（例如 <code>def f(x: int) -&gt; int</code>）',
      'Python 的递归函数：函数在内部调用自己，并且有一个「到此为止」的基础情形'
    ],
    summary: [
      '排序（sort）≈ 类型，用 <code>[A B]</code> 声明；排序名是自己起的名字，不是关键字',
      '算子（op）≈ 函数，<code>op 名字 : 参数排序... -&gt; 结果排序</code>；没有参数的算子就是常量',
      '名字里的下划线 <code>_</code> 标出参数位置：<code>_+_</code> 是中缀，<code>s_</code> 是前缀，<code>if_then{_}else{_}</code> 是混合（mixfix）',
      '项（term）就是一棵树：节点是算子，叶子是常量或变量；<code>prec:</code> 决定字符串怎么解析成唯一的树',
      '等式 <code>eq 左 = 右 .</code> 从左往右用；变量要先声明；左边不能只是一个变量；句号不能漏',
      '<code>{constr}</code> 标出构造子：由构造子拼成的项就是「值」（如 <code>s(s(0))</code>）'
    ],
    goals: [
      '能写出一个合法的 <code>mod!</code> 模块：排序、算子、变量、等式',
      '分清「排序（sort）」和「项（term）」，能画出项的语法树',
      '会写前缀、中缀、混合（mixfix）三种算子',
      '知道 <code>{constr}</code>、<code>prec:</code>、<code>assoc/comm</code> 分别是什么意思'
    ],
    sections: [
      {
        id: 'L1.s1', title: '排序（sort）：先给「东西」分类',
        guide: {
          what: '排序（sort）就是「类型」的名字，代表一类值的集合。好比超市货架的标签：「水果」架上只放水果，「饮料」架上只放饮料。',
          why: '没有排序，<code>true + 0</code> 这种无意义的式子也会被接受；有了排序，每个算子只接受规定类型的参数，写错的式子在运行前就被拒绝。',
          how: '用方括号声明：<code>[Bool PNat]</code>。然后用 <code>op</code> 声明这个排序里有哪些值，见下面的代码。',
          use: 'Python 的类型注解 <code>x: int</code>、TypeScript 的 <code>let x: number</code>、Rust 的 <code>let x: u32</code> 都是同一个想法：给值标类型，让编译器提前查错。',
          pitfalls: ['以为 <code>Bool</code>、<code>Nat</code> 是关键字：排序名是自己起的，<code>[Hat]</code> 也合法', '忘了方括号，写成 <code>Bool PNat</code>', '把排序名和值搞混：<code>PNat</code> 是类型，<code>0</code>、<code>s(0)</code> 才是它的值']
        },
        html: '<p>在 CafeOBJ 里，每个值都属于一个<b>排序（sort）</b>。你可以把它想成「类型」，但更接近数学里「集合」的概念：排序就是一个集合的名字。</p>' +
          cb('w-l1-1', 'mod! SORT-DEMO {\n  [Bool PNat]\n  ops true false : -> Bool {constr}\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n}\nopen SORT-DEMO .\nred true .\nred s(0) .\nclose', '声明两个排序', {
            'mod! SORT-DEMO {': '定义一个名叫 SORT-DEMO 的模块，<code>{</code> 后面是模块内容。',
            '[Bool PNat]': '一次声明两个排序：Bool（真假值）和 PNat（皮亚诺自然数）。多个排序之间用空格隔开。',
            'ops true false : -> Bool {constr}': '<code>ops</code>（复数）一次声明两个算子 true 和 false。箭头左边为空 = 没有参数 = 常量，结果排序是 Bool。<code>{constr}</code> 表示它们是构造子（基本值），本章第 5 节细讲。',
            'op 0 : -> PNat {constr}': '声明常量 0，排序是 PNat。',
            'op s_ : PNat -> PNat {constr}': '声明后继算子 s：给一个 PNat，得到下一个 PNat（加一）。<code>s_</code> 的下划线在 s 后面，表示参数写在 s 后面（前缀写法）。',
            '}': '模块结束，<code>}</code> 后面不加句号。',
            'open SORT-DEMO .': '打开模块，后面的 red 都在这个模块里算。',
            'red true .': '归约 <code>true</code>。没有等式可用，所以结果就是它自己，排序是 Bool。',
            'red s(0) .': '归约 <code>s(0)</code>。它由构造子组成，已经是值了，结果还是 <code>s 0</code>（引擎显示时省略括号），排序是 PNat。',
            'close': '关闭模块。'
          }) +
          '<p>写法要点：</p><ul>' +
          '<li><code>[Bool PNat]</code>：一次声明两个排序。<b>排序名不是关键字</b>（不像 <code>int</code>），你写 <code>[Hat]</code> 也合法。</li>' +
          '<li><code>op true : -> Bool {constr}</code>：<code>true</code> 是一个<b>不带参数</b>的算子，也就是常量（constant）。箭头的左边是参数，右边是结果排序。</li>' +
          '<li><code>op s_ : PNat -> PNat {constr}</code>：<code>s_</code> 是<b>前缀</b>写法：s 写在前面，下划线标出参数的位置（在 s 后面）。所以 <code>s 0</code> 也可以写成 <code>s(0)</code>（CafeOBJ 两种都接受，运行结果里显示的是 <code>s 0</code>）。</li></ul>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔑</span>为什么排序这么重要</div>' +
          '<p>因为<b>重写是有排序约束的</b>：等式 <code>0 + Y = Y</code> 里，<code>Y</code> 必须是 <code>PNat</code>，' +
          '所以匹配和计算都在排序的约束下进行。第 2 章的「阶排序」和第 3 章的重写都建立在这上面，' +
          '写错一个排序，后面的 <code>red</code> 全部出错。</p></div>' +
          '<div class="widget" id="w-l1-lat"></div>'
      },
      {
        id: 'L1.s2', title: '算子（operator）与 arity：三种写法',
        guide: {
          what: '算子（operator）就是函数。名字里的下划线 <code>_</code> 是「参数插槽」，决定参数写在哪里。好比填空题：<code>_+_</code> 就是「___ + ___」，空里填两个数。',
          why: '如果只能写 <code>plus(1, 2)</code>，复杂式子会满屏括号，很难读。下划线让你自己设计写法，写出 <code>1 + 2 * 3</code>、<code>if c then {a} else {b}</code> 这种接近数学的式子。',
          how: '声明格式是 <code>op 名字 : 参数排序1 参数排序2 ... -&gt; 结果排序</code>。下面的代码定义了 <code>+</code> 和 <code>*</code>，并用 <code>prec</code> 规定先乘后加。',
          use: 'Python 用 <code>__add__</code> 让 <code>a + b</code> 调用你写的函数；Rust 用 <code>impl Add</code>；Haskell 可以直接定义中缀运算符；Swift 能自定义前缀、中缀、后缀运算符并指定优先级。',
          pitfalls: ['用的时候忘了空格：要写 <code>1 + 2</code>，不能写 <code>1+2</code>', '下划线个数和参数排序个数不一致', '同时有 + 和 * 时忘写 <code>prec</code>，导致解析结果和预期不同']
        },
        html: '<p>算子 = 函数名 + 参数个数（arity）。CafeOBJ 最反直觉的地方是<b>名字里带下划线</b>表示参数位置。</p>' +
          '<table><tr><th>形式</th><th>写法</th><th>用法</th></tr>' +
          '<tr><td>普通函数式 / 常量</td><td><code>op fact : Nat -> Nat</code></td><td><code>fact(3)</code></td></tr>' +
          '<tr><td>中缀（infix）</td><td><code>op _+_ : Nat Nat -> Nat</code></td><td><code>1 + 2</code>（下划线处放参数）</td></tr>' +
          '<tr><td>混合（mixfix）</td><td><code>op if_then{_}else{_} : Bool Nat Nat -> Nat</code></td><td><code>if c then {1} else {2}</code></td></tr>' +
          '<tr><td>前缀（prefix）</td><td><code>op s_ : Nat -> Nat</code></td><td><code>s 0</code> 或 <code>s(0)</code>（s 在前，参数在后）</td></tr>' +
          '<tr><td>后缀（postfix）</td><td><code>op _! : Nat -> Nat</code></td><td><code>3 !</code>（参数在前，! 在后，讲义第 1 章练习 6）</td></tr>' +
          '<tr><td>括号式</td><td><code>op (_,_) : Nat Nat -> Pair</code></td><td><code>(1,2)</code></td></tr></table>' +
          '<p>下划线的数量 = 参数个数。<code>_+_</code> 有两个下划线 → 二元；<code>s_</code> 一个 → 一元；<code>nil</code> 没有 → 常量。</p>' +
          cb('w-l1-2', 'mod! OPDEMO {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _+_ : PNat PNat -> PNat {prec: 33}\n  op _*_ : PNat PNat -> PNat {prec: 31}\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n  eq 0 * Y = 0 .\n  eq s(X) * Y = (X * Y) + Y .\n}\nopen OPDEMO .\nred s(0) + s(s(0)) .\nred s(s(0)) * s(s(0)) .\nclose', '中缀算子 + 优先级', {
            'mod! OPDEMO {': '定义模块 OPDEMO。',
            '[PNat]': '声明排序 PNat（皮亚诺自然数）。',
            'op 0 : -> PNat {constr}': '常量 0（构造子）。',
            'op s_ : PNat -> PNat {constr}': '后继 s（加一），前缀写法，构造子。',
            'op _+_ : PNat PNat -> PNat {prec: 33}': '中缀加法：两个参数都是 PNat，结果是 PNat。优先级 33。',
            'op _*_ : PNat PNat -> PNat {prec: 31}': '中缀乘法。优先级 31 比加法的 33 小，所以乘法绑定更紧、先算。',
            'vars X Y : PNat': '声明变量 X、Y，排序是 PNat。',
            'eq 0 + Y = Y .': '加法基础情形：0 + Y = Y。',
            'eq s(X) + Y = s(X + Y) .': '加法递归情形：(X+1) + Y = (X+Y) + 1。',
            'eq 0 * Y = 0 .': '乘法基础情形：0 乘任何数等于 0。',
            'eq s(X) * Y = (X * Y) + Y .': '乘法递归情形：(X+1) × Y = X×Y + Y。乘法被化成了加法。',
            '}': '模块结束。',
            'open OPDEMO .': '打开模块。',
            'red s(0) + s(s(0)) .': '算 1 + 2，结果是 <code>s(s(s(0)))</code>，即 3。',
            'red s(s(0)) * s(s(0)) .': '算 2 × 2，结果是 4 个 s 包着 0，即 4。',
            'close': '关闭模块。'
          }) +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>prec 是干嘛的</div>' +
          '<p><code>prec:</code> 越小，绑定越紧。乘法的 prec 比加法小，所以 <code>1 + 2 * 3</code> 会先算乘法 —— 和你从小学数学的规则一致。' +
          '<b>考试写模块时，如果同时有 + 和 *，一定要写 prec，否则解析会出乎意料。</b></p></div>'
      },
      {
        id: 'L1.s3', title: '项（term）：把表达式看成树',
        guide: {
          what: '项（term）是用算子、常量和变量拼起来的式子，它的真实结构是一棵树。好比家谱：最上面是祖先（最外层的算子），往下是子女（参数）。',
          why: '如果只把式子当一串字符，就说不清「哪一部分」被替换了。把它看成树以后，每一部分都有确定的位置，重写就是「把树上某个节点下面的整块换掉」。',
          how: '看下面的树图：根是 <code>_+_</code>，两个孩子是 <code>s(s(0))</code> 和 <code>s(0)</code>。试着自己从根往下数位置。',
          use: 'Python 的 <code>ast.parse("1 + 2 * 3")</code> 会把代码变成一棵语法树；TypeScript、Rust 编译器、数据库的 SQL 解析器第一步也都是把文本变成树，后面的检查和优化全在树上做。',
          pitfalls: ['把「项」和「字符串」混为一谈：<code>1 + 2 * 3</code> 这个字符串要先按优先级解析，才得到唯一的树', '数位置时从 0 开始：位置从 1 开始数，根是空串 ε', '以为变量不能出现在项里：<code>X + 0</code> 也是项（含变量的项）']
        },
        html: '<p>项是「算子的应用」递归拼起来的东西。<code>s(s(0)) + s(0)</code> 不是一串字符，而是一棵树：</p>' +
          '<div class="widget" id="w-l1-tree"></div>' +
          '<p>树上的每个节点是一个算子，叶子是常量或变量。这个视角非常重要，因为第 3 章的「重写」就是<b>在树上某个节点做替换</b>：</p>' +
          '<ul><li><b>子项（subterm）</b>：树上任意一个节点连同它下面的一切</li>' +
          '<li><b>位置（position）</b>：从根开始往第几个子节点走，例如 <code>2.1</code> 表示「根的第二个子节点的第一个子节点」</li></ul>' +
          '<p>第 3 章还会定义 <b>redex</b>：能套用某条等式的那个子项。现在只需知道「重写总是发生在某个子项上」。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🌳</span>为什么必须用树来想</div>' +
          '<p>项本身就是一棵树，树是唯一的。会有歧义的是<b>我们写下的字符串</b>：<code>1 + 2 * 3</code> 这串字符，既可能读成 <code>(1 + 2) * 3</code>，也可能读成 <code>1 + (2 * 3)</code>，' +
          '这是两个不同的项（两棵不同的树）。CafeOBJ 靠 <code>prec:</code>（优先级）和括号来决定这串字符对应哪一棵树，' +
          '而重写的「位置」正是定义在这棵树上的。考试里问「第 3 步重写了哪个位置」时，答案一定是树上的一个位置。</p></div>'
      },
      {
        id: 'L1.s4', title: '等式（equation）与变量',
        guide: {
          what: '等式 <code>eq 左 = 右 .</code> 是一条「看到左边就换成右边」的规则。好比字典里的「同义替换」：看到「2+3」就可以写成「5」。',
          why: 'CafeOBJ 没有 return、没有循环，函数「怎么算」全靠等式描述。没有等式，<code>fact(3)</code> 只是一个写在那里的式子，永远算不出结果。',
          how: '先写基础情形 <code>fact(0) = s(0)</code>，再写递归情形 <code>fact(s(X)) = s(X) * fact(X)</code>。下面的代码点运行就能看到 3! = 6。',
          use: '这就是 Haskell / OCaml / Rust 里的「模式匹配」写法（Rust 的 <code>match n { 0 =&gt; 1, n =&gt; n * fact(n-1) }</code>），Python 3.10 的 <code>match</code> 语句也是同一个想法。',
          pitfalls: ['等式末尾漏写句号 <code>.</code>', '用了没声明的变量', '写了 <code>eq X = 0 .</code> 这种左边只是一个变量的等式', '以为等式可以从右往左用：引擎只会从左往右替换']
        },
        html: '<p>等式是 CafeOBJ 的「程序」，形如 <code>eq 左边 = 右边 .</code>，结尾的<b>句号不能漏</b>。</p>' +
          cb('w-l1-3', 'mod! FACT-DEMO {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _*_ : PNat PNat -> PNat {prec: 31}\n  op _+_ : PNat PNat -> PNat {prec: 33}\n  op fact : PNat -> PNat\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n  eq 0 * Y = 0 .\n  eq s(X) * Y = (X * Y) + Y .\n  eq fact(0) = s(0) .\n  eq fact(s(X)) = s(X) * fact(X) .\n}\nopen FACT-DEMO .\nred fact(s(s(s(0)))) .\nred fact(s(s(s(s(0))))) .\nclose', '阶乘：3! 与 4!', {
            'mod! FACT-DEMO {': '定义模块 FACT-DEMO（阶乘演示）。',
            '[PNat]': '声明排序 PNat。',
            'op 0 : -> PNat {constr}': '常量 0（构造子）。',
            'op s_ : PNat -> PNat {constr}': '后继 s（加一），构造子。',
            'op _*_ : PNat PNat -> PNat {prec: 31}': '乘法，优先级 31（比加法先算）。',
            'op _+_ : PNat PNat -> PNat {prec: 33}': '加法，优先级 33。',
            'op fact : PNat -> PNat': '阶乘函数 fact：普通函数写法，用的时候写 <code>fact(...)</code>。注意它<b>没有</b> <code>{constr}</code>：<code>fact(3)</code> 不是值，要靠等式算掉。',
            'vars X Y : PNat': '声明变量 X、Y。',
            'eq 0 + Y = Y .': '加法基础情形。',
            'eq s(X) + Y = s(X + Y) .': '加法递归情形。',
            'eq 0 * Y = 0 .': '乘法基础情形。',
            'eq s(X) * Y = (X * Y) + Y .': '乘法递归情形。',
            'eq fact(0) = s(0) .': '阶乘基础情形：0! = 1（<code>s(0)</code> 就是 1）。Python 里相当于 <code>if n == 0: return 1</code>。',
            'eq fact(s(X)) = s(X) * fact(X) .': '阶乘递归情形：(X+1)! = (X+1) × X!。左边 <code>fact(s(X))</code> 只能匹配「参数不是 0」的情况，X 自动取到「参数减一」。Python 里相当于 <code>return n * fact(n - 1)</code>。',
            '}': '模块结束。',
            'open FACT-DEMO .': '打开模块。',
            'red fact(s(s(s(0)))) .': '算 3!，结果是 6 个 s 包着 0，即 6。',
            'red fact(s(s(s(s(0))))) .': '算 4!，结果是 24 个 s，即 24。步数明显变多，因为皮亚诺数的乘法要一层层拆成加法。',
            'close': '关闭模块。'
          }) +
          '<p>读法等式的三条铁律：</p>' +
          '<ol><li><b>变量必须先声明</b>：<code>vars X Y : Nat</code> 或 <code>var N : Nat</code>。没声明的大写名字会被当成未定义变量，可能报错，也可能悄悄算出奇怪结果。</li>' +
          '<li><b>左边不能只是一个变量</b>：<code>eq X = 0 .</code> 是非法的（否则什么都变成 0）。左边必须「有结构」，比如 <code>fact(s(X))</code>。</li>' +
          '<li><b>等式的方向是从左到右</b>：<code>eq fact(0) = s(0)</code> 表示「看到 <code>fact(0)</code> 就换成 <code>s(0)</code>」，反过来不成立。</li></ol>' +
          '<div class="card exam"><div class="card-t"><span class="ico">🎯</span>考试最爱考的细节</div>' +
          '<ul><li>每条 <code>eq</code> 末尾要有 <code>.</code>；<code>mod!</code> 里的 <code>}</code> 后面<b>没有</b>句号</li>' +
          '<li>定义递归函数时，<b>习惯上先写基础情形</b>（<code>fact(0)</code>），再写递归情形（<code>fact(s(X))</code>）。' +
          '<b>等式的书写顺序不影响结果</b>：引擎靠「匹配左边」来选用哪条等式，<code>fact(0)</code> 只能对上第一条，<code>fact(s(...))</code> 只能对上第二条。' +
          '先写基础情形只是为了方便自己检查有没有漏掉情况（和 Python 里 <code>if</code> 分支的先后顺序会影响结果不同）。</li>' +
          '<li><code>s(s(0))</code> 表示 2，<code>0</code> 表示 0。用「后继」表示自然数是没有内置数字时的标准做法（第 11 章验证时必用）。' +
          '从第 2 章起，模块里写一行 <code>pr(NAT)</code> 导入系统自带的 NAT 模块，就可以直接写 <code>2</code>、<code>3</code> 这样的普通数字。</li></ul></div>'
      },
      {
        id: 'L1.s5', title: '把这段代码拆开看：BOOL 模块',
        guide: {
          what: '一个完整的小模块：自己定义真假值 Bool 和 not、and 两个运算。好比自己动手造一个只有两个按键的计算器。',
          why: '前几节分别学了排序、算子、变量、等式，这一节把它们放在同一个模块里，让你看到一个能用的模块长什么样，以后写任何模块都照这个结构。',
          how: '按「排序 → 构造子 → 其他算子 → 变量 → 等式」的顺序读下面的代码，再点运行看三个结果。',
          use: 'Python 的 <code>bool</code>、Rust 的 <code>enum Bool { True, False }</code>、TypeScript 的联合类型 <code>true | false</code> 本质上都是「一个类型 + 两个构造子」；用变量 B2 一条等式覆盖多种情况，就像 Rust <code>match</code> 里的通配分支。',
          pitfalls: ['把 <code>{constr}</code> 加在 not、and 上：它们是要被算掉的函数，不是值', '以为必须把 true/false 的四种组合都写出来：用变量一条就能覆盖两种', '<code>ops</code> 和 <code>op</code> 用混：声明多个名字用 <code>ops</code>']
        },
        html: '<p>下面是一个完整的、真正会被用到的模块。逐行读一遍，这是你后面所有模块的模板：</p>' +
          cb('w-l1-4', 'mod! MY-BOOL {\n  [Bool]\n  ops true false : -> Bool {constr}\n  op not_ : Bool -> Bool\n  op _and_ : Bool Bool -> Bool\n  vars B1 B2 : Bool\n  eq not true = false .\n  eq not false = true .\n  eq true and B2 = B2 .\n  eq false and B2 = false .\n}\nopen MY-BOOL .\nred not false .\nred true and false .\nred false and true .\nclose', 'BOOL：最完整的模板', {
            'mod! MY-BOOL {': '定义模块 MY-BOOL。',
            '[Bool]': '声明一个排序 Bool。',
            'ops true false : -> Bool {constr}': '一次声明两个常量 true、false，它们是 Bool 的构造子（Bool 的值只有这两个）。',
            'op not_ : Bool -> Bool': '声明「非」运算，前缀写法：<code>not true</code>。没有 <code>{constr}</code>，因为它要靠等式算掉。',
            'op _and_ : Bool Bool -> Bool': '声明「与」运算，中缀写法：<code>true and false</code>。',
            'vars B1 B2 : Bool': '声明两个 Bool 变量（这个例子里只用到了 B2，多声明一个不会出错）。',
            'eq not true = false .': 'not true 等于 false。',
            'eq not false = true .': 'not false 等于 true。',
            'eq true and B2 = B2 .': 'true and 任何值 = 那个值。一条等式同时覆盖了 <code>true and true</code> 和 <code>true and false</code>。',
            'eq false and B2 = false .': 'false and 任何值 = false。',
            '}': '模块结束。',
            'open MY-BOOL .': '打开模块。',
            'red not false .': '用 <code>eq not false = true</code>，结果 true。',
            'red true and false .': '用 <code>eq true and B2 = B2</code>，B2 取 false，结果 false。',
            'red false and true .': '用 <code>eq false and B2 = false</code>，结果 false。',
            'close': '关闭模块。'
          }) +
          '<ul><li><code>[Bool]</code> 声明排序；<code>ops true false : -> Bool</code> 一次声明两个常量（<code>ops</code> 是复数形式，只声明一个时用 <code>op</code>）</li>' +
          '<li><code>{constr}</code>：标记这是<b>构造子（constructor）</b>，意思是「这个排序的值就是由这些算子造出来的」。只用构造子拼成、不含变量的项（如 <code>true</code>、<code>s(s(0))</code>）就是<b>值</b>，' +
          '归约算到这种形状就该停了；而 <code>not true</code>、<code>fact(3)</code> 含有非构造子的算子，不是值，还要靠等式继续算。<code>{constr}</code> 本身不改变计算，它说明「值长什么样」（第 11 章做归纳证明时要用到这个信息）。</li>' +
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
      { q: '<code>op _+_ : Nat Nat -> Nat</code> 里的两个下划线表示什么？', opts: ['两个排序', '两个参数位置（二元算子）', '两个等式', '优先级'], a: 1, why: '下划线是参数的「占位符」，数量 = arity。',
        optWhy: ['错：排序写在冒号后面（<code>Nat Nat</code>），下划线不是排序', '对：两个下划线 = 两个参数插槽，用法是 <code>X + Y</code>', '错：等式用 <code>eq</code> 写，和下划线无关', '错：优先级用 <code>{prec: 数字}</code> 写'] },
      { q: '下面哪个声明是<b>常量</b>？', opts: ['<code>op nil : -> List</code>', '<code>op s_ : Nat -> Nat</code>', '<code>op _+_ : Nat Nat -> Nat</code>', '<code>op hd_ : List -> Nat</code>'], a: 0, why: '箭头左边为空 = 没有参数 = 常量。',
        optWhy: ['对：箭头左边什么都没有，nil 不需要参数，是常量', '错：s_ 有一个 Nat 参数，是一元算子', '错：_+_ 有两个参数', '错：hd_ 有一个 List 参数'] },
      { q: '<code>eq X = 0 .</code>（X 是变量）为什么非法？', opts: ['少了句号', '左边不能只是一个变量，否则会把所有东西都改写成 0', 'X 没有声明排序', '0 不是常量'], a: 1, why: '等式的左边必须有结构（至少有一个算子），这是重写规则的基本要求（第 3 章）。',
        optWhy: ['错：末尾有句号', '对：左边是单个变量时，它能匹配任何项，所有东西都会被换成 0', '错：题目已说明 X 是声明过的变量，问题不在声明', '错：0 是常量，右边写常量没有问题'] }
    ]
  };
  QZ['L1-quiz'] = {
    title: 'L1 综合测验',
    items: [
      { q: '（热身）声明一个排序 <code>Color</code>，正确写法是？', opts: ['<code>[Color]</code>', '<code>sort Color</code>', '<code>Color : sort</code>', '<code>op Color</code>'], a: 0, why: '排序用方括号声明。',
        optWhy: ['对：方括号里写排序名', '错：CafeOBJ 声明排序不用 <code>sort</code> 关键字（<code>sort</code> 只在 view 里出现，第 4 章）', '错：没有这种写法', '错：<code>op</code> 声明的是算子，不是排序'] },
      { q: '（热身）每条 <code>eq</code> 等式的末尾必须写什么？', opts: ['分号 <code>;</code>', '句号 <code>.</code>', '右花括号 <code>}</code>', '什么都不写'], a: 1, why: '句号是等式的结束标记。',
        optWhy: ['错：CafeOBJ 不用分号', '对：漏掉句号，引擎会把下一行也当成这条等式的一部分', '错：<code>}</code> 是模块结束', '错：不写句号会出错'] },
      { q: '要给 <code>fact</code> 写递归定义，基础情形应该是哪一条？', opts: ['<code>eq fact(X) = s(0) .</code>', '<code>eq fact(0) = s(0) .</code>', '<code>eq fact(s(X)) = s(X) * fact(X) .</code>', '<code>eq 0 = fact(0) .</code>'], a: 1, why: '基础情形处理最小的输入 0，递归情形处理 s(X)。',
        optWhy: ['错：<code>fact(X)</code> 能匹配任何参数，会让所有阶乘都等于 1', '对：0! = 1，这是递归的终点', '错：这是递归情形，不是基础情形', '错：方向反了，而且左边 <code>0</code> 是常量，这条等式会把所有 0 都换成 fact(0)，永远停不下来'] },
      { q: '<code>{constr}</code> 的含义是：', opts: ['这条等式优先使用', '该算子是构造子，说明这个排序的值由它构造', '该算子是私有的', '该算子可以交换'], a: 1, why: 'constr 标注构造子，描述「值长什么样」，不影响重写方向。',
        optWhy: ['错：<code>{constr}</code> 写在 op 上，不是写在等式上，也不决定等式先后', '对：例如 0 和 s 是 PNat 的构造子，s(s(0)) 就是一个值', '错：CafeOBJ 没有「私有」这个概念', '错：交换律用 <code>comm</code> 表示（第 3 章）'] },
      { q: '<code>prec:</code> 数值越小表示：', opts: ['优先级越低', '优先级越高（绑定越紧）', '参数越少', '排序越小'], a: 1, why: 'prec 越小绑定越紧，所以 <code>*</code> 的 prec 比 <code>+</code> 小。',
        optWhy: ['错：正好反了', '对：<code>*</code> 是 31、<code>+</code> 是 33，所以 <code>1 + 2 * 3</code> 读成 <code>1 + (2 * 3)</code>', '错：参数个数由下划线个数决定', '错：prec 和排序无关'] },
      { q: '<code>s(s(s(0)))</code> 表示哪个自然数？', opts: ['0', '1', '3', 's 的个数无关紧要'], a: 2, why: '0 的后继三次 = 3。这是第 11 章验证的核心表示法。',
        optWhy: ['错：0 是一个 s 都没有的情况', '错：1 是 <code>s(0)</code>', '对：三个 s，即 0 加一三次', '错：s 的个数正是这个数的大小'] }
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
    pre: [
      'L1 的排序、算子、变量、等式：能看懂 <code>op s_ : PNat -&gt; PNat {constr}</code> 和 <code>eq fact(0) = s(0) .</code>',
      'L1.s5 的 <code>{constr}</code>：构造子拼成的项就是值',
      'L0.s4 里见过的列表写法 <code>3 | 2 | 1 | nil</code>（≈ Python 的 <code>[3, 2, 1]</code>）'
    ],
    summary: [
      '模块 = 签名（排序 + 算子）+ 公理（等式）；<code>pr(NAT)</code> 导入系统自带的 NAT 模块，之后能直接写 <code>2</code>、<code>3</code> 这样的数字',
      '<code>[Zero NzNat &lt; Nat]</code> 声明子排序：Zero = {0}，NzNat = {1,2,...}，它们都包含在 Nat 里',
      '用子排序表达定义域：<code>p_ : NzNat -&gt; Nat</code> 只接受非零数，<code>p(0)</code> 不会被当成合法的 Nat 项',
      '每个项都有<b>最小排序</b>（最精确的类型）：<code>0</code> 是 Zero，<code>s(0)</code> 是 NzNat',
      '同名算子可以有多个 rank（重载），引擎按参数的最小排序选；<code>hd</code> 对 Nil、NnNatList、NatList 各有一个 rank',
      '列表由 <code>nil</code> 和 <code>_|_</code> 两个构造子造出；列表函数都按「nil 一条、E | L 一条」来写'
    ],
    goals: [
      '说清模块的两个组成部分：signature（签名）与 axioms（公理）',
      '会用 <code>[Zero NzNat &lt; Nat]</code> 写阶排序，并解释为什么要这样做',
      '理解重载（overloading）与 kind（同 kind 的排序可以互相匹配）',
      '能写出 NATLIST 的 <code>hd / tl / len / @ / [X..Y]</code>'
    ],
    sections: [
      {
        id: 'L2.s1', title: '模块 = 签名 + 公理',
        guide: {
          what: '模块是 CafeOBJ 的「程序单位」，由两部分组成：签名（有哪些类型和函数）和公理（这些函数怎么算）。好比一本说明书：前半是零件清单，后半是组装步骤。',
          why: '把「有什么」和「怎么算」分开写，别人读模块时先看签名就知道能用哪些函数；模块之间还能用 <code>pr(...)</code> 互相导入，不用重复写。',
          how: '下面的代码前半部分（<code>[...]</code> 和 <code>op</code>）是签名，后半部分（<code>eq</code>）是公理。',
          use: 'Python 的模块 + <code>import</code>、Rust 的 <code>mod</code> + <code>use</code>、TypeScript 的 <code>.d.ts</code> 声明文件（只有签名）和 <code>.ts</code> 实现文件，都是同样的分工。',
          pitfalls: ['以为 <code>pr(NAT)</code> 是函数调用：它是「导入 NAT 模块」', '在模块里用了数字 2、3，却没写 <code>pr(NAT)</code>', '<code>mod!</code> 和 <code>mod*</code> 分不清：写程序一律先用 <code>mod!</code>']
        },
        html: '<p>CafeOBJ 的模块（module）只有两部分，看懂这个结构，任何模块都不怕：</p>' +
          '<table><tr><th>部分</th><th>内容</th><th>作用</th></tr>' +
          '<tr><td><b>signature</b>（签名）</td><td>排序声明 + 算子声明</td><td>说明「有哪些东西」</td></tr>' +
          '<tr><td><b>axioms</b>（公理）</td><td>等式 <code>eq</code> / 条件等式 <code>ceq</code></td><td>说明「它们怎么算」</td></tr></table>' +
          '<p>模块有两种：<code>mod!</code>（可执行，strict）和 <code>mod*</code>（宽松，允许构造子之间没有等式）。' +
          '课程里<b>写程序用 <code>mod!</code></b>，写<b>参数化模块的模板</b>用 <code>mod*</code>。</p>' +
          '<div class="card"><div class="card-t"><span class="ico">📥</span>导入模块：<code>pr(...)</code> 和「直接写数字」</div>' +
          '<p>模块里可以写 <code>pr(模块名)</code> 导入别的模块，<code>pr</code> 是 protecting（保护式导入）的缩写，意思是「把那个模块的排序、算子、等式全拿过来用，并且不改变它原有的含义」。相当于 Python 的 <code>from nat import *</code>。</p>' +
          '<p>系统自带一个 <code>NAT</code> 模块，里面已经定义好了自然数和 <code>+ * &lt; &gt; ==</code> 等运算。<b>写了 <code>pr(NAT)</code> 之后，就能直接写 <code>2</code>、<code>3</code>，不用再写 <code>s(s(0))</code></b>，结果也会显示成普通数字。' +
          'L1 里坚持用 <code>s(...)</code>，是为了让你看清「数字是怎么被造出来的」；从这一章起，大多数例子改用普通数字。</p>' +
          '<p>后面还会见到两个系统自带的小模块：<code>BOOL-IF</code> 和 <code>NAT-IF</code>。它们分别为 Bool 和 Nat 提供 <code>if 条件 then {甲} else {乙}</code>（条件为 true 得甲，为 false 得乙），' +
          '相当于 Python 的 <code>甲 if 条件 else 乙</code>。需要在 Nat 上用 if 时，就写 <code>pr(NAT-IF)</code>。</p></div>' +
          cb('w-l2-1', 'mod! ANAT {\n  [Zero NzNat < Nat]\n  op 0 : -> Zero {constr}\n  op s_ : Nat -> NzNat {constr}\n  op p_ : NzNat -> Nat\n  op _+_ : Nat Nat -> Nat {prec: 33}\n  var N : Nat\n  eq p(s(N)) = N .\n  eq N + 0 = N .\n}\nopen ANAT .\nred p(s(s(s(0)))) .\nred s(s(0)) + 0 .\nclose', 'NAT 的骨架：阶排序', {
            'mod! ANAT {': '定义模块 ANAT（自己写的一个简化版 NAT）。',
            '[Zero NzNat < Nat]': '声明三个排序，并说明 Zero 和 NzNat 都是 Nat 的<b>子排序</b>（<code>&lt;</code> 读作「包含于」）。Zero 只含 0，NzNat（Non-zero Nat）含 1、2、3……下一节细讲。',
            'op 0 : -> Zero {constr}': '常量 0，它的排序是最精确的 Zero（当然它也属于 Nat）。',
            'op s_ : Nat -> NzNat {constr}': '后继 s：输入任意 Nat，输出一定是非零数，所以结果排序写 NzNat。',
            'op p_ : NzNat -> Nat': '前驱 p（减一）：<b>只接受非零数</b>（NzNat），因为 0 没有前一个自然数。',
            'op _+_ : Nat Nat -> Nat {prec: 33}': '加法。',
            'var N : Nat': '声明一个 Nat 变量 N（单个变量用 <code>var</code>）。',
            'eq p(s(N)) = N .': '前驱的定义：(N+1) 的前一个数是 N。',
            'eq N + 0 = N .': '任何数加 0 等于它自己（这个演示里只写了这一条加法等式）。',
            '}': '模块结束。',
            'open ANAT .': '打开模块。',
            'red p(s(s(s(0)))) .': '算 3 的前驱，结果 2。显示成数字「2」是本引擎的显示方式；排序是 NzNat。',
            'red s(s(0)) + 0 .': '用 <code>N + 0 = N</code>，结果 2。',
            'close': '关闭模块。'
          }) +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>为什么需要 <code>Zero</code> 和 <code>NzNat</code></div>' +
          '<p>因为 <code>p_</code>（前驱）只对<b>非零</b>的数有意义。<code>p(0)</code> 应该没有定义。' +
          '有了 <code>[Zero NzNat &lt; Nat]</code>，我们就可以把 <code>p_</code> 的签名写成 <code>NzNat -> Nat</code>，' +
          '于是 <b><code>p(0)</code> 在语法上就是非法的</b>，不需要运行时检查。这叫「用类型把错误挡在门外」。</p>' +
          '<p>同理，<code>hd</code>（取列表头）只对非空列表有意义，所以它的签名写成 <code>hd_ : NnNatList -> Nat</code>。' +
          '这里的 <code>NnNatList</code> 现在只需知道是「非空自然数列表」的排序（Non-nil NatList），第 4 节会正式定义它；第 3 节还会看到系统自带的 NATLIST 给 <code>hd</code> 另外补了两个签名，用来处理空表。</p></div>'
      },
      {
        id: 'L2.s2', title: '阶排序（order sorts）与最小上界',
        guide: {
          what: '阶排序就是「类型之间的包含关系」：Zero（只有 0）和 NzNat（1、2、3……）都包含在 Nat 里。好比「猫」和「狗」都属于「动物」。',
          why: '有些函数只对一部分值有意义，比如「减一」不能用在 0 上。如果只有一个 Nat 类型，就没法在类型上说清这一点；有了子排序，就能把定义域写成 NzNat，<code>p(0)</code> 不会被当成合法的 Nat 项。',
          how: '用 <code>&lt;</code> 声明：<code>[Zero NzNat &lt; Nat]</code>。然后在 op 声明里用更精确的排序（如 <code>p_ : NzNat -&gt; Nat</code>）。',
          use: 'Python 的类继承（<code>class Cat(Animal)</code>，Cat 的实例也是 Animal）；TypeScript 的联合类型和子类型（<code>0 | 1</code> 是 <code>number</code> 的子类型）；Rust 的 <code>NonZeroU32</code> 类型就是 NzNat 的思路。',
          pitfalls: ['把 <code>&lt;</code> 方向写反：小的（子排序）写在左边', '以为子排序只是注释：它会影响 op 接受哪些参数和结果的最小排序', '以为 <code>p(0)</code> 会算出 0：它根本不是合法的 Nat 项，引擎会原样保留']
        },
        html: '<p><code>[Zero NzNat &lt; Nat]</code> 读作「Zero 和 NzNat 是 Nat 的<b>子排序</b>」—— 反过来 Nat 是它们的<b>父排序</b>。图形上是：</p>' +
          '<div class="widget" id="w-l2-lat"></div>' +
          '<p>这套偏序关系带来两个关键能力：</p>' +
          '<ol><li><b>子排序的值也是父排序的值</b>：<code>0</code> 属于 <code>Zero</code>，也属于 <code>Nat</code>；<code>s(0)</code> 属于 <code>NzNat</code>，也属于 <code>Nat</code>。' +
          '所以要求 Nat 参数的 <code>_+_</code>，两种值都接受。反过来不成立：<code>p_ : NzNat -&gt; Nat</code> 要求参数是 NzNat，' +
          '而 <code>0</code> 属于 Zero、不属于 NzNat，所以 <code>p_</code> 拒绝 <code>0</code>。<b>拒绝的原因是 p_ 的定义域是 NzNat</b>，0 不在这个集合里。</li>' +
          '<li><b>最小排序（least sort）</b>：一个项可能同时属于好几个排序（<code>0</code> 既是 Zero 也是 Nat），其中<b>最小、最精确的那个</b>叫它的最小排序。' +
          '<code>0</code> 的最小排序是 <code>Zero</code>，<code>s(0)</code> 的最小排序是 <code>NzNat</code>。CafeOBJ 报结果时显示的就是最小排序（所以 <code>red 0 + 0</code> 的结果显示 <code>Zero</code>，<code>red 2 + 3</code> 显示 <code>NzNat</code>）。</li></ol>' +
          '<div class="card"><div class="card-t"><span class="ico">📐</span>「最小上界」用例子说</div>' +
          '<p>「上界」就是「同时包含它们的排序」。Zero 和 NzNat 的上界只有 Nat（在这个排序图里），所以它们的<b>最小上界</b>是 Nat。' +
          '什么时候用得到？比如 <code>if c then {0} else {s(0)}</code>：两个分支一个是 Zero、一个是 NzNat，整个 if 的结果类型只能说是「两者的最小上界」，也就是 Nat。' +
          '再看列表：<code>nil</code> 是 Nil，<code>1 | nil</code> 是 NnNatList，它们的最小上界是 NatList。</p></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🔑</span>考试常问</div>' +
          '<p>「为什么要写 <code>[Zero NzNat &lt; Nat]</code> 而不是只写 <code>[Nat]</code>？」' +
          '标准答案：<b>为了用排序表达函数的定义域，让非法调用（如 <code>p(0)</code>、<code>hd(nil)</code>）在签名层面就被排除。</b></p></div>' +
          '<div class="card"><div class="card-t"><span class="ico">🧩</span>kind（连通分量）是什么</div>' +
          '<p>把排序画成图，用 &lt; 关系连线。<b>能连到一起的一组排序</b>叫一个连通分量，CafeOBJ 把它叫做一个 <b>kind</b>。例子：</p>' +
          '<ul><li><code>Zero</code>、<code>NzNat</code>、<code>Nat</code> 连在一起，是一个 kind</li>' +
          '<li><code>Nil</code>、<code>NnNatList</code>、<code>NatList</code> 连在一起，是另一个 kind</li>' +
          '<li><code>Bool</code> 和它们都不相连，自己是一个 kind</li></ul>' +
          '<p>CafeOBJ 会给每个 kind 自动加一个「错误排序」，名字前面带问号，例如 <code>?Nat</code>。讲义里的例子：<code>1 quo 0</code>（除以 0）不是合法的 Nat 项，CafeOBJ 会显示它的排序是 <code>?Nat</code>，表示「出错了，但还属于自然数这一族」。' +
          '同一个 kind 里的项可以出现在同一个参数位置上（类型检查放宽到 kind），这在错误处理（下一节的 <code>Nat&amp;Err</code>）和第 4 章里会用到。</p></div>'
      },
      {
        id: 'L2.s3', title: '重载（overloading）：同名算子的多个 rank',
        guide: {
          what: '重载就是「同一个函数名，按参数类型不同，声明多个版本」。每个版本的「参数排序 -&gt; 结果排序」叫一个 rank。好比「打开」这个词：打开门、打开电脑、打开文件，动作名相同，对象不同，结果也不同。',
          why: '<code>hd</code> 作用在空表上应该得到错误，作用在非空表上应该得到一个数。只声明一个版本，就没法让结果的类型精确地反映这两种情况。',
          how: '把同名算子写多行 <code>op hd : ...</code>，每行参数排序不同。下面的代码直接打开系统自带的 NATLIST，对空表和非空表分别取 hd，看结果排序的区别。',
          use: 'Java / C++ / TypeScript 的函数重载；Rust 用 trait 给不同类型实现同名方法；Python 的 <code>functools.singledispatch</code> 按参数类型选择实现。',
          pitfalls: ['以为后声明的版本会覆盖先声明的：所有版本同时存在，按参数的最小排序选', '忘了最宽的那个版本（<code>NatList -&gt; Nat&amp;Err</code>）：参数排序不确定时要靠它', '把错误值 <code>errNat</code> 当成普通数字参与计算']
        },
        html: '<p>同一个算子名可以声明多次，每次参数/结果排序不同 —— 这叫<b>重载</b>。CafeOBJ 会按参数的<b>最小排序</b>自动选出合适的那个（rank）。</p>' +
          '<div class="card"><div class="card-t"><span class="ico">🧯</span>先认识两个新排序：<code>ErrNat</code> 和 <code>Nat&amp;Err</code></div>' +
          '<p>空表没有头元素，<code>hd(nil)</code> 该得到什么？讲义的做法是造一个专门表示「出错了」的值。系统自带的 <code>NAT-ERR</code> 模块里有：</p>' +
          '<div class="codebox"><pre>[Nat ErrNat &lt; Nat&amp;Err]\nop errNat : -&gt; ErrNat {constr}</pre></div>' +
          '<ul><li><code>ErrNat</code>：「自然数出错」的排序，里面只有一个值 <code>errNat</code>（错误常量）</li>' +
          '<li><code>Nat&amp;Err</code>：读作「Nat 或 Err」，是 Nat 和 ErrNat 的共同父排序，表示「可能是正常自然数，也可能是错误」。<code>&amp;</code> 只是名字里的一个字符，不是运算符</li></ul>' +
          '<p>相当于 Python 里返回 <code>int</code> 或 <code>None</code> 的函数（类型注解写成 <code>Optional[int]</code>）。第 5 章会把这个「错误排序」模式用到表上。</p></div>' +
          cb('w-l2-2', 'open NATLIST .\nred hd(2 | 1 | 0 | nil) .\nred hd(nil) .\nred tl(2 | 1 | 0 | nil) .\nred len(nil) .\nred len(1 | 2 | 3 | nil) .\nclose', '重载：hd 有三个 rank', {
            'open NATLIST .': '打开系统自带的 NATLIST 模块（它内部写了 <code>pr(NAT-ERR)</code>，所以 errNat 也能用）。',
            'red hd(2 | 1 | 0 | nil) .': '对非空表取头：用 <code>eq hd(X | L) = X</code>，X 取 2，结果 2，排序 NzNat。',
            'red hd(nil) .': '对空表取头：用 <code>eq hd(nil) = errNat</code>，结果是错误值 errNat，排序 ErrNat。',
            'red tl(2 | 1 | 0 | nil) .': '去掉头，剩 <code>1 | 0 | nil</code>，排序 NnNatList（非空列表）。',
            'red len(nil) .': '空表长度 0，排序 Zero。',
            'red len(1 | 2 | 3 | nil) .': '长度 3，排序 NzNat。',
            'close': '关闭模块。'
          }) +
          '<p>NATLIST 里的 <code>hd</code> 实际上是三条声明（讲义写法，函数式调用 <code>hd(...)</code>）：</p>' +
          '<table><tr><th>rank</th><th>含义</th><th>结果排序</th></tr>' +
          '<tr><td><code>hd : Nil -> ErrNat</code></td><td>对空表取头 → 错误值</td><td><code>ErrNat</code></td></tr>' +
          '<tr><td><code>hd : NnNatList -> Nat</code></td><td>对非空表取头 → 头元素</td><td><code>Nat</code>（最精确）</td></tr>' +
          '<tr><td><code>hd : NatList -> Nat&amp;Err</code></td><td>参数只知道是列表、不知道空不空时用这个</td><td><code>Nat&amp;Err</code></td></tr></table>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>重载 + 策略 = 一个坑（第 6 章预告）</div>' +
          '<p>算子除了 <code>{constr}</code>、<code>{prec: ...}</code>，还可以带一个属性 <code>{strat: (1 0)}</code>，它规定「先算哪个参数」。' +
          '现在只需知道「它控制计算顺序」，第 6 章（无限列表）细讲。第 6 章会踩到的坑是：<code>_|_</code> 在「有限列表」和「无限列表」里各有一个 rank，' +
          '而无限列表那个带 <code>{strat: (1 0)}</code>。<b>属性是跟着 rank 走的，不是跟着算子名走的</b>，' +
          '所以同一个 <code>|</code> 在不同上下文里的归约顺序不同。</p></div>'
      },
      {
        id: 'L2.s4', title: 'NATLIST：列表的完整定义',
        guide: {
          what: '自然数列表由两个构造子造出：<code>nil</code>（空表）和 <code>E | L</code>（把元素 E 放在列表 L 前面）。好比一串糖葫芦：<code>nil</code> 是空竹签，<code>|</code> 是往最前面串一颗。',
          why: 'Python 的 list 是内置的，你不用管它怎么造出来的。CafeOBJ 没有内置列表，必须自己用构造子定义；这样定义的列表结构清楚，后面才能对它做结构归纳证明（第 12 章）。',
          how: '先声明排序 <code>[Nil NnNatList &lt; NatList]</code> 和两个构造子，再对每个函数写两条等式：一条处理 <code>nil</code>，一条处理 <code>E | L</code>。',
          use: 'Haskell 的列表 <code>[] </code> 和 <code>x : xs</code>、OCaml 的 <code>[]</code> 和 <code>x :: xs</code>、Lisp 的 <code>cons</code>，都是同一种定义；Rust 里可以写 <code>enum List { Nil, Cons(u32, Box&lt;List&gt;) }</code>。',
          pitfalls: ['以为 <code>1 | 2 | 3</code> 就是列表：末尾必须有 <code>nil</code>', '<code>|</code> 两边忘写空格', '把 <code>@</code>（连接两个列表）和 <code>|</code>（往前加一个元素）搞混：<code>|</code> 左边是一个数，<code>@</code> 两边都是列表']
        },
        html: '<p>列表是函数式编程的主角。它由两个构造子造出来：空表 <code>nil</code>，和「头 + 尾」<code>_|_</code>。</p>' +
          '<p>排序 <code>[Nil NnNatList &lt; NatList]</code> 的意思：<code>Nil</code> 只含空表 <code>nil</code>；<code>NnNatList</code>（Non-nil NatList）是所有非空列表；两者都属于 <code>NatList</code>。这和上一节 <code>[Zero NzNat &lt; Nat]</code> 是同一个套路。</p>' +
          cb('w-l2-3', 'mod! MYLIST {\n  pr(NAT)\n  [Nil NnNatList < NatList]\n  op nil : -> Nil {constr}\n  op _|_ : Nat NatList -> NnNatList {constr prec: 40}\n  vars E E2 : Nat\n  vars L L2 : NatList\n  op hd_ : NnNatList -> Nat\n  op tl_ : NatList -> NatList\n  op len : NatList -> Nat\n  eq hd(E | L) = E .\n  eq tl(E | L) = L .\n  eq len(nil) = 0 .\n  eq len(E | L) = s(len(L)) .\n  op _@_ : NatList NatList -> NatList {prec: 40}\n  eq nil @ L2 = L2 .\n  eq (E | L) @ L2 = E | (L @ L2) .\n}\nopen MYLIST .\nred hd(7 | 8 | nil) .\nred tl(7 | 8 | nil) .\nred len(7 | 8 | 9 | nil) .\nred (1 | 2 | nil) @ (3 | 4 | nil) .\nclose', '列表：hd / tl / len / @', {
            'mod! MYLIST {': '定义自己的列表模块 MYLIST。',
            'pr(NAT)': '导入系统自带的 NAT 模块，这样就能直接写 7、8、9 这样的数字，也能用 <code>s</code>、<code>+</code>。',
            '[Nil NnNatList < NatList]': '三个排序：Nil（空表）、NnNatList（非空表）都是 NatList（列表）的子排序。',
            'op nil : -> Nil {constr}': '构造子 nil：空表，排序 Nil。相当于 Python 的 <code>[]</code>。',
            'op _|_ : Nat NatList -> NnNatList {constr prec: 40}': '构造子 <code>|</code>：左边一个数，右边一个列表，得到一个非空列表。<code>7 | 8 | nil</code> 读作 <code>7 | (8 | nil)</code>，相当于 Python 的 <code>[7, 8]</code>。<code>prec: 40</code> 让 <code>|</code> 比 <code>+</code> 绑定得更松，<code>1 + 2 | nil</code> 读作 <code>(1 + 2) | nil</code>。',
            'vars E E2 : Nat': '声明元素变量 E、E2（E2 这里没用到）。',
            'vars L L2 : NatList': '声明列表变量 L、L2。',
            'op hd_ : NnNatList -> Nat': '取头元素，<b>只接受非空列表</b>（和 L2.s1 说的一致）。这里只写了一个 rank；系统自带的 NATLIST 还补了 <code>Nil -&gt; ErrNat</code> 和 <code>NatList -&gt; Nat&amp;Err</code> 两个 rank 来处理空表（见上一节）。',
            'op tl_ : NatList -> NatList': '去掉头元素后的列表。这个简化版没写 <code>tl(nil)</code> 的等式，所以 <code>tl(nil)</code> 会原样保留。',
            'op len : NatList -> Nat': '求长度。',
            'eq hd(E | L) = E .': '非空表的头就是 E。相当于 Python 的 <code>lst[0]</code>。',
            'eq tl(E | L) = L .': '非空表去掉头剩下 L。相当于 Python 的 <code>lst[1:]</code>。',
            'eq len(nil) = 0 .': '空表长度 0。',
            'eq len(E | L) = s(len(L)) .': '非空表的长度 = 尾巴的长度 + 1（<code>s</code> 就是加一）。',
            'op _@_ : NatList NatList -> NatList {prec: 40}': '连接两个列表（append），相当于 Python 的 <code>a + b</code>。op 声明可以写在等式中间，不影响结果。',
            'eq nil @ L2 = L2 .': '空表接 L2，还是 L2。',
            'eq (E | L) @ L2 = E | (L @ L2) .': '头元素 E 留在最前，把尾巴 L 和 L2 连接起来（递归）。',
            '}': '模块结束。',
            'open MYLIST .': '打开模块。',
            'red hd(7 | 8 | nil) .': '结果 7。',
            'red tl(7 | 8 | nil) .': '结果 <code>8 | nil</code>。',
            'red len(7 | 8 | 9 | nil) .': '结果 3。',
            'red (1 | 2 | nil) @ (3 | 4 | nil) .': '结果 <code>1 | 2 | 3 | 4 | nil</code>，用了 2 次递归等式、1 次基础等式。',
            'close': '关闭模块。'
          }) +
          '<p>注意 <code>_@_</code>（append，连接）的两个等式，这是<b>结构递归</b>的标准形态：</p>' +
          '<ul><li>基础情形：<code>nil @ L2 = L2</code> —— 空表接任何表还是那个表</li>' +
          '<li>递归情形：<code>(E | L) @ L2 = E | (L @ L2)</code> —— 头不动，把「尾巴接 L2」交给自己递归</li></ul>' +
          '<div class="card why"><div class="card-t"><span class="ico">🔁</span>记住这个套路</div>' +
          '<p>几乎所有列表函数都是这个形状：<b>对 nil 给一个答案，对 E|L 用「E」和「递归(l)」拼出答案</b>。' +
          '第 5 章的 lookup、第 6 章的 take、第 12 章的证明，全是这个套路。会写这一条，等于会写一半的题。</p></div>'
      },
      {
        id: 'L2.s5', title: '区间 [X..Y] 与更多列表函数',
        guide: {
          what: '<code>[X .. Y]</code> 生成从 X 到 Y 的列表，比如 <code>[2 .. 6]</code> 得到 <code>2 | 3 | 4 | 5 | 6 | nil</code>。相当于 Python 的 <code>list(range(X, Y+1))</code>。',
          why: '前面的函数只按列表的形状（nil 还是 E | L）分情况。有些函数要按「数值条件」分情况（X 是否大于 Y），这就需要 <code>if_then{_}else{_}</code>。',
          how: '定义只有一条等式：<code>X &gt; Y</code> 时得到 nil，否则得到 <code>X | [X + 1 .. Y]</code>。运行下面的代码，看 <code>[6 .. 2]</code> 为什么是 nil。',
          use: 'Python 的 <code>range</code>、Rust 的 <code>2..=6</code>、Haskell 的 <code>[2..6]</code> 都是区间；递归加「先判断边界」是所有语言写递归的通用模式。',
          pitfalls: ['区间写法里的空格：<code>[2 .. 6]</code>，<code>..</code> 两边要有空格', '以为 <code>[6 .. 2]</code> 会倒着数或报错：按定义它直接得到 nil', '忘了递归时 X 要加一（<code>X + 1</code>），否则永远停不下来']
        },
        html: '<p>有了 <code>if</code> 和比较，就能写出很有趣的东西，比如「从 X 到 Y 的列表」：</p>' +
          cb('w-l2-4', 'open NATLIST .\nred [2 .. 6] .\nred [5 .. 5] .\nred [6 .. 2] .\nred (1 | 2 | 3 | nil) @ (4 | nil) .\nclose', '区间与连接', {
            'open NATLIST .': '打开系统自带的 NATLIST 模块，<code>[_.._]</code> 和 <code>@</code> 都已经定义好。',
            'red [2 .. 6] .': '2 不大于 6，得到 <code>2 | [3 .. 6]</code>，一直展开到 <code>[7 .. 6]</code> 变成 nil。结果 <code>2 | 3 | 4 | 5 | 6 | nil</code>。',
            'red [5 .. 5] .': '5 不大于 5，得到 <code>5 | [6 .. 5]</code>；6 大于 5，得到 nil。结果 <code>5 | nil</code>。',
            'red [6 .. 2] .': '6 大于 2，直接得到 nil。',
            'red (1 | 2 | 3 | nil) @ (4 | nil) .': '连接两个列表，结果 <code>1 | 2 | 3 | 4 | nil</code>。',
            'close': '关闭模块。'
          }) +
          '<p><code>[X .. Y]</code> 的定义是（来自讲义的 NATLIST）：</p>' +
          '<div class="codebox"><pre>op [_.._] : Nat Nat -&gt; NatList\nop if_then{_}else{_} : Bool NatList NatList -&gt; NatList\neq [X .. Y] = if X &gt; Y then {nil} else {X | [X + 1 .. Y]} .\neq if true then {L} else {L2} = L .\neq if false then {L} else {L2} = L2 .</pre></div>' +
          '<ul><li>第 1 行：区间算子，两个下划线放两个数，结果是列表</li>' +
          '<li>第 2 行：为列表声明一个 if 算子：条件是 Bool，两个分支都是列表</li>' +
          '<li>第 3 行：X &gt; Y 就是空表，否则把 X 放在最前，后面接 <code>[X + 1 .. Y]</code>（递归）</li>' +
          '<li>第 4、5 行：if 的两条等式。条件先被算成 true 或 false，再选对应的分支</li></ul>' +
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
      { q: '<code>[Zero NzNat &lt; Nat]</code> 中，<code>s(0)</code> 的最小排序是？', opts: ['Zero', 'NzNat', 'Nat', 'NatList'], a: 1, why: '<code>s_ : Nat -&gt; NzNat</code>，所以结果排序是 NzNat。',
        optWhy: ['错：Zero 里只有 0，s(0) 是 1', '对：s 的结果排序声明为 NzNat，这是最精确的排序', '错：s(0) 也属于 Nat，但 Nat 不是「最小」的那个', '错：NatList 是列表排序，和数字不在同一个 kind'] },
      { q: '为什么 <code>p_ : NzNat -&gt; Nat</code> 要写成接受 NzNat 而不是 Nat？', opts: ['为了快', '为了让 <code>p(0)</code> 在签名层面非法，不需要运行时检查', '因为 0 不是自然数', '为了支持重载'], a: 1, why: '用排序表达定义域，是这门课反复强调的「用类型排除非法值」。',
        optWhy: ['错：写 NzNat 和速度无关', '对：0 不属于 NzNat，所以 p(0) 不是合法的 Nat 项', '错：0 是自然数（属于 Nat），只是不属于 NzNat', '错：这里只有一个 p_ 的声明，没有重载'] },
      { q: '在系统自带的 NATLIST 模块里，<code>red len(1 | 2 | nil) .</code> 显示的结果是？', opts: ['<code>0</code>', '<code>1</code>', '<code>2</code>', '<code>nil</code>'], a: 2, why: '<code>len(nil) = 0</code>，每有一个元素加一个 <code>s</code>，得到 <code>s(s(0))</code>。NATLIST 导入了内置的 NAT，所以结果显示成普通数字 <code>2</code>。',
        optWhy: ['错：0 是空表的长度', '错：列表有两个元素，不是一个', '对：两个元素，长度 2；内置 NAT 把 s(s(0)) 显示为 2', '错：len 的结果是数字，不是列表'] }
    ]
  };
  QZ['L2-quiz'] = {
    title: 'L2 综合测验',
    items: [
      { q: '（热身）模块里写 <code>pr(NAT)</code> 的作用是？', opts: ['打印 NAT', '导入系统自带的 NAT 模块，之后能直接写 2、3 这样的数字', '声明一个叫 NAT 的排序', '关闭 NAT 模块'], a: 1, why: '<code>pr</code> = protecting，保护式导入。',
        optWhy: ['错：pr 不是 print', '对：导入后 NAT 的排序、算子、等式都能用', '错：声明排序用方括号 <code>[...]</code>', '错：关闭模块用 <code>close</code>'] },
      { q: '（热身）列表 <code>5 | 6 | nil</code> 相当于 Python 的？', opts: ['<code>[5, 6]</code>', '<code>[5, 6, None]</code>', '<code>5 or 6</code>', '<code>(5, 6, nil)</code>'], a: 0, why: '<code>|</code> 往前加元素，<code>nil</code> 表示结束，本身不算元素。',
        optWhy: ['对：两个元素 5 和 6', '错：nil 是「列表结束」的标记，不是一个元素', '错：<code>|</code> 不是「或」运算', '错：它是列表，不是三元组'] },
      { q: '模块由哪两部分组成？', opts: ['imports 和 exports', 'signature（排序+算子）和 axioms（等式）', '变量和常量', '注释和代码'], a: 1, why: '签名说「有什么」，公理说「怎么算」。',
        optWhy: ['错：CafeOBJ 有导入（pr），但没有 exports 这一部分', '对：签名 = 排序和算子声明，公理 = eq / ceq', '错：变量和常量都只是模块里的一种声明', '错：注释可有可无，不是模块的组成部分'] },
      { q: '同名算子声明多次、参数排序不同，这叫？', opts: ['递归', '重载（overloading）', '多态', '继承'], a: 1, why: 'CafeOBJ 按参数的最小排序选 rank。',
        optWhy: ['错：递归是函数在等式右边调用自己', '对：例如 hd 有三个 rank', '错：多态（第 4 章的参数化模块更接近它）不是这里的术语', '错：CafeOBJ 的子排序像继承，但「同名多声明」叫重载'] },
      { q: '<code>eq (E | L) @ L2 = E | (L @ L2) .</code> 属于哪种情形？', opts: ['基础情形', '递归情形（结构递归）', '条件等式', '交换律'], a: 1, why: '对 <code>E|L</code> 这种结构做递归，是标准的结构递归。',
        optWhy: ['错：基础情形是 <code>nil @ L2 = L2</code>，右边不再调用 @', '对：右边又出现了 @，参数 L 比原来的 E | L 短', '错：条件等式用 <code>ceq ... if ...</code> 写', '错：交换律是 a @ b = b @ a，这里不是'] },
      { q: '<code>red [6 .. 2] .</code> 的结果？', opts: ['报错', '<code>nil</code>', '<code>6 | 5 | 4 | 3 | 2 | nil</code>', '<code>2 | 3 | 4 | 5 | 6 | nil</code>'], a: 1, why: '<code>if X &gt; Y then {nil}</code>，6 &gt; 2 所以返回 nil。',
        optWhy: ['错：定义里专门处理了 X &gt; Y 的情况，不会报错', '对：6 &gt; 2，直接走 then 分支得到 nil', '错：定义不会倒着数', '错：这是 <code>[2 .. 6]</code> 的结果'] }
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
    pre: [
      'L1.s3：项是一棵树，子项和位置（如 <code>2.1</code>）的含义',
      'L1.s4：等式 <code>eq 左 = 右 .</code> 从左往右用，变量要先声明',
      'L2.s4：列表 <code>E | L</code>、连接 <code>@</code> 的两条等式（本章的手算示范就用它们）',
      'L2.s1：<code>pr(NAT)</code>、<code>BOOL-IF</code> / <code>NAT-IF</code> 是什么'
    ],
    summary: [
      '一步重写 = 选一个位置 p → 那里的子项匹配某条等式左边（得到替换 σ）→ 换成 σ(右边)，其他地方不动',
      '替换 σ：变量 ↦ 项 的对应表；redex：能匹配某条等式左边的子项（被换掉的）；contract：σ(右边)（换上去的）',
      '归约 = 反复做一步重写，直到没有 redex；最后得到的项叫范式（normal form），<code>red</code> 打印的就是它',
      '条件等式 <code>ceq 左 = 右 if 条件 .</code>：匹配成功后还要把 σ(条件) 算成 true 才能替换；条件里的变量必须在左边出现过',
      '<code>assoc</code> / <code>comm</code> / <code>id:</code> 让括号、顺序、单位元不再区分项，三者合用可表示多重集；代价是匹配可能有多个解',
      '终止性（不会无限算下去）+ 合流性（结果唯一）= 收敛，这时 <code>red</code> 的结果才是唯一的'
    ],
    goals: [
      '精确说出 substitution / pattern match / subterm / position / redex / contract 的定义',
      '能手算「第 n 步重写了哪个位置、用的哪条等式」',
      '会写条件等式 <code>ceq</code> 并说明什么时候它是 redex',
      '理解 assoc / comm / id: 为什么能表示多重集，以及 AC 匹配为什么难'
    ],
    sections: [
      {
        id: 'L3.s1', title: '替换（substitution）与模式匹配（pattern match）',
        guide: {
          what: '模式匹配就是「把等式左边当作模板，看能不能套到项上」；替换 σ 是套上时「每个变量取什么值」的记录。好比填表：模板是「姓名：___，年龄：___」，σ 就是「姓名 = 张三，年龄 = 20」。',
          why: '等式里有变量，引擎必须先知道变量代表什么，才能写出替换后的结果。没有匹配和替换，<code>eq (X | L) @ L2 = ...</code> 这样的等式就没法用到具体的列表上。',
          how: '先跟着下面的「完整手算示范」走一遍（项树 → 找 redex → 得到 σ → 替换 → 新项），再看后面的正式定义表。',
          use: 'Python 3.10 的 <code>match</code> 语句、Rust / Haskell 的模式匹配、正则表达式的分组捕获、TypeScript 编译器推断泛型参数（把 <code>Array&lt;T&gt;</code> 和 <code>Array&lt;number&gt;</code> 对上，得到 T = number）都是同一件事。',
          pitfalls: ['把 redex 和 contract 弄反：redex 是被换掉的（左边的实例），contract 是换上去的（右边的实例）', '匹配时只看最外层：要一直对到叶子，每个变量必须对上一个完整的子项', '同一个变量在左边出现两次时，两处必须对上完全相同的项（见 L3.s4）']
        },
        html: '<h3 class="sub">先看一遍完整的手算示范</h3>' +
          '<p>用第 2 章的连接函数 <code>@</code> 做例子，它有两条等式（讲义给它们起名 @1、@2）：</p>' +
          '<div class="codebox"><pre>eq nil @ L2 = L2 .                   -- (@1)\neq (X | L) @ L2 = X | (L @ L2) .     -- (@2)</pre></div>' +
          '<p>要算的项是 <code>(4 | 3 | nil) @ (2 | 1 | 0 | nil)</code>。</p>' +
          '<p><b>① 画出项树。</b>根是 <code>_@_</code>，它的第 1 个孩子是左边的列表，第 2 个孩子是右边的列表：</p>' +
          '<div class="codebox"><pre>              _@_                    位置 ε（根）\n            /     \\\n         _|_       2 | 1 | 0 | nil   位置 1 和 位置 2\n        /   \\\n       4    _|_                      位置 1.1 和 1.2\n           /   \\\n          3    nil                   位置 1.2.1 和 1.2.2</pre></div>' +
          '<p><b>② 找 redex（能套用某条等式的子项）。</b>两条等式的左边都是 <code>... @ ...</code>，所以只看有 <code>@</code> 的节点。现在只有根（位置 ε）有 <code>@</code>。' +
          '它的左参数是 <code>4 | (3 | nil)</code>，不是 <code>nil</code>，所以 @1 对不上；它形如 <code>X | L</code>，所以 @2 能对上。</p>' +
          '<p><b>③ 匹配，得到替换 σ。</b>把 @2 的左边 <code>(X | L) @ L2</code> 和根处的项逐个位置对齐：</p>' +
          '<table><tr><th>模式里的变量</th><th>对上的子项</th></tr>' +
          '<tr><td><code>X</code></td><td><code>4</code></td></tr>' +
          '<tr><td><code>L</code></td><td><code>3 | nil</code></td></tr>' +
          '<tr><td><code>L2</code></td><td><code>2 | 1 | 0 | nil</code></td></tr></table>' +
          '<p>于是 σ = {X ↦ 4, L ↦ 3 | nil, L2 ↦ 2 | 1 | 0 | nil}。</p>' +
          '<p><b>④ 替换。</b>把 σ 代入 @2 的右边 <code>X | (L @ L2)</code>，得到 contract：<code>4 | ((3 | nil) @ (2 | 1 | 0 | nil))</code>。</p>' +
          '<p><b>⑤ 得到新项。</b>把位置 ε 处的 redex 换成 contract。因为位置是根，整个项都换掉：</p>' +
          '<div class="codebox"><pre>(4 | 3 | nil) @ (2 | 1 | 0 | nil)\n→ 4 | ((3 | nil) @ (2 | 1 | 0 | nil))       第 1 步：位置 ε，用 @2</pre></div>' +
          '<p><b>再重复两次。</b>新项里的 <code>@</code> 跑到了位置 2：</p>' +
          '<table><tr><th>步</th><th>redex 的位置</th><th>redex</th><th>等式</th><th>σ</th><th>新项</th></tr>' +
          '<tr><td>2</td><td>2</td><td><code>(3 | nil) @ (2 | 1 | 0 | nil)</code></td><td>@2</td><td>{X ↦ 3, L ↦ nil, L2 ↦ 2 | 1 | 0 | nil}</td><td><code>4 | 3 | (nil @ (2 | 1 | 0 | nil))</code></td></tr>' +
          '<tr><td>3</td><td>2.2</td><td><code>nil @ (2 | 1 | 0 | nil)</code></td><td>@1</td><td>{L2 ↦ 2 | 1 | 0 | nil}</td><td><code>4 | 3 | 2 | 1 | 0 | nil</code></td></tr></table>' +
          '<p>第 3 步之后项里没有 <code>@</code> 了，找不到任何 redex，计算结束。这个结果叫<b>范式</b>。点下面的运行，引擎也是 3 步：</p>' +
          cb('w-l3-hand', 'open NATLIST .\nred (4 | 3 | nil) @ (2 | 1 | 0 | nil) .\nclose', '手算示范的答案', {
            'open NATLIST .': '打开系统自带的 NATLIST 模块，里面的 @ 就是上面的 @1、@2 两条等式。',
            'red (4 | 3 | nil) @ (2 | 1 | 0 | nil) .': '归约这个项。结果 <code>4 | 3 | 2 | 1 | 0 | nil</code>，右边的 [3] 表示用了 3 步，和手算一致。',
            'close': '关闭模块。'
          }) +
          '<p>下面把刚才用到的几个词正式定义一遍。</p>' +
          '<h3 class="sub">正式定义</h3>' +
          '<p>一条等式 <code>eq fact(s(X)) = s(X) * fact(X)</code> 里有变量 <code>X</code>。要让这条等式作用到一个具体的项上，' +
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
        guide: {
          what: '位置（position）是项树上每个节点的「门牌号」：从根出发，走第几个孩子就写几，用点连起来。根的门牌号是空串 ε。好比「3 号楼 2 单元 1 室」写成 3.2.1。',
          why: '一个项里常常有好几处可以重写。只说「重写了 s(0)」是不够的，因为 s(0) 可能出现在好几个地方；给出位置才能精确说明「换的是哪一处」。',
          how: '从根开始，第 1 个参数编号 1，第 2 个参数编号 2，往下一层就在后面加「.编号」。对照下面的完整位置表自己数一遍。',
          use: '编辑器的「跳转到语法节点」、浏览器 DOM 的节点路径（如 XPath <code>/html/body/div[2]</code>）、JSON 的路径 <code>$.a[1].b</code>、Git 合并时定位冲突的语法树节点，都是同一种「从根往下走的路径」。',
          pitfalls: ['从 0 开始编号：位置从 1 开始', '根写成 1：根是 ε（空串）', '漏掉叶子：常量 <code>0</code> 也有自己的位置（如 1.1）']
        },
        html: '<p>「位置」是从根往下走的一串下标，空串记作 <code>ε</code>（根）。' +
          '<code>2.1</code> 表示「根的第二个子项的第一个子项」。</p>' +
          '<div class="widget" id="w-l3-tree"></div>' +
          '<p>看这个项：<code>s(0) + (s(0) * s(s(0)))</code>。它的<b>全部</b>位置有：</p>' +
          '<table><tr><th>位置</th><th>子项</th><th>怎么走到的</th></tr>' +
          '<tr><td>ε</td><td><code>s(0) + (s(0) * s(s(0)))</code></td><td>根本身</td></tr>' +
          '<tr><td>1</td><td><code>s(0)</code></td><td><code>+</code> 的第 1 个参数</td></tr>' +
          '<tr><td>1.1</td><td><code>0</code></td><td>再往下：<code>s</code> 的参数</td></tr>' +
          '<tr><td>2</td><td><code>s(0) * s(s(0))</code></td><td><code>+</code> 的第 2 个参数</td></tr>' +
          '<tr><td>2.1</td><td><code>s(0)</code></td><td><code>*</code> 的第 1 个参数</td></tr>' +
          '<tr><td>2.1.1</td><td><code>0</code></td><td>再往下：<code>s</code> 的参数</td></tr>' +
          '<tr><td>2.2</td><td><code>s(s(0))</code></td><td><code>*</code> 的第 2 个参数</td></tr>' +
          '<tr><td>2.2.1</td><td><code>s(0)</code></td><td>外层 <code>s</code> 的参数</td></tr>' +
          '<tr><td>2.2.1.1</td><td><code>0</code></td><td>内层 <code>s</code> 的参数</td></tr></table>' +
          '<p>一共 9 个位置，对应树上 9 个节点。注意 <code>s(0)</code> 出现在 1、2.1、2.2.1 三个位置，<code>0</code> 出现在四个位置 —— 所以只说「换掉 s(0)」是不够的，必须说位置。</p>' +
          '<p>重写的「一步」= 选一个位置 p，把 p 处的 redex 换成 contract，其它地方<b>一个字符都不动</b>。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🎯</span>为什么考试爱考位置</div>' +
          '<p>因为「同一时刻往往有多个 redex」，选哪一个决定了后面的归约过程。' +
          '而「选哪一个」是由<b>求值策略（E-strategy）</b>决定的。现在只需知道「CafeOBJ 有一套固定规则决定先重写哪个位置，默认大致是先算参数、再算外层」，第 6 章（无限列表）细讲。所以位置 + 策略 = 完全确定的归约过程。</p></div>'
      },
      {
        id: 'L3.s3', title: '一步重写与归约：看引擎怎么走',
        guide: {
          what: '一步重写是「换掉一个 redex」；归约是「一直换，换到不能再换」；最后的结果叫范式。好比剥洋葱：剥一层是一步，剥到不能再剥就是范式。',
          why: '<code>red</code> 只给你最终结果。考试要求写出中间过程（trace），所以必须能一步一步说清每次换了哪里、用了哪条等式。',
          how: '用下面的播放器单步播放 <code>fact1(s(s(s(0))))</code>，每一步都会标出用的等式和位置。然后自己在纸上写前 3 步。',
          use: 'Python 调试器单步执行、数据库的 <code>EXPLAIN</code> 显示查询计划的每一步、编译器的 <code>-O</code> 优化逐遍改写中间代码，都是「看清每一步变换」。',
          pitfalls: ['把「归约」和「一步重写」混用：归约是零步或多步', '以为范式一定是一个数字：<code>p 0</code> 这种找不到 redex 的项也是范式', '写 trace 时漏写所用等式的名字']
        },
        html: '<p>下面用真正的引擎跑一遍，<b>每一步都标出了用的规则和位置</b>（这里用的是系统自带的 PNAT1 模块，它的 <code>fact1</code> 就是第 1 章 FACT-DEMO 里的 fact）：</p>' +
          '<div class="widget" id="w-l3-reduce"></div>' +
          '<p>术语链条要记牢：</p>' +
          '<ol><li><b>一步重写（one-step rewrite）</b>：t →<sub>p</sub> t′，在位置 p 把一个 redex 换掉</li>' +
          '<li><b>归约（reduction）</b>：t →* t′，零步或多步，并且 t′ 里再也没有 redex</li>' +
          '<li><b>范式（normal form）</b>：再也找不到 redex 的项，归约的终点</li></ol>' +
          '<div class="card"><div class="card-t"><span class="ico">🔍</span>在官方 CafeOBJ 里看每一步</div>' +
          '<p>系统自带一个 <code>FACT</code> 模块（讲义第 1 章的写法：<code>pr(NAT)</code>，用普通数字，<code>eq fact(0) = 1 .</code> 和 <code>eq fact(NzX) = NzX * fact(p NzX) .</code>）。在官方 CafeOBJ 里，下面的命令会打印每一步：</p>' +
          cb('w-l3-trace', 'open FACT .\nset trace whole on .\nred fact(3) .\nset trace whole off .\nclose', '官方 CafeOBJ 的 trace 写法', {
            'open FACT .': '打开 FACT 模块（本系统也自带，所以这段能运行）。',
            'set trace whole on .': '官方 CafeOBJ：打开「整体跟踪」，每做一步重写就打印一次当前的整个项。本系统的引擎会跳过这条命令，想看每一步请用上面的播放器。',
            'red fact(3) .': '计算 3!，结果 6，排序 NzNat。',
            'set trace whole off .': '关闭跟踪。',
            'close': '关闭模块。'
          }) +
          '<p>讲义里还有 <code>set trace on</code>（不带 whole），它会额外打印每一步用的等式和替换 σ。考试写 trace 时，格式参考讲义：每一步写出新项，并注明用了哪条等式。</p></div>'
      },
      {
        id: 'L3.s4', title: '条件等式（conditional equation）',
        guide: {
          what: '条件等式 <code>ceq 左 = 右 if 条件 .</code> 是「带前提的替换规则」：左边对上了还不够，条件也要成立才换。好比「如果下雨，就把『出门』换成『带伞出门』」。',
          why: '有些函数光靠参数的形状分不出情况。<code>min(3,5)</code> 和 <code>min(5,3)</code> 形状一样，要比较大小才知道结果。没有 ceq，就只能写成一层层的 if，又长又难读。',
          how: '写法：<code>ceq min(X,Y) = X if X &lt; Y .</code>。引擎先匹配左边得到 σ，再把 σ(条件) 归约，结果是 true 才替换。看下面 min 的三条规则。',
          use: 'Python 3.10 <code>match</code> 里的守卫 <code>case (x, y) if x &lt; y:</code>、Rust <code>match</code> 的 <code>if</code> 守卫、Haskell 的 guard（<code>| x &lt; y = x</code>），以及数据库触发器的 <code>WHEN</code> 条件，都是「匹配 + 条件」。',
          pitfalls: ['条件里用了左边没有的变量：匹配之后它没有值', '条件用了没有等式的运算，条件永远算不成 true，规则永远不触发', '写成 <code>eq ... if ...</code>：带条件的必须用 <code>ceq</code>']
        },
        html: '<p>有时候「能不能换」取决一个条件：<code>ceq 左边 = 右边 if 条件 .</code></p>' +
          '<p>语义：先匹配左边 → 得到 σ → <b>把 σ(条件) 归约</b> → 如果结果是 <code>true</code>，才允许替换。</p>' +
          '<div class="card"><div class="card-t"><span class="ico">📋</span>写 ceq 的三条规则（考试会考）</div>' +
          '<ul><li>① 左边不能是单个变量</li><li>② 右边出现的变量必须在左边出现过</li>' +
          '<li>③ <b>条件里的变量也必须在左边出现过</b></li></ul>' +
          '<p>第三条最容易忘。原因：条件是在匹配之后才求值的，如果条件里出现了左边没有的变量，就没有值可以代入。</p></div>' +
          cb('w-l3-ceq2', 'mod! MIN-DEMO {\n  pr(BOOL-IF)\n  pr(NAT-IF)\n  op min : Nat Nat -> Nat\n  vars X Y : Nat\n  eq min(X,X) = X .\n  ceq min(X,Y) = X if X < Y .\n  ceq min(X,Y) = Y if Y < X .\n}\nopen MIN-DEMO .\nred min(3,5) .\nred min(5,3) .\nred min(4,4) .\nclose', '条件等式：min 的三条规则', {
            'mod! MIN-DEMO {': '定义模块 MIN-DEMO（求两数中较小的那个）。',
            'pr(BOOL-IF)': '导入系统自带的 BOOL-IF：它带进了 Bool 和 Bool 上的 if。',
            'pr(NAT-IF)': '导入系统自带的 NAT-IF：它带进了 NAT（数字、<code>&lt;</code> 等）和 Nat 上的 if。这里真正用到的是 NAT 里的 <code>&lt;</code>。',
            'op min : Nat Nat -> Nat': '声明 min：两个数，返回一个数。',
            'vars X Y : Nat': '声明变量 X、Y。',
            'eq min(X,X) = X .': '两个参数相同时，结果就是它。注意 X 在左边出现了<b>两次</b>：只有两个参数是同一个值时才能匹配（见下面的说明）。',
            'ceq min(X,Y) = X if X < Y .': '条件等式：如果 X &lt; Y，min(X,Y) 就是 X。<code>ceq</code> 表示「带条件的等式」，<code>if</code> 后面是条件。',
            'ceq min(X,Y) = Y if Y < X .': '如果 Y &lt; X，结果是 Y。',
            '}': '模块结束。',
            'open MIN-DEMO .': '打开模块。',
            'red min(3,5) .': 'σ = {X ↦ 3, Y ↦ 5}，条件 3 &lt; 5 算成 true，用第二条，结果 3。',
            'red min(5,3) .': '第二条的条件 5 &lt; 3 是 false，不能用；第三条的条件 3 &lt; 5 是 true，结果 3。',
            'red min(4,4) .': '两个参数相同，第一条能匹配，结果 4。',
            'close': '关闭模块。'
          }) +
          '<p>三条规则互不重叠：相等走第一条；小于走第二条；大于走第三条。' +
          '<b>没有任何一条用 <code>if</code> 嵌套</b> —— 这就是条件等式的威力。</p>' +
          '<div class="card"><div class="card-t"><span class="ico">🔁</span>同一个变量出现两次：<code>min(X,X)</code></div>' +
          '<p>到目前为止，等式左边的每个变量都只出现一次（如 <code>(X | L) @ L2</code>），这叫<b>线性模式</b>。<code>min(X,X)</code> 里 X 出现了两次，叫<b>非线性模式</b>。' +
          '它的意思是：第 1 个参数和第 2 个参数<b>必须是完全相同的项</b>，才能匹配成功。</p>' +
          '<ul><li><code>min(4,4)</code>：第 1 处 X 对上 4，第 2 处 X 也对上 4，一致 → 匹配成功，σ = {X ↦ 4}</li>' +
          '<li><code>min(3,5)</code>：第 1 处 X 对上 3，第 2 处 X 要对上 5，但 X 已经是 3 了，矛盾 → 匹配失败，去试下一条</li></ul>' +
          '<p>Python 类比：<code>match (a, b): case (x, y) if x == y: return x</code>，只是 CafeOBJ 把「x == y」藏进了「同一个变量名」里。</p></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>写 ceq 时的常见坑</div>' +
          '<p>条件里的「不等于」不要写 <code>!=</code>。官方 CafeOBJ 用 <code>=/=</code> 或 <code>not (... == ...)</code>；本系统的引擎请用 <code>not (... == ...)</code>。' +
          '另外条件最好用<b>已经定义了等式</b>的运算（如 <code>&lt;</code>、<code>==</code>），否则条件永远化不成 true，规则就永远不触发。</p></div>'
      },
      {
        id: 'L3.s5', title: 'AC 匹配：assoc / comm / id 与多重集',
        guide: {
          what: '<code>assoc</code>（结合律）、<code>comm</code>（交换律）、<code>id:</code>（单位元）是写在算子上的属性，让引擎把「只差括号、顺序、单位元」的项当成同一个。三个合用就得到多重集：一个装东西的袋子，不管顺序，但数个数。',
          why: '没有这些属性，<code>1 2</code> 和 <code>2 1</code> 是两个不同的项，你得自己写等式来交换、去括号，而像 <code>X Y = Y X</code> 这样的等式会让重写来回交换、停不下来。写成属性后，引擎在匹配时直接处理。',
          how: '在 op 声明里写：<code>op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}</code>。下面的代码用系统自带的 MULTISET-NAT，看几种写法是否相等。',
          use: 'Python 的 <code>collections.Counter</code> 就是多重集（<code>Counter([1,2,1]) == Counter([2,1,1])</code> 为 True）；数据库查询优化器利用 JOIN 的结合律和交换律重排连接顺序；Maude 和 SMT 求解器（如 Z3）内部也做 AC 匹配。',
          pitfalls: ['以为 comm 会把元素排序：它只是让顺序不同的项被当成同一个', '把多重集当集合：<code>1 1 2</code> 和 <code>1 2</code> 不相等（个数不同）', '以为 AC 匹配只有一个解：同一个模式可能有多种对法（第 7 章的坑）']
        },
        html: '<p>给算子加属性，就能让「重写」自动获得数学性质：</p>' +
          '<table><tr><th>属性</th><th>含义</th><th>效果</th></tr>' +
          '<tr><td><code>assoc</code></td><td>结合律</td><td><code>(a+b)+c</code> 和 <code>a+(b+c)</code> 视为同一个项</td></tr>' +
          '<tr><td><code>comm</code></td><td>交换律</td><td><code>a+b</code> 和 <code>b+a</code> 视为同一个项</td></tr>' +
          '<tr><td><code>id: emp</code></td><td>单位元</td><td><code>x emp</code> 自动变成 <code>x</code></td></tr></table>' +
          '<div class="card"><div class="card-t"><span class="ico">👀</span>怎么读并置算子 <code>__</code></div>' +
          '<p>系统自带的 MULTISET-NAT 里有一行 <code>op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}</code>。' +
          '名字 <code>__</code> 是两个紧挨着的下划线，中间<b>没有任何符号</b>。按「下划线 = 参数位置」的规则，它表示「两个参数并排写，中间只隔一个空格」。' +
          '所以 <code>1 2</code> 就是把 1 和 2 放进同一个袋子，<code>1 2 3</code> 是三个元素的袋子。这种算子叫<b>并置（juxtaposition）</b>算子，书上有时写成 <code>_ _</code>。' +
          '另外 <code>[Nat &lt; MSet]</code> 让每个数字本身就是一个只有一个元素的多重集，<code>emp</code> 是空袋子。</p></div>' +
          '<p>三个属性一起用，<code>__</code> 就变成了<b>多重集（multiset）</b>：元素无序、可重复、有单位元。</p>' +
          cb('w-l3-ac', 'open MULTISET-NAT .\nred (1 2) 3 .\nred (1 2) 3 == 1 (2 3) .\nred 1 2 == 2 1 .\nred 1 1 2 == 1 2 .\nred emp 1 emp 2 emp 1 emp 1 emp 2 emp .\nred emp emp .\nclose', '多重集：结合律/交换律/单位元一次看全', {
            'open MULTISET-NAT .': '打开系统自带的自然数多重集模块。',
            'red (1 2) 3 .': '看 <code>(1 2) 3</code> 化简成什么：结果显示 <code>1 2 3</code>，括号没有了（assoc 的效果），而且一步重写都没用（[0]）。',
            'red (1 2) 3 == 1 (2 3) .': '比较两种加括号的方式：结果 <code>true</code>。括号不同的两个项被当成同一个。',
            'red 1 2 == 2 1 .': '比较两种顺序：结果 <code>true</code>（comm 的效果）。',
            'red 1 1 2 == 1 2 .': '一个有两个 1，一个只有一个 1：结果 <code>false</code>，多重集要数个数。',
            'red emp 1 emp 2 emp 1 emp 1 emp 2 emp .': '中间夹了很多 emp（空袋子）。id: emp 让它们全部消失，结果 <code>1 1 1 2 2</code>（顺序也被整理过）。',
            'red emp emp .': '两个空袋子合在一起还是空袋子，结果 <code>emp</code>。',
            'close': '关闭模块。'
          }) +
          '<p>注意第 1 行：<code>(1 2) 3</code> 打印出来是 <code>1 2 3</code>，括号被抹平了。第 2、3 行的结果都是 <code>true</code>：括号不同、顺序不同的两边被判为相等。' +
          '这正是 assoc/comm 的效果：它们不是靠等式一步步重写出来的，而是让引擎<b>在比较和匹配时就忽略括号和顺序</b>。' +
          '第 4 行则是 <code>false</code>：数量不同就是不同的多重集。</p>' +
          '<div class="card why"><div class="card-t"><span class="ico">🤔</span>AC 匹配为什么难</div>' +
          '<p>普通的模式匹配是「一个一个位置对下去」。但有了 assoc/comm，' +
          '模式 <code>E S</code> 要匹配 <code>1 2 3</code> 时，<b>哪个元素给 E、哪些给 S</b> 有 3 种分法；' +
          '如果模式里有两个变量、元素有 n 个，组合数爆炸。这就是 AC 匹配（AC matching）的难点，第 7 章整章都在处理它。</p>' +
          '<p>更麻烦的是：AC 匹配可能<b>有多个解</b>，选哪个解会影响结果 —— 这正是第 7 章「update 结果不一致」bug 的根源。</p></div>' +
          cta('L3-quiz2', '随堂小测 · 重写机制（4 题）')
      },
      {
        id: 'L3.s6', title: '终止性与合流性（概念题，考选择题）',
        guide: {
          what: '终止性 = 不管怎么重写，总会停下来；合流性 = 不管先重写哪里，最后结果都一样。好比走迷宫：终止性保证一定能走出去，合流性保证从哪条路走都到同一个出口。',
          why: '不终止，<code>red</code> 会一直算下去没有结果；不合流，同一个式子按不同顺序算会得到不同答案，<code>red</code> 的结果就没法当「标准答案」。',
          how: '判断时看两点：右边是不是比左边「更小」（终止性）；两条等式的左边会不会同时匹配同一个项却给出不同结果（合流性）。对照下面的反例表。',
          use: 'Python 的递归没有基础情形就会报 <code>RecursionError</code>（不终止）；数据库查询优化器、编译器的改写规则都必须保证会停下来、结果不变；Rust 的类型推导规则也要证明会终止。',
          pitfalls: ['以为「能算出结果的例子」就证明了终止：终止要对所有输入成立', '把两个性质混在一起：一个系统可以终止但不合流，也可以合流但不终止', '以为等式的书写顺序能解决不合流：引擎不保证按书写顺序选等式']
        },
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
      { q: '「能与等式左边匹配的子项」叫什么？', opts: ['contract', 'redex', 'position', 'substitution'], a: 1, why: 'redex = reducible expression，可归约表达式。',
        optWhy: ['错：contract 是 σ(右边)，是换上去的新项', '对：redex 是被换掉的那个子项', '错：position 是子项所在的位置（门牌号），不是子项本身', '错：substitution（替换 σ）是变量到项的对应表'] },
      { q: '把替换 σ 作用到等式<b>右边</b>得到的东西叫？', opts: ['redex', 'contract', '范式', '公理'], a: 1, why: 'contract 是替换上去的新项。',
        optWhy: ['错：redex 是 σ(左边)', '对：contract = σ(右边)', '错：范式是整个归约结束时、没有 redex 的项', '错：公理是模块里的等式本身，不是代入后的结果'] },
      { q: '位置 ε 表示？', opts: ['最左边的子项', '整棵树（根）', '叶子', '不存在的项'], a: 1, why: 'ε 是空串，表示根位置。',
        optWhy: ['错：最左边的孩子是位置 1', '对：一步都不往下走，就是根，也就是整个项', '错：叶子的位置是最长的那些，如 2.2.1.1', '错：ε 处一定有项，就是整个项'] }
    ]
  };
  QZ['L3-quiz2'] = {
    title: '随堂小测 · 重写机制',
    items: [
      { q: '条件等式 <code>ceq L = R if C .</code> 什么时候可以重写？', opts: ['只要 L 匹配成功', 'L 匹配成功且 σ(C) 归约到 true', 'C 与 L 相同', '总是可以'], a: 1, why: '先匹配左边，再把条件归约，必须得到 true。',
        optWhy: ['错：只匹配左边是 eq 的规则，ceq 还要检查条件', '对：先匹配得到 σ，再把 σ(C) 算成 true', '错：条件是一个 Bool 式子，不需要和左边相同', '错：条件为 false 或算不出来时不能重写'] },
      { q: '写 ceq 时，条件里出现的变量必须？', opts: ['任意命名', '也在左边出现过', '在右边出现过', '声明为常量'], a: 1, why: '否则匹配后无法代入具体值。',
        optWhy: ['错：名字可以随便起，但必须能从左边得到值', '对：σ 只给左边出现的变量赋值', '错：右边的变量本身也必须来自左边，只在右边出现没有用', '错：条件里要的是变量，常量不用声明成变量'] },
      { q: '<code>assoc</code> 属性带来的效果是？', opts: ['交换顺序', '去掉单位元', '<code>(a+b)+c</code> 与 <code>a+(b+c)</code> 视为同一项', '自动排序'], a: 2, why: 'assoc = 结合律。comm = 交换律，id: = 单位元。',
        optWhy: ['错：交换顺序是 comm', '错：去掉单位元是 id:', '对：结合律让括号不再重要', '错：没有哪个属性会给元素排序'] },
      { q: 'AC 匹配为什么可能没有唯一解？', opts: ['因为项太长', '因为元素无序、分组方式有多个，可能产生多组不同的变量绑定', '因为 CafeOBJ 有 bug', '因为等式没有句号'], a: 1, why: '这正是第 7 章 update 结果不一致的原因，需要靠 isValid 之类的条件来约束。',
        optWhy: ['错：项短也会有多个解，如 <code>E S</code> 匹配 <code>1 2</code> 就有两种', '对：E 可以取任何一个元素，剩下的给 S', '错：这是 AC 匹配本身的性质，不是程序错误', '错：句号是语法问题，和匹配解的个数无关'] }
    ]
  };
  QZ['L3-quiz'] = {
    title: 'L3 综合测验',
    items: [
      { q: '（热身）<code>red</code> 打印出来的结果，在术语上叫？', opts: ['redex', '范式（normal form）', '替换', '位置'], a: 1, why: 'red 一直重写到没有 redex 为止，停下时的项就是范式。',
        optWhy: ['错：redex 是中途被换掉的子项，结果里已经没有 redex', '对：没有 redex 的项叫范式', '错：替换 σ 是匹配时变量的取值', '错：位置是子项的门牌号'] },
      { q: '（热身）一步重写会改动项的哪些部分？', opts: ['整个项全部重新计算', '只改选定位置上的那个 redex，其他地方不动', '所有出现同一个子项的地方一起改', '只改最右边的子项'], a: 1, why: '一步重写只在一个位置 p 上换掉一个 redex。',
        optWhy: ['错：其他部分保持原样', '对：t′ 只在位置 p 和 t 不同', '错：同样的子项在别的位置要另外一步来换', '错：位置是由 redex 所在处和求值策略决定的，不固定在最右边'] },
      { q: '对项 <code>fact(s(s(0)))</code> 应用 <code>eq fact(s(X)) = s(X) * fact(X)</code>，σ 是？', opts: ['{X ↦ 0}', '{X ↦ s(0)}', '{X ↦ s(s(0))}', '{X ↦ fact(0)}'], a: 1, why: 's(X) 要等于 s(s(0))，所以 X = s(0)。',
        optWhy: ['错：那样 s(X) = s(0)，对不上 s(s(0))', '对：s(X) 对上 s(s(0))，X 就是里面的 s(0)', '错：那样 s(X) = s(s(s(0)))，多了一个 s', '错：项里没有 fact(0)，X 只能对上 fact 参数里面的部分'] },
      { q: '归约的终点叫？', opts: ['redex', 'contract', '范式（normal form）', '公理'], a: 2, why: '找不到 redex 时的项叫范式。',
        optWhy: ['错：redex 是要被换掉的子项', '错：contract 是每一步换上去的新项，中途还可能含 redex', '对：再也找不到 redex 的项', '错：公理是模块里写的等式'] },
      { q: '一个重写系统「收敛」是指？', opts: ['只有一条等式', '终止且合流（结果唯一）', '没有变量', '能编译'], a: 1, why: '终止性 + 合流性。',
        optWhy: ['错：一条等式也可能不终止，如 <code>eq f(X) = f(s(X))</code>', '对：一定会停下，且结果唯一', '错：变量和收敛无关', '错：CafeOBJ 不编译，收敛是重写系统的数学性质'] },
      { q: '<code>eq f(X) = f(s(X)) .</code> 破坏了哪个性质？', opts: ['终止性', '排序的正确性', '变量必须先声明', '没有破坏任何性质'], a: 0, why: '每步都变成一个更大的 f(...)，永不停止，终止性被破坏。（它只有一条规则，不会出现两种结果，所以合流性没有被破坏。）',
        optWhy: ['对：<code>f(0) → f(s(0)) → f(s(s(0))) → …</code> 永远停不下来', '错：左右两边都是 f(...)，排序一致', '错：题目没有说 X 未声明，声明问题和这条等式的含义无关', '错：它会无限重写，red 永远得不到结果'] }
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
    pre: [
      'L2.s1：模块 = 签名 + 公理，<code>pr(...)</code> 是导入',
      'L2.s4：列表的两个构造子 <code>nil</code>、<code>_|_</code> 和连接 <code>@</code> 的两条等式',
      'L2.s3：错误排序 <code>ErrNat</code>、<code>Nat&amp;Err</code> 和错误常量 <code>errNat</code>'
    ],
    summary: [
      '参数化模块 <code>mod! GLIST1(E :: TRIV) { ... }</code>：把元素类型抽成参数 E，<code>Elt.E</code> 表示「E 里的排序 Elt」',
      '<code>mod* TRIV { [Elt] }</code> 是接口（要求）：实际参数只要有一个排序就行；接口用 <code>mod*</code>，参数化模块本身用 <code>mod!</code>',
      'view（视图）写出「接口里的排序/算子 → 实际模块里的排序/算子」的对应，如 <code>sort Elt -&gt; Nat,</code>；mixfix 算子在 view 里要加括号',
      '实例化：<code>GLIST1(E &lt;= TRIV2NAT)</code>；实际模块声明了 principal-sort 时可简写为 <code>GLIST1(NAT)</code>',
      '重命名 <code>* { sort List -&gt; NatList, op nil -&gt; nlnil }</code>：导入时给排序和算子改名',
      '本系统的引擎不能执行参数化模块和 view，考试要会手写；引擎里用「手工实例化」的模块代替'
    ],
    goals: [
      '会写 <code>mod! GLIST1(E :: TRIV)</code> 形式的参数化模块，知道 <code>mod*</code> 只用于 TRIV 这类接口',
      '会写 view（把抽象排序映射到具体排序）并实例化',
      '说清 <code>pr(...)</code> 导入、<code>E &lt;= TRIV2NAT</code> 的含义',
      '理解 TABLE 为什么需要参数化（第 5 章的铺垫）'
    ],
    sections: [
      {
        id: 'L4.s1', title: '为什么要参数化：一份代码，多种类型',
        guide: {
          what: '参数化模块是「带参数的模块」：把列表里元素的类型抽出来当参数，写一次，可以装 Nat、Qid 或任何类型。',
          why: '不参数化的话，自然数列表、名字列表、条目列表要各写一遍，代码一模一样，只是类型不同。',
          how: '读下面的 GLIST1：唯一和 L2 列表不同的地方，是把 <code>Nat</code> 换成了 <code>Elt.E</code>。',
          use: 'Java / TypeScript 的泛型 <code>List&lt;T&gt;</code>、Python 的 <code>list[T]</code>、Rust 的 <code>Vec&lt;T&gt;</code> 都是同一个想法。',
          pitfalls: ['把参数化模块写成 <code>mod*</code>：讲义里参数化模块用 <code>mod!</code>，<code>mod*</code> 只用于 TRIV 这种「接口」', '忘了在元素类型后面加 <code>.E</code>：要写 <code>Elt.E</code>，不是 <code>Elt</code>']
        },
        html: '<p>第 2 章写的列表只能放 <code>Nat</code>。但「表」需要放 (Qid,String) 对，第 8 章的环境需要放 (变量,值) 对。' +
          '如果每个都重写一遍，代码量爆炸。</p>' +
          '<p>参数化模块（parameterized module）就是<b>带参数的模块</b>：把「元素类型」抽出来当参数。讲义的写法：</p>' +
          '<div class="codebox"><pre>mod! GLIST1(E :: TRIV) {\n  [Nil NnList &lt; List]\n  op nil : -&gt; Nil {constr}\n  op _|_ : Elt.E List -&gt; NnList {constr prec: 40}\n  ...\n}</pre></div>' +
          '<p>这里 <code>E :: TRIV</code> 的意思是：<b>E 是一个模块，它必须满足 TRIV 这个「接口」</b>。' +
          '<code>Elt.E</code> 表示「E 里的 Elt 排序」。</p>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span><code>mod!</code> 还是 <code>mod*</code>？</div>' +
          '<p>讲义的约定：<b>参数化模块本身用 <code>mod!</code></b>（如 <code>mod! GLIST1(E :: TRIV)</code>），' +
          '<b>只有当「接口 / 要求」的模块用 <code>mod*</code></b>（如 <code>mod* TRIV { [Elt] }</code>、<code>mod* TRIV-ERR</code>）。' +
          '<code>mod*</code> 表示「只规定必须有什么，不限定具体是什么」，正适合当参数的要求。</p></div>' +
          '<table><tr><th>写法</th><th>含义</th></tr>' +
          '<tr><td><code>mod! GLIST1(E :: TRIV)</code></td><td>声明参数 E，约束是 TRIV（参数化模块用 mod!）</td></tr>' +
          '<tr><td><code>Elt.E</code></td><td>参数模块 E 里的排序 Elt</td></tr>' +
          '<tr><td><code>pr(NAT)</code></td><td>导入模块 NAT（protected）</td></tr>' +
          '<tr><td><code>GLIST1(NAT)</code></td><td>把 NAT 作为参数实例化（NAT 声明了 principal-sort 时才能这样简写）</td></tr>' +
          '<tr><td><code>E &lt;= TRIV2NAT</code></td><td>用一个 view 作为参数（见下节）</td></tr></table>' +
          '<div class="card"><div class="card-t"><span class="ico">📦</span>TRIV 是什么</div>' +
          '<p>TRIV 是最小的模块：只有一个排序 <code>Elt</code>，没有任何算子。</p>' +
          '<div class="codebox"><pre>mod* TRIV { [Elt] }</pre></div>' +
          '<p>它像一个「插座」：任何模块只要能提供 <code>Elt</code>，就能插进去。</p></div>'
      },
      {
        id: 'L4.s2', title: 'view：把抽象排序映射到具体排序',
        guide: {
          what: 'view 是一张对照表：说明接口（如 TRIV）里的排序和算子，在实际模块（如 NAT）里分别对应谁。',
          why: 'TRIV 里的排序叫 Elt，NAT 里叫 Nat，名字不同，系统不知道该怎么对应，需要你写清楚。',
          how: '<code>view 名字 from 接口 to 实际模块 { sort 甲 -&gt; 乙, op 丙 -&gt; 丁, }</code>，再用 <code>GLIST1(E &lt;= 名字)</code> 实例化。',
          use: 'Java 里写 <code>class NatList implements List&lt;Integer&gt;</code> 时，编译器做的就是这种对应。',
          pitfalls: ['条目之间漏了逗号', 'mixfix 算子没加括号：要写 <code>op (if_then{_}else{_}) -&gt; (...)</code>']
        },
        html:'<p>TRIV 里的排序叫 <code>Elt</code>，但 NAT 里的自然数排序叫 <code>Nat</code>。要插上，需要一个<b>视图（view）</b>说明对应关系：</p>' +
          '<div class="codebox"><pre>view TRIV2NAT from TRIV to NAT {\n  sort Elt -&gt; Nat\n}</pre></div>' +
          '<p>然后把 view 作为参数传进去：<code>GLIST1(E &lt;= TRIV2NAT)</code>。如果实际模块声明了 principal-sort（如 <code>mod! NAT principal-sort Nat { … }</code>），可以简写成 <code>GLIST1(NAT)</code>，系统会自动把 Elt 对应到这个主排序。</p>' +
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
        guide: {
          what: '本系统不能运行参数化模块，所以用「手工实例化」代替：把参数换成具体类型，其余照抄。',
          why: '能运行才能看到结果；手工实例化后的模块和参数化版本做的是同一件事。',
          how: '运行下面的 GLIST-NAT，再对比考试模板，找出唯一的差别（Nat ↔ Elt.E）。',
          pitfalls: ['考试时写成手工实例化版本：考试要写参数化版本 <code>mod! GLIST1(E :: TRIV)</code>']
        },
        html: '<div class="card exam"><div class="card-t"><span class="ico">📌</span>先说明：本引擎不支持参数化</div>' +
          '<p>本系统的引擎是教学用的简化版，<b>不执行参数化模块（带 <code>(E :: TRIV)</code> 的模块）和 view</b>（那需要完整的模块表达式求解）。' +
          '所以第 4、5 章的概念用<b>图 + 等价的手写实例化模块</b>来演示，考试时你仍要会写参数化版本。</p></div>' +
          '<p>「手工实例化」就是：把参数换成具体排序，其它照抄。例如 GLIST(NAT) 手写成：</p>' +
          cb('w-l4-1', 'mod! GLIST-NAT {\n  pr(NAT)\n  [Nil NnList < List]\n  op nil : -> Nil {constr}\n  op _|_ : Nat List -> NnList {constr prec: 40}\n  op len : List -> Nat\n  vars E : Nat\n  vars L L2 : List\n  eq len(nil) = 0 .\n  eq len(E | L) = s(len(L)) .\n  op _@_ : List List -> List {prec: 40}\n  eq nil @ L2 = L2 .\n  eq (E | L) @ L2 = E | (L @ L2) .\n}\nopen GLIST-NAT .\nred len(1 | 2 | 3 | nil) .\nred (1 | 2 | nil) @ (3 | nil) .\nclose', 'GLIST1(NAT) 的手工实例化', {
            'mod! GLIST-NAT {': '手工实例化的模块：把 GLIST1 的参数 E 换成 NAT 后照抄。',
            'pr(NAT)': '导入自然数，元素类型就是 Nat。',
            '[Nil NnList < List]': '空列表 Nil 和非空列表 NnList 都属于 List。',
            'op nil : -> Nil {constr}': '空列表。',
            'op _|_ : Nat List -> NnList {constr prec: 40}': '把一个 Nat 接到列表前面。参数化版本里这里的 Nat 写作 Elt.E。',
            'op len : List -> Nat': '求长度。',
            'vars E : Nat': '元素变量（参数化版本里是 Elt.E）。',
            'vars L L2 : List': '列表变量。',
            'eq len(nil) = 0 .': '空列表长度为 0。',
            'eq len(E | L) = s(len(L)) .': '非空列表长度 = 尾巴长度 + 1。',
            'op _@_ : List List -> List {prec: 40}': '连接两个列表。',
            'eq nil @ L2 = L2 .': '空列表接上 L2 还是 L2。',
            'eq (E | L) @ L2 = E | (L @ L2) .': '把头拿出来，尾巴再和 L2 连接。',
            '}': '模块结束。',
            'open GLIST-NAT .': '打开模块试算。',
            'red len(1 | 2 | 3 | nil) .': '长度是 3。',
            'red (1 | 2 | nil) @ (3 | nil) .': '结果 1 | 2 | 3 | nil。',
            'close': '退出试算。'
          }) +
          '<p>对比一下参数化版本，你会发现<b>唯一的差别就是 <code>Nat</code> 写成了 <code>Elt.E</code></b>。' +
          '理解这一点，考试时写参数化模块就不会慌。</p>' +
          '<div class="card tip"><div class="card-t"><span class="ico">✍️</span>考试模板（背下来）</div>' +
          '<div class="codebox"><pre>mod! GLIST1(E :: TRIV) {\n  pr(NAT)\n  [Nil NnList &lt; List]\n  op nil : -&gt; Nil {constr}\n  op _|_ : Elt.E List -&gt; NnList {constr prec: 40}\n  op len : List -&gt; Nat\n  op _@_ : List List -&gt; List {prec: 40}\n  vars E : Elt.E\n  vars L L2 : List\n  eq len(nil) = 0 .\n  eq len(E | L) = s(len(L)) .\n  eq nil @ L2 = L2 .\n  eq (E | L) @ L2 = E | (L @ L2) .\n}</pre></div></div>'
      },
      {
        id: 'L4.s4', title: '多参数与嵌套：TABLE 的由来',
        guide: {
          what: '参数化模块可以有多个参数，也可以导入时给排序和算子改名（renaming），第 5 章的表就是这样从列表搭出来的。',
          why: '表本质上是「条目的列表」。直接复用列表模块再改个名，就不用重写所有列表操作。',
          how: '读 <code>* { sort List -&gt; Table, op nil -&gt; empTable }</code> 这种写法时，把它当成「导入后改名」。',
          use: '和 Python 的 <code>from list import List as Table</code> 是同一个想法，只是 CafeOBJ 还能改内部的算子名。',
          pitfalls: ['renaming 里的 sort / op 前缀漏写', '这一节的代码只需要读懂，不需要背下来']
        },
        html:'<p>参数化模块可以有多个参数，也可以<b>把一个参数化模块作为另一个的参数</b>，这是第 5 章 TABLE 的关键：</p>' +
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
      { q: '热身：参数化模块最像 Python / Java 里的什么？', opts: ['for 循环', '泛型（如 List[T]、List&lt;T&gt;）', '异常处理', '全局变量'], a: 1, why: '都是把元素类型抽成参数，写一次可以装不同类型。',
        optWhy: ['循环是控制流，和类型参数无关', '正确', '异常处理和参数化无关', '全局变量和参数化无关'] },
      { q: '讲义里，参数化模块 GLIST1 用哪个关键字声明？', opts: ['<code>mod*</code>', '<code>mod!</code>', '<code>view</code>', '<code>open</code>'], a: 1, why: '讲义写作 <code>mod! GLIST1(E :: TRIV)</code>；<code>mod*</code> 只用于 TRIV 这类接口。',
        optWhy: ['mod* 用于接口（如 TRIV），不用于参数化模块本身', '正确', 'view 是对照表，不是模块', 'open 是打开模块试算'] },
      { q: '<code>mod! GLIST1(E :: TRIV)</code> 中 <code>E :: TRIV</code> 表示？', opts: ['E 是排序名', 'E 是模块参数，必须满足 TRIV 的接口', 'E 是变量', 'E 是常量'], a: 1, why: ':: 声明参数模块及其约束接口。',
        optWhy: ['排序名写在方括号里，E 在这里是模块参数', '正确', '变量用 var 声明，并且在等式里使用', '常量是没有参数的算子'] },
      { q: '<code>Elt.E</code> 的含义？', opts: ['E 的父排序', '参数模块 E 里的排序 Elt', 'E 类型的变量', 'Elt 的子排序'], a: 1, why: '参数模块里的排序用「模块名.排序名」引用。',
        optWhy: ['没有「父排序」这个写法', '正确：「排序名.参数名」', '变量要另外用 var 声明', '这里没有子排序关系'] },
      { q: 'view 里对 mixfix 算子做映射时要注意？', opts: ['直接写名字', '用括号包起来：<code>op (if_then{_}else{_}) -&gt; (...)</code>', '不能用 mixfix', '要加 constr'], a: 1, why: '课件的注意事项：mixfix 算子出现在 view 中必须加括号。',
        optWhy: ['直接写名字解析器会把下划线和花括号读错', '正确', 'mixfix 算子可以映射，只是要加括号', 'constr 是算子属性，和 view 无关'] }
    ]
  };
  QZ['L4-quiz'] = {
    title: 'L4 综合测验',
    items: [
      { q: '参数化模块的主要好处？', opts: ['运行更快', '一份定义可复用于多种元素类型（Nat/Qid/Pair…）', '避免语法错误', '支持递归'], a: 1, why: '抽象出元素类型。',
        optWhy: ['速度不会变快', '正确', '语法错误照样会有', '递归不需要参数化也能写'] },
      { q: '<code>pr(PAIR(K,V) * {sort Pair -&gt; Entry})</code> 里的 <code>* {...}</code> 是？', opts: ['乘法', '重命名（renaming）', '注释', '优先级'], a: 1, why: '把一个模块的排序/算子改名后导入。',
        optWhy: ['这里的 * 不是乘法', '正确', '注释是 -- 开头', '优先级用 prec'] },
      { q: 'TABLE 里为什么要给 <code>nil</code> 改名成 <code>empTable</code>？', opts: ['名字好听', '因为表的「空」在语义上与列表的 nil 不同，改名后更清楚且避免冲突', '为了通过编译', 'nil 是关键字'], a: 1, why: '复用列表结构，但用表自己的术语命名。',
        optWhy: ['不是为了好听', '正确', '不改名也能编译', 'nil 不是关键字'] },
      { q: 'TRIV 模块包含什么？', opts: ['只有 <code>[Elt]</code>', 'Bool 和 Nat', '列表算子', 'if-then-else'], a: 0, why: 'TRIV 是最小接口：一个排序 Elt，无算子。',
        optWhy: ['正确', 'TRIV 里没有任何具体类型', '列表算子在 GLIST 里', 'if-then-else 在 BOOL 相关模块里'] }
    ]
  };
  QZ['L4-flash'] = {
    title: 'L4 闪卡',
    cards: [
      { q: '参数化模块的写法？', a: '<code>mod! GLIST1(E :: TRIV) { ... }</code>，用 <code>Elt.E</code> 引用参数里的排序。' },
      { q: 'view 的作用？', a: '把抽象排序/算子映射到具体排序/算子，使参数化模块可被实例化。' },
      { q: 'renaming 的语法？', a: '<code>pr(MOD * {sort A -&gt; B, op f -&gt; g})</code>' },
      { q: 'TRIV 的内容？', a: '<code>mod* TRIV { [Elt] }</code>（接口用 mod*）' },
      { q: 'mod! 与 mod* 怎么选？', a: '参数化模块本身用 <code>mod!</code>（如 <code>mod! GLIST1(E :: TRIV)</code>）；只当接口 / 要求时用 <code>mod*</code>（如 TRIV、TRIV-ERR）。' }
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
    pre: [
      'L2：列表 <code>E | L</code>、<code>nil</code> 和递归函数的写法',
      'L2.s3：错误排序 <code>ErrNat</code>、<code>Nat&amp;Err</code> 和 <code>errNat</code>',
      'L4：参数化模块和 renaming（表就是「条目的列表」改名而来）'
    ],
    summary: [
      '表 = 键的子集 + 函数；用列表表示时要满足不变量「键互不相同」',
      '七个操作：singleton、isReg、lookup、update（有则改、无则加）、insert（已存在返回 errTable）、remove（不存在也不报错）、delete（不存在返回 errTable）',
      '错误处理模式：原排序 + 错误排序 = <code>X&amp;Err</code>，查不到返回错误值；<code>eq (K,err.V) = errEntry .</code> 把错误往外传',
      '第 8 章解释器的「环境」就是一张从变量到值的表'
    ],
    sections: [
      {
        id: 'L5.s1', title: '表是什么：键、值、条目',
        guide: {
          what: '表是「键 → 值」的集合，每个键只出现一次。每一对 (键, 值) 叫一个条目。',
          why: '查找、修改「某个名字对应的值」是程序里最常见的操作，第 8 章解释器的变量环境就是一张表。',
          how: '把它想成通讯录：名字是键，电话是值。在 CafeOBJ 里用「条目的列表」来表示。',
          use: 'Python 的 dict、Java 的 HashMap、数据库的主键索引、Redis 缓存。',
          pitfalls: ['用列表表示时忘了「键不能重复」这条要求', '以为表里的条目有顺序：表不在乎顺序']
        },
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
        guide: {
          what: '用「错误值」表示操作失败：查不到键时返回 errNat，插入失败时返回 errTable。',
          why: 'CafeOBJ 没有异常（try/catch）。把错误也当成一种值，函数就总有结果，错误也能在类型上看出来。',
          how: '每个可能出错的类型 X 配一个错误类型 ErrX，两者合起来叫 X&amp;Err；可能出错的函数，结果类型写 X&amp;Err。',
          use: 'Rust 的 <code>Result&lt;T, E&gt;</code>、Haskell 的 <code>Maybe</code>、Go 的 <code>(value, err)</code> 都是同一个思路。',
          pitfalls: ['用 0 表示「查不到」：0 也是合法的值，分不清是查到了 0 还是没查到', '忘了把错误往外传：一个参数是错误值时，结果也应该是错误值']
        },
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
        guide: {
          what: '表的七个基本操作：造表、查键在不在、查值、改值、插入、两种删除。',
          why: '考试常考「写出某个操作的等式」和「update 与 insert、remove 与 delete 的区别」。',
          how: '每个操作都按表的形状分两种情况写：空表 empTable，和非空表 (K,V) | T。运行下面的代码，看每个操作的结果。',
          use: 'dict 的 <code>d[k] = v</code> 相当于 update，<code>d.pop(k)</code> 相当于 delete（键不存在会报错）。',
          pitfalls: ['把 insert 写成「已存在就返回原表」：讲义规定返回 errTable', 'lookup 查不到时返回 0：讲义返回错误值']
        },
        html: '<p>下面用<b>本引擎能跑的版本</b>演示：等式和讲义一致（包括错误值），只是把讲义里的参数固定成键 Qid、值 Nat。讲义的完整版是参数化的，考试按讲义写。</p>' +
          cb('w-l5-1', 'mod! TABLE-DEMO {\n  pr(NAT-ERR)\n  pr(QID)\n  [Entry]\n  op (_,_) : Qid Nat -> Entry {constr}\n  [EmpTable NeTable < Table]\n  [Table ErrTable < Table&Err]\n  op empTable : -> EmpTable {constr}\n  op errTable : -> ErrTable {constr}\n  op _|_ : Entry Table -> NeTable {constr prec: 40}\n  op if_then{_}else{_} : Bool Table&Err Table&Err -> Table&Err\n  op if_then{_}else{_} : Bool Nat&Err Nat&Err -> Nat&Err\n  op if_then{_}else{_} : Bool Bool Bool -> Bool\n  op singleton : Qid Nat -> Table\n  op isReg : Table Qid -> Bool\n  op lookup : Table Qid -> Nat&Err\n  op update : Table Qid Nat -> Table\n  op insert : Table Qid Nat -> Table&Err\n  op remove : Table Qid -> Table\n  op delete : Table Qid -> Table&Err\n  vars K K2 : Qid\n  vars V V2 : Nat\n  var T : Table\n  vars T1 T2 : Table&Err\n  vars N1 N2 : Nat&Err\n  vars B1 B2 : Bool\n  eq if true then {T1} else {T2} = T1 .\n  eq if false then {T1} else {T2} = T2 .\n  eq if true then {N1} else {N2} = N1 .\n  eq if false then {N1} else {N2} = N2 .\n  eq if true then {B1} else {B2} = B1 .\n  eq if false then {B1} else {B2} = B2 .\n  eq singleton(K,V) = (K,V) | empTable .\n  eq isReg(empTable,K2) = false .\n  eq isReg((K,V) | T,K2) = if K == K2 then {true} else {isReg(T,K2)} .\n  eq lookup(empTable,K2) = errNat .\n  eq lookup((K,V) | T,K2) = if K == K2 then {V} else {lookup(T,K2)} .\n  eq update(empTable,K2,V2) = (K2,V2) | empTable .\n  eq update((K,V) | T,K2,V2) = if K == K2 then {(K,V2) | T} else {(K,V) | update(T,K2,V2)} .\n  eq insert(T,K2,V2) = if isReg(T,K2) then {errTable} else {(K2,V2) | T} .\n  eq remove(empTable,K2) = empTable .\n  eq remove((K,V) | T,K2) = if K == K2 then {T} else {(K,V) | remove(T,K2)} .\n  eq delete(T,K2) = if isReg(T,K2) then {remove(T,K2)} else {errTable} .\n}\nopen TABLE-DEMO .\nred isReg((\'a,1) | (\'b,2) | empTable,\'a) .\nred isReg((\'a,1) | (\'b,2) | empTable,\'c) .\nred lookup((\'a,1) | (\'b,2) | empTable,\'b) .\nred lookup((\'a,1) | empTable,\'z) .\nred update((\'a,1) | (\'b,2) | empTable,\'a,99) .\nred update((\'a,1) | empTable,\'c,3) .\nred insert((\'a,1) | empTable,\'a,5) .\nred insert((\'a,1) | empTable,\'b,5) .\nred remove((\'a,1) | (\'b,2) | empTable,\'a) .\nred delete((\'a,1) | empTable,\'z) .\nclose', '表的七个操作（讲义写法：带错误值；键固定为 Qid、值固定为 Nat）', {
            'mod! TABLE-DEMO {': '定义一个演示用的表模块。讲义的 TABLE 是参数化的，这里把键固定成 Qid、值固定成 Nat，好让本系统的引擎能运行。',
            'pr(NAT-ERR)': '导入「带错误值的自然数」：除了 Nat，还有错误类型 ErrNat 和错误常量 errNat，以及 Nat&amp;Err（两者合起来）。',
            'pr(QID)': '导入 Qid（带撇号的名字，如 \'a、\'b），用来当键。',
            '[Entry]': '条目类型：一个 (键, 值) 对。',
            'op (_,_) : Qid Nat -> Entry {constr}': '条目的写法 <code>(K,V)</code>，是构造子。',
            '[EmpTable NeTable < Table]': '表分两种：空表 EmpTable 和非空表 NeTable，它们都属于 Table。',
            '[Table ErrTable < Table&Err]': '错误处理模式：Table 和错误表 ErrTable 合起来叫 Table&amp;Err。操作失败时返回 errTable。',
            'op empTable : -> EmpTable {constr}': '空表常量。',
            'op errTable : -> ErrTable {constr}': '错误表常量，例如 insert 一个已存在的键时返回它。',
            'op _|_ : Entry Table -> NeTable {constr prec: 40}': '把一个条目接到表前面，和列表的写法一样。',
            'op if_then{_}else{_} : Bool Table&Err Table&Err -> Table&Err': '表上的 if-then-else（结果可能是错误表）。',
            'op if_then{_}else{_} : Bool Nat&Err Nat&Err -> Nat&Err': '值上的 if-then-else（结果可能是 errNat）。',
            'op if_then{_}else{_} : Bool Bool Bool -> Bool': '布尔值上的 if-then-else。同一个名字声明了三次，这叫重载。',
            'op singleton : Qid Nat -> Table': '造一张只有一个条目的表。',
            'op isReg : Table Qid -> Bool': '键是否已登记（is registered）。',
            'op lookup : Table Qid -> Nat&Err': '查键对应的值；查不到时返回错误值，所以结果类型是 Nat&amp;Err。',
            'op update : Table Qid Nat -> Table': '有则改、无则加。',
            'op insert : Table Qid Nat -> Table&Err': '只加不改：键已存在时返回 errTable。',
            'op remove : Table Qid -> Table': '删掉某个键；键不存在也不报错。',
            'op delete : Table Qid -> Table&Err': '删掉某个键；键不存在时返回 errTable。',
            'vars K K2 : Qid': '键变量。',
            'vars V V2 : Nat': '值变量。',
            'var T : Table': '表变量。',
            'vars T1 T2 : Table&Err': 'if-then-else 里用的变量（可能是错误表）。',
            'vars N1 N2 : Nat&Err': 'if-then-else 里用的变量（可能是 errNat）。',
            'vars B1 B2 : Bool': 'if-then-else 里用的布尔变量。',
            'eq if true then {T1} else {T2} = T1 .': '条件为 true 取第一个分支。',
            'eq if false then {T1} else {T2} = T2 .': '条件为 false 取第二个分支。',
            'eq if true then {N1} else {N2} = N1 .': '同上（值的版本）。',
            'eq if false then {N1} else {N2} = N2 .': '同上（值的版本）。',
            'eq if true then {B1} else {B2} = B1 .': '同上（布尔的版本）。',
            'eq if false then {B1} else {B2} = B2 .': '同上（布尔的版本）。',
            'eq singleton(K,V) = (K,V) | empTable .': '单个条目接到空表前面。',
            'eq isReg(empTable,K2) = false .': '空表里什么键都没有。',
            'eq isReg((K,V) | T,K2) = if K == K2 then {true} else {isReg(T,K2)} .': '看第一个条目的键是不是 K2；不是就去剩下的表里找。',
            'eq lookup(empTable,K2) = errNat .': '讲义：查不到时返回错误值（讲义写作 err.V，这里值是 Nat，所以是 errNat）。',
            'eq lookup((K,V) | T,K2) = if K == K2 then {V} else {lookup(T,K2)} .': '命中就返回值 V，否则继续往后找。',
            'eq update(empTable,K2,V2) = (K2,V2) | empTable .': '键不存在：在表里新加一个条目。',
            'eq update((K,V) | T,K2,V2) = if K == K2 then {(K,V2) | T} else {(K,V) | update(T,K2,V2)} .': '命中就把值换成 V2，否则保留这个条目、继续往后找。',
            'eq insert(T,K2,V2) = if isReg(T,K2) then {errTable} else {(K2,V2) | T} .': '讲义：键已存在时返回 errTable，否则加到前面。这是 insert 和 update 的关键区别。',
            'eq remove(empTable,K2) = empTable .': '空表删什么都还是空表。',
            'eq remove((K,V) | T,K2) = if K == K2 then {T} else {(K,V) | remove(T,K2)} .': '命中就扔掉这个条目。',
            'eq delete(T,K2) = if isReg(T,K2) then {remove(T,K2)} else {errTable} .': '和 remove 的区别：键不存在时返回 errTable。',
            '}': '模块结束。',
            'open TABLE-DEMO .': '打开模块，开始试算。',
            'red isReg((\'a,1) | (\'b,2) | empTable,\'a) .': '\'a 在表里，结果 true。',
            'red isReg((\'a,1) | (\'b,2) | empTable,\'c) .': '\'c 不在表里，结果 false。',
            'red lookup((\'a,1) | (\'b,2) | empTable,\'b) .': '查 \'b，结果 2。',
            'red lookup((\'a,1) | empTable,\'z) .': '查不到 \'z，结果 errNat（错误值）。',
            'red update((\'a,1) | (\'b,2) | empTable,\'a,99) .': '\'a 已存在：把值改成 99。',
            'red update((\'a,1) | empTable,\'c,3) .': '\'c 不存在：加到表里。',
            'red insert((\'a,1) | empTable,\'a,5) .': '\'a 已存在，insert 返回 errTable。',
            'red insert((\'a,1) | empTable,\'b,5) .': '\'b 不存在，正常加入。',
            'red remove((\'a,1) | (\'b,2) | empTable,\'a) .': '删掉 \'a。',
            'red delete((\'a,1) | empTable,\'z) .': '\'z 不存在，delete 返回 errTable。',
            'close': '退出试算。'
          }) +
          '<div class="card"><div class="card-t"><span class="ico">📌</span>七个操作速记</div>' +
          '<table><tr><th>操作</th><th>作用</th><th>关键等式</th></tr>' +
          '<tr><td><code>singleton</code></td><td>造只有一个条目的表</td><td><code>= (K,V) | empT</code></td></tr>' +
          '<tr><td><code>isReg</code></td><td>键是否已登记</td><td>空 → false；命中 → true</td></tr>' +
          '<tr><td><code>lookup</code></td><td>查值</td><td>空 → 错误值（errNat）；命中 → V</td></tr>' +
          '<tr><td><code>update</code></td><td>有则改，无则加</td><td>空 → 新建；命中 → 替换</td></tr>' +
          '<tr><td><code>insert</code></td><td>只加不改（已存在则返回 errTable）</td><td><code>if isReg(T,K2) then {errTable} else {(K2,V2) | T}</code></td></tr>' +
          '<tr><td><code>remove</code></td><td>删掉某个键（不存在也不报错）</td><td>命中 → T（扔掉该条目）</td></tr>' +
          '<tr><td><code>delete</code></td><td>删掉（不存在则返回 errTable）</td><td><code>if isReg(T,K2) then {remove(T,K2)} else {errTable}</code></td></tr></table></div>' +
          '<div class="card warn"><div class="card-t"><span class="ico">⚠️</span>update vs insert 的区别</div>' +
          '<p><code>update</code> 无论键在不在都能用（在就改，不在就加）；<code>insert</code> 在键已存在时返回错误。' +
          '这是考试最爱出的辨析题。</p></div>'
      },
      {
        id: 'L5.s4', title: '计费程序：表的一个真实应用',
        guide: {
          what: '用商品目录（表）和购物车（列表）算出账单。',
          why: '把表、列表、递归、元组放在一起用，结构很像考试题。',
          how: '对购物车里每个 (商品, 数量)，用 lookup 在目录里查名字和单价，算出小计，最后加总。',
          use: '电商结账、超市收银系统做的就是这件事。',
          pitfalls: ['同一种商品在购物车里出现两次时，账单里要合并成一个条目']
        },
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
      { q: '热身：表最像 Python 里的什么？', opts: ['list', 'dict', 'tuple', 'set'], a: 1, why: '表就是「键 → 值」的映射，键不重复。',
        optWhy: ['list 没有键', '正确', 'tuple 是固定长度的组合', 'set 只有键没有值'] },
      { q: '讲义里，<code>insert</code> 一个已经存在的键会得到什么？', opts: ['原表', '<code>errTable</code>', '值被覆盖', '空表'], a: 1, why: '<code>eq insert(T,K2,V2) = if isReg(T,K2) then {errTable} else {(K2,V2) | T} .</code>',
        optWhy: ['讲义规定返回错误表，不是原表', '正确', '覆盖是 update 的行为', '不会清空表'] },
      { q: '一张表由什么组成？', opts: ['只是一组值', '键的子集 A′ 加一个函数 f : A′ → B', '两个列表', '一个多重集'], a: 1, why: '表 = 键集合 + 映射。',
        optWhy: ['还要有键', '正确', '「两个列表」不能保证键和值一一对应', '多重集允许重复，表的键不能重复'] },
      { q: '<code>update</code> 与 <code>insert</code> 的关键差别？', opts: ['没有差别', 'update 有则改、无则加；insert 在键已存在时返回错误', 'insert 更快', 'update 只能用在空表'], a: 1, why: '这是最常考的辨析点。',
        optWhy: ['差别正是考点', '正确', '速度一样', 'update 对任何表都能用'] },
      { q: '<code>eq (K,err.V) = errEntry .</code> 的作用是？', opts: ['阻止错误', '把错误从值传播到条目，使错误在结构中一路传出去', '删除条目', '排序声明'], a: 1, why: '错误传播（error propagation）模式。',
        optWhy: ['它不阻止错误，而是把错误传出去', '正确', '它不删除条目', '排序声明写在方括号里'] }
    ]
  };
  QZ['L5-quiz'] = {
    title: 'L5 综合测验',
    items: [
      { q: '用列表表示表时，必须满足的不变量是？', opts: ['键递增', '键互不相同', '值递增', '长度固定'], a: 1, why: '否则同一个键会有两个值。',
        optWhy: ['表不要求键有顺序', '正确', '值可以任意', '表可以有任意多个条目'] },
      { q: '<code>lookup(empTable,K2)</code> 应该返回？', opts: ['0', '错误值 <code>err.V</code>', '空表', 'true'], a: 1, why: '键不存在是错误，用错误值表示。',
        optWhy: ['讲义规定返回错误值，不是 0（0 是合法的值，没法和「查不到」区分）', '正确', '查值的结果是值，不是表', '这是 isReg 的结果类型'] },
      { q: '计费程序里购物车 <code>(\'o,4) | (\'t,10) | (\'o,6) | nil</code> 中 orange 的总数量是？', opts: ['4', '6', '10', '两个条目'], a: 2, why: '4 + 6 = 10，账单里合并成一个条目 ("orange",10,1000)。',
        optWhy: ['漏了后面的 6 个', '漏了前面的 4 个', '正确', '账单会把同一种商品合并成一个条目'] },
      { q: '第 8 章解释器的「环境」本质上是什么？', opts: ['一个列表', '一张从变量到值的表', '一个栈', '一个虚拟机'], a: 1, why: '环境 = 变量 → 值的表，所以本课先讲表再讲解释器。',
        optWhy: ['环境要保证变量不重复，比列表多一条要求', '正确', '栈是第 9 章虚拟机用的', '虚拟机是第 9 章的内容'] }
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
