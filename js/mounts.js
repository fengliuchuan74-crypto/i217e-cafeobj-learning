/* =====================================================================
 * mounts.js — 每个 widget 占位符的挂载配置 + 量子模拟器
 * ===================================================================== */
(function (global) {
  'use strict';
  var W = global.W;
  var C = global.CafeOBJ;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function reg() { return C.builtins(); }

  /* ---------------- 表（table）示意图 ---------------- */
  function tableViz(el) {
    var rows = [
      ["'a", '("apple",150)'],
      ["'o", '("orange",100)'],
      ["'t", '("tomato",90)']
    ];
    var h = '<div class="widget-t"><b>表 = 键 → 值</b><span>顺序无关，键互不相同</span></div>';
    h += '<div style="display:grid;grid-template-columns:90px 1fr;gap:8px;max-width:420px">';
    h += '<div style="color:var(--dim2);font-size:12px;text-align:right;padding-top:8px">键 keys</div>' +
      '<div style="color:var(--dim2);font-size:12px;padding-top:8px">值 values</div>';
    rows.forEach(function (r) {
      h += '<div style="background:#172338;border:1px solid #33465e;border-radius:9px;padding:8px;' +
        'text-align:center;font-family:var(--mono);color:#ffd08a">' + esc(r[0]) + '</div>';
      h += '<div style="background:#14202f;border:1px solid #2b3d52;border-radius:9px;padding:8px 12px;' +
        'font-family:var(--mono);color:#a8d8ff">' + esc(r[1]) + '</div>';
    });
    h += '</div>';
    h += '<div class="hint" style="text-align:left;margin-top:10px">用列表写出来就是：' +
      '<code>(\'a,("apple",150)) | (\'o,("orange",100)) | (\'t,("tomato",90)) | empTable</code></div>';
    el.innerHTML = h;
  }

  /* =====================================================================
   * 量子态模拟器（L13）
   * ===================================================================== */
  function Quantum(el, opts) {
    opts = opts || {};
    var n = opts.n || 2;
    var st = {};   // bits -> amplitude (real)
    var trace = [];
    function reset(bits, amp) {
      st = {};
      st[bits] = amp === undefined ? 1 : amp;
      trace = [];
    }
    function keys() { return Object.keys(st).filter(function (k) { return Math.abs(st[k]) > 1e-9; }).sort(); }
    function apply1(k, fn) {
      var ns = {}, ks = keys();
      ks.forEach(function (b) {
        var r = fn(b, st[b]);
        if (!r) return;
        for (var kk in r) ns[kk] = (ns[kk] || 0) + r[kk];
      });
      st = ns;
    }
    function H(k) {
      var s = 1 / Math.sqrt(2);
      apply1(k, function (b, a) {
        if (b[k] === '0') {
          var y = b.substr(0, k) + '1' + b.substr(k + 1);
          var o = {}; o[b] = a * s; o[y] = a * s; return o;
        } else {
          var z = b.substr(0, k) + '0' + b.substr(k + 1);
          var o2 = {}; o2[z] = a * s; o2[b] = -a * s; return o2;
        }
      });
    }
    function X(k) {
      apply1(k, function (b, a) {
        var y = b.substr(0, k) + (b[k] === '0' ? '1' : '0') + b.substr(k + 1);
        var o = {}; o[y] = a; return o;
      });
    }
    function Z(k) {
      apply1(k, function (b, a) {
        var o = {}; o[b] = (b[k] === '1') ? -a : a; return o;
      });
    }
    function CX(c, t) {
      apply1(0, function (b, a) {
        var o = {};
        if (b[c] === '1') {
          var y = b.substr(0, t) + (b[t] === '0' ? '1' : '0') + b.substr(t + 1);
          o[y] = a;
        } else o[b] = a;
        return o;
      });
    }
    function ampStr(a) {
      if (Math.abs(a - 1) < 1e-9) return '1';
      if (Math.abs(a + 1) < 1e-9) return '-1';
      if (Math.abs(Math.abs(a) - 1 / Math.sqrt(2)) < 1e-6) return (a < 0 ? '-1/√2' : '1/√2');
      if (Math.abs(Math.abs(a) - 0.5) < 1e-9) return (a < 0 ? '-1/2' : '1/2');
      if (Math.abs(a - Math.sqrt(0.5)) < 1e-6) return '1/√2';
      return (Math.round(a * 1000) / 1000).toString();
    }
    function render() {
      var ks = keys();
      var h = '<div class="widget-t"><b>' + esc(opts.title || '量子态模拟器') + '</b>' +
        '<span>共 ' + n + ' 个 qubit，比特串按 |q' + (n - 1) + '…q0&gt; 读</span></div>';
      if (!ks.length) {
        h += '<div class="dim">（零态：所有振幅都是 0）</div>';
      } else {
        h += '<div style="display:flex;flex-direction:column;gap:6px">';
        ks.forEach(function (b) {
          var a = st[b], p = a * a;
          var w = Math.max(2, Math.round(p * 100));
          h += '<div style="display:flex;align-items:center;gap:10px">' +
            '<span style="font-family:var(--mono);color:#8fd0ff;width:76px">|' + b + '&gt;</span>' +
            '<span style="font-family:var(--mono);color:#ffd08a;width:70px">' + ampStr(a) + '</span>' +
            '<div style="flex:1;height:8px;background:#101a26;border-radius:4px;overflow:hidden">' +
            '<div style="width:' + w + '%;height:100%;background:linear-gradient(90deg,#4ea8ff,#a86bd8)"></div></div>' +
            '<span class="dim" style="font-size:11.5px;width:64px">p=' + (Math.round(p * 1000) / 1000) + '</span></div>';
        });
        h += '</div>';
      }
      if (trace.length) {
        h += '<div class="hint" style="text-align:left;margin-top:10px">' +
          trace.slice(-4).map(function (t) { return '· ' + esc(t); }).join('<br>') + '</div>';
      }
      el.innerHTML = h;
    }

    /* ---------- 模式 A：自由操作门 ---------- */
    if (opts.mode === 'gate') {
      reset('00');
      var box = document.createElement('div');
      el.innerHTML = '';
      el.appendChild(box);
      var ctl = document.createElement('div');
      var html = '<div class="widget-t"><b>量子态模拟器（真实振幅计算）</b><span>点按钮，看态怎么变</span></div>' +
        '<div id="' + el.id + '-view"></div>' +
        '<div class="wctl">' +
        '<button class="mini-btn" data-g="H0">H(q0)</button>' +
        '<button class="mini-btn" data-g="H1">H(q1)</button>' +
        '<button class="mini-btn" data-g="CX01">CX(q0→q1)</button>' +
        '<button class="mini-btn" data-g="X0">X(q0)</button>' +
        '<button class="mini-btn" data-g="X1">X(q1)</button>' +
        '<button class="mini-btn" data-g="Z0">Z(q0)</button>' +
        '<button class="mini-btn" data-g="Z1">Z(q1)</button>' +
        '<button class="mini-btn" data-g="M0">测量 q0</button>' +
        '<button class="mini-btn" data-g="reset">重置 |00&gt;</button></div>' +
        '<div class="hint" style="text-align:left;margin-top:8px">提示：先 H(q0) 再 CX(q0→q1) 就得到 Bell 对 ' +
        '(|00&gt;+|11&gt;)/√2 —— 这就是隐形传态要用的纠缠资源。</div>';
      el.innerHTML = html;
      var view = document.getElementById(el.id + '-view');
      function paint() { Quantum_render(view, st, keys, ampStr, trace, n); }
      el.querySelectorAll('[data-g]').forEach(function (b) {
        b.onclick = function () {
          var g = b.dataset.g;
          if (g === 'H0') { H(0); trace.push('H(q0)'); }
          else if (g === 'H1') { H(1); trace.push('H(q1)'); }
          else if (g === 'CX01') { CX(0, 1); trace.push('CX(q0→q1)'); }
          else if (g === 'X0') { X(0); trace.push('X(q0)'); }
          else if (g === 'X1') { X(1); trace.push('X(q1)'); }
          else if (g === 'Z0') { Z(0); trace.push('Z(q0)'); }
          else if (g === 'Z1') { Z(1); trace.push('Z(q1)'); }
          else if (g === 'M0') {
            var p0 = 0, p1 = 0, ks = keys();
            ks.forEach(function (b) { if (b[0] === '0') p0 += st[b] * st[b]; else p1 += st[b] * st[b]; });
            var got = Math.random() < p0 ? '0' : '1';
            var ns = {};
            ks.forEach(function (b) {
              if (b[0] === got) ns[b] = st[b] / Math.sqrt(got === '0' ? p0 : p1);
            });
            st = ns;
            trace.push('测量 q0 → ' + got + '（塌缩，总概率重归 1）');
          }
          else if (g === 'reset') { reset('00'); }
          paint();
        };
      });
      paint();
    }

    /* ---------- 模式 B：隐形传态分步 ---------- */
    if (opts.mode === 'tele') {
      // 3 qubits: q0 = a|0>+b|1>, q1,q2 = Bell
      var A = 0.6, B = 0.8;   // 0.36+0.64=1
      var steps = [];
      function state(str) { return str; }
      var s0 = {};   // (a|0>+b|1>)_q0 ⊗ (|00>+|11>)/√2 _q1q2
      s0['000'] = A / Math.sqrt(2);
      s0['011'] = A / Math.sqrt(2);   // q0=0,q1=1,q2=1 → bits '011'
      s0['100'] = B / Math.sqrt(2);
      s0['111'] = B / Math.sqrt(2);
      // 说明：比特串写作 q0 q1 q2
      steps.push({
        t: '① 初始：q0 = 0.6|0&gt; + 0.8|1&gt;（待传态），q1q2 = Bell 对',
        st: s0, note: '比特串写作 q0q1q2'
      });
      // CX(q0,q1)
      var s1 = {};
      Object.keys(s0).forEach(function (b) {
        var nb = b;
        if (b[0] === '1') nb = b[0] + (b[1] === '0' ? '1' : '0') + b[2];
        s1[nb] = (s1[nb] || 0) + s0[b];
      });
      steps.push({ t: '② CX(q0→q1)：Alice 做受控非门', st: s1 });
      // H(q0)
      var s2 = {};
      var hf = 1 / Math.sqrt(2);
      Object.keys(s1).forEach(function (b) {
        var a = s1[b];
        var b0 = '0' + b.substr(1), b1 = '1' + b.substr(1);
        if (b[0] === '0') {
          s2[b0] = (s2[b0] || 0) + a * hf;
          s2[b1] = (s2[b1] || 0) + a * hf;
        } else {
          s2[b0] = (s2[b0] || 0) + a * hf;
          s2[b1] = (s2[b1] || 0) - a * hf;
        }
      });
      steps.push({ t: '③ H(q0)：Alice 做 Hadamard 门', st: s2 });
      steps.push({
        t: '④ Alice 测量 q0、q1，得到两个比特 (m0,m1)；Bob 的 q2 变成四种可能之一',
        st: s2,
        note: '四种 (m0,m1) 各占 1/4 概率，每种里 q2 相差一个 X/Z 修正'
      });
      function fix(m0, m1) {
        // 只保留 q0=m0,q1=m1 的分支，再对 q2 施加修正，看是否恢复 A|0>+B|1>
        var out = {};
        Object.keys(s2).forEach(function (b) {
          if (b[0] !== m0 || b[1] !== m1) return;
          var bit = b[2];
          out[bit] = (out[bit] || 0) + s2[b];
        });
        // 修正：m1=1 → X(q2); m0=1 → Z(q2)
        var cur = out;
        if (m1 === '1') {
          var t1 = {};
          Object.keys(cur).forEach(function (k) { t1[k === '0' ? '1' : '0'] = cur[k]; });
          cur = t1;
        }
        if (m0 === '1') {
          var t2 = {};
          Object.keys(cur).forEach(function (k) { t2[k] = (k === '1') ? -cur[k] : cur[k]; });
          cur = t2;
        }
        // 测量后分支概率为 1/4，重新归一化（除以分支振幅的模长）才是 Bob 手里的量子态
        var nrm = Math.sqrt((cur['0'] || 0) * (cur['0'] || 0) + (cur['1'] || 0) * (cur['1'] || 0));
        if (nrm > 1e-12) {
          Object.keys(cur).forEach(function (k) { cur[k] = cur[k] / nrm; });
        }
        return cur;
      }
      var finalOK = true;
      for (var m0 = 0; m0 < 2; m0++) for (var m1 = 0; m1 < 2; m1++) {
        var r = fix(String(m0), String(m1));
        var a0 = Math.abs(r['0'] || 0), a1 = Math.abs(r['1'] || 0);
        if (Math.abs(a0 - A) > 1e-6 || Math.abs(a1 - B) > 1e-6) finalOK = false;
      }
      steps.push({
        t: '⑤ Bob 按 (m0,m1) 施加修正：m1=1 就 X(q2)，m0=1 就 Z(q2)',
        st: fix('0', '0'), finalNote: true,
        note: finalOK ? '✓ 四种情形全部恢复成 0.6|0&gt; + 0.8|1&gt; —— 传态成功' : '（检查未通过）'
      });

      var cur2 = 0;
      el.innerHTML = '<div class="widget-t"><b>隐形传态：分步看量子态</b>' +
        '<span>q0 待传态，q1/q2 是 Bell 对</span></div>' +
        '<div id="' + el.id + '-t" class="dim" style="font-size:12.5px;min-height:34px;margin-bottom:8px"></div>' +
        '<div id="' + el.id + '-v"></div>' +
        '<div class="wctl"><button class="mini-btn" data-t="prev">◀ 上一步</button>' +
        '<button class="mini-btn" data-t="next">下一步 ▶</button>' +
        '<button class="mini-btn" data-t="reset">从头</button>' +
        '<span class="dim" style="font-size:11.5px" id="' + el.id + '-i"></span></div>';
      var v = document.getElementById(el.id + '-v');
      var tt = document.getElementById(el.id + '-t');
      var ii = document.getElementById(el.id + '-i');
      function show(k) {
        cur2 = Math.max(0, Math.min(k, steps.length - 1));
        var s = steps[cur2];
        tt.textContent = s.t;
        ii.textContent = (cur2 + 1) + ' / ' + steps.length;
        Quantum_render(v, s.st, function () { return Object.keys(s.st).filter(function (x) { return Math.abs(s.st[x]) > 1e-9; }).sort(); }, ampStr, s.note ? [s.note] : [], 3);
      }
      el.querySelectorAll('[data-t]').forEach(function (b) {
        b.onclick = function () {
          var a = b.dataset.t;
          if (a === 'next') show(cur2 + 1);
          else if (a === 'prev') show(cur2 - 1);
          else show(0);
        };
      });
      show(0);
    }

    function Quantum_render(box, stt, keysFn, ampF, tr, nn) {
      var ks = keysFn();
      var h = '';
      if (!ks.length) { h = '<div class="dim">（零态）</div>'; box.innerHTML = h; return; }
      h += '<div style="display:flex;flex-direction:column;gap:6px">';
      ks.forEach(function (b) {
        var a = stt[b], p = a * a;
        var w = Math.max(2, Math.round(p * 100));
        h += '<div style="display:flex;align-items:center;gap:10px">' +
          '<span style="font-family:var(--mono);color:#8fd0ff;width:82px">|' + b + '&gt;</span>' +
          '<span style="font-family:var(--mono);color:#ffd08a;width:74px">' + ampF(a) + '</span>' +
          '<div style="flex:1;height:8px;background:#101a26;border-radius:4px;overflow:hidden">' +
          '<div style="width:' + w + '%;height:100%;background:linear-gradient(90deg,#4ea8ff,#a86bd8)"></div></div>' +
          '<span class="dim" style="font-size:11.5px;width:66px">p=' + (Math.round(p * 1000) / 1000) + '</span></div>';
      });
      h += '</div>';
      if (tr && tr.length) {
        h += '<div class="hint" style="text-align:left;margin-top:10px;color:#9fe8c0">' +
          tr.map(function (x) { return esc(x); }).join('<br>') + '</div>';
      }
      box.innerHTML = h;
    }
  }

  /* =====================================================================
   * 挂载表
   * ===================================================================== */
  var M = {};

  M['w-l1-lat'] = function (el) { W.lattice(el, { mod: 'NAT' }); };
  M['w-l1-tree'] = function (el) {
    W.termTree(el, { mod: 'NAT', term: 's(s(0)) + s(0)', note: '根是 <code>_+_</code>，左子树是 <code>s(s(0))</code>（=2），右子树是 <code>s(0)</code>（=1）。' });
  };
  M['w-l2-lat'] = function (el) { W.lattice(el, { mod: 'NATLIST' }); };
  M['w-l2-tree'] = function (el) {
    W.termTree(el, { mod: 'NATLIST', term: '(1 | 2 | nil) @ (3 | nil)', note: '<code>@</code> 的左边是一棵完整的列表树，右边也是。归约就是不断把 <code>@</code> 往右推。' });
  };
  M['w-l3-tree'] = function (el) {
    W.termTree(el, { mod: 'NAT', term: 's(0) + (s(0) * s(s(0)))', note: '位置 <code>2.2</code> 是 <code>s(s(0))</code>，位置 <code>2.2.1</code> 是 <code>s(0)</code>。' });
  };
  M['w-l3-reduce'] = function (el) {
    W.reducePlayer(el, { mod: 'PNAT1', term: 'fact1(s(s(s(0))))', maxSteps: 80 });
  };
  M['w-l5-table'] = function (el) { tableViz(el); };

  M['w-l6-strat'] = function (el) {
    W.strategyDemo(el, {
      mod: 'INF-LIST', term: '0 | mkNILFrom(1)', op: '_|_', outer: [0, 1, 0], maxSteps: 18,
      note: '左边 (1 0)：先把头 0 算成 0，然后试根（没有规则），<b>停下来</b> —— 这就是惰性。<br>' +
        '右边 (0 1 0)：先试根（没有规则），再去算尾巴 <code>mkNILFrom(1)</code>，它又长成 <code>1 | mkNILFrom(2)</code>，' +
        '于是无限增长 —— <b>这就是发散</b>。所以 <code>_|_</code> 必须写 <code>{strat: (1 0)}</code>。'
    });
  };
  M['w-l6-take'] = function (el) {
    W.listDemo(el, { kind: 'takedrop', n: 8, title: 'take 与 drop：一个从前面取，一个从前面丢' });
  };
  M['w-l6-sieve'] = function (el) {
    W.listDemo(el, { kind: 'sieve', max: 60, title: '埃拉托斯特尼筛法：把倍数一个个划掉' });
  };
  M['w-l6-ham'] = function (el) {
    W.listDemo(el, { kind: 'hamming', n: 12, title: 'Hamming 数：2/3/5 的倍数归并去重' });
  };
  M['w-l8-lab'] = function (el) {
    W.minila(el, { src: 'y := 0 ; x := 1 ; while x < 4 do y := y + x ; x := x + 1 od', env: { x: 0, y: 0 } });
  };
  M['w-l9-lab'] = function (el) {
    W.minila(el, { src: 'y := 0 ; x := 0 ; while x < 3 do y := y + x ; x := x + 1 od', env: { x: 0, y: 0 } });
  };
  M['w-l10-lab'] = function (el) {
    W.minila(el, { src: 'z := 1 ; if x < 2 then z := x + 10 else z := x * 10 fi', env: { x: 3, z: 0 } });
  };
  M['w-l13-gate'] = function (el) { Quantum(el, { mode: 'gate', n: 2 }); };
  M['w-l13-tele'] = function (el) { Quantum(el, { mode: 'tele' }); };

  W.MOUNT = M;
  W.Quantum = Quantum;
})(window);
