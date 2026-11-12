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
    goals: ['会写 eval / execute', '能手算环境'],
    body: task(1, '写出 <code>eval</code> 对整数、变量、加法、比较的四条等式。',
      '结构递归。',
      '<code>eq eval(N,Env)=N .</code>；<code>eq eval(X,Env)=lookup(Env,X) .</code>；<code>eq eval(E1+E2,Env)=eval(E1,Env)+eval(E2,Env) .</code>；<code>eq eval(E1&lt;E2,Env)=eval(E1,Env)&lt;eval(E2,Env) .</code>') +
      task(2, '写出 <code>execute</code> 对 skip / 赋值 / 顺序 的三条等式。',
      '顺序那条要把 S2 放在新环境上。',
      '<code>eq execute(skip,Env)=Env .</code>；<code>eq execute(X:=E,Env)=update(Env,X,eval(E,Env)) .</code>；<code>eq execute(S1;S2,Env)=execute(S2,execute(S1,Env)) .</code>') +
      task(3, '对 <code>x := 1 ; y := 0 ; while x &lt; 4 do y := y + x ; x := x + 1 od</code>，写出执行结束后的环境。',
      '手动模拟四轮。',
      'x=4, y=0+1+2+3=6。环境：<code>((x,4)|((y,6)|empEnv))</code>（顺序无关）。') +
      task(4, '为什么 Minila 的 while 必须用递归而不是循环来实现？',
      '考虑函数式语言里没有「赋值给 pc」。',
      '因为 execute 是纯函数：它接收环境、返回新环境，没有可变状态和跳转。' +
      '「重复执行」只能表达为「用新环境再次调用自己」，即递归；递归的终止由条件为假时返回 Env 保证。'),
    quiz: 'HW8-q'
  });

  add({
    id: 'HW9', title: 'HW9 · Minila 虚拟机',
    goals: ['会写指令序列', '能追踪 pc/栈'],
    body: task(1, '把 <code>z := x + 1</code> 翻译成指令序列，并写出每条指令执行后的栈。',
      '左先右后。',
      '<code>load x</code>（栈 [x]）→ <code>push 1</code>（[1,x]）→ <code>add</code>（[x+1]）→ <code>store z</code>（[]）。') +
      task(2, '写出 <code>if B then S1 else S2</code> 的指令骨架，并说明每个跳转的地址怎么算（用 len 表示）。',
      'jumpOnCond 跳 then，jump 跳结束。',
      '<code>[B 的指令] ++ jumpOnCond(len(B)+1) ++ [S2] ++ jump(len(S2)+1) ++ [S1]</code>，其中 then 的入口是 len(B)+1。') +
      task(3, '写出 <code>while B do S</code> 的指令骨架。',
      '循环开头标 TOP，条件假则跳出。',
      '<code>TOP: [B] ++ bjump(len(B)+len(S)+1) ++ [S] ++ jump(1) ++ …</code>，bjump 的目标是循环后的第一条。') +
      task(4, '<code>jumpOnCond</code> 与 <code>bjump</code> 的区别？为什么 while 用 bjump？',
      '一个是「真则跳」，一个是「假则跳」。',
      'jumpOnCond n：弹栈，真则 pc←n。bjump n：弹栈，假则 pc←n。' +
      'while 的语义是「条件不成立就退出循环体」，正好是「假则跳」，所以用 bjump。') +
      task(5, 'VM 为什么不需要语法树？',
      '控制流已经被编译成跳转。',
      '因为 if/while 的结构信息已经被翻译成 jump/jumpOnCond/bjump 指令，执行时只需 pc 顺序推进或跳转；' +
      '中间结果用显式栈代替了递归调用栈。'),
    quiz: 'HW9-q'
  });

  add({
    id: 'HW10', title: 'HW10 · Minila 编译器',
    goals: ['会写 genForExp', '理解回填地址'],
    body: task(1, '写出 <code>genForExp</code> 对 <code>N</code>、<code>X</code>、<code>E1+E2</code>、<code>E1-E2</code>、<code>E1&lt;E2</code> 的等式。',
      '左先右后。',
      '<code>genForExp(N)=push(N)</code>；<code>genForExp(X)=load(X)</code>；<code>genForExp(E1+E2)=genForExp(E1)++genForExp(E2)++(add|nil)</code>；' +
      '同理 sub / lt。') +
      task(2, '翻译 <code>x := (a + b) * (c - 1)</code>。',
      '先算 a+b，再算 c-1，最后 mul。',
      '<code>load a; load b; add; load c; push 1; sub; mul; store x</code>') +
      task(3, '解释编译 if 时为什么需要 <code>len</code> 与「回填」。',
      '跳转目标要等分支长度确定。',
      '写 <code>jumpOnCond ?</code> 时还不知道 then 的入口地址；它等于「当前已生成指令数 + else 分支长度 + 1」。' +
      '所以先占位，等 else 编译完后用 len 算出地址再回填（backpatching）。') +
      task(4, '陈述编译器的正确性定理，并说明为什么证明需要加强归纳假设。',
      '表达式的结果在栈上。',
      '<code>execute(P,Env) = executeVM(compile(P),Env)</code>。' +
      '因为编译后的表达式把结果留在栈顶，所以必须把命题加强为「eval(E,Env) = top(run(genForExp(E), emptyStack, Env))」，' +
      '否则归纳假设不足以推出子表达式的行为。'),
    quiz: 'HW10-q'
  });

  add({
    id: 'HW11', title: 'HW11 · 验证：自然数（重点）',
    goals: ['会写完整证明分数', '会构造引理'],
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
      return { id: 'HW.' + h.id, title: h.title, html: html };
    })
  });

  /* ---------------- 作业自检题 ---------------- */
  function mkq(id, title, items) { QZ[id] = { title: title, items: items }; }
  mkq('HW1-q', 'HW1 自检', [
    { q: '声明常量 <code>nil</code> 的正确写法？', opts: ['<code>op nil : -&gt; List</code>', '<code>op nil : List</code>', '<code>op nil_ : List</code>', '<code>nil : List</code>'], a: 0, why: '箭头左边为空表示无参数。' },
    { q: '<code>ops a b : -&gt; S</code> 声明了几个常量？', opts: ['1', '2', '3', '0'], a: 1, why: 'ops 可以一次声明多个。' },
    { q: '等式的方向是？', opts: ['左右都可以', '固定左边换成右边', '固定右边换成左边', '由 prec 决定'], a: 1, why: '重写规则有方向。' }
  ]);
  mkq('HW2-q', 'HW2 自检', [
    { q: '<code>[Nil NnNatList &lt; NatList]</code> 中 Nil 是？', opts: ['NatList 的子排序', 'NatList 的父排序', '与 NatList 无关', '一个算子'], a: 0, why: '< 左边是子排序。' },
    { q: '<code>len(1|nil)</code> 的结果？', opts: ['0', '1', '<code>s(0)</code>', 'nil'], a: 2, why: 'len(nil)=0，加一个 s。' },
    { q: '为什么 hd 要重载？', opts: ['为了快', '对 nil 需要返回错误值', '语法要求', '为了排序'], a: 1, why: '用排序区分定义域。' }
  ]);
  mkq('HW3-q', 'HW3 自检', [
    { q: 'contract 是？', opts: ['被替换的子项', '替换后得到的新项', '位置', '等式'], a: 1, why: 'σ(右边)。' },
    { q: '<code>eq X Y = Y X</code> 的问题？', opts: ['语法错', '无限循环', '丢失元素', '排序错'], a: 1, why: '破坏终止性。' },
    { q: 'ceq 条件里的变量必须？', opts: ['新声明', '在左边出现', '在右边出现', '是常量'], a: 1, why: '否则无法代入。' }
  ]);
  mkq('HW4-q', 'HW4 自检', [
    { q: '<code>E :: TRIV</code> 中 :: 表示？', opts: ['排序继承', '参数模块及其接口约束', '重载', '重命名'], a: 1, why: '参数化模块。' },
    { q: 'view 里 sort 映射用什么符号？', opts: ['=&gt;', '-&gt;', '::', '&lt;'], a: 1, why: '<code>sort Elt -&gt; Nat</code>。' },
    { q: '<code>* {sort Pair -&gt; Entry}</code> 叫？', opts: ['乘法', 'renaming', 'view', 'import'], a: 1, why: '重命名导入。' }
  ]);
  mkq('HW5-q', 'HW5 自检', [
    { q: '表的不变量？', opts: ['键有序', '键唯一', '值唯一', '长度固定'], a: 1, why: '否则一个键两个值。' },
    { q: '<code>update</code> 在键不存在时？', opts: ['报错', '新增该条目', '返回空表', '返回 nil'], a: 1, why: '有则改、无则加。' },
    { q: '<code>insert</code> 在键已存在时？', opts: ['覆盖', '返回错误', '忽略', '删除'], a: 1, why: 'insert 要求键不存在。' }
  ]);
  mkq('HW6-q', 'HW6 自检', [
    { q: '<code>_|_</code> 的属性 <code>strat: (1 0)</code> 作用？', opts: ['排序', '先算头再试根，实现惰性', '优先级', '交换律'], a: 1, why: '关键属性。' },
    { q: '<code>take(primes,5)</code> = ?', opts: ['2|3|5|7|11|nil', '2|3|5|7|nil', '1|2|3|5|7|nil', '2|4|6|8|10|nil'], a: 0, why: '前五个素数。' },
    { q: 'merge 里 X==Y 时？', opts: ['都保留', '只保留一个并同时推进', '报错', '停止'], a: 1, why: '去重。' }
  ]);
  mkq('HW7-q', 'HW7 自检', [
    { q: '多重集的三个属性？', opts: ['assoc comm id:', 'prec strat constr', 'constr ac', 'assoc id: prec'], a: 0, why: '结合、交换、单位元。' },
    { q: 'update 出错的根因？', opts: ['语法错', 'AC 匹配多解 + 无不变量检查', '排序错', 'emp 写错'], a: 1, why: '核心结论。' },
    { q: '修复用的函数是？', opts: ['isReg', 'isValid', 'lookup', 'count'], a: 1, why: '检查键唯一。' }
  ]);
  mkq('HW8-q', 'HW8 自检', [
    { q: 'execute(S1;S2,Env) = ?', opts: ['execute(S1,execute(S2,Env))', 'execute(S2,execute(S1,Env))', 'Env', 'execute(S2,Env)'], a: 1, why: '顺序不能反。' },
    { q: '环境本质上是？', opts: ['栈', '变量→值的表', '树', '指令数组'], a: 1, why: '表的应用。' },
    { q: '未定义变量的值？', opts: ['报错', '0', 'nil', 'undefined'], a: 1, why: 'lookup(empEnv,X)=0。' }
  ]);
  mkq('HW9-q', 'HW9 自检', [
    { q: 'while 用哪条指令退出？', opts: ['jumpOnCond', 'bjump', 'jump', 'halt'], a: 1, why: '假则跳。' },
    { q: '<code>push 1</code> 后栈是？', opts: ['[]', '[1]', '[1,1]', 'pop'], a: 1, why: '压栈。' },
    { q: 'VM 状态包含？', opts: ['pc/栈/环境', '只有 pc', '语法树', '寄存器'], a: 0, why: '三个部件。' }
  ]);
  mkq('HW10-q', 'HW10 自检', [
    { q: '<code>genForExp(E1-E2)</code> = ?', opts: ['gen(E2)++gen(E1)++sub', 'gen(E1)++gen(E2)++sub', 'sub', 'gen(E1)'], a: 1, why: '左先右后。' },
    { q: '编译 if 需要？', opts: ['回填地址', '递归下降', '垃圾回收', '寄存器分配'], a: 0, why: '用 len 算目标地址。' },
    { q: 'compile 与 generate 差别？', opts: ['无差别', 'compile 末尾加 halt', 'generate 更慢', 'compile 不处理 if'], a: 1, why: '要停机。' }
  ]);
  mkq('HW11-q', 'HW11 自检', [
    { q: 'IH 的正确写法？', opts: ['eq (x+y)+z = x+(y+z) .', 'eq (x+Y)+Z = x+(Y+Z) .', 'eq (X+Y)+Z = X+(Y+Z) .', 'red (x+Y)+Z = x+(Y+Z) .'], a: 1, why: '小写常量 + 大写变量。' },
    { q: 'comm+ 需要几个引理？', opts: ['0', '1', '2', '3'], a: 2, why: 'rz+ 和 rs+。' },
    { q: '证明分数最后一步？', opts: ['<code>red</code> 得 true', '<code>close</code>', '<code>show</code>', '<code>open</code>'], a: 0, why: 'red 结果为 true 即证完。' }
  ]);
  mkq('HW12-q', 'HW12 自检', [
    { q: '列表归纳的 ind 需要几个新常量？', opts: ['1', '2', '3', '0'], a: 1, why: 'e 和 l1。' },
    { q: 'p-sr2 的公式？', opts: ['sr2(L1,E2|L2)=sr2(L1,nil)@(E2|L2)', 'rev1=rev2', 'assoc@', 'sr2(nil,L)=L'], a: 0, why: '关键引理。' },
    { q: '证明顺序？', opts: ['ctrr→p-sr2→assoc@', 'assoc@→p-sr2→ctrr', '任意', 'p-sr2→assoc@→ctrr'], a: 1, why: '依赖顺序。' }
  ]);
  mkq('HW13-q', 'HW13 自检', [
    { q: '归一化条件？', opts: ['a+b=1', '|a|²+|b|²=1', 'a=b', 'ab=1'], a: 1, why: '概率和为 1。' },
    { q: 'CX 的作用？', opts: ['总是翻转', '控制位为 1 时翻转目标', '相位翻转', '测量'], a: 1, why: 'Controlled-NOT。' },
    { q: '验证用？', opts: ['对 a、b 归纳', '对 4 种测量结果分情形', '只测一次', '枚举所有 a'], a: 1, why: 'case splitting。' }
  ]);
  mkq('HW14-q', 'HW14 自检', [
    { q: ':apply (si) 做什么？', opts: ['化简', '结构归纳切子目标', '显示证明', '声明目标'], a: 1, why: 'si = structural induction。' },
    { q: ':ind on X:S 的作用？', opts: ['声明目标', '指定归纳变量', '化简', '解释'], a: 1, why: '指定对谁归纳。' },
    { q: 'CITP 是全自动定理证明器吗？', opts: ['是', '不是，是交互式助手', '只对自然数有效', '只能证等式'], a: 1, why: '需要人指定归纳变量与引理。' }
  ]);
})();
