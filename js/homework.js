/* =====================================================================
 * homework.js — 作业系统 HW1 ~ HW14
 * 每题给出：任务 / 提示 / 评分要点（参考答案折叠）
 * ===================================================================== */
(function () {
  'use strict';
  var CH = (window.CHAPTERS = window.CHAPTERS || []);
  var QZ = (window.QUIZZES = window.QUIZZES || {});
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function draft(id) {
    return '<div style="margin-top:10px"><div class="dim" style="font-size:12px;margin-bottom:4px">' +
      '我的作答草稿（自动保存在本机）：</div>' +
      '<textarea class="hw-draft" data-draft="' + id + '" placeholder="在这里写你的答案 / 代码…"></textarea></div>';
  }
  function task(i, q, hint, ans) {
    var h = '<div style="margin:14px 0;padding:12px 14px;background:#121b28;border:1px solid #223046;border-radius:12px">';
    h += '<div style="font-weight:700;margin-bottom:4px"><span style="color:var(--acc)">' + i + '.</span> ' + q + '</div>';
    if (hint) h += '<div class="dim" style="font-size:12.5px">💡 ' + hint + '</div>';
    if (ans) h += '<details style="margin-top:8px"><summary style="cursor:pointer;font-size:12.5px;color:#8ef0c4">' +
      '展开参考答案要点</summary><div style="margin-top:8px;font-size:13px;color:#c3d6ea;line-height:1.8">' + ans + '</div></details>';
    h += '</div>';
    return h;
  }
  function qcta(id, title) {
    return '<div class="quiz-cta" data-quiz="' + id + '"><span class="q-ico">✅</span>' +
      '<span class="q-txt"><b>' + title + '</b><span>自检：做完作业再测一次</span></span>' +
      '<span class="q-go">开始 →</span></div>';
  }

  var HW = [];
  function add(o) { HW.push(o); }

  add({
    id: 'HW1', title: 'HW1 · 排序、算子、项、等式',
    goals: ['能写出合法的 mod! 模块', '掌握 ops / vars / eq 的写法'],
    guide: {
      what: '用 <code>mod!</code> 从零写一个皮亚诺自然数模块：排序、构造子 <code>0</code> 与 <code>s_</code>、加法 <code>_+_</code>，并找出错误模块里的毛病',
      why: '这是第 1 章全部考点的动手版：模板块、<code>op</code> 声明、变量与等式方向，考试手写模块全靠它',
      how: '先照 L1 的例子默写 MYNAT，再逐条检查句号、下划线与 <code>{constr}</code>，最后做第 4 题的找错，卡住就回看 L1 的代码块',
      pitfalls: ['等式末尾漏句号，引擎会把下一行也吞进同一条等式，解析直接报错', '构造子忘标 <code>{constr}</code>，<code>s(0)</code> 就会被当成还能继续归约的项']
    },
    body: task(1, '写一个模块 <code>MYNAT</code>，用皮亚诺方式定义自然数（<code>0</code> 与 <code>s</code> 为构造子），并定义加法 <code>_+_</code>。',
      '参照 L1 的例子。注意每条声明末尾的句号，以及构造子要写 <code>{constr}</code>。',
      '<div class="codebox"><pre>mod! MYNAT {\n  [Nat]\n  op 0 : -&gt; Nat {constr}\n  op s_ : Nat -&gt; Nat {constr}\n  op _+_ : Nat Nat -&gt; Nat {prec: 33}\n  vars X Y : Nat\n  eq 0 + Y = Y .\n  eq s(X) + Y = s(X + Y) .\n}</pre></div>') +
      task(2, '在 <code>MYNAT</code> 里加一个 <code>_*_</code>（乘法），并解释为什么必须写 <code>prec</code>。',
      '<code>_*_</code> 的 prec 要比 <code>_+_</code> 小（绑定更紧）。',
      '<code>op _*_ : Nat Nat -&gt; Nat {prec: 31}</code>，加 <code>eq 0 * Y = 0 .</code> 和 <code>eq s(X) * Y = (X * Y) + Y .</code>。' +
      '必须写 prec 是因为同时存在 + 和 * 时，解析器需要知道谁先结合；否则括号结构不确定。') +
      task(3, '写出 <code>s(s(s(0)))</code> 的项树结构（根、子项、位置）。',
      '根是一元算子 <code>s_</code>。',
      '根：<code>s(s(s(0)))</code>（位置 ε）；子项 <code>s(s(0))</code>（位置 1）；子项 <code>s(0)</code>（位置 1.1）；子项 <code>0</code>（位置 1.1.1）。') +
      task(4, '下面这段代码有几处错误？<div class="codebox"><pre>mod! BAD {\n  [Nat]\n  op 0 : -&gt; Nat\n  op s : Nat -&gt; Nat\n  eq X = s(0) .\n  eq 0 + Y = Y\n}</pre></div>',
      '逐条检查：构造子、等式左边、句号。',
      '① <code>op 0</code> 与 <code>op s</code> 缺 <code>{constr}</code>（不算硬错误，但语义上应标注）；' +
      '② <code>eq X = s(0)</code> 左边是单变量，非法；' +
      '③ <code>eq 0 + Y = Y</code> 缺句号；④ 没声明变量 <code>X Y</code>；⑤ <code>_+_</code> 未声明就使用。'),
    quiz: 'HW1-q'
  });

  add({
    id: 'HW2', title: 'HW2 · 阶排序与列表',
    goals: ['会写子排序', '会写 hd/tl/len/@ 与递归函数'],
    guide: {
      what: '写 <code>NATLIST</code> 的完整骨架：子排序 <code>Nil NnNatList &lt; NatList</code>、<code>nil</code> 与 <code>_|_</code>，再补 <code>hd</code> 重载、<code>len</code>、<code>@</code> 与 <code>rev</code> 的等式，写完后都要能跑通',
      why: '第 2 章的列表是全课程的地基：第 5 章的表、第 12 章的列表归纳都建在它上面',
      how: '先写骨架并让 <code>len(1|nil)</code> 跑通，再逐个补 <code>rev</code>、<code>sum</code>、<code>maxl</code>，卡住就回看 L2.s4 的 MYLIST 与播放器',
      pitfalls: ['<code>hd(nil)</code> 忘了给错误值，全函数性就断了，空表情形没覆盖', '把 <code>E | L</code> 当成无序集合，忘了列表有先后，<code>rev</code> 会写错']
    },
    body: task(1, '写 <code>NATLIST</code> 的骨架：排序 <code>[Nil NnNatList &lt; NatList]</code>、构造子 <code>nil</code> 与 <code>_|_</code>，以及 <code>hd</code>（重载）、<code>tl</code>、<code>len</code>、<code>@</code>。',
      'hd 要对 nil 返回错误值，所以需要 ErrNat（或至少一个错误常量）。',
      '见 L2.s4 的 MYLIST；重载版本参见引擎内 <code>NATLIST</code>。') +
      task(2, '为什么 <code>hd_</code> 需要重载而不是写一个 <code>hd : NatList -&gt; Nat</code>？',
      '考虑 <code>hd(nil)</code>。',
      '因为 <code>hd(nil)</code> 没有自然的 Nat 值可返回。用重载可以：<code>hd : NnNatList -&gt; Nat</code>（非空时精确返回 Nat）、' +
      '<code>hd : Nil -&gt; ErrNat</code>（空表返回错误值）、<code>hd : NatList -&gt; Nat&amp;Err</code>（一般情形）。' +
      '这既保持了全函数性，又让错误在类型上可见。') +
      task(3, '定义 <code>rev : NatList -&gt; NatList</code>（反转），并写出 <code>rev(1|2|3|nil)</code> 的归约过程。',
      '对 <code>E | L</code>，先把尾巴反转，再把 E 接到末尾（用 @ 和 singleton）。',
      '<code>eq rev(nil) = nil .</code> / <code>eq rev(E | L) = rev(L) @ (E | nil) .</code><br>' +
      'rev(1|2|3|nil) → rev(2|3|nil) @ (1|nil) → (rev(3|nil) @ (2|nil)) @ (1|nil) → … → 3|2|1|nil') +
      task(4, '写 <code>sum : NatList -&gt; Nat</code> 与 <code>maxl : NnNatList -&gt; Nat</code>。',
      'maxl 需要辅助函数 <code>max2 : Nat Nat -&gt; Nat</code>。',
      'sum: <code>eq sum(nil)=0 .</code> / <code>eq sum(E|L)= E + sum(L) .</code><br>' +
      'maxl: <code>eq maxl(E|nil)=E .</code> / <code>eq maxl(E|L)= max2(E,maxl(L)) .</code>，max2 用 if 比较。'),
    quiz: 'HW2-q'
  });

  add({
    id: 'HW3', title: 'HW3 · 项重写（核心作业）',
    goals: ['能手算归约过程', '能写条件等式', '理解 AC 匹配'],
    guide: {
      what: '手算 <code>fact1</code> 的完整归约并标位置，写条件等式 <code>min</code>，解释交换律为何不能用 <code>eq</code> 表达',
      why: '第 3 章是全部考题的基础，redex、位置、AC 匹配这些术语在 L11–L13 的证明里反复出现',
      how: '先在播放器里单步看一遍 <code>fact1</code>，再自己写位置；<code>min</code> 用两条 <code>ceq</code> 覆盖三种情形',
      pitfalls: ['位置层级写错，把 <code>1.1</code> 当成 <code>1.2</code>，归约路径就对不上', '条件里的变量没在左边出现，匹配时无法代入']
    },
    body: task(1, '对 <code>fact1(s(s(s(0))))</code> 写出完整归约过程，标出每一步用的等式和位置。',
      '用 PNAT1 的 fact1。位置从根开始编号。',
      'fact1(s³0) →(f1-2@ε) s³0 * fact1(s²0) →(f1-2@2.2?) … 关键是：每展开一层 fact1，乘法就多一层。' +
      '完整步骤可在本系统 L3 的播放器里看到（选 PNAT1 / fact1）。') +
      task(2, '写一个条件等式版本的 <code>min : Nat Nat -&gt; Nat</code>（用 ceq + 比较），要求覆盖三种情形。',
      '可以用 <code>if</code> 或两条 ceq + 一条 eq。',
      '<code>eq min(X,X) = X .</code>；<code>ceq min(X,Y) = X if X &lt; Y .</code>；<code>ceq min(X,Y) = Y if Y &lt; X .</code>（注意条件变量都在左边出现）。') +
      task(3, '解释为什么 <code>eq X Y = Y X</code> 不能用来表达交换律，而 <code>{comm}</code> 可以。',
      '考虑重写方向。',
      '<code>eq X Y = Y X</code> 会让 <code>a b → b a → a b → …</code> 无限循环，破坏终止性。' +
      '<code>{comm}</code> 不是重写规则，而是交给<b>匹配器</b>处理：匹配时允许两参数互换，不产生新的重写步骤。') +
      task(4, '写出 <code>count(1, (1,2,1,3))</code> 的归约结果，并说明为什么结果与元素顺序无关。',
      '多条路径都到 2。',
      '结果是 2。因为 <code>_ _</code> 是 assoc+comm 的，匹配器对任意顺序都能找到合适的分组，' +
      '而 # 的定义把整个多重集遍历一遍，最终结果只与各元素的键有关，与遍历顺序无关。'),
    quiz: 'HW3-q'
  });

  add({
    id: 'HW4', title: 'HW4 · 参数化模块与视图',
    goals: ['会写 mod* 参数化模块', '会写 view', '理解 renaming'],
    guide: {
      what: '写参数化模块 <code>GLIST(E :: TRIV)</code> 与视图 <code>TRIV2NAT</code>，并解释 renaming 与嵌套实例化的写法',
      why: '第 4 章是送分题：考试必考一段参数化模块加视图，格式固定，练熟就能稳拿分',
      how: '先默写 GLIST 骨架，再写 <code>sort Elt -&gt; Nat</code> 的映射，最后用 L4.s3 的考试模板逐行对照检查',
      pitfalls: ['接口用 <code>mod*</code>、实现用 <code>mod!</code>，两者写反了整个模块都跑不起来', '视图里的映射符号必须是 <code>-&gt;</code>，写成 <code>::</code> 就不再是 view']
    },
    body: task(1, '写参数化模块 <code>GLIST(E :: TRIV)</code>，包含 nil、_|_、len、@。',
      '元素排序写 <code>Elt.E</code>。',
      '见 L4.s3 的考试模板。') +
      task(2, '写 view <code>TRIV2NAT</code>，并说明 <code>GLIST(E &lt;= TRIV2NAT)</code> 的含义。',
      'view 里只有一条 sort 映射。',
      '<code>view TRIV2NAT from TRIV to NAT { sort Elt -&gt; Nat }</code>。含义：把 GLIST 的参数 E 实例化为由 TRIV2NAT 指定的 NAT（即 Elt 当 Nat 用）。') +
      task(3, '解释 <code>pr(PAIR(K,V) * {sort Pair -&gt; Entry})</code> 中 <code>* {...}</code> 的作用。',
      '这是 renaming。',
      '把导入的 PAIR(K,V) 模块中的排序 Pair 改名为 Entry 后再导入，从而复用 PAIR 的所有等式，同时用表自己的术语命名。') +
      task(4, '为什么 TABLE 要用 <code>GLIST-ERR(E &lt;= view from TRIV-ERR to ENTRY {...})</code> 这种嵌套写法？',
      'ENTRY 本身是参数化模块，需要先实例化才能当参数。',
      '因为 GLIST-ERR 的参数要求一个满足 TRIV-ERR 接口的模块，而 ENTRY 是<b>参数化</b>模块（还需要 K 和 V）。' +
      '用一个匿名 view 把 ENTRY 的排序（Entry/ErrEntry/Entry&amp;Err）和算子（err→errEntry）映射到 TRIV-ERR 的接口上，' +
      '就把它「包装」成了一个可用的参数。'),
    quiz: 'HW4-q'
  });

  add({
    id: 'HW5', title: 'HW5 · 表（映射）',
    goals: ['默写 7 个操作', '理解错误处理模式'],
    guide: {
      what: '默写表的 <code>isReg</code>、<code>lookup</code>、<code>update</code>、<code>insert</code>、<code>remove</code>、<code>delete</code> 这七个操作，并解释错误如何向上传播到最外层',
      why: '第 5 章的表是 L8 解释器环境的核心，环境就是变量到值的表，必须先写熟这 7 个操作',
      how: '先写 <code>isReg</code> 与 <code>lookup</code>，再写 <code>update</code>、<code>insert</code>，最后拿计费例子核对结果 1900 和三个条目',
      pitfalls: ['<code>insert</code> 遇到已存在的键要返回错误表，不能直接覆盖', '错误条目没化成 <code>errEntry</code>，错误就传不到外层']
    },
    body: task(1, '写出 <code>isReg</code>、<code>lookup</code>、<code>update</code>、<code>insert</code>、<code>remove</code>、<code>delete</code> 的等式（键用 Qid、值用 Nat 简化）。',
      '参考 L5.s3 的 TABLE-DEMO。',
      '见 L5.s3 的可运行代码。注意 insert 与 delete 需要 isReg 判断。') +
      task(2, '<code>update</code> 与 <code>insert</code> 的语义差别？各举一个使用场景。',
      '一个「有则改无则加」，一个「已存在则报错」。',
      'update：配置项修改（键可能还没有）；insert：注册新用户（重复注册应当报错）。') +
      task(3, '解释 <code>[Entry ErrEntry &lt; Entry&amp;Err]</code> 与 <code>eq (K,err.V) = errEntry .</code> 如何实现「错误传播」。',
      '错误值在结构里向上传递。',
      '当值位置是错误值 <code>err.V</code> 时，等式把整个条目化成 <code>errEntry</code>；' +
      '而 <code>errEntry</code> 属于 <code>Entry&amp;Err</code>，于是含它的列表/表也会被相应等式化成错误表 <code>errTable</code>。错误因此「浮」到最外层。') +
      task(4, '写出计费程序对 <code>(\'o,4)|(\'t,10)|(\'o,6)|nil</code> 的处理结果。',
      '注意 orange 出现两次要合并。',
      '<code>(("orange",10,1000) | ("tomato",10,900) | nil, 1900)</code>。'),
    quiz: 'HW5-q'
  });

  add({
    id: 'HW6', title: 'HW6 · 无限列表（重点）',
    goals: ['会解释 E-strategy', '会写 take/drop/sieve'],
    guide: {
      what: '写无限列表 <code>_|_</code> 的 <code>constr</code>、<code>strat</code>、<code>prec</code> 三个属性，默写 <code>take</code>、<code>drop</code>、<code>sieve</code> 的等式，并解释惰性求值',
      why: '第 6 章是重点也是难点：无限列表不炸，靠的就是 <code>strat</code> 控制先算哪个参数',
      how: '先写声明，只跑 <code>take(primes,5)</code>，再逐步补 <code>sieve</code> 与 <code>merge</code>；发散时回看 L6 的播放器',
      pitfalls: ['去掉 <code>strat: (1 0)</code> 后无限尾巴会先被求值，<code>take(primes,10)</code> 立刻发散打转', '<code>merge</code> 两数相等时不同时推进两个列表，Hamming 数就出现重复']
    },
    body: task(1, '写出 <code>INF-LIST</code> 中 <code>_|_</code> 的声明，并解释每个属性的作用。',
      '三个关键字：constr / strat / prec。',
      '<code>op _|_ : Nat InfList -&gt; InfList {constr strat: (1 0) prec: 40}</code>。constr：构造子；strat (1 0)：先算头再试根，实现惰性；prec 40：低于 + 和 *，所以 <code>1 + 2 | 3</code> 会解析成 <code>(1+2) | 3</code>。') +
      task(2, '默写 take / drop / zip 的等式。',
      'take 和 drop 都用 Nat / NzNat 分情形。',
      'take: <code>eq take(IL,0)=nil .</code> / <code>eq take(X|IL,NzN)= X | take(IL,p NzN) .</code><br>' +
      'drop: <code>eq drop(IL,0)=IL .</code> / <code>eq drop(X|IL,NzN)= drop(IL,p NzN) .</code><br>' +
      'zip: <code>eq zip(X|IL,Y|IL2)= X | Y | zip(IL,IL2) .</code>') +
      task(3, '写出 <code>primes</code> 的定义，并手算 <code>take(primes,6)</code> 的前 4 步。',
      'sieve 取头，check 划掉倍数。',
      '<code>eq primes = sieve(mkNILFrom(2)) .</code>；<code>eq sieve(X|IL)= X | sieve(check(X,IL)) .</code><br>' +
      'sieve(mkNILFrom(2)) → 2|sieve(check(2,mkNILFrom(3))) → 2|sieve(3|check(2,mkNILFrom(4))) → 2|3|sieve(check(3,check(2,mkNILFrom(4)))) → …（4 被 2 划掉）。') +
      task(4, '解释：为什么去掉 <code>strat: (1 0)</code> 后 <code>take(primes,10)</code> 会发散？',
      '想「默认策略要先算哪个参数」。',
      '默认策略 (1 2 0) 要求先把第 2 个参数（无限尾巴）归约成范式，这永远做不到，于是无限展开。' +
      '(1 0) 只要求先把头算出来，尾巴保持「未求值」的形式，take 每次只要一个头，因此能停。') +
      task(5, '写出 <code>ham</code> 的定义，并解释 merge 中「相等只取一个」的原因。',
      '去重。',
      '<code>eq ham = 1 | merge(merge(2*(ham),3*(ham)),5*(ham)) .</code>；相等时两边的数相同，如果都保留就重复了，' +
      '所以 <code>X | merge(IL,IL2)</code> 同时推进两个列表。'),
    quiz: 'HW6-q'
  });

  add({
    id: 'HW7', title: 'HW7 · 多重集（重点）',
    goals: ['会写多重集模块', '能分析 AC 匹配导致的 bug'],
    guide: {
      what: '写 <code>MULTISET-NAT</code> 的 <code>assoc comm id: emp</code>，分析 <code>update</code> 为何在多重集上不可靠，并给出两条 <code>ceq</code> 修复',
      why: '第 7 章直接考「AC 匹配多解 + 缺不变量」，是理解匹配器与合流性的关键一题',
      how: '先按讲义写 <code>#</code> 与 <code>isValid</code>，再拿重复键的例子分别跑修复前与修复后两种结果',
      pitfalls: ['只给 <code>update</code> 加了条件，忘了 <code>add</code> 等入口也要先查 <code>isValid</code>，非法输入照旧出错', '以为 AC 匹配的解唯一：选哪组解由匹配器决定']
    },
    body: task(1, '写出 <code>MULTISET-NAT</code>，并说明三个属性各自的作用。',
      '一个 op，三个属性。',
      '<code>op __ : MSet MSet -&gt; MSet {constr assoc comm id: emp}</code>。assoc：括号无意义；comm：顺序无意义；id: emp：空单元可省略。') +
      task(2, '写出 <code>#</code>（计数）与 <code>isValid</code>。',
      'isValid 检查键唯一。',
      '见 L7.s2。') +
      task(3, '<b>核心题</b>：说明为什么 <code>eq update((I,N) MS,J,N2) = if I == J then {(I,N2) MS} else {(I,N) update(MS,J,N2)} .</code> 在多重集上不可靠。',
      '从「AC 匹配多解」和「缺少不变量」两个角度写。',
      '① AC 匹配对 <code>(I,N) MS</code> 有多组解：任一元素都可以当 <code>(I,N)</code>。若挑中的是键 J 的元素就立即返回，' +
      '剩下的 MS 里可能还有同键元素，导致结果里出现重复键或漏改。' +
      '② 该等式假设「键唯一」这一不变量成立；输入违反时结果取决于匹配器选哪个解，因此<b>不确定</b>，破坏合流性。') +
      task(4, '给出修复方案（两条 ceq），并解释修复为什么有效。',
      '关键是条件里出现 isValid。',
      '见 L7.s4。有效性在于：<code>isValid((I,N) MS)</code> 保证输入中键唯一，于是「哪个元素是 (I,N)」不再有多解，匹配被钉死。') +
      task(5, '对 <code>update((\'a,1)(\'a,2),\'a,9)</code> 说明修复前后的差别。',
      '非法输入。',
      '修复前：可能得到 (a,9)(a,2) 或 (a,1)(a,9)，不确定。修复后：<code>isValid</code> 为 false，第二条 ceq 生效，返回原多重集不变。'),
    quiz: 'HW7-q'
  });

  add({
    id: 'HW8', title: 'HW8 · Minila 解释器',
    goals: ['会写 <code>evalExp</code> / <code>eval</code> 的结构递归', '能手算最终环境'],
    guide: {
      what: '写 <code>evalExp</code> 与 <code>eval</code> 的等式，手算 while 结束后的环境，并说明为什么用递归',
      why: '第 8 章的 Minila 解释器是 L9 虚拟机与 L10 编译器的前提：先有语义，才谈得上编译',
      how: '先写 <code>evalExp</code>（记住 <code>errNat</code> 传播），再写 <code>eval</code>（estm / 赋值 / 顺序），最后纸笔模拟四轮，核对 x=4、y=6',
      pitfalls: ['把未定义变量当成 0：讲义是 <code>errNat</code>，一路传成 <code>errEnv</code>', '顺序语句写反，先执行 <code>S2</code> 用的是旧环境']
    },
    body: task(1, '写出 <code>evalExp</code> 对 <code>n(N)</code>、变量、<code>E1+E2</code>、<code>E1&lt;E2</code> 的等式（含错误传播）。',
      '结构递归；别漏了环境已经是错的那条。',
      '<code>eq evalExp(n(N),EV)=N .</code>；<code>eq evalExp(V,EV)=lookup(EV,V) .</code>；<code>eq evalExp(E1+E2,EV)=evalExp(E1,EV)+evalExp(E2,EV) .</code>；<code>eq evalExp(E1&lt;E2,EV)=evalExp(E1,EV)&lt;evalExp(E2,EV) .</code>；再加 <code>eq evalExp(E,errEnv)=errNat .</code>') +
      task(2, '写出 <code>eval</code> 对 <code>estm</code> / 赋值 / 顺序 的三条等式。',
      '顺序那条要把 S2 放在新环境上；分号属于赋值语句。',
      '<code>eq eval(estm,EV)=EV .</code>；<code>eq eval(V := E ;,EV)=evalAssign(V,evalExp(E,EV),EV) .</code>；<code>eq eval(S1 S2,EV)=eval(S2,eval(S1,EV)) .</code>') +
      task(3, '对 <code>x := n(1) ; y := n(0) ; while x &lt; n(4) { y := y + x ; x := x + n(1) }</code>，写出执行结束后的环境。',
      '手动模拟：x 依次是 1、2、3。',
      'x=4，y=0+1+2+3=6。环境：<code>((x,4)|((y,6)|empEnv))</code>（写出顺序无关紧要）。') +
      task(4, '为什么 Minila 的 while 必须用递归而不是循环来实现？',
      '考虑函数式语言里没有「赋值给 pc」。',
      '因为 <code>eval</code> 是纯函数：接收环境、返回新环境，没有可变状态和跳转。' +
      '「重复执行」只能表达为「用新环境再次调用自己」，即递归；终止由条件求值为 0（假）时返回当前环境保证。'),
    quiz: 'HW8-q'
  });

  add({
    id: 'HW9', title: 'HW9 · Minila 虚拟机',
    goals: ['会写指令序列', '能追踪 pc / 栈', '分清三条跳转'],
    guide: {
      what: '把赋值译成 <code>load/push/add/store</code>，写 if / while 的跳转骨架，并说清三条跳转的分工',
      why: '第 9 章把控制流压成跳转；考试常考指令序列、每条指令后的栈，以及跳转后的 pc',
      how: '先手画 <code>z := x + 1</code> 的栈，再照讲义公式写 if / while，最后拿 p.15 的 18 条指令核对偏移',
      pitfalls: ['把 <code>bjump</code> 当成「假则跳」：它无条件向后跳，退出循环的是 <code>jump</code>', '把跳转参数当绝对编号：<code>bjump(12)</code> 在 pc=16 时到 4，不是 12']
    },
    body: task(1, '把 <code>z := x + 1</code> 翻译成指令序列，并写出每条指令执行后的栈（左边是栈顶）。',
      '左先右后。',
      '<code>load x</code>（栈 [x]）→ <code>push 1</code>（[1, x]）→ <code>add</code>（[x+1]）→ <code>store z</code>（[]）。') +
      task(2, '写出 <code>if E {S1} else {S2}</code> 的指令骨架，并说明每个跳转的偏移怎么算（用 len 表示）。',
      '然后真跳 else、假跳 then？先想清楚哪条指令负责跳过谁。',
      '<code>[E] jumpOnCond(2) jump(len1+2) [S1] jump(len2+1) [S2]</code>，其中 <code>len1=len(generate(S1))</code>、<code>len2=len(generate(S2))</code>；<b>then 在前、else 在后</b>。') +
      task(3, '写出 <code>while E {S1}</code> 的指令骨架。',
      '退出靠 jump，回跳靠 bjump。',
      '<code>[E] jumpOnCond(2) jump(len2+2) [S1] bjump(len1+len2+2)</code>，其中 <code>len1=len(genForExp(E))</code>、<code>len2=len(generate(S1))</code>。') +
      task(4, '三条跳转的语义差别？while 为什么同时用到 <code>jump</code> 和 <code>bjump</code>？',
      '一个是无条件向前，一个是无条件向后，一个是看栈顶。',
      '<code>jump(n)</code>：<code>pc←pc+n</code>（无条件向前）；<code>bjump(n)</code>：<code>pc←pc−n</code>（无条件向后）；' +
      '<code>jumpOnCond(n)</code>：栈顶非 0 则 <code>pc←pc+n</code>，否则 <code>pc←pc+1</code>。' +
      'while 用 <code>jump</code> 在条件为假时<b>退出</b>，用 <code>bjump</code> 在循环体末尾<b>回到开头</b>。') +
      task(5, 'VM 为什么不需要语法树？',
      '控制流已经被编译成跳转。',
      '因为 if/while 的结构信息已经被翻译成 jump/jumpOnCond/bjump 指令，执行时只需 pc 顺序推进或跳转；' +
      '中间结果用显式栈代替了递归调用栈。'),
    quiz: 'HW9-q'
  });

  add({
    id: 'HW10', title: 'HW10 · Minila 编译器',
    goals: ['会写 <code>genForExp</code>', '会用 <code>len</code> 算跳转偏移'],
    guide: {
      what: '写 <code>genForExp</code> 并翻译表达式，解释 if 的偏移为什么能直接用 <code>len</code> 算，陈述编译器的正确性目标',
      why: '第 10 章把表达式编译成栈指令；「先左后右」与偏移公式是这一章的两个得分点',
      how: '先写 <code>genForExp</code> 覆盖加、减、比较，再翻译 <code>x := (a+b)*(c-1)</code>，最后自己推一遍 <code>len1+2</code>',
      pitfalls: ['减法左右写反：先压右操作数会让栈上的操作数颠倒', '把偏移当绝对地址，或忘了 <code>jumpOnCond</code> 的参数恒为 2']
    },
    body: task(1, '写出 <code>genForExp</code> 对 <code>n(N)</code>、<code>V</code>、<code>E1+E2</code>、<code>E1-E2</code>、<code>E1&lt;E2</code> 的等式。',
      '左先右后；末尾别忘 <code>| iln</code>。',
      '<code>genForExp(n(N)) = push(N) | iln .</code>；<code>genForExp(V) = load(V) | iln .</code>；<code>genForExp(E1+E2) = genForExp(E1) @ genForExp(E2) @ (add | iln) .</code>；' +
      '<code>E1-E2</code> 同理换成 <code>minus</code>，<code>E1&lt;E2</code> 换成 <code>lessThan</code>。') +
      task(2, '翻译 <code>x := (a + b) * (c - 1)</code>。',
      '先算 a+b，再算 c-1，最后 multiply。',
      '<code>load a; load b; add; load c; push 1; minus; multiply; store x</code>（讲义写法用 <code>@</code> 连接，末尾 <code>| iln</code>）') +
      task(3, '解释编译 if 时，跳转偏移为什么可以直接用 <code>len</code> 算出来，而不需要事后回填？',
      '偏移是相对量，不是绝对地址。',
      '因为偏移是相对量：<code>jump(len1+2)</code> 的意思是「从这条 jump 往后数 len1+2 条」，而 <code>len1</code> 就是 then 分支的指令数，编译 S1 时已经知道；' +
      '同理 <code>jump(len2+1)</code>。所以公式里直接写 <code>len</code> 就行，不必先留空再回填。') +
      task(4, '编译器要保证什么性质？为什么证明它要「加强」命题？（正式证明在 L13）',
      '表达式的结果在栈顶。',
      '要保证 <code>M(C(p)) = I(p)</code>：编译后交给 VM 执行，与直接解释，得到同一个环境。' +
      '因为表达式的编译结果<b>留在栈顶</b>，所以必须把命题加强成「<code>evalExp(E,EV)</code> = <code>top(run(genForExp(E), empstk, EV))</code>」，否则归纳假设推不动子表达式。'),
    quiz: 'HW10-q'
  });

  add({
    id: 'HW11', title: 'HW11 · 验证：自然数（重点）',
    goals: ['会写完整证明分数', '会构造引理'],
    guide: {
      what: '写出 <code>assoc+</code> 的完整证明分数，包含 base 与 ind 两个分支，再补 <code>rz+</code>、<code>rs+</code> 两条引理并完成 <code>comm+</code>',
      why: '第 11 章分值最高：自然数归纳是所有证明题的模板，base 与 ind 的写法必须背下来',
      how: '先开模块、写 IH 等式，再用 <code>red</code> 把每个分支化到 <code>true</code>；卡住回看 L11.s3',
      pitfalls: ['IH 里把小写常量写成变量，归纳假设立刻失效', '引理只写成含常量的等式，无法对任意 <code>X</code> 归纳']
    },
    body: task(1, '写出 assoc+ 的完整证明分数（base 与 ind）。',
      'IH 用「小写常量 + 大写变量」。',
      '见 L11.s3 的可运行代码。') +
      task(2, '证明 rz+（<code>X + 0 = X</code>），给出两个分支。',
      'base 是 0+0=0。',
      'open PNAT1 / op x / <code>red 0 + 0 = 0 .</code>；ind: <code>eq x + 0 = x .</code> / <code>red s(x) + 0 = s(x) .</code>') +
      task(3, '证明 rs+（<code>X + s(Y) = s(X + Y)</code>）。',
      'base: 0+s(y)=s(0+y)。',
      '见 L11.s4 的代码块 w-l11-4。') +
      task(4, '用 rz+ 与 rs+ 完成 comm+ 的两个分支。',
      'base 加 rz+；ind 加 rs+ 和 IH。',
      '见 L11.s4 的代码块 w-l11-5。') +
      task(5, '说明「引理要比需要的更一般」这一原则，并举一个反例。',
      '考虑 s(x)*sfact2(x,s(0)) = sfact2(x,s(x)*s(0))。',
      '若引理写成只含常量的等式（如 <code>s(x)*sfact2(x,s(0)) = sfact2(x,s(x)*s(0))</code>），' +
      '它只对一个具体 x 成立，无法用归纳法证（归纳时需要「对任意 X 成立」）。' +
      '泛化成 <code>Y * sfact2(X,Z) = sfact2(X,Y*Z)</code> 后就能对 X 归纳。'),
    quiz: 'HW11-q'
  });

  add({
    id: 'HW12', title: 'HW12 · 验证：列表（重点）',
    goals: ['会做列表归纳', '会写 assoc@ 与 ctrr'],
    guide: {
      what: '证 <code>assoc@</code>、<code>p-sr2</code> 与 <code>ctrr</code>，并比较列表归纳和自然数归纳在构造子与 IH 上的差别',
      why: '第 12 章把归纳从自然数搬到列表：两个构造子、两个新常量，是考试列表题的固定套路',
      how: '按依赖顺序先证 <code>assoc@</code>、再证 <code>p-sr2</code>、最后证 <code>ctrr</code>；<code>ind</code> 分支要引入 <code>e</code> 与 <code>l1</code> 两个新常量',
      pitfalls: ['证明顺序颠倒，<code>ctrr</code> 用到的 <code>p-sr2</code> 还没证，会卡住', '<code>ind</code> 只引入一个常量，写不出 <code>e | l1</code> 这种头尾情形']
    },
    body: task(1, '写出 assoc@ 的证明分数，并说明 LIST2 里为什么不用证。',
      'base 两边都 → l2@l3。',
      '见 L12.s2 的代码块 w-l12-2。LIST2 里 @ 有 assoc 属性，匹配时自动视为同一项，一行 red 即 true。') +
      task(2, '证明 p-sr2：<code>sr2(L1,E2|L2) = sr2(L1,nil) @ (E2|L2)</code>。',
      'ind 里要用 assoc@。',
      '见 L12.s3。') +
      task(3, '完成 ctrr：<code>rev1(L1) = rev2(L1)</code>。',
      'base 很干净；ind 用 p-sr2。',
      '见 L12.s3 的代码块 w-l12-4。') +
      task(4, '把列表归纳与自然数归纳做一张对照表（构造子、新常量个数、IH 形状）。',
      '两个构造子 vs 两个构造子。',
      '见 L12.s4 的表格。') +
      task(5, '如果要证 <code>len(L1 @ L2) = len(L1) + len(L2)</code>，需要什么引理？',
      '对 L1 归纳，ind 会遇到 len(L) 与 +。',
      '一般不需要新引理，但会用到加法的定义；若把 <code>+</code> 定义为递归在第二个参数上，可能需要 comm+ 或 rz+。' +
      '写出 base（两边的 len(nil)=0）与 ind（用 IH 展开）即可。'),
    quiz: 'HW12-q'
  });

  add({
    id: 'HW13', title: 'HW13 · 量子隐形传态',
    goals: ['会写量子态的项', '能描述验证策略'],
    guide: {
      what: '用项表示量子比特与纠缠态，写出 H、CX、X、Z 的作用规则，描述隐形传态的三步',
      why: '第 13 章是规格应用的例子：把物理过程写成等式，再用分情形验证协议正确',
      how: '先写基态与纠缠态的项，再列门的规则，最后按 Alice 的 4 种测量结果分别化简',
      pitfalls: ['漏掉归一化条件，合并时系数对不上', '忘了第三步要把两位测量结果经典地传给 Bob']
    },
    body: task(1, '用 CafeOBJ 的记号写一个 qubit 与一个两比特纠缠态。',
      '⊗ 是 _@_。',
      '<code>a |0&gt; + b |1&gt;</code>；纠缠态 <code>(|0&gt;@|0&gt; + |1&gt;@|1&gt;)</code>（省略 1/√2 时需说明）。') +
      task(2, '写出 H、CX、X、Z 四个门对基态的作用规则。',
      'X 翻转、Z 改符号。',
      'H|0&gt;=(|0&gt;+|1&gt;)/√2，H|1&gt;=(|0&gt;−|1&gt;)/√2；CX|10&gt;=|11&gt;，其余不变；X|0&gt;=|1&gt;，X|1&gt;=|0&gt;；Z|0&gt;=|0&gt;，Z|1&gt;=−|1&gt;。') +
      task(3, '描述隐形传态的三步，并指出哪一步需要经典通信。',
      '测量结果是经典比特。',
      '① 共享 Bell 对；② Alice 做 CX(q0,q1) 与 H(q0) 后测量 q0、q1；③ Alice 把两位结果经典地告诉 Bob，Bob 施加 X/Z 修正。第 ③ 步需要经典通信。') +
      task(4, '验证时的核心方法是什么？为什么能只做有限次检查？',
      '测量结果只有 4 种。',
      '分情形（case splitting）：Alice 的测量结果 (m0,m1) 只有 4 种组合，对每种分别化简量子态，' +
      '再用归一化条件合并。因为可能的情形有限（4 种），所以穷举即可，不需要对连续参数 a、b 归纳。'),
    quiz: 'HW13-q'
  });

  add({
    id: 'HW14', title: 'HW14 · 证明助手',
    goals: ['记住 7 个命令', '读懂 proof script'],
    guide: {
      what: '写一段 <code>proof script</code> 从头证明 <code>assoc+</code>，并说清 <code>:apply (si)</code>、<code>(rd)</code>、<code>(tc)</code> 三个命令各自到底做什么',
      why: '第 14 章的证明助手把手写分数变成命令流，读懂它才能看懂证明概要与子目标',
      how: '先 <code>:goal</code> 声明目标，再用 <code>:ind on</code> 选变量，<code>(si)</code> 切分后用 <code>(rd)</code> 逐个化简子目标',
      pitfalls: ['<code>:apply (rd)</code> 只做化简不实例化，需要常量时要先用 <code>(tc)</code> 引入', '忘了 <code>:ind on</code> 指定归纳变量，<code>:apply (si)</code> 就不知道该对谁做归纳']
    },
    body: task(1, '写出一段 proof script 证明 assoc+。',
      ':goal → :ind on → :apply (si) → :apply (rd) ×2。',
      '见 L14.s3。') +
      task(2, '解释 <code>:apply (si)</code> 的作用（切分、新常量、IH）。',
      '三个动作。',
      '对 <code>:ind on</code> 指定的变量做结构归纳，把目标切成「构造子个数」个子目标，' +
      '为非常量构造子引入新常量，并自动加入 IH。') +
      task(3, '<code>:apply (rd)</code> 与 <code>:apply (tc)</code> 的区别？',
      '一个是化简，一个是实例化常量。',
      ':apply (rd) 化简当前目标，若化成 true 则子目标被解除；:apply (tc) 把目标中的变量替换为新常量（实例化），不化简。') +
      task(4, 'CITP 相比手写 proof score 的优势？',
      '人为错误。',
      '自动管理新常量（避免重用已有常量）、自动生成 IH、自动管理子目标；减少人为错误，且能显示证明概要便于检查。'),
    quiz: 'HW14-q'
  });

  /* ---------------- 生成章节 ---------------- */
  CH.push({
    id: 'HW', num: 'HW', group: '第 6 部分 · 作业', short: '作业系统 HW1–HW14',
    title: '作业系统：HW1 – HW14',
    sub: '每讲一份作业。做完点「✓ 我学会了这一节」记录进度，草稿会自动保存在本机。作业占成绩 30%，务必动手写。',
    minutes: 300,
    goals: [
      '每讲的作业都能不看答案独立做完</b>',
      '草稿可保存，方便对照与复习',
      '每份作业都配一组自检题'
    ],
    sections: HW.map(function (h) {
      var html = '<div class="card tip"><div class="card-t"><span class="ico">🎯</span>本次目标</div><ul>' +
        h.goals.map(function (g) { return '<li>' + g + '</li>'; }).join('') + '</ul></div>';
      html += h.body;
      html += draft(h.id);
      html += '<div class="card"><div class="card-t"><span class="ico">📝</span>提交前自检</div>' +
        '<ul><li>每条 <code>eq</code> / <code>op</code> 结尾都有句号？</li>' +
        '<li>变量都声明了？大小写对不对？</li>' +
        '<li>每个递归函数都写了基础情形？</li>' +
        '<li>代码真的在引擎里跑过（不是「看起来对」）？</li></ul></div>';
      html += qcta(h.quiz, 'HW 自检测验');
      return { id: 'HW.' + h.id, title: h.title, guide: h.guide, html: html };
    })
  });

  /* ---------------- 作业自检题 ---------------- */
  function mkq(id, title, items) { QZ[id] = { title: title, items: items }; }
  mkq('HW1-q', 'HW1 自检', [
    { q: '声明常量 <code>nil</code> 的正确写法？', opts: ['<code>op nil : -&gt; List</code>', '<code>op nil : List</code>', '<code>op nil_ : List</code>', '<code>nil : List</code>'], a: 0, why: '箭头左边为空表示无参数。', optWhy: ['对：箭头左边为空表示无参数，<code>nil</code> 是常量', '错：缺 <code>-&gt;</code>，冒号后面必须写「参数 -&gt; 结果」', '错：<code>nil</code> 不带下划线，带下划线表示有参数插槽', '错：缺 <code>op</code> 关键字，解析器认不出这是算子声明'] },
    { q: '<code>ops a b : -&gt; S</code> 声明了几个常量？', opts: ['1', '2', '3', '0'], a: 1, why: 'ops 可以一次声明多个。', optWhy: ['错：<code>ops</code> 后面列了几个名字就声明几个常量', '对：<code>a</code>、<code>b</code> 两个名字，一次声明两个常量', '错：只写了两名字，没有第三个常量', '错：<code>ops</code> 后至少跟一个名字，空列表是空声明'] },
    { q: '等式的方向是？', opts: ['左右都可以', '固定左边换成右边', '固定右边换成左边', '由 prec 决定'], a: 1, why: '重写规则有方向。', optWhy: ['错：等式有方向，重写只从左边朝右边做', '对：左边是模式，匹配成功后换成右边的实例', '错：方向反了，右边是结果，不会被换回左边', '错：<code>prec</code> 只管解析时的结合优先级'] }
  ]);
  mkq('HW2-q', 'HW2 自检', [
    { q: '<code>[Nil NnNatList &lt; NatList]</code> 中 Nil 是？', opts: ['NatList 的子排序', 'NatList 的父排序', '与 NatList 无关', '一个算子'], a: 0, why: '< 左边是子排序。', optWhy: ['对：<code>&lt;</code> 左边是子排序，Nil 比 NatList 更小', '错：父排序是右边的 NatList，不是 Nil', '错：写在方括号里就参与了排序关系，不是无关', '错：算子用 <code>op</code> 声明，排序写方括号'] },
    { q: '<code>len(1|nil)</code> 的结果？', opts: ['0', '1', '<code>s(0)</code>', 'nil'], a: 2, why: 'len(nil)=0，加一个 s。', optWhy: ['错：0 是 <code>len(nil)</code>，空表才没有元素', '错：Peano 记法要写 <code>s(0)</code>，不是数字 1', '对：<code>len(nil)=0</code>，加一个元素就是 <code>s(0)</code>', '错：<code>nil</code> 是列表，<code>len</code> 返回的是 Nat'] },
    { q: '为什么 hd 要重载？', opts: ['为了快', '对 nil 需要返回错误值', '语法要求', '为了排序'], a: 1, why: '用排序区分定义域。', optWhy: ['错：重载不提升速度，只是为不同排序分别给定义', '对：<code>hd(nil)</code> 没有 Nat 可返回，只能重载到 ErrNat', '错：不重载也能写，只是丢掉「空表返回错误」的信息', '错：排序由 <code>op</code> 声明决定，重载是为了分情形'] }
  ]);
  mkq('HW3-q', 'HW3 自检', [
    { q: 'contract 是？', opts: ['被替换的子项', '替换后得到的新项', '位置', '等式'], a: 1, why: 'σ(右边)。', optWhy: ['错：被替换的子项叫 redex，是 σ(左边)', '对：contract 是 σ(右边)，也就是换上去的新项', '错：位置是子项的门牌号，如 1.2', '错：等式是模块里写的规则，还没代入'] },
    { q: '<code>eq X Y = Y X</code> 的问题？', opts: ['语法错', '无限循环', '丢失元素', '排序错'], a: 1, why: '破坏终止性。', optWhy: ['错：语法合法，能通过解析和类型检查', '对：<code>a b → b a → a b</code> 来回换，永不终止', '错：元素一个没少，只是顺序被反复颠倒', '错：两边都是同一种排序，类型没问题'] },
    { q: 'ceq 条件里的变量必须？', opts: ['新声明', '在左边出现', '在右边出现', '是常量'], a: 1, why: '否则无法代入。', optWhy: ['错：不用重新声明，模块顶部的 <code>vars</code> 已够', '对：只有匹配左边时，才能给条件里的变量找到值', '错：只在右边或条件里出现，就拿不到代入值', '错：条件里通常是变量，写成常量就失去一般性'] }
  ]);
  mkq('HW4-q', 'HW4 自检', [
    { q: '<code>E :: TRIV</code> 中 :: 表示？', opts: ['排序继承', '参数模块及其接口约束', '重载', '重命名'], a: 1, why: '参数化模块。', optWhy: ['错：排序继承写在方括号里，用 <code>&lt;</code> 表示', '对：<code>E</code> 是参数，<code>TRIV</code> 是它必须满足的接口', '错：重载是同名算子多份声明，与 <code>::</code> 无关', '错：重命名靠 <code>* {sort ... -&gt; ...}</code> 追加在导入后面'] },
    { q: 'view 里 sort 映射用什么符号？', opts: ['=&gt;', '-&gt;', '::', '&lt;'], a: 1, why: '<code>sort Elt -&gt; Nat</code>。', optWhy: ['错：<code>=&gt;</code> 是等式或函数式写法，不是 view 映射', '对：写 <code>sort Elt -&gt; Nat</code>，箭头指向具体排序', '错：<code>::</code> 用在参数化模块的接口声明上', '错：<code>&lt;</code> 用来声明子排序关系'] },
    { q: '<code>* {sort Pair -&gt; Entry}</code> 叫？', opts: ['乘法', 'renaming', 'view', 'import'], a: 1, why: '重命名导入。', optWhy: ['错：这里的 <code>*</code> 是重命名运算符，不是乘法', '对：把导入模块的排序改名后再导入，这叫 renaming', '错：view 是模块间对照表，写法是 <code>view ... from ... to ...</code>', '错：import 只说导入，改名要靠 <code>* {...}</code>'] }
  ]);
  mkq('HW5-q', 'HW5 自检', [
    { q: '表的不变量？', opts: ['键有序', '键唯一', '值唯一', '长度固定'], a: 1, why: '否则一个键两个值。', optWhy: ['错：表用多重集实现，不要求键有顺序', '对：同一个键最多一个条目，否则 lookup 结果不唯一', '错：不同的键可以有相同的值', '错：表能随时 update、add，长度不固定'] },
    { q: '<code>update</code> 在键不存在时？', opts: ['报错', '新增该条目', '返回空表', '返回 nil'], a: 1, why: '有则改、无则加。', optWhy: ['错：报错是 insert 的行为，update 允许键不存在', '对：update 的语义是有则改、无则加，键可不存在', '错：原表内容要保留，不能返回空表', '错：返回的仍是表，不是 nil'] },
    { q: '<code>insert</code> 在键已存在时？', opts: ['覆盖', '返回错误', '忽略', '删除'], a: 1, why: 'insert 要求键不存在。', optWhy: ['错：覆盖是 update 的语义，insert 更严格', '对：insert 要求键原本不存在，重复注册返回错误表', '错：不会悄悄忽略，错误必须能被看见', '错：删除用 delete 或 remove，与 insert 无关'] }
  ]);
  mkq('HW6-q', 'HW6 自检', [
    { q: '<code>_|_</code> 的属性 <code>strat: (1 0)</code> 作用？', opts: ['排序', '先算头再试根，实现惰性', '优先级', '交换律'], a: 1, why: '关键属性。', optWhy: ['错：排序由 <code>op</code> 冒号后的类型决定', '对：只要求先算第 1 个参数，尾巴不急着求值', '错：优先级用 <code>prec</code> 数字表示，与惰性无关', '错：交换律用 <code>comm</code>，列表是有序的'] },
    { q: '<code>take(primes,5)</code> = ?', opts: ['2|3|5|7|11|nil', '2|3|5|7|nil', '1|2|3|5|7|nil', '2|4|6|8|10|nil'], a: 0, why: '前五个素数。', optWhy: ['对：前五个素数是 2、3、5、7、11，末尾接 nil', '错：只有四个元素，少了 11', '错：1 不是素数，sieve 从 2 开始', '错：这是偶数，2 的倍数已被 sieve 划掉'] },
    { q: 'merge 里 X==Y 时？', opts: ['都保留', '只保留一个并同时推进', '报错', '停止'], a: 1, why: '去重。', optWhy: ['错：都保留会让 Hamming 数出现重复项', '对：相等的数只写一次，两个列表同时前进一个', '错：相等是正常情形，不该报错', '错：还要继续合并后面的项，不能提前停'] }
  ]);
  mkq('HW7-q', 'HW7 自检', [
    { q: '多重集的三个属性？', opts: ['assoc comm id:', 'prec strat constr', 'constr ac', 'assoc id: prec'], a: 0, why: '结合、交换、单位元。', optWhy: ['对：结合、交换、单位元，<code>__</code> 才能当多重集', '错：prec、strat、constr 是解析与求值属性', '错：<code>ac</code> 是 assoc+comm，但漏了单位元', '错：<code>prec</code> 与多重集的语义无关'] },
    { q: 'update 出错的根因？', opts: ['语法错', 'AC 匹配多解 + 无不变量检查', '排序错', 'emp 写错'], a: 1, why: '核心结论。', optWhy: ['错：等式能通过解析，这是语义问题', '对：任一元素都能当 <code>(I,N)</code>，结果取决于选了哪组解', '错：两边同排序，类型没问题', '错：<code>id: emp</code> 的声明本身没写错'] },
    { q: '修复用的函数是？', opts: ['isReg', 'isValid', 'lookup', 'count'], a: 1, why: '检查键唯一。', optWhy: ['错：isReg 只判断键是否存在，管不了键重复', '对：isValid 检查整张表的键是否唯一', '错：lookup 只查值，不检查表的结构', '错：count 只数元素个数，看不出键是否重复'] }
  ]);
  mkq('HW8-q', 'HW8 自检', [
    { q: '<code>eval(S1 S2,EV)</code> = ?', opts: ['<code>eval(S1, eval(S2,EV))</code>', '<code>eval(S2, eval(S1,EV))</code>', '<code>EV</code>', '<code>eval(S2,EV)</code>'], a: 1, why: '先执行 S1，用新环境再执行 S2。', optWhy: ['错：顺序反了，这样会先执行 S2', '对：先执行 S1 得到新环境，再在新环境上执行 S2', '错：那是 <code>estm</code>（空语句）的结果，顺序语句会改环境', '错：漏掉了 S1 对环境做的改动'] },
    { q: '环境本质上是？', opts: ['栈', '变量→值的表', '树', '指令数组'], a: 1, why: '表的应用。', optWhy: ['错：栈是第 9 章虚拟机用的结构', '对：环境就是表，用 update 与 lookup 维护', '错：环境没有树形结构，只是键到值的对照', '错：指令数组是编译器与 VM 的概念'] },
    { q: '<code>lookup(empEnv,V)</code> 返回什么？', opts: ['<code>errNat</code>（会一路传播成 <code>errEnv</code>）', '0', '<code>nil</code>', '<code>undefined</code>'], a: 0, why: '讲义用错误传播，不用默认值。', optWhy: ['对：<code>errNat</code> 进入算术运算后继续传播，最终整个 <code>eval</code> 返回 <code>errEnv</code>', '错：返回 0 会让「未定义变量」安静地变成合法值，讲义不允许', '错：<code>nil</code> 是列表的单位元，不是这里的值', '错：<code>undefined</code> 不是可归约的项'] }
  ]);
  mkq('HW9-q', 'HW9 自检', [
    { q: 'while 用哪条指令退出？', opts: ['<code>jumpOnCond</code>', '<code>jump</code>', '<code>bjump</code>', '<code>quit</code>'], a: 1, why: '条件为假时不跳过 jump(len2+2)，于是跳出。', optWhy: ['错：<code>jumpOnCond</code> 只负责「条件真时跳过那条 jump」', '对：条件假时执行 <code>jump(len2+2)</code>，越过循环体退出', '错：<code>bjump</code> 是向后跳，用途是回到循环开头', '错：<code>quit</code> 结束整段程序，不是退出循环'] },
    { q: '<code>push 1</code> 后栈是？', opts: ['[]', '[1]', '[1,1]', 'pop'], a: 1, why: '压栈。', optWhy: ['错：<code>push 1</code> 至少压一个数，不会还是空栈', '对：栈顶就是刚压入的 1', '错：只压了一次，不会有两条', '错：<code>pop</code> 是弹栈动作，不是栈的内容'] },
    { q: 'VM 状态包含？', opts: ['pc / 栈 / 环境', '只有 pc', '语法树', '寄存器'], a: 0, why: '三个部件。', optWhy: ['对：程序计数器、操作数栈、变量环境三个部件', '错：只有 pc 跑不动，还要栈和环境', '错：VM 直接执行指令，不再保留语法树', '错：Minila VM 用栈而不是寄存器'] }
  ]);
  mkq('HW10-q', 'HW10 自检', [
    { q: '<code>genForExp(E1-E2)</code> = ?', opts: ['<code>gen(E2) @ gen(E1) @ (minus|iln)</code>', '<code>gen(E1) @ gen(E2) @ (minus|iln)</code>', '<code>minus | iln</code>', '<code>gen(E1)</code>'], a: 1, why: '左先右后。', optWhy: ['错：左右反了，先压 E2 会让操作数顺序颠倒', '对：左先右后，两个结果在栈上再执行 <code>minus</code>', '错：只生成 <code>minus</code>，两个操作数都没进栈', '错：只生成了 E1 的代码，E2 被整个丢掉'] },
    { q: 'if 骨架里 <code>jumpOnCond</code> 的参数恒为？', opts: ['2', '<code>len1+2</code>', '<code>len2+1</code>', '0'], a: 0, why: '它只跳过紧跟其后的那条 <code>jump</code>。', optWhy: ['对：永远是 2，因为只跳过一条指令', '错：那是紧接着的 <code>jump</code> 的偏移', '错：那是 then 分支末尾 <code>jump</code> 的偏移', '错：参数为 0 等于不跳'] },
    { q: '<code>compile</code> 与 <code>generate</code> 差别？', opts: ['无差别', '<code>compile</code> 末尾补 <code>quit | iln</code>', '<code>generate</code> 更慢', '<code>compile</code> 不处理 if'], a: 1, why: '编译产物要能自己停机。', optWhy: ['错：一个是完整程序，一个是片段，不能互换', '对：<code>compile(S) = generate(S) @ (quit | iln)</code>', '错：两者指令数一样，只多了 <code>quit | iln</code>', '错：<code>compile</code> 也处理 if，跳转由 <code>generate</code> 产生'] }
  ]);
  mkq('HW11-q', 'HW11 自检', [
    { q: 'IH 的正确写法？', opts: ['eq (x+y)+z = x+(y+z) .', 'eq (x+Y)+Z = x+(Y+Z) .', 'eq (X+Y)+Z = X+(Y+Z) .', 'red (x+Y)+Z = x+(Y+Z) .'], a: 1, why: '小写常量 + 大写变量。', optWhy: ['错：全是小写会被当常量，<code>x</code> 也不是归纳变量', '对：<code>x</code> 是归纳常量，<code>Y</code>、<code>Z</code> 是任意变量', '错：全是变量，就丢了「对常量 x 成立」这个前提', '错：<code>red</code> 是求值命令，不能当假设声明'] },
    { q: 'comm+ 需要几个引理？', opts: ['0', '1', '2', '3'], a: 2, why: 'rz+ 和 rs+。', optWhy: ['错：只展开基础情形就会卡住，需要辅助引理', '错：只补一条不够，另一个加法方向也要', '对：需要 <code>rz+</code> 与 <code>rs+</code> 两条引理配合', '错：两条就够，第三条是多余重复'] },
    { q: '证明分数最后一步？', opts: ['<code>red</code> 得 true', '<code>close</code>', '<code>show</code>', '<code>open</code>'], a: 0, why: 'red 结果为 true 即证完。', optWhy: ['对：归约出 <code>true</code> 才说明这个分支证完了', '错：<code>close</code> 只关闭模块，不验证目标', '错：<code>show</code> 只显示内容，不做化简', '错：<code>open</code> 是开头打开模块用的'] }
  ]);
  mkq('HW12-q', 'HW12 自检', [
    { q: '列表归纳的 ind 需要几个新常量？', opts: ['1', '2', '3', '0'], a: 1, why: 'e 和 l1。', optWhy: ['错：只引入一个常量，表达不了「头 + 尾」', '对：<code>e</code> 当头、<code>l1</code> 当尾，两个常量', '错：列表只有两个构造子，引入两个常量就够', '错：不引入常量就写不出 <code>e | l1</code> 这种情形'] },
    { q: 'p-sr2 的公式？', opts: ['sr2(L1,E2|L2)=sr2(L1,nil)@(E2|L2)', 'rev1=rev2', 'assoc@', 'sr2(nil,L)=L'], a: 0, why: '关键引理。', optWhy: ['对：把追加的 E2 提到外层，这是 ctrr 归纳要用的引理', '错：那是 ctrr 的目标，不是 p-sr2 的公式', '错：<code>assoc@</code> 说的是 @ 的结合，另一条引理', '错：这是 sr2 的基础情形，不足以推出 ind 情形'] },
    { q: '证明顺序？', opts: ['ctrr→p-sr2→assoc@', 'assoc@→p-sr2→ctrr', '任意', 'p-sr2→assoc@→ctrr'], a: 1, why: '依赖顺序。', optWhy: ['错：ctrr 依赖 p-sr2，先证它推不下去', '对：顺序是先证 <code>assoc@</code>，再证 p-sr2，最后证 ctrr', '错：引理必须先于用到它的定理', '错：p-sr2 里也要用 <code>assoc@</code>，顺序不能换'] }
  ]);
  mkq('HW13-q', 'HW13 自检', [
    { q: '归一化条件？', opts: ['a+b=1', '|a|²+|b|²=1', 'a=b', 'ab=1'], a: 1, why: '概率和为 1。', optWhy: ['错：概率是幅度的模平方，不是幅度本身相加', '对：两个基态的概率之和必须等于 1', '错：a、b 允许不相等，例如幅度取 <code>2/√5</code> 与 <code>1/√5</code>', '错：乘积为 1 没有物理意义，也不保证归一'] },
    { q: 'CX 的作用？', opts: ['总是翻转', '控制位为 1 时翻转目标', '相位翻转', '测量'], a: 1, why: 'Controlled-NOT。', optWhy: ['错：控制位为 0 时目标比特不变', '对：Controlled-NOT，控制位为 1 才翻转目标', '错：改符号的是 Z 门，不是 CX', '错：测量是读出结果，CX 是可逆门'] },
    { q: '验证用？', opts: ['对 a、b 归纳', '对 4 种测量结果分情形', '只测一次', '枚举所有 a'], a: 1, why: 'case splitting。', optWhy: ['错：a、b 是连续参数，做不了结构归纳', '对：测量结果只有 4 种，逐个化简就覆盖全体', '错：只测一次只覆盖一种情形，证明不了协议正确', '错：a 是复数，有无穷多个，不能枚举'] }
  ]);
  mkq('HW14-q', 'HW14 自检', [
    { q: ':apply (si) 做什么？', opts: ['化简', '结构归纳切子目标', '显示证明', '声明目标'], a: 1, why: 'si = structural induction。', optWhy: ['错：化简要用 <code>:apply (rd)</code>，si 负责切分归纳', '对：对归纳变量切分，自动引入新常量与 IH', '错：看证明成果用 <code>:show proof</code> 这类命令', '错：声明目标要用 <code>:goal</code> 命令，不是 apply'] },
    { q: ':ind on X:S 的作用？', opts: ['声明目标', '指定归纳变量', '化简', '解释'], a: 1, why: '指定对谁归纳。', optWhy: ['错：目标由 <code>:goal</code> 声明，与 <code>:ind</code> 无关', '对：告诉助手对哪个变量、按哪个排序做归纳', '错：它只设定归纳对象，不做任何化简', '错：<code>:ind</code> 是归纳设定，不是解释命令'] },
    { q: 'CITP 是全自动定理证明器吗？', opts: ['是', '不是，是交互式助手', '只对自然数有效', '只能证等式'], a: 1, why: '需要人指定归纳变量与引理。', optWhy: ['错：归纳变量和引理都要人来指定，不是全自动', '对：人给策略，助手执行并管理子目标', '错：它也用于列表、量子态等排序，不限于自然数', '错：目标可以是任意项的等式，不限于某类式子'] }
  ]);
})();
