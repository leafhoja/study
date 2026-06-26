(function () {
  'use strict';

  /* ── スクロール進捗バー ── */
  var bar = document.createElement('div');
  bar.id = 'reading-progress';
  document.body.insertBefore(bar, document.body.firstChild);

  /* ── ページ先頭へ戻るボタン ── */
  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.textContent = '↑';
  btn.title = 'ページ先頭へ';
  btn.setAttribute('aria-label', 'ページ先頭へ戻る');
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  /* ── スクロールイベント（両方まとめて） ── */
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;

    // 進捗バー
    bar.style.width = (total > 0 ? scrollY / total * 100 : 0) + '%';

    // back-to-top の表示切り替え
    btn.classList.toggle('visible', scrollY > 320);
  }, { passive: true });

  /* ── ナビリンク: 現在ページを自動 .active ── */
  document.addEventListener('DOMContentLoaded', function () {
    var cur = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a[href], header a[href]').forEach(function (a) {
      var href = a.getAttribute('href').split('#')[0].split('/').pop();
      if (href === cur) a.classList.add('active');
    });
  });
})();
