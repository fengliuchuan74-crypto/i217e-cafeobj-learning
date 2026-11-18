/* =====================================================================
 * content-pre.js — P0 前置知识：零基础从这里开始
 * 交互实验的实现在 pre-labs.js / pre-labs2.js
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function cb(id, src, cap, notes) {
    if (notes) (window.CODE_NOTES = window.CODE_NOTES || {})[id] = notes;
    return '<div class="codebox" id="' + id + '">' +
      '<div class="codebox-h"><span>' + esc(cap || 'CafeOBJ') + '</span>' +
      '<button class="btn-run" data-run="' + id + '">▶ 运行</button></div>' +
      '<pre>' + esc(src) + '</pre>' +
      '<div class="run-out">点「运行」，本机引擎会真的执行这段代码</div></div>';
  }
  function lab(id) { return '<div class="lab" id="' + id + '"></div>'; }

  CH.push({
    id: 'P0', num: 'P0', group: '第 0 部分 · 导学', short: '前置知识：零基础从这里开始',
    title: '前置知识：零基础从这里开始',
    sub: '不需要任何 CafeOBJ 基础。先用 7 个交互实验看看这门课的知识用在哪里，再补最少的数学准备，最后学会读一段 CafeOBJ 代码。',
    minutes: 60,
    pre: ['会一点点 Python（知道函数、if、递归是什么）就够了', '不会也没关系：每个概念都会先给生活里的例子'],
    goals: [
      '说出这门课每一部分在现实里用在哪里，并亲手玩过对应的实验',
      '知道函数、集合、递归、归纳法这 4 个数学概念的大白话意思',
      '能逐行读懂一段最简单的 CafeOBJ 代码，知道每个符号是什么意思'
    ],
    sections: [
      {
        id: 'P0.s1', title: '这门课学的东西，现实里用在哪？',
        guide: {
          what: '这门课教的是「用规则描述程序、按规则化简来计算、用推理证明程序永远正确」。',
          why: '先知道学了有什么用，后面学细节时才知道自己在干什么。',
          how: '下面每张卡片对应课程的一部分。有 ▶ 的卡片，本章下面有可以动手玩的实验。',
          use: '编译器、Python/Java 虚拟机、数据库、操作系统内核、芯片设计、云服务的安全检查。'
        },
        html: '<p class="lead">很多人第一次看到 CafeOBJ 会觉得：这语言没人用，学它干什么？其实它只是一个<b>教学工具</b>。课程真正教的是几种思想，而这些思想在你每天用的软件里到处都是。</p>' +
          lab('w-p0-apps') +
          '<div class="card why"><div class="card-t"><span class="ico">💡</span>一句话记住这门课</div>' +
          '<p><b>用等式写程序，用重写来执行，用归纳来证明它是对的。</b>后面每一章都是在展开这句话。</p></div>'
      },
      {
        id: 'P0.s2', title: '最少的数学准备：4 个概念',
        guide: {
          what: '函数、集合（类型）、递归、归纳法。这门课的数学只用到这些。',
          why: 'CafeOBJ 的代码就是用这 4 个概念写成的，不认识它们就看不懂代码。',
          how: '每个概念先看大白话，再看 Python 对照，最后看 CafeOBJ 里长什么样。',
          pitfalls: ['把「排序 sort」理解成「排序算法」。这里 sort 只是「类型」的意思', '以为 CafeOBJ 的变量能被修改。它的变量只是占位符，像数学里的 x']
        },
        html: '<table><tr><th>概念</th><th>大白话</th><th>Python 里</th><th>CafeOBJ 里</th></tr>' +
          '<tr><td><b>集合 / 类型</b></td><td>一类东西的全体，比如「所有自然数」</td><td><code>int</code></td><td><code>[Nat]</code>（叫 sort）</td></tr>' +
          '<tr><td><b>函数</b></td><td>给它输入，它给你输出，同样的输入永远得到同样的输出</td><td><code>def f(x: int) -&gt; int</code></td><td><code>op f : Nat -&gt; Nat</code></td></tr>' +
          '<tr><td><b>递归</b></td><td>用「更小的自己」来定义自己：先写最简单的情况，再写「大的怎么变成小的」</td><td><code>def fact(n): return 1 if n == 0 else n * fact(n-1)</code></td><td><code>eq fact(0) = 1 .</code><br><code>eq fact(s N) = s N * fact(N) .</code></td></tr>' +
          '<tr><td><b>归纳法</b></td><td>证明「对所有数都成立」：① 对 0 成立；② 对 n 成立就能推出对 n+1 成立</td><td>（Python 没有）</td><td>证明分数（L11）</td></tr></table>' +
          '<div class="card"><div class="card-t"><span class="ico">🔢</span>为什么课里把 2 写成 s(s(0))？</div>' +
          '<p>课里经常不用 1、2、3，而是只用 <code>0</code> 和「加一」<code>s</code>：<code>s(0)</code> 是 1，<code>s(s(0))</code> 是 2。这叫<b>皮亚诺自然数</b>。</p>' +
          '<p>好处是每个数的「结构」一目了然：任何自然数要么是 <code>0</code>，要么是 <code>s(某个更小的数)</code>。递归和归纳正好就是按这两种情况来写的。' +
          '等你导入内置模块 <code>pr(NAT)</code> 以后，就可以直接写普通数字了。</p></div>' +
          '<div class="card tip"><div class="card-t"><span class="ico">🐍</span>最大的思维转变</div>' +
          '<p>Python 是「告诉电脑一步步做什么」（改变量、循环）。CafeOBJ 是「告诉电脑什么等于什么」，电脑自己用这些等式把式子化简到底。下一节的实验会让你亲眼看到这个过程。</p></div>'
      },
      {
        id: 'P0.s3', title: '实验 ①：化简器（看懂「项重写」）',
        guide: {
          what: '按规则一步步把式子换成更简单的式子，直到换不动为止。',
          why: '这就是 CafeOBJ「计算」的全部方式，L3 整章都在讲它。',
          how: '选一个式子，点「下一步」。每一步分两拍：① 找到能用规则的那一块（橙色）；② 按规则换掉（绿色）。',
          use: '编译器优化（把 x*1 换成 x、把 x-x 换成 0）、SymPy 化简公式、数据库优化 SQL 查询。',
          pitfalls: ['以为规则可以从右往左用。系统只会从左往右用', '最后一个例子 (a + b) - (b + a)：没有交换律规则时，系统不知道 a + b 和 b + a 是一回事']
        },
        html: lab('w-p0-simp') +
          '<div class="card"><div class="card-t"><span class="ico">🔍</span>试试这几件事</div><ul>' +
          '<li>把规则 <b>mul0</b> 的勾去掉，再化简 <code>(a * 1) + (b * 0)</code>：结果停在 <code>a + b * 0</code>，因为没有规则能处理 <code>b * 0</code> 了。<b>缺规则 = 算不完</b>，这是写 CafeOBJ 时最常见的问题。</li>' +
          '<li>看第 5、6 个例子：<code>(a + b) - (a + b)</code> 能化成 0，<code>(a + b) - (b + a)</code> 却不行。规则 sub 要求两边<b>长得一模一样</b>。</li>' +
          '<li>注意「位置」：<code>1</code> 是第 1 个参数，<code>2.1</code> 是第 2 个参数的第 1 个参数，<code>ε</code> 是整个式子。L3 会细讲。</li></ul></div>'
      },
      {
        id: 'P0.s4', title: '实验 ②：无限滚动（看懂「惰性求值」）',
        guide: {
          what: '不到真正需要的时候，不去计算。',
          why: '有了它，才能写「所有素数」这种无限长的列表而不卡死。',
          how: '左边每点一次只多算几个；右边试图一次算完全部，永远停不下来。下面可以真的运行 CafeOBJ 的 take(primes, n)。',
          use: 'Python 的生成器（yield）、短视频 App 往下刷才加载、Python 的 a and b（a 为假就不算 b）。',
          pitfalls: ['以为「无限列表」真的存了无限个元素。它只存了「怎么算下一个」']
        },
        html: lab('w-p0-lazy')
      },
      {
        id: 'P0.s5', title: '实验 ③：购物车（看懂「多重集」）',
        guide: {
          what: '可以重复、但不在乎顺序的一堆东西。',
          why: '很多现实数据（购物车、库存、投票）都是这样的，用列表表示会多出「顺序」这个本来不存在的信息。',
          how: '点「打乱顺序」，再点「改数量」，观察同一个购物车为什么会得到不同结果。',
          use: 'Python 的 collections.Counter、电商购物车、仓库库存。',
          pitfalls: ['同一种商品出现两次时，「改它的数量」到底改哪一个？这就是 L7 要修的 bug']
        },
        html: lab('w-p0-cart')
      },
      {
        id: 'P0.s6', title: '实验 ④：编译器 + 虚拟机（程序是怎么跑起来的）',
        guide: {
          what: '编译器把式子翻译成简单指令；虚拟机用一个「栈」一条条执行这些指令。',
          why: 'L8–L10 要用 CafeOBJ 亲手写一个小语言 Minila 的解释器、虚拟机和编译器。先看懂它们在做什么。',
          how: '改一下上面的式子和变量值，点「编译」，再一条条点「执行一条指令」，看栈怎么变化。',
          use: 'Python 和 Java 都先编译成字节码再由虚拟机执行；浏览器的 JavaScript 引擎也是这样。',
          pitfalls: ['减法的顺序：先放进去的是左边的数，取出来时要「下面的 - 上面的」']
        },
        html: lab('w-p0-vm')
      },
      {
        id: 'P0.s7', title: '实验 ⑤⑥：测试 vs 证明，以及归纳法',
        guide: {
          what: '测试是试几个输入；证明是对所有输入一起推理。归纳法是证明「对所有数成立」的标准方法。',
          why: 'L11–L14 是考试分值最高的部分，讲的就是怎么用 CafeOBJ 写证明。',
          how: '先在左边用不同规模测试二分查找，再点右边看证明怎么直接找出 bug。然后玩多米诺骨牌，最后点两个按钮，看真正的 CafeOBJ 归纳证明。',
          use: 'seL4 微内核和 CompCert 编译器有完整的机器检查证明；AWS 用自动推理检查访问权限；芯片设计大量使用形式化验证。',
          pitfalls: ['以为测试全部通过就说明程序是对的', '归纳证明只证了归纳情形、忘了基础情形']
        },
        html: lab('w-p0-proof') + lab('w-p0-domino') +
          '<div class="card"><div class="card-t"><span class="ico">🧠</span>为什么用小写的 x 就能代表「任意数」？</div>' +
          '<p>证明里声明的 <code>op x : -&gt; PNat .</code> 是一个<b>没有任何规则</b>的常量，系统对它一无所知。' +
          '既然对它一无所知还能证出结论，说明证明过程没有用到「x 具体是几」，所以结论对任何数都成立。这个小技巧叫<b>新常量（fresh constant）</b>，L11 会反复用。</p></div>'
      },
      {
        id: 'P0.s8', title: '实验 ⑦：让类型帮你挡住错误',
        guide: {
          what: '把「这个值不能是 0」直接写进类型里。',
          why: '很多 bug（除以 0、对空列表取第一个元素）都可以在运行之前就被类型挡住。',
          how: '点 p 0、p 1、p 2，看系统对 0 和非零数的不同反应。',
          use: 'Rust 的 NonZeroU32、TypeScript 的非空数组类型、数据库字段的 NOT NULL 约束。'
        },
        html: lab('w-p0-type')
      },
      {
        id: 'P0.s9', title: '学会读一段 CafeOBJ 代码',
        guide: {
          what: '一段 CafeOBJ 代码 = 定义模块（类型 + 算子 + 规则）+ 打开模块试算。',
          why: '后面每一章都有这样的代码。这一节读懂了，后面就只是换内容。',
          how: '点代码块上的「📖 逐行解读」看每一行的意思；然后直接在代码里改，比如把最后的 red 改成 s(s(0)) + 0，再点「▶ 运行」。',
          pitfalls: ['每条 op / var / eq / red 末尾都要句号，而且句号前要有空格', '模块结尾的右花括号 } 后面不要加句号', '大小写不同就是不同的名字']
        },
        html: '<h3 class="sub">CafeOBJ 符号字典</h3>' +
          '<table><tr><th>写法</th><th>读作</th><th>相当于 Python 的</th></tr>' +
          '<tr><td><code>mod! 名字 { ... }</code></td><td>定义一个模块</td><td>一个 .py 文件</td></tr>' +
          '<tr><td><code>[Nat]</code></td><td>声明类型 Nat</td><td><code>class Nat</code></td></tr>' +
          '<tr><td><code>[NzNat &lt; Nat]</code></td><td>NzNat 是 Nat 的一部分</td><td>子类</td></tr>' +
          '<tr><td><code>op f : A B -&gt; C</code></td><td>f 吃一个 A 和一个 B，吐出一个 C</td><td><code>def f(a: A, b: B) -&gt; C</code></td></tr>' +
          '<tr><td><code>op _+_ : ...</code></td><td><code>_</code> 标出参数位置，写作 <code>X + Y</code></td><td>运算符重载 <code>__add__</code></td></tr>' +
          '<tr><td><code>op 0 : -&gt; Nat</code></td><td>没有输入的算子 = 常量</td><td>常量</td></tr>' +
          '<tr><td><code>{constr}</code></td><td>构造子：只搭数据，不再计算</td><td>dataclass 的构造函数</td></tr>' +
          '<tr><td><code>vars X Y : Nat</code></td><td>X、Y 代表任意的 Nat</td><td>函数形参</td></tr>' +
          '<tr><td><code>eq 左 = 右 .</code></td><td>规则：左边可以换成右边</td><td><code>if 参数像左边: return 右边</code></td></tr>' +
          '<tr><td><code>ceq 左 = 右 if 条件 .</code></td><td>条件成立时才能换</td><td>带 if 的分支</td></tr>' +
          '<tr><td><code>open M .</code> … <code>close</code></td><td>进入 / 退出试算模式</td><td>进入交互式命令行</td></tr>' +
          '<tr><td><code>red 式子 .</code></td><td>把式子化简到底并打印</td><td><code>print(式子)</code></td></tr>' +
          '<tr><td><code>pr(NAT)</code></td><td>导入内置自然数模块</td><td><code>import</code></td></tr>' +
          '<tr><td><code>-- 文字</code></td><td>注释</td><td><code># 文字</code></td></tr></table>' +
          '<h3 class="sub">完整读一遍：用「加一」定义加法</h3>' +
          cb('w-p0-read', 'mod! MY-ADD {\n  [PNat]\n  op 0 : -> PNat {constr}\n  op s_ : PNat -> PNat {constr}\n  op _+_ : PNat PNat -> PNat\n  vars X Y : PNat\n  eq 0 + Y = Y .\n  eq s X + Y = s(X + Y) .\n}\nopen MY-ADD .\nred s s 0 + s s s 0 .\nclose', '逐行解读示例：2 + 3', {
            'mod! MY-ADD {': '定义一个模块，名字叫 MY-ADD。<code>{</code> 后面是模块的内容。',
            '[PNat]': '声明一种类型，叫 PNat（Peano Natural number，皮亚诺自然数）。',
            'op 0 : -> PNat {constr}': '声明常量 <code>0</code>，类型是 PNat。箭头左边是空的，表示它不需要输入。<code>{constr}</code> 说明它是「积木」（构造子）。',
            'op s_ : PNat -> PNat {constr}': '声明「加一」<code>s</code>：输入一个 PNat，输出一个 PNat。下划线在 s 后面，表示参数写在 s 后面：<code>s 0</code> 就是 1，<code>s s 0</code> 就是 2。它也是积木。',
            'op _+_ : PNat PNat -> PNat': '声明加法：输入两个 PNat，输出一个 PNat。两个下划线表示参数写在 + 的两边：<code>X + Y</code>。它不是积木，因为它要被规则算掉。',
            'vars X Y : PNat': '声明两个变量 X 和 Y，代表「任意一个 PNat」。',
            'eq 0 + Y = Y .': '规则 1：0 加任何数 Y，等于 Y。末尾的句号表示这条规则写完了。',
            'eq s X + Y = s(X + Y) .': '规则 2：(X 加一) + Y，等于 (X + Y) 再加一。每用一次，左边的数就少一个 s，所以最后一定会用到规则 1。',
            '}': '模块定义结束。注意这里不加句号。',
            'open MY-ADD .': '打开模块，准备试算。',
            'red s s 0 + s s s 0 .': '计算 2 + 3。',
            'close': '退出试算。',
            __py: 'def add(x, y):\n    if x == 0:            # 规则 1\n        return y\n    return add(x - 1, y) + 1   # 规则 2：(x-1+1) + y = (x-1 + y) + 1',
            __steps: '<code>s s 0 + s s s 0</code><br>→ <code>s(s 0 + s s s 0)</code>　（规则 2，X = s 0）<br>→ <code>s s(0 + s s s 0)</code>　（规则 2，X = 0）<br>→ <code>s s s s s 0</code>　（规则 1，Y = s s s 0）<br>结果有 5 个 s，就是 5。'
          }) +
          '<div class="card tip"><div class="card-t"><span class="ico">✏️</span>动手改一改</div><ul>' +
          '<li>把最后的 <code>red</code> 改成 <code>red 0 + s 0 .</code>，预测结果，再运行验证。</li>' +
          '<li>故意删掉 <code>eq 0 + Y = Y .</code> 末尾的句号，运行看看提示。</li>' +
          '<li>把规则 1 整行删掉，看结果为什么会停在一个没算完的式子上。</li></ul></div>'
      }
    ],
    summary: [
      '这门课 = 用等式写程序 + 用重写来计算 + 用归纳来证明',
      '重写：找到能和规则左边对上的一块（redex），按右边换掉，重复到换不动（范式）',
      '惰性求值让「无限长的列表」成为可能；多重集是不在乎顺序的集合；编译器把式子翻译成虚拟机的指令',
      '测试只能检查部分输入，证明覆盖全部输入；归纳法 = 基础情形 + 归纳情形',
      '读代码看 4 样：类型 [ ]、算子 op、变量 vars、规则 eq'
    ],
    quiz: 'P0-quiz'
  });

  QZ['P0-quiz'] = {
    title: 'P0 前置知识 · 小测',
    items: [
      { q: '热身：CafeOBJ 里 <code>[Nat]</code> 的意思是？', opts: ['把 Nat 排个序', '声明一种叫 Nat 的类型', '定义一个列表', '注释'], a: 1, why: '方括号用来声明类型（sort）。sort 在这里的意思是「类型」，和排序算法无关。',
        optWhy: ['sort 这个词容易让人误会成排序，这里它只是「类型」', '正确：<code>[Nat]</code> 声明了类型 Nat', '列表要另外定义，比如 L2 的 NatList', 'CafeOBJ 的注释是 <code>--</code> 开头'] },
      { q: '热身：<code>s(s(s(0)))</code> 表示几？', opts: ['0', '1', '3', '无法确定'], a: 2, why: '每个 s 表示「加一」，三个 s 就是 3。',
        optWhy: ['最里面的 0 外面还套了 3 个 s', '只套一个 s 才是 1', '正确：三个 s 就是 0 加了三次一', 'Peano 写法每个数都是确定的'] },
      { q: '在化简器里，规则 <code>E * 1 = E</code> 能把 <code>(a + b) * 1</code> 化简成什么？', opts: ['a + b', '1', 'a', '不能化简'], a: 0, why: 'E 是变量，可以对上任何式子。这里 E = a + b，替换后得到 a + b。',
        optWhy: ['正确：E 对上了 (a + b)，换成右边的 E 就是 a + b', '右边是 E，不是 1', 'E 对上的是整个 a + b，不是只有 a', '变量 E 可以对上任何式子，包括 a + b'] },
      { q: '为什么规则 <code>E - E = 0</code> 不能化简 <code>(a + b) - (b + a)</code>？', opts: ['因为减法不能化简', '因为两边不是完全相同的式子，而系统不知道加法可以交换', '因为 E 只能对上单个字母', '因为规则写错了'], a: 1, why: 'E 出现了两次，所以两边必须对上同一个式子。a + b 和 b + a 写法不同，除非告诉系统加法满足交换律（comm）。',
        optWhy: ['(a + b) - (a + b) 就能化简，说明减法本身没问题', '正确：两边必须一模一样；交换律要另外声明', 'E 可以对上任何式子', '规则本身没错，它对 (a+b) - (a+b) 是有效的'] },
      { q: '「无限长的素数列表」不会让程序卡死，靠的是：', opts: ['电脑内存足够大', '惰性求值：只在需要时才计算下一个', '素数其实是有限的', '程序会自动跳过'], a: 1, why: '惰性求值只算真正用到的部分。CafeOBJ 里用 <code>{strat: (1 0)}</code> 让列表的「尾巴」暂时不算。',
        optWhy: ['内存再大也装不下无穷多个数', '正确', '素数有无穷多个（欧几里得早就证明了）', '没有「自动跳过」这回事，是靠求值策略控制的'] },
      { q: '归纳证明「对所有自然数成立」需要哪两步？', opts: ['随机测试 1000 次', '基础情形（0 成立）+ 归纳情形（n 成立能推出 n+1 成立）', '只证明 n+1 的情况', '证明 0、1、2 三个数'], a: 1, why: '就像多米诺骨牌：第一块会倒，并且每一块都能推倒下一块，所以全部会倒。',
        optWhy: ['测试只能检查部分输入，不是证明', '正确', '没有基础情形，第一块骨牌不会倒', '只证了 3 个数，第 4 个呢？'] }
    ]
  };
})();
