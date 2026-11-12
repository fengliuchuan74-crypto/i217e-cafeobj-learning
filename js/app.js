/* =====================================================================
 * app.js — 外壳：导航 / 路由 / 进度 / 倒数 / 挂载
 * ===================================================================== */
(function (global) {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var App = {};
  var chapters = [];
  var steps = [];       // [{chap, sec}]
  var curStep = 0;

  function buildIndex() {
    chapters = (global.CHAPTERS || []).slice();
    steps = [];
    chapters.forEach(function (c) {
      c.sections.forEach(function (s, i) { steps.push({ chap: c, sec: s, i: i }); });
    });
  }

  function totalPoints() {
    var n = 0;
    chapters.forEach(function (c) {
      n += c.sections.length;
      if (c.quiz && global.QUIZZES && global.QUIZZES[c.quiz]) n += 1;
    });
    return n;
  }
  function donePoints() {
    var n = 0;
    chapters.forEach(function (c) {
      c.sections.forEach(function (s) { if (Store.isDone(s.id)) n++; });
      if (c.quiz && Store.quizResult(c.quiz)) n += 1;
    });
    return n;
  }

  App.refreshProgress = function () {
    var tot = totalPoints(), dn = donePoints();
    var pct = tot ? Math.round(dn / tot * 100) : 0;
    $('pb-bar').style.width = pct + '%';
    $('pb-pct').textContent = pct + '%';
    $('pb-sub').textContent = dn + ' / ' + tot + ' 个知识点';
    document.querySelectorAll('.nav-item').forEach(function (el) {
      var cid = el.dataset.chap;
      var c = chapters.filter(function (x) { return x.id === cid; })[0];
      if (!c) return;
      var all = c.sections.every(function (s) { return Store.isDone(s.id); });
      el.classList.toggle('done', all);
    });
    var due = Store.dueReview().length;
    var rc = $('review-count');
    if (rc) { rc.textContent = due; rc.style.color = due ? '#ffb454' : ''; }
  };

  /* ---------------- 导航 ---------------- */
  function buildNav() {
    var nav = $('nav');
    var byGroup = [];
    chapters.forEach(function (c) {
      var g = byGroup.filter(function (x) { return x.g === c.group; })[0];
      if (!g) { g = { g: c.group, items: [] }; byGroup.push(g); }
      g.items.push(c);
    });
    var h = '';
    byGroup.forEach(function (g) {
      h += '<div class="nav-group"><div class="nav-group-title">' + esc(g.g) + '</div>';
      g.items.forEach(function (c) {
        h += '<div class="nav-item" data-chap="' + c.id + '">' +
          '<span class="num">' + esc(c.num || '') + '</span>' +
          '<span>' + esc(c.short || c.title) + '</span>' +
          '<span class="tick">✓</span></div>';
      });
      h += '</div>';
    });
    nav.innerHTML = h;
    nav.querySelectorAll('.nav-item').forEach(function (el) {
      el.onclick = function () { App.gotoChap(el.dataset.chap); };
    });
  }

  /* ---------------- 章节渲染 ---------------- */
  function sectionBlock(c, s, idx) {
    var done = Store.isDone(s.id);
    var h = '<section class="sec-block" id="sec-' + s.id + '" data-sec="' + s.id + '">';
    h += '<h2 class="sec">' + (idx + 1) + '. ' + s.title +
      (done ? ' <span class="badge ok">✓ 已掌握</span>' : '') + '</h2>';
    h += s.html;
    h += '<div class="sec-foot" style="display:flex;justify-content:space-between;align-items:center;' +
      'margin:16px 0 6px;padding-top:10px;border-top:1px dashed #223046">' +
      '<span class="dim" style="font-size:11.5px">' + esc(s.id) + '</span>' +
      '<button class="mini-btn btn-know" data-sec="' + s.id + '">' + (done ? '取消「已掌握」' : '✓ 我学会了这一节') + '</button>' +
      '</div></section>';
    return h;
  }

  App.renderChapter = function (cid, secId) {
    var c = chapters.filter(function (x) { return x.id === cid; })[0];
    if (!c) { App.gotoChap(chapters[0].id); return; }
    Store.visit(cid);
    var h = '<h1 class="chap-title">' + esc(c.title) + '</h1>';
    h += '<div class="chap-sub">' + (c.sub || '') + '</div>';
    if (c.goals && c.goals.length) {
      h += '<div class="card why"><div class="card-t"><span class="ico">🎯</span>这一章你要能做什么</div><ul>';
      c.goals.forEach(function (g) { h += '<li>' + g + '</li>'; });
      h += '</ul></div>';
    }
    c.sections.forEach(function (s, i) { h += sectionBlock(c, s, i); });
    if (c.quiz && global.QUIZZES && global.QUIZZES[c.quiz]) {
      var r = Store.quizResult(c.quiz);
      h += '<div class="quiz-cta ' + (r ? 'done' : '') + '" data-quiz="' + c.quiz + '">' +
        '<span class="q-ico">🧪</span><span class="q-txt"><b>本章综合测验</b>' +
        '<span>' + (r ? ('上次 ' + r.score + '/' + r.total + '，可以再测一次') : '把这一章的知识点连起来考') + '</span></span>' +
        '<span class="q-go">' + (r ? '再测一次 →' : '开始 →') + '</span></div>';
    }
    if (c.flash && global.QUIZZES && global.QUIZZES[c.flash]) {
      h += '<div class="quiz-cta" data-flash="' + c.flash + '"><span class="q-ico">🃏</span>' +
        '<span class="q-txt"><b>闪卡记忆</b><span>碎片时间快速过一遍，比通读更有效</span></span>' +
        '<span class="q-go">开始 →</span></div>';
    }
    if (c.extra) h += c.extra;
    $('view').innerHTML = h;

    /* 挂载 widget */
    c.sections.forEach(function (s) {
      if (typeof s.after === 'function') {
        try { s.after(document); } catch (e) { console.error('widget 挂载失败', s.id, e); }
      }
    });
    /* 统一挂载：任何 id 在 W.MOUNT 里的占位元素 */
    $('view').querySelectorAll('[id^="w-"]').forEach(function (el) {
      var fn = global.W && W.MOUNT && W.MOUNT[el.id];
      if (!fn) return;
      try { fn(el); } catch (e) {
        console.error('widget 挂载失败', el.id, e);
        el.innerHTML = '<div class="run-out err">组件加载失败：' + (e && e.message) + '</div>';
      }
    });
    /* 绑定 */
    $('view').querySelectorAll('[data-quiz]').forEach(function (el) {
      el.onclick = function () { Quiz.open(el.dataset.quiz); };
    });
    $('view').querySelectorAll('[data-flash]').forEach(function (el) {
      el.onclick = function () { Quiz.flash(global.QUIZZES[el.dataset.flash]); };
    });
    $('view').querySelectorAll('.btn-know').forEach(function (el) {
      el.onclick = function () {
        var sid = el.dataset.sec;
        var now = Store.toggleDone(sid);
        el.textContent = now ? '取消「已掌握」' : '✓ 我学会了这一节';
        App.refreshProgress();
        toast(now ? '标记为已掌握 ✓' : '已取消标记');
        var sec = document.getElementById('sec-' + sid);
        if (sec) {
          var h2 = sec.querySelector('h2');
          var badge = h2.querySelector('.badge');
          if (now && !badge) h2.insertAdjacentHTML('beforeend', ' <span class="badge ok">✓ 已掌握</span>');
          if (!now && badge) badge.remove();
        }
      };
    });
    $('view').querySelectorAll('[data-run]').forEach(function (btn) {
      btn.onclick = function () { W.codeRun(btn.dataset.run); };
    });
    /* 作业草稿：恢复 + 自动保存 */
    $('view').querySelectorAll('textarea[data-draft]').forEach(function (ta) {
      var k = 'draft:' + ta.dataset.draft;
      var v = Store.raw().hw[k];
      if (v) ta.value = v;
      var tm = null;
      ta.oninput = function () {
        clearTimeout(tm);
        tm = setTimeout(function () { Store.setHw(k, ta.value); }, 400);
      };
      ta.onblur = function () { Store.setHw(k, ta.value); };
    });

    $('crumbs').innerHTML = '<b>' + esc(c.title) + '</b> · 共 ' + c.sections.length + ' 节' +
      (c.minutes ? ' · 建议 ' + c.minutes + ' 分钟' : '');
    var si = 0;
    if (secId) {
      for (var k = 0; k < c.sections.length; k++) if (c.sections[k].id === secId) si = k;
    }
    curStep = steps.findIndex(function (st) { return st.chap.id === c.id && st.sec.id === c.sections[si].id; });
    if (secId) {
      var el = document.getElementById('sec-' + secId);
      if (el) el.scrollIntoView({ block: 'start' });
      else window.scrollTo(0, 0);
    } else window.scrollTo(0, 0);
    App.refreshProgress();
  };

  App.gotoChap = function (cid, secId) {
    location.hash = '#/' + cid + (secId ? '/' + secId : '');
  };

  App.gotoStep = function (i) {
    i = Math.max(0, Math.min(i, steps.length - 1));
    var st = steps[i];
    location.hash = '#/' + st.chap.id + '/' + st.sec.id;
  };

  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean);
    if (!parts.length) {
      if (chapters.length) App.gotoChap(chapters[0].id);
      return;
    }
    App.renderChapter(decodeURIComponent(parts[0]), parts[1] ? decodeURIComponent(parts[1]) : null);
  }

  /* ---------------- 倒数 ---------------- */
  function tickCountdown() {
    var exam = Date.parse('2026-12-01T10:50:00+09:00');
    var now = Date.now();
    var days = Math.ceil((exam - now) / 86400000);
    $('cd-days').textContent = days > 0 ? days : '0';
    $('cd-date').textContent = days > 0 ? '距 2026-12-01 期末考试' : '考试已开始/结束';
  }

  /* ---------------- 启动 ---------------- */
  App.init = function () {
    buildIndex();
    buildNav();
    tickCountdown();
    setInterval(tickCountdown, 60000);
    window.addEventListener('hashchange', route);
    $('btn-prev').onclick = function () { App.gotoStep(curStep - 1); };
    $('btn-next').onclick = function () { App.gotoStep(curStep + 1); };
    $('btn-review').onclick = function () { Quiz.reviewQueue(); };
    $('modal-close').onclick = closeModal;
    $('modal-back').onclick = function (e) { if (e.target.id === 'modal-back') closeModal(); };
    $('btn-reset').onclick = function () {
      if (confirm('确定要清空全部学习进度（含作业草稿）吗？此操作不可撤销。')) {
        Store.resetAll(); toast('已重置'); location.reload();
      }
    };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && e.altKey) App.gotoStep(curStep + 1);
      if (e.key === 'ArrowLeft' && e.altKey) App.gotoStep(curStep - 1);
    });
    route();
    App.refreshProgress();
  };

  global.App = App;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', App.init);
  else App.init();
})(window);
