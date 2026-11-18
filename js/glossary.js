/* =====================================================================
 * glossary.js — 全站术语表
 * 每条：t 术语（主名）, k 页面里可能出现的写法（用于自动加悬停解释）,
 *       d 大白话解释, py 用 Python/日常的话类比（可选）, ch 在哪一章细讲
 * 课文里第一次出现这些词时，鼠标停上去就能看到解释；顶部「📘 术语表」可以全部查看。
 * ===================================================================== */
(function () {
  'use strict';
  window.GLOSSARY = [
    /* ---------- L1 基础 ---------- */
    { t: 'CafeOBJ', k: ['CafeOBJ'], ch: 'L0', d: '这门课用的语言。你写「等式」，它用等式把式子一步步化简来得到结果，还能拿等式做证明。', py: '有点像只允许写 return 的 Python 函数，而且每个函数都写成「左边 = 右边」的规则。' },
    { t: '模块 module', k: ['模块', 'module', 'mod!', 'mod*'], ch: 'L1', d: '把一组类型、算子、等式打包在一起的单位。<code>mod! 名字 { ... }</code>。<code>mod!</code> 表示数据只能由构造子拼出来（初始语义）；<code>mod*</code> 表示宽松的（松散语义），常用于参数。', py: '相当于一个 .py 文件或一个类。' },
    { t: '排序 sort', k: ['排序', 'sort', 'sorts'], ch: 'L1', d: 'CafeOBJ 里的「类型」。写在方括号里：<code>[Nat]</code> 表示声明一个类型 Nat。注意这里的「排序」和「排序算法」没有关系，只是 sort 一词的译名。', py: '类似 Python 的 int、str 这种类型名。' },
    { t: '算子 operator', k: ['算子', 'operator', 'operators'], ch: 'L1', d: '函数或常量。<code>op f : A B -&gt; C</code> 表示 f 吃一个 A 和一个 B，吐出一个 C。没有输入的算子就是常量，如 <code>op 0 : -&gt; Nat</code>。', py: 'def f(a: A, b: B) -&gt; C'},
    { t: '下划线 _（mixfix）', k: ['mixfix'], ch: 'L1', d: '算子名里的 <code>_</code> 标出参数写在哪里。<code>_+_</code> 写作 <code>X + Y</code>；<code>s_</code> 写作 <code>s X</code>（前缀）；<code>if_then_else_fi</code> 写作 <code>if A then B else C fi</code>。', py: '像在模板里挖空，空格处填参数。' },
    { t: '签名 / rank', k: ['签名', 'signature', 'rank'], ch: 'L1', d: '一个算子的「输入类型 → 输出类型」，例如 <code>Nat Nat -&gt; Nat</code>。', py: '函数的类型注解。' },
    { t: '项 term', k: ['项', 'term', 'terms'], ch: 'L1', d: '由算子和变量拼起来的式子，例如 <code>s(0) + X</code>。每个项都可以画成一棵树：根是最外层的算子，孩子是它的参数。', py: '一个表达式，比如 add(succ(0), x)。' },
    { t: '基项 ground term', k: ['基项', 'ground term'], ch: 'L1', d: '不含变量的项，例如 <code>s(s(0))</code>。只有基项才能算出确定的值。' },
    { t: '构造子 constructor', k: ['构造子', 'constructor', 'constr'], ch: 'L1', d: '用来「搭数据」的算子，标 <code>{constr}</code>。例如 <code>0</code> 和 <code>s_</code> 搭出所有自然数。构造子本身不会被再算下去，它就是结果的形状。', py: '像 dataclass 的构造函数，只负责装数据。' },
    { t: '等式 equation', k: ['等式', 'equation', 'eq'], ch: 'L1', d: '<code>eq 左 = 右 .</code> 一条规则：凡是能和「左」对上的式子，都可以换成「右」。系统只会从左往右用。末尾的句号不能少。', py: '一条 if 分支：if 参数长这样: return 那样。' },
    { t: '变量 variable', k: ['变量', 'variable', 'vars', 'var'], ch: 'L1', d: '等式里的占位符，表示「任意一个该类型的值」。用 <code>vars X Y : Nat</code> 声明，习惯上大写。它和 Python 的变量不同，不能被赋值修改。', py: '函数的形参。' },
    { t: '皮亚诺自然数', k: ['皮亚诺', 'Peano'], ch: 'L1', d: '只用 <code>0</code> 和「加一」<code>s</code> 表示所有自然数：<code>s(0)</code> 是 1，<code>s(s(0))</code> 是 2。这样每个数都有清楚的结构，方便做归纳证明。' },
    { t: '优先级 prec', k: ['prec', '优先级'], ch: 'L1', d: '<code>{prec: n}</code>：数字越小绑定越紧。<code>*</code> 的 prec 要比 <code>+</code> 小，这样 <code>1 + 2 * 3</code> 才会读成 <code>1 + (2 * 3)</code>。', py: '和数学里「先乘除后加减」一样。' },
    { t: '导入 pr(…)', k: ['protecting', 'pr('], ch: 'L2', d: '<code>pr(NAT)</code> 把别的模块导进来，并保证不破坏它原来的含义。导入内置 NAT 以后就能直接写 1、2、3。', py: 'import' },
    /* ---------- L2 ---------- */
    { t: '子排序 subsort', k: ['子排序', 'subsort'], ch: 'L2', d: '<code>[NzNat &lt; Nat]</code> 表示「非零自然数」是「自然数」的一部分。凡是要 Nat 的地方都能放 NzNat，反过来不行。', py: '像子类：Dog 是 Animal 的子类。' },
    { t: '阶排序 order-sorted', k: ['阶排序', 'order-sorted', '排序格', 'lattice'], ch: 'L2', d: '类型之间有大小（包含）关系的类型系统。把这些包含关系画出来，就是一张「格」图：上面的类型大，下面的类型小。' },
    { t: 'NzNat', k: ['NzNat'], ch: 'L2', d: '非零自然数（1、2、3…）。用它声明「减一」<code>p_ : NzNat -&gt; Nat</code>，系统就不会接受 <code>p 0</code>。', py: 'Rust 的 NonZeroU32。' },
    { t: 'kind / 错误项', k: ['kind', 'ErrNat'], ch: 'L2', d: '当一个式子类型不对（例如 <code>p 0</code>）时，系统不直接报错，而是把它放到一个更大的「错误类型」里（kind，写作 <code>[Nat]</code> 或 ErrNat）。你可以把它理解成「出错了的 Nat」。' },
    { t: '重载 overloading', k: ['重载', 'overload'], ch: 'L2', d: '同一个名字（如 <code>_+_</code>）在不同类型上有不同的声明。系统会选「最贴切」的那个（least rank）。' },
    { t: '列表 list', k: ['NatList', 'NnNatList', '列表'], ch: 'L2', d: '<code>1 | 2 | nil</code>：<code>|</code> 把一个元素接到列表前面，<code>nil</code> 是空列表。NnNatList 是「非空列表」，hd/tl 只对它有意义。', py: '[1, 2]' },
    /* ---------- L3 ---------- */
    { t: '位置 position', k: ['位置', 'position'], ch: 'L3', d: '项树里某个节点的「门牌号」。根是 ε，根的第 1 个孩子是 1，它的第 2 个孩子是 1.2。' },
    { t: '替换 σ substitution', k: ['替换', 'substitution', 'σ'], ch: 'L3', d: '匹配成功后得到的「变量 = 具体值」对照表。比如用 <code>s(X) + Y</code> 去对 <code>s(0) + s(0)</code>，得到 σ = {X ↦ 0, Y ↦ s(0)}。', py: '一个 dict：{"X": 0, "Y": 1}' },
    { t: 'redex 可约式', k: ['redex', 'redexes', '可约式'], ch: 'L3', d: '项里「能和某条等式左边对上」的那一块子式子。重写就是找到 redex，把它换掉。' },
    { t: 'contractum', k: ['contract', 'contractum'], ch: 'L3', d: '把 redex 按等式右边换掉以后得到的那块新式子。' },
    { t: '一步重写 one-step rewrite', k: ['一步重写', 'one-step', 'rewrite', 'rewriting', '重写'], ch: 'L3', d: '找一个 redex，用一条等式把它换掉，得到一个新项。重复做这件事就是计算。' },
    { t: '归约 reduction / red', k: ['归约', 'reduction', 'red'], ch: 'L3', d: '不停地做一步重写，直到换不动为止。命令 <code>red 项 .</code> 就是让系统做这件事并打印结果。' },
    { t: '范式 normal form', k: ['范式', 'normal form'], ch: 'L3', d: '已经没有 redex、换不动了的项，也就是最终结果。' },
    { t: '终止 termination', k: ['终止', 'termination', 'terminating'], ch: 'L3', d: '不管怎么换，总会在有限步内停下来。不终止就像死循环。' },
    { t: '合流 confluence', k: ['合流', 'confluence', 'confluent'], ch: 'L3', d: '不管先换哪一块，最后得到的结果都一样。终止 + 合流 = 每个项有唯一结果。' },
    { t: 'E-strategy 求值策略', k: ['E-strategy', 'strat', '求值策略', '策略'], ch: 'L3 / L6', d: '<code>{strat: (1 0)}</code> 告诉系统先算哪个参数、什么时候算自己。1 = 先算第 1 个参数，0 = 尝试重写自己。没写进列表的参数不会被主动去算，这就是「惰性」。', py: 'Python 的 a and b：a 为假时 b 根本不算。' },
    { t: '结合律 assoc', k: ['assoc', '结合律'], ch: 'L3', d: '<code>(a b) c = a (b c)</code>，括号怎么加都一样。系统会自动把括号「抹平」。' },
    { t: '交换律 comm', k: ['comm', '交换律'], ch: 'L3', d: '<code>a b = b a</code>，顺序无关。' },
    { t: '单位元 id:', k: ['id:', '单位元'], ch: 'L3 / L7', d: '<code>{id: emp}</code>：和 emp 拼在一起等于没拼，就像加法里的 0。' },
    { t: 'AC 匹配', k: ['AC 匹配', 'AC-matching', 'AC matching', 'AC'], ch: 'L3', d: '在有结合律、交换律的算子上做匹配：不看顺序和括号，只要「元素对得上」就算匹配。所以要尝试很多种拆法。' },
    /* ---------- L4–L7 ---------- */
    { t: '参数化模块', k: ['参数化模块', 'parameterized'], ch: 'L4', d: '带参数的模块，例如 <code>LIST(E :: TRIV)</code>：写一次，再把 E 换成 Nat、换成字符串，就得到不同的列表。', py: '泛型 List[T]' },
    { t: 'view 视图', k: ['view'], ch: 'L4', d: '告诉系统「参数 E 具体用哪个类型、哪个算子来填」的映射说明。' },
    { t: 'TRIV', k: ['TRIV'], ch: 'L4', d: '最简单的参数要求：只要求有一个类型 Elt，别的什么都不要。' },
    { t: '表 table', k: ['表', 'table'], ch: 'L5', d: '「键 → 值」的集合，键不能重复。', py: 'dict' },
    { t: '无限列表', k: ['无限列表', 'infinite list'], ch: 'L6', d: '理论上无穷长的列表，例如所有自然数。靠惰性求值，只在需要时才算出前几个。', py: '生成器 generator / itertools.count()' },
    { t: '惰性求值 lazy', k: ['惰性', 'lazy'], ch: 'L6', d: '不到真正需要结果时不去计算。', py: '生成器的 yield' },
    { t: '多重集 multiset', k: ['多重集', 'multiset'], ch: 'L7', d: '允许重复、但不在乎顺序的集合。', py: 'collections.Counter，或购物车' },
    { t: '条件等式 ceq', k: ['ceq', '条件等式'], ch: 'L7', d: '<code>ceq 左 = 右 if 条件 .</code> 只有条件算出 true 时才允许换。条件里用到的变量必须在左边出现过。', py: 'if 条件: return 右' },
    /* ---------- L8–L10 ---------- */
    { t: 'Minila', k: ['Minila'], ch: 'L8', d: '课程自己设计的一个迷你编程语言（有赋值、if、while），用来演示解释器、虚拟机和编译器。' },
    { t: '解释器 interpreter', k: ['解释器', 'interpreter'], ch: 'L8', d: '直接读程序并执行它，边读边算。', py: 'python 命令本身就是一个解释器。' },
    { t: '虚拟机 VM', k: ['虚拟机', 'virtual machine', 'VM'], ch: 'L9', d: '一台用软件模拟的简单「计算机」，只认几条简单指令（压栈、相加、跳转…）。', py: 'Java 的 JVM、Python 的字节码虚拟机。' },
    { t: '栈 stack', k: ['栈', 'stack'], ch: 'L9', d: '只能从顶上放、从顶上取的一摞东西。虚拟机用它存放中间结果。', py: 'list 的 append / pop' },
    { t: '编译器 compiler', k: ['编译器', 'compiler'], ch: 'L10', d: '把程序翻译成另一种（通常更低级的）语言，比如把 Minila 翻译成虚拟机指令。' },
    { t: '相对跳转 jump / jumpOnCond / bjump', k: ['jumpOnCond', 'bjump', '相对跳转'], ch: 'L9 / L10', d: '虚拟机的跳转指令都是「相对」的：<code>jump(n)</code> 让 pc 往前跳 n 条；<code>bjump(n)</code> 让 pc 往回跳 n 条（无条件）；<code>jumpOnCond(n)</code> 在栈顶为真（非 0）时往前跳 n 条，否则执行下一条。编译 if / while 时，编译器用 <code>len(generate(s))</code> 算出每段指令的长度，从而得到跳转距离。' },
    /* ---------- L11–L14 ---------- */
    { t: '结构归纳 structural induction', k: ['结构归纳', '归纳法', 'induction'], ch: 'L11', d: '证明「对所有数（或所有列表）都成立」的方法：① 证最小的情形（0 或 nil）成立；② 假设对 n 成立，证对 s(n) 也成立。就像多米诺骨牌：第一块倒，且每块都能推倒下一块，所以全倒。' },
    { t: '基础情形 base case', k: ['base case', '基础情形'], ch: 'L11', d: '归纳证明的第一步：证明最小的情形（如 0、nil）成立。' },
    { t: '归纳情形 induction case', k: ['induction case', '归纳情形', 'induction step'], ch: 'L11', d: '归纳证明的第二步：在假设 n 成立的前提下，证明 s(n) 也成立。' },
    { t: '归纳假设 IH', k: ['归纳假设', 'IH'], ch: 'L11', d: '在归纳情形里「先假设对 n 成立」的那个假设。在 CafeOBJ 里把它写成一条等式加进去。' },
    { t: '新常量 fresh constant', k: ['新常量', 'fresh constant', 'fresh'], ch: 'L11', d: '证明时声明的、没有任何等式约束的常量（如 <code>op x : -&gt; Nat .</code>）。因为对它一无所知，所以对它证出来的结论对任意值都成立。' },
    { t: '证明分数 proof score', k: ['证明分数', 'proof score', 'proof scores'], ch: 'L11', d: '用 CafeOBJ 代码写的证明：声明新常量、写归纳假设、再用 red 检查目标是否化简成 true。' },
    { t: '引理 lemma', k: ['引理', 'lemma'], ch: 'L11', d: '为了证明主定理而先证明的小定理。red 卡住化不成 true 时，往往说明缺一条引理。' },
    { t: 'CITP 证明助手', k: ['CITP', '证明助手', 'proof assistant'], ch: 'L14', d: '帮你管理证明步骤的工具：你用 <code>:ind</code>（做归纳）、<code>:apply</code>（应用某个证明策略）等命令，它记录还剩哪些目标没证。' },
    { t: '量子比特 qubit', k: ['量子比特', 'qubit'], ch: 'L13', d: '量子计算的基本单位，可以同时处于 0 和 1 的叠加状态。' },
    { t: '量子隐形传态', k: ['隐形传态', 'teleportation'], ch: 'L13', d: '借助纠缠和两比特的经典通信，把一个量子比特的状态「搬」到另一个地方。L13 用 CafeOBJ 证明这套流程一定能恢复原来的状态。' }
  ];
})();
