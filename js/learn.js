/* =====================================================================
 * learn.js — 给初学者的辅助功能
 *   1. 代码块：可直接编辑、还原、行号、报错行高亮、常见错误提示
 *   2. 「📖 逐行解读」：每一行代码是什么意思（有作者写的注释就用注释，
 *      没有就由下面的 explainLine 自动生成大白话说明）
 *   3. 术语悬停解释（数据来自 glossary.js）
 *   4. 全站搜索 + 术语表弹窗
 * 依赖：engine.js（CafeOBJ）、widgets.js（W）、quiz.js（openModal / closeModal）
 * ===================================================================== */
(function (global) {
  'use strict';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function strip(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' '); }
  var Learn = {};

  /* =====================================================================
   * 1. 一行 CafeOBJ 代码的自动解读
   * ===================================================================== */
  var PH = ['X', 'Y', 'Z', 'W', 'V'];
  /* 根据算子名里 _ 的位置，造一个「实际写出来长什么样」的例子 */
  function usage(name, nargs) {
    if (name.indexOf('_') < 0) {
      if (!nargs) return name;
      return name + '(' + PH.slice(0, nargs).join(', ') + ')';
    }
    var parts = name.split('_'), out = '', k = 0;
    for (var i = 0; i < parts.length; i++) {
      out += parts[i];
      if (i < parts.length - 1) out += ' ' + (PH[k++] || 'A') + ' ';
    }
    return out.replace(/\s+/g, ' ').trim();
  }
  function explainAttrs(attrs, nargs) {
    var out = [];
    var a = attrs.trim();
    if (/\bconstr\b/.test(a)) out.push('<b>constr</b>：它是「构造子」，只负责搭数据，本身不会再被计算');
    var m = a.match(/prec:\s*(\d+)/);
    if (m) out.push('<b>prec: ' + m[1] + '</b>：优先级，数字越小绑得越紧（像「先乘除后加减」）');
    if (/\bassoc\b/.test(a)) out.push('<b>assoc</b>：满足结合律，括号可以随便加，系统会自动抹平');
    if (/\bcomm\b/.test(a)) out.push('<b>comm</b>：满足交换律，左右两边可以互换');
    m = a.match(/id:\s*([^\s}]+)/);
    if (m) out.push('<b>id: ' + esc(m[1]) + '</b>：' + esc(m[1]) + ' 是单位元，和它拼在一起等于没拼（像加法里的 0）');
    if (/\bidem\b/.test(a)) out.push('<b>idem</b>：幂等，X 和 X 拼起来还是 X');
    if (/\bmemo\b/.test(a)) out.push('<b>memo</b>：记住算过的结果，下次直接用');
    m = a.match(/strat:\s*\(([^)]*)\)/);
    if (m) {
      var nums = m[1].trim().split(/\s+/);
      var desc = nums.map(function (n) { return n === '0' ? '尝试重写自己' : '先把第 ' + n + ' 个参数算完'; }).join(' → ');
      var missing = [];
      for (var i = 1; i <= nargs; i++) if (nums.indexOf(String(i)) < 0) missing.push(i);
      out.push('<b>strat: (' + esc(m[1]) + ')</b>：求值顺序是「' + desc + '」' +
        (missing.length ? '；第 ' + missing.join('、') + ' 个参数没写进去，所以<b>不会被主动计算</b>（这就是惰性）' : ''));
    }
    return out;
  }
  function explainLine(raw) {
    var s = raw.trim();
    if (!s) return '';
    if (/^(--|\*\*)/.test(s)) return '注释，系统会忽略这一行，只是写给人看的。';
    var m;
    if ((m = s.match(/^mod!\s+([\w\-]+)/))) return '定义一个模块，名字叫 <b>' + esc(m[1]) + '</b>（相当于一个 .py 文件）。<code>mod!</code> 表示这个模块里的数据只能由构造子搭出来。<code>{</code> 表示模块内容从这里开始。';
    if ((m = s.match(/^mod\*\s+([\w\-]+)/))) return '定义一个「宽松」模块 <b>' + esc(m[1]) + '</b>（<code>mod*</code>）。它只规定「必须满足什么」，常用来当参数的要求，比如 TRIV。' + (/\(/.test(s) ? '括号里是这个模块的参数，像泛型 <code>List[T]</code> 里的 T。' : '');
    if ((m = s.match(/^(pr|protecting|ex|extending|inc|including)\s*\((.*)\)/))) return '导入模块 <b>' + esc(m[2]) + '</b>，这样就能直接使用它里面定义好的类型、算子和规则（像 Python 的 import）。导入内置 NAT 后就能直接写 1、2、3。';
    if ((m = s.match(/^\[(.*)\]$/)) && !/=/.test(s)) {
      var body = m[1];
      if (body.indexOf('<') >= 0) {
        var chain = body.split('<').map(function (x) { return x.trim(); });
        return '声明类型，并说明包含关系：' + chain.map(function (x) { return '<b>' + esc(x) + '</b>'; }).join(' 属于 ') +
          '。<code>&lt;</code> 读作「是……的一部分」，凡是要大类型的地方都能放小类型，反过来不行。';
      }
      return '声明新的类型（sort）：<b>' + esc(body.trim().split(/\s+/).join('、')) + '</b>。方括号只是「声明类型」的写法。';
    }
    if ((m = s.match(/^(ops?)\s+(.+?)\s+:\s+(.*)$/))) {
      var isOps = m[1] === 'ops';
      var rest = m[3].replace(/\s*\.\s*$/, '');
      var arrow = rest.indexOf('->');
      if (arrow < 0) return '声明算子 ' + esc(m[2]) + '。';
      var args = rest.slice(0, arrow).trim();
      var after = rest.slice(arrow + 2).trim();
      var res = after.split(/[\s{]/)[0];
      var attrM = after.match(/\{(.*)\}\s*$/);
      var argList = args ? args.split(/\s+/) : [];
      var names = isOps ? m[2].split(/\s+/) : [m[2]];
      var h;
      if (!argList.length) {
        h = '声明' + (names.length > 1 ? ' ' + names.length + ' 个' : '一个') + '<b>常量</b>：' +
          names.map(function (x) { return '<code>' + esc(x) + '</code>'; }).join('、') + '，它们都是 <b>' + esc(res) + '</b> 类型（没有输入，所以箭头左边是空的）。';
      } else {
        h = '声明' + (names.length > 1 ? '几个' : '一个') + '算子（函数）<code>' + esc(names.join(' ')) + '</code>：输入 ' +
          argList.map(function (x) { return '<b>' + esc(x) + '</b>'; }).join(' 和 ') + '，输出 <b>' + esc(res) + '</b>。' +
          '实际写的时候长这样：<code>' + esc(usage(names[0], argList.length)) + '</code>' +
          (names[0].indexOf('_') >= 0 ? '（<code>_</code> 标出参数写在哪里）' : '') + '。';
      }
      if (attrM) {
        var ex = explainAttrs(attrM[1], argList.length);
        if (ex.length) h += '<br>花括号里是属性：' + ex.join('；') + '。';
      }
      return h;
    }
    if ((m = s.match(/^vars?\s+(.+?)\s*:\s*([\w\-]+)/))) {
      var vs = m[1].split(/\s+/);
      return '声明变量 ' + vs.map(function (x) { return '<code>' + esc(x) + '</code>'; }).join('、') + '，类型是 <b>' + esc(m[2]) +
        '</b>。变量是等式里的占位符，代表「任意一个 ' + esc(m[2]) + '」，像函数的形参。';
    }
    if ((m = s.match(/^(c?eq)\s*(\[[^\]]+\]\s*:)?\s*(.*)$/))) {
      var label = m[2] ? m[2].replace(/[\[\]:\s]/g, '') : '';
      var body2 = m[3].replace(/\s*\.\s*$/, '');
      var cond = '';
      if (m[1] === 'ceq') {
        var ci = body2.lastIndexOf(' if ');
        if (ci >= 0) { cond = body2.slice(ci + 4); body2 = body2.slice(0, ci); }
      }
      var eqi = body2.indexOf(' = ');
      var L = eqi >= 0 ? body2.slice(0, eqi) : body2, R = eqi >= 0 ? body2.slice(eqi + 3) : '';
      var hh = (m[1] === 'ceq' ? '<b>条件</b>规则' : '一条计算规则') + (label ? '（名字叫 ' + esc(label) + '）' : '') +
        '：凡是长成 <code>' + esc(L) + '</code> 这样的式子，都换成 <code>' + esc(R) + '</code>' +
        (cond ? '，但前提是 <code>' + esc(cond) + '</code> 算出来是 true' : '') + '。';
      hh += '系统只会从左往右用这条规则。';
      if (!/\.\s*$/.test(s)) hh += '<br><span class="warn-t">⚠ 这一行末尾没有句号「.」。如果下一行不是它的续写，就是漏写了，这条规则会和下一条粘在一起。</span>';
      return hh;
    }
    if ((m = s.match(/^open\s+([\w\-]+)/))) return '打开模块 <b>' + esc(m[1]) + '</b>，进入「试算模式」：后面的 <code>red</code> 都会用这个模块里的规则来算。在 open 里还可以临时声明常量和等式（做证明时就是这样用的）。';
    if (/^close\b/.test(s)) return '退出试算模式。open 里临时加的东西会全部丢掉。';
    if ((m = s.match(/^(red|reduce)\s+(.*?)\s*\.?\s*$/))) return '让系统把 <code>' + esc(m[2]) + '</code> 一步步化简，直到不能再化简，然后打印结果（red 是 reduce 的缩写）。';
    if (/^set\s+trace/.test(s)) return '打开或关闭「逐步追踪」，打开后会显示每一步用了哪条规则。';
    if (/^show\b/.test(s)) return '显示模块或项的信息。';
    if (/^view\b/.test(s)) return '定义一个 view：说明参数模块里的类型、算子具体用谁来替换。';
    if (/^\}/.test(s)) return '模块到这里结束。注意右花括号后面<b>不要</b>加句号。';
    if (/^\{/.test(s)) return '模块内容开始。';
    if (/^(signature|axioms|imports)\b/.test(s)) return '分组写法：把声明分成「导入 / 签名 / 公理」几块，只是为了好读。';
    return '';
  }
  Learn.explainLine = explainLine;

  /* 运行前的小检查：找出最常见的初学者错误 */
  function lint(src) {
    var lines = src.split('\n'), warns = [];
    for (var i = 0; i < lines.length; i++) {
      var s = lines[i].trim();
      if (/^c?eq\b/.test(s) && !/\.\s*$/.test(s)) {
        var nx = (lines[i + 1] || '').trim();
        if (!nx || /^(c?eq|op|ops|vars?|red|close|open|\}|--|\*\*)\b/.test(nx) || /^\}/.test(nx))
          warns.push({ line: i + 1, text: '第 ' + (i + 1) + ' 行的等式末尾漏了句号「.」' });
      }
      if (/^\}\s*\./.test(s)) warns.push({ line: i + 1, text: '第 ' + (i + 1) + ' 行：右花括号 } 后面不要加句号' });
      var m = s.match(/^c?eq\s*(?:\[[^\]]+\]\s*:)?\s*([A-Z][\w\-]*)\s*=/);
      if (m && /^[A-Z]/.test(m[1])) warns.push({ line: i + 1, text: '第 ' + (i + 1) + ' 行：等式左边只有一个变量 ' + m[1] + '，这是不允许的（它会匹配一切）' });
    }
    return warns;
  }
  function hintFor(msg) {
    if (/没有(名为 )?模块/.test(msg)) return '模块名拼错了，或者这个模块还没有定义。注意大小写要完全一致。';
    if (/red 之前必须先 open/.test(msg)) return '要先写 <code>open 模块名 .</code>，再写 red。';
    if (/必须写在 open 之内|必须写在模块或 open 之内/.test(msg)) return '声明要写在 <code>mod! ... { }</code> 里面，或者写在 <code>open</code> 和 <code>close</code> 之间。';
    if (/多余内容/.test(msg)) return '式子写完后还多了东西。最常见的原因：漏了句号；或者用了没声明过的算子；或者算子的写法和声明里 _ 的位置不一致。';
    if (/表达式不完整/.test(msg)) return '式子没写完，比如 <code>1 +</code> 后面缺了东西，或者括号没有配对。';
    if (/期望/.test(msg)) return '语法结构不对。检查：括号是否配对、冒号 : 和箭头 -&gt; 是否写全、句号有没有漏。';
    if (/无法处理的记号/.test(msg)) return '出现了系统不认识的符号，检查是不是打了中文标点（中文句号「。」、中文括号「（）」）。';
    return '';
  }

  /* =====================================================================
   * 2. 代码块增强
   * ===================================================================== */
  function notesFor(box) {
    var all = global.CODE_NOTES || {};
    return all[box.id] || all[box.getAttribute('data-nk')] || null;
  }
  function renderExplain(box, src) {
    var notes = notesFor(box) || {};
    var lines = src.split('\n');
    var h = '<div class="explain-list">';
    var any = false;
    lines.forEach(function (ln, i) {
      var k = ln.trim();
      if (!k) return;
      var mine = notes[k];
      var auto = mine ? '' : explainLine(k);
      any = true;
      h += '<div class="ex-row"><div class="ex-n">' + (i + 1) + '</div><div class="ex-body"><code class="ex-code">' + esc(ln) +
        '</code><div class="ex-txt">' + (mine || auto || '<span class="dim">（接着上一行写的内容）</span>') +
        (!mine && auto ? ' <span class="auto-tag">自动说明</span>' : '') + '</div></div></div>';
    });
    if (notes.__py) h += '<div class="py-cmp"><div class="card-t">🐍 用 Python 写大概是这样</div><pre>' + esc(notes.__py) + '</pre></div>';
    if (notes.__steps) h += '<div class="py-cmp"><div class="card-t">✍️ 手算过程</div><div>' + notes.__steps + '</div></div>';
    h += '</div>';
    return any ? h : '<div class="dim">没有可以解读的代码行。</div>';
  }
  function updateGutter(box) {
    var pre = box.querySelector('pre'), g = box.querySelector('.gutter');
    if (!pre || !g) return;
    var n = pre.textContent.replace(/\n$/, '').split('\n').length;
    var bad = box._badLines || {};
    var h = '';
    for (var i = 1; i <= n; i++) h += '<div class="' + (bad[i] ? 'bad' : '') + '">' + i + '</div>';
    g.innerHTML = h;
  }
  function enhanceBox(box) {
    if (box._enh) return;
    box._enh = true;
    var pre = box.querySelector('pre');
    if (!pre) return;
    var runnable = !!box.querySelector('.btn-run');
    var head = box.querySelector('.codebox-h');
    if (!head) {
      head = document.createElement('div');
      head.className = 'codebox-h';
      head.innerHTML = '<span>代码</span>';
      box.insertBefore(head, pre);
    }
    var orig = pre.textContent;
    box._orig = orig;
    /* 行号栏 */
    var wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    var gut = document.createElement('div');
    gut.className = 'gutter';
    wrap.appendChild(gut);
    wrap.appendChild(pre);
    /* 工具按钮 */
    var tools = document.createElement('span');
    tools.className = 'cb-tools';
    tools.innerHTML = '<button class="cb-btn" data-a="explain">📖 逐行解读</button>' +
      (runnable ? '<button class="cb-btn" data-a="reset" title="恢复成原来的代码">↺ 还原</button>' : '') +
      '<button class="cb-btn" data-a="copy">⧉ 复制</button>';
    var runBtn = head.querySelector('.btn-run');
    if (runBtn) head.insertBefore(tools, runBtn); else head.appendChild(tools);
    if (runnable) {
      pre.setAttribute('contenteditable', 'plaintext-only');
      pre.setAttribute('spellcheck', 'false');
      pre.classList.add('editable');
      pre.title = '可以直接在这里改代码，然后点「▶ 运行」';
      var tip = document.createElement('div');
      tip.className = 'edit-tip';
      tip.textContent = '✏️ 这段代码可以直接改：改完点「▶ 运行」看结果；改乱了点「↺ 还原」。';
      box.insertBefore(tip, wrap.nextSibling);
      pre.addEventListener('input', function () {
        box._badLines = {};
        updateGutter(box);
        box.classList.toggle('modified', pre.textContent !== orig);
      });
      pre.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '  '); }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (runBtn) runBtn.click(); }
      });
    }
    var panel = document.createElement('div');
    panel.className = 'explain-panel hidden';
    box.appendChild(panel);
    tools.querySelectorAll('.cb-btn').forEach(function (b) {
      b.onclick = function () {
        var a = b.dataset.a;
        if (a === 'explain') {
          var open = panel.classList.contains('hidden');
          if (open) panel.innerHTML = renderExplain(box, pre.textContent);
          panel.classList.toggle('hidden', !open);
          b.classList.toggle('on', open);
          if (open && global.Learn) Learn.glossify(panel);
        } else if (a === 'reset') {
          pre.textContent = orig;
          box._badLines = {};
          box.classList.remove('modified');
          updateGutter(box);
          var out = box.querySelector('.run-out');
          if (out) { out.className = 'run-out'; out.textContent = '已还原成原来的代码'; }
          if (!panel.classList.contains('hidden')) panel.innerHTML = renderExplain(box, orig);
        } else if (a === 'copy') {
          var txt = pre.textContent;
          if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('已复制'); }, function () { toast('复制失败，请手动选中复制'); });
          else toast('请手动选中复制');
        }
      };
    });
    updateGutter(box);
  }

  /* 替换 widgets.js 里的运行函数：增加行号、常见错误提示和小检查 */
  function installRunner() {
    if (!global.W || global.W._learnRun) return;
    var C = global.CafeOBJ;
    global.W._learnRun = true;
    global.W.codeRun = function (boxId) {
      var box = document.getElementById(boxId);
      if (!box) return;
      var pre = box.querySelector('pre');
      var out = box.querySelector('.run-out');
      var src = pre.textContent;
      var bad = {};
      var html = [];
      var warns = lint(src);
      warns.forEach(function (w) { bad[w.line] = 1; html.push('<div class="ln-warn">⚠ ' + esc(w.text) + '</div>'); });
      var hasErr = false;
      try {
        var res = C.runScript(src, C.builtins(), { openTag: 'x' + Math.random().toString(36).slice(2, 7) });
        res.output.forEach(function (o) {
          if (o.kind === 'red') {
            html.push('<div class="ln-red"><span class="dim">red</span> ' + esc(o.input) + '<br>  ⇒ <b class="res">' + esc(o.result) + '</b>  <span class="dim">: ' +
              esc(o.sort || '?') + '　（用了 ' + o.count + ' 步）</span></div>');
          } else if (o.kind === 'err') {
            hasErr = true;
            if (o.line) bad[o.line] = 1;
            var hint = hintFor(o.text);
            html.push('<div class="ln-err">✗ ' + esc(o.text) + (hint ? '<div class="err-hint">💡 ' + hint + '</div>' : '') + '</div>');
          } else if (o.kind === 'msg') {
            html.push('<div class="ln-msg">· ' + esc(o.text) + '</div>');
          }
        });
      } catch (e) {
        hasErr = true;
        html.push('<div class="ln-err">✗ ' + esc(e.message) + '</div>');
      }
      if (!html.length) html.push('<div class="dim">（没有输出。要看到结果，需要写 <code>open 模块 .</code> 和 <code>red 式子 .</code>）</div>');
      out.className = 'run-out' + (hasErr ? ' err' : '');
      out.innerHTML = html.join('');
      box._badLines = bad;
      updateGutter(box);
    };
  }

  /* =====================================================================
   * 3. 术语悬停解释
   * ===================================================================== */
  var NOISY = { red: 1, 'var': 1, vars: 1, eq: 1, strat: 1, AC: 1, rewrite: 1, rewriting: 1, term: 1, terms: 1, sort: 1, sorts: 1, table: 1,
    view: 1, fresh: 1, stack: 1, lazy: 1, module: 1, 'id:': 1, 'pr(': 1, 'mod!': 1, 'mod*': 1, constr: 1, induction: 1, reduction: 1,
    rank: 1, signature: 1, operator: 1, operators: 1, variable: 1, equation: 1, constructor: 1, 'VM': 1, 'prec': 1, 'IH': 1, 'contract': 1 };
  var glRe = null, glMap = null;
  function buildGloss() {
    if (glRe || !global.GLOSSARY) return;
    glMap = {};
    var keys = [];
    global.GLOSSARY.forEach(function (g, i) {
      g.k.forEach(function (k) {
        if (NOISY[k]) return;
        if (/^[\x00-\x7f]+$/.test(k) && k.length < 3) return;
        glMap[k.toLowerCase()] = i;
        keys.push(k);
      });
    });
    keys.sort(function (a, b) { return b.length - a.length; });
    var parts = keys.map(function (k) {
      var e = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return /^[\x00-\x7f]+$/.test(k) ? '(?<![A-Za-z0-9\\-])' + e + '(?![A-Za-z0-9])' : e;
    });
    glRe = new RegExp(parts.join('|'), 'gi');
  }
  var SKIP = { CODE: 1, PRE: 1, TEXTAREA: 1, BUTTON: 1, A: 1, H1: 1, SCRIPT: 1, STYLE: 1, svg: 1, SVG: 1, ABBR: 1, INPUT: 1, SUMMARY: 1 };
  function skipEl(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentNode) {
      if (SKIP[e.tagName]) return true;
      if (e.classList && (e.classList.contains('codebox') || e.classList.contains('run-out') || e.classList.contains('widget') ||
        e.classList.contains('wctl') || e.classList.contains('gl') || e.classList.contains('no-gl'))) return true;
      if (e.id && /^w-/.test(e.id)) return true;
      if (e.classList && e.classList.contains('sec-block')) return false;
    }
    return false;
  }
  Learn.glossify = function (root) {
    buildGloss();
    if (!glRe) return;
    var scopes = root.querySelectorAll('.sec-block');
    if (!scopes.length) scopes = [root];
    Array.prototype.forEach.call(scopes, function (scope) {
      var seen = {};
      var tw = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
      var nodes = [], n;
      while ((n = tw.nextNode())) if (n.nodeValue.trim() && !skipEl(n.parentNode)) nodes.push(n);
      nodes.forEach(function (node) {
        var txt = node.nodeValue, last = 0, m, frag = null;
        glRe.lastIndex = 0;
        while ((m = glRe.exec(txt))) {
          var gi = glMap[m[0].toLowerCase()];
          if (gi === undefined || seen[gi]) continue;
          seen[gi] = 1;
          frag = frag || document.createDocumentFragment();
          frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
          var ab = document.createElement('abbr');
          ab.className = 'gl';
          ab.dataset.g = gi;
          ab.textContent = m[0];
          frag.appendChild(ab);
          last = m.index + m[0].length;
        }
        if (frag) {
          frag.appendChild(document.createTextNode(txt.slice(last)));
          node.parentNode.replaceChild(frag, node);
        }
      });
    });
  };
  var tipEl = null;
  function showTip(ab) {
    var g = global.GLOSSARY[+ab.dataset.g];
    if (!g) return;
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'gl-tip'; document.body.appendChild(tipEl); }
    tipEl.innerHTML = '<div class="gl-t">' + esc(g.t) + (g.ch ? '<span class="gl-ch">' + esc(g.ch) + ' 细讲</span>' : '') + '</div>' +
      '<div>' + g.d + '</div>' + (g.py ? '<div class="gl-py">🐍 类比：' + g.py + '</div>' : '') +
      '<div class="gl-more">点击查看完整术语表</div>';
    tipEl.style.display = 'block';
    var r = ab.getBoundingClientRect();
    var w = Math.min(360, window.innerWidth - 20);
    tipEl.style.width = w + 'px';
    var left = Math.max(10, Math.min(r.left, window.innerWidth - w - 10));
    tipEl.style.left = left + 'px';
    var top = r.bottom + 8;
    tipEl.style.top = top + 'px';
    var th = tipEl.offsetHeight;
    if (top + th > window.innerHeight - 10) tipEl.style.top = Math.max(10, r.top - th - 8) + 'px';
  }
  function hideTip() { if (tipEl) tipEl.style.display = 'none'; }
  document.addEventListener('mouseover', function (e) {
    var ab = e.target.closest && e.target.closest('abbr.gl');
    if (ab) showTip(ab); else hideTip();
  });
  document.addEventListener('click', function (e) {
    var ab = e.target.closest && e.target.closest('abbr.gl');
    if (ab) { hideTip(); Learn.glossary(global.GLOSSARY[+ab.dataset.g].t); }
  });
  window.addEventListener('scroll', hideTip, true);

  /* =====================================================================
   * 4. 术语表 / 搜索
   * ===================================================================== */
  Learn.glossary = function (focus) {
    var body = openModal('📘 术语表（' + (global.GLOSSARY || []).length + ' 个）');
    var h = '<input class="srch" id="gl-q" placeholder="输入术语或关键字过滤，例如：redex、归纳、栈" value="' + esc(focus || '') + '">' +
      '<div id="gl-list"></div>';
    body.innerHTML = h;
    function draw() {
      var q = document.getElementById('gl-q').value.trim().toLowerCase();
      var out = '';
      (global.GLOSSARY || []).forEach(function (g) {
        var hay = (g.t + ' ' + g.k.join(' ') + ' ' + strip(g.d) + ' ' + strip(g.py || '')).toLowerCase();
        if (q && hay.indexOf(q) < 0) return;
        out += '<div class="gl-item"><div class="gl-t">' + esc(g.t) + (g.ch ? '<span class="gl-ch">' + esc(g.ch) + '</span>' : '') + '</div>' +
          '<div>' + g.d + '</div>' + (g.py ? '<div class="gl-py">🐍 类比：' + g.py + '</div>' : '') + '</div>';
      });
      document.getElementById('gl-list').innerHTML = out || '<div class="dim">没有找到。试试别的写法（中文或英文）。</div>';
    }
    document.getElementById('gl-q').oninput = draw;
    draw();
    document.getElementById('gl-q').focus();
  };

  var index = null;
  function buildIndex() {
    if (index) return index;
    index = [];
    (global.CHAPTERS || []).forEach(function (c) {
      c.sections.forEach(function (s) {
        var g = s.guide ? [s.guide.what, s.guide.why, s.guide.how, s.guide.use].concat(s.guide.pitfalls || []).join(' ') : '';
        index.push({ cid: c.id, sid: s.id, chap: c.title, title: s.title, text: strip(s.title + ' ' + g + ' ' + s.html) });
      });
    });
    return index;
  }
  Learn.search = function () {
    var body = openModal('🔍 搜索全部课文');
    body.innerHTML = '<input class="srch" id="s-q" placeholder="输入关键字，例如：strat、无限列表、jumpOnCond、IH">' +
      '<div class="dim" style="font-size:12.5px;margin:6px 0">按回车或直接输入即可，点结果跳到对应小节。</div><div id="s-res"></div>';
    var qEl = document.getElementById('s-q');
    function draw() {
      var q = qEl.value.trim();
      var box = document.getElementById('s-res');
      if (!q) { box.innerHTML = ''; return; }
      var ql = q.toLowerCase(), out = '', n = 0;
      (global.GLOSSARY || []).forEach(function (g) {
        if ((g.t + ' ' + g.k.join(' ')).toLowerCase().indexOf(ql) >= 0)
          out += '<div class="s-item s-gl" data-gl="' + esc(g.t) + '"><b>📘 ' + esc(g.t) + '</b><div class="dim">' + strip(g.d).slice(0, 80) + '…</div></div>';
      });
      buildIndex().forEach(function (it) {
        var i = it.text.toLowerCase().indexOf(ql);
        if (i < 0 || n >= 40) return;
        n++;
        var a = Math.max(0, i - 30), snip = it.text.slice(a, i + q.length + 50);
        var hi = esc(snip).replace(new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), function (x) { return '<mark>' + x + '</mark>'; });
        out += '<div class="s-item" data-c="' + it.cid + '" data-s="' + it.sid + '"><b>' + esc(it.chap) + '</b> › ' + esc(it.title) +
          '<div class="dim">…' + hi + '…</div></div>';
      });
      box.innerHTML = out || '<div class="dim">没有找到「' + esc(q) + '」。</div>';
      box.querySelectorAll('.s-item').forEach(function (el) {
        el.onclick = function () {
          if (el.dataset.gl) { Learn.glossary(el.dataset.gl); return; }
          closeModal();
          App.gotoChap(el.dataset.c, el.dataset.s);
        };
      });
    }
    qEl.oninput = draw;
    qEl.focus();
  };

  /* 章节渲染后由 app.js 调用 */
  Learn.enhance = function (root) {
    installRunner();
    root.querySelectorAll('.codebox').forEach(enhanceBox);
    Learn.glossify(root);
  };

  global.Learn = Learn;
})(window);
