/* =====================================================================
 * quiz.js — 进度存储 / 随堂小测 / 章节测验 / 闪卡 / 间隔复习
 * ===================================================================== */
(function (global) {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ============================ 进度存储 ============================ */
  var KEY = 'i217e:progress:v1';
  var data = null;
  function load() {
    if (data) return data;
    try { data = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { data = {}; }
    data.done = data.done || {};        // 已掌握的知识点 / 小测
    data.quiz = data.quiz || {};        // quizId -> {score,total,at}
    data.review = data.review || [];    // 复习队列 [{id,title,level,due,chap}]
    data.hw = data.hw || {};            // 作业勾选与草稿
    data.visited = data.visited || {};
    return data;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(load())); } catch (e) { }
  }
  var Store = {
    raw: function () { return load(); },
    isDone: function (id) { return !!load().done[id]; },
    markDone: function (id) { load().done[id] = Date.now(); save(); },
    unmark: function (id) { delete load().done[id]; save(); },
    toggleDone: function (id) {
      if (Store.isDone(id)) { Store.unmark(id); return false; }
      Store.markDone(id); return true;
    },
    countDone: function (ids) {
      var n = 0; ids.forEach(function (i) { if (Store.isDone(i)) n++; }); return n;
    },
    recordQuiz: function (id, score, total) {
      load().quiz[id] = { score: score, total: total, at: Date.now() };
      if (score === total) Store.markDone(id);
      save();
    },
    quizResult: function (id) { return load().quiz[id] || null; },
    /* 间隔复习：答错进队列，1→3→7→21 天 */
    pushReview: function (item) {
      var d = load(), found = null;
      for (var i = 0; i < d.review.length; i++) if (d.review[i].id === item.id) found = d.review[i];
      var now = Date.now();
      if (found) {
        found.level = Math.min(found.level + 1, 4);
      } else {
        found = { id: item.id, title: item.title, chap: item.chap || '', level: 0, due: now };
        d.review.push(found);
      }
      var days = [1, 3, 7, 21, 60][found.level] || 1;
      found.due = now + days * 86400000;
      save();
    },
    dueReview: function () {
      var now = Date.now();
      return load().review.filter(function (r) { return r.due <= now; });
    },
    allReview: function () { return load().review; },
    removeReview: function (id) {
      var d = load();
      d.review = d.review.filter(function (r) { return r.id !== id; });
      save();
    },
    hwDone: function (key) { return !!load().hw[key]; },
    setHw: function (key, val) { load().hw[key] = val; save(); },
    visit: function (id) { load().visited[id] = Date.now(); save(); },
    resetAll: function () { data = { done: {}, quiz: {}, review: [], hw: {}, visited: {} }; save(); }
  };
  global.Store = Store;

  /* ============================ 弹窗 ============================ */
  function openModal(title) {
    $('modal-title').textContent = title;
    $('modal-back').classList.remove('hidden');
    $('modal-body').innerHTML = '';
    return $('modal-body');
  }
  function closeModal() { $('modal-back').classList.add('hidden'); }
  global.closeModal = closeModal;
  global.openModal = openModal;

  function toast(msg, ms) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.add('hidden'); }, ms || 2200);
  }
  global.toast = toast;

  /* ============================ 选择题测验 ============================ */
  var Quiz = {};

  Quiz.open = function (id) {
    var spec = global.QUIZZES && global.QUIZZES[id];
    if (!spec) { toast('找不到题目：' + id); return; }
    var items = spec.items.slice();
    var idx = 0, score = 0;
    var body = openModal(spec.title || '测验');

    function render() {
      if (idx >= items.length) return finish();
      var it = items[idx];
      var h = '<div class="q-prog">第 ' + (idx + 1) + ' / ' + items.length + ' 题' +
        (it.tag ? ' · <span style="color:#8fd0ff">' + esc(it.tag) + '</span>' : '') + '</div>';
      h += '<div class="q-stem">' + it.q + '</div>';
      if (it.code) {
        h += '<div class="codebox"><pre>' + esc(it.code) + '</pre></div>';
      }
      if (it.opts) {
        h += '<div class="opts">';
        it.opts.forEach(function (o, i) {
          h += '<div class="opt" data-i="' + i + '"><span class="k">' + 'ABCDEF'[i] + '</span><span class="txt">' + o + '</span></div>';
        });
        h += '</div>';
      } else {
        h += '<div class="opts"><div class="opt" data-i="0"><span class="k">A</span><span class="txt">对（对/错题）</span></div>' +
          '<div class="opt" data-i="1"><span class="k">B</span><span class="txt">错</span></div></div>';
        it.opts = null;
      }
      h += '<div id="q-explain"></div>';
      h += '<div class="q-foot"><span class="q-prog" id="q-msg"></span>' +
        '<button class="btn-main" id="q-next" disabled>' + (idx === items.length - 1 ? '看结果' : '下一题') + '</button></div>';
      body.innerHTML = h;

      var answered = false, chosen = -1;
      var ansIdx = it.a !== undefined ? it.a : (it.answer === true ? 0 : (it.answer === false ? 1 : it.a));
      body.querySelectorAll('.opt').forEach(function (el) {
        el.onclick = function () {
          if (answered) return;
          answered = true;
          chosen = +el.dataset.i;
          var ok = chosen === ansIdx;
          if (ok) score++;
          body.querySelectorAll('.opt').forEach(function (x, i) {
            if (i === ansIdx) x.classList.add('right');
            else if (i === chosen) x.classList.add('wrong');
          });
          var ex = $('q-explain');
          var ow = '';
          if (it.optWhy && it.optWhy.length) {
            var labels = it.opts ? it.opts : ['对', '错'];
            ow = '<div class="opt-why"><div class="ow-t">每个选项为什么对 / 错：</div>';
            it.optWhy.forEach(function (w, i) {
              if (!w) return;
              ow += '<div class="ow-row ' + (i === ansIdx ? 'ok' : (i === chosen ? 'bad' : '')) + '"><span class="k">' + 'ABCDEF'[i] + '</span>' +
                '<span><span class="ow-opt">' + (labels[i] || '') + '</span> — ' + w + '</span></div>';
            });
            ow += '</div>';
          }
          ex.innerHTML = '<div class="q-explain"><b>' + (ok ? '✓ 正确' : '✗ 不对，正确答案是 ' + 'ABCDEF'[ansIdx]) + '</b>　' + (it.why || '') + ow + '</div>';
          $('q-next').disabled = false;
          $('q-msg').textContent = ok ? '很好，继续' : '记住这个点，它容易考';
          if (!ok) Store.pushReview({ id: 'q:' + id + ':' + idx, title: (spec.title || '测验') + ' 第 ' + (idx + 1) + ' 题' });
        };
      });
      $('q-next').onclick = function () { idx++; render(); };
    }

    function finish() {
      var pct = Math.round(score / items.length * 100);
      var good = pct >= 80;
      Store.recordQuiz(id, score, items.length);
      var h = '<div class="result-bar ' + (good ? 'good' : 'bad') + '"><div class="score">' + score + ' / ' + items.length + '</div>' +
        '<div><b>' + (pct === 100 ? '满分！这个知识点你已经拿下了' : (good ? '不错，基本掌握' : '还需要再看一遍')) + '</b>' +
        '<div class="dim" style="font-size:12px">正确率 ' + pct + '%' + (good ? '' : ' · 建议回到本节重读一遍再测') + '</div></div></div>';
      if (!good) {
        for (var i = 0; i < items.length; i++) Store.pushReview({ id: 'q:' + id + ':r' + i, title: (spec.title || '测验') + ' 重点' });
      }
      h += '<div class="q-foot"><button class="btn-ghost" id="q-retry">再测一次</button>' +
        '<button class="btn-main" id="q-close">完成</button></div>';
      body.innerHTML = h;
      $('q-close').onclick = function () {
        closeModal();
        if (global.App && App.refreshProgress) App.refreshProgress();
        if (good) toast('已记录：' + (spec.title || '小测') + ' ✓');
      };
      $('q-retry').onclick = function () { idx = 0; score = 0; render(); };
    }

    render();
  };

  /* ============================ 闪卡 ============================ */
  Quiz.flash = function (spec) {
    var cards = spec.cards.slice();
    var i = 0, flipped = false;
    var body = openModal(spec.title || '闪卡记忆');
    function render() {
      if (i >= cards.length) {
        body.innerHTML = '<div class="result-bar good"><div class="score">✓</div><div><b>这一组卡片过完了</b>' +
          '<div class="dim" style="font-size:12px">重复 3 遍比看 1 遍更有效</div></div></div>' +
          '<div class="q-foot"><button class="btn-ghost" id="f-again">再来一遍</button><button class="btn-main" id="f-close">关闭</button></div>';
        $('f-again').onclick = function () { i = 0; flipped = false; render(); };
        $('f-close').onclick = closeModal;
        return;
      }
      var c = cards[i];
      var h = '<div class="q-prog">卡片 ' + (i + 1) + ' / ' + cards.length + '</div>';
      h += '<div class="card" style="min-height:150px;display:flex;flex-direction:column;justify-content:center;' +
        'cursor:pointer;border-color:#3d5b80" id="f-card">' +
        '<div style="font-size:17px;font-weight:700;line-height:1.7">' + c.q + '</div>' +
        (flipped ? '<div style="margin-top:14px;padding-top:12px;border-top:1px dashed #2a3648;font-size:14px;color:#bfe0ff">' + c.a + '</div>'
          : '<div class="dim" style="margin-top:14px;font-size:12px">点击卡片翻面</div>') + '</div>';
      h += '<div class="q-foot"><span class="q-prog">' + (flipped ? '想清楚了吗？' : '先在脑子里回答，再翻面') + '</span>' +
        '<div style="display:flex;gap:8px"><button class="btn-ghost" id="f-hard">有点模糊</button>' +
        '<button class="btn-main" id="f-ok">记得</button></div></div>';
      body.innerHTML = h;
      $('f-card').onclick = function () { flipped = !flipped; render(); };
      $('f-ok').onclick = function () { i++; flipped = false; render(); };
      $('f-hard').onclick = function () {
        cards.push(cards[i]);
        Store.pushReview({ id: 'fc:' + (spec.title || '') + ':' + i, title: c.q.replace(/<[^>]+>/g, '').slice(0, 40) });
        i++; flipped = false; render();
      };
    }
    render();
  };

  /* ============================ 复习队列 ============================ */
  Quiz.reviewQueue = function () {
    var due = Store.dueReview(), all = Store.allReview();
    var body = openModal('复习队列（间隔复习）');
    var h = '<div class="dim" style="font-size:13px;margin-bottom:10px">答错的知识点会自动进入复习队列，' +
      '按 1 天 → 3 天 → 7 天 → 21 天 的间隔重复出现。这是对抗遗忘最有效的办法。</div>';
    if (!all.length) {
      h += '<div class="card tip"><div class="card-t">🌱 队列是空的</div>做题时答错的点会自动排进来。现在没有待复习内容。</div>';
    } else {
      h += '<div style="font-size:12.5px;color:var(--dim);margin-bottom:8px">今天到期：<b>' + due.length + '</b> 条 · 总计 ' + all.length + ' 条</div>';
      all.forEach(function (r) {
        var isDue = r.due <= Date.now();
        var days = Math.max(0, Math.ceil((r.due - Date.now()) / 86400000));
        h += '<div class="step-row" style="margin-bottom:6px"><span class="idx">' + (isDue ? '●' : '○') + '</span>' +
          '<span class="trm" style="flex:1">' + esc(r.title) + '</span>' +
          '<span class="rule">' + (isDue ? '现在复习' : days + ' 天后') + '</span></div>';
      });
    }
    h += '<div class="q-foot"><button class="btn-ghost" id="r-clear">清空队列</button>' +
      '<button class="btn-main" id="r-close">关闭</button></div>';
    body.innerHTML = h;
    $('r-close').onclick = closeModal;
    $('r-clear').onclick = function () {
      Store.raw().review = []; try { localStorage.setItem(KEY, JSON.stringify(Store.raw())); } catch (e) { }
      closeModal(); toast('复习队列已清空');
    };
  };

  global.Quiz = Quiz;
})(window);
