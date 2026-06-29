(function () {
  'use strict';

  /* ── PWA: manifest + apple-touch-icon を動的注入 ── */
  var me = document.currentScript;
  if (me && me.src) {
    var base = me.src.replace(/common\.js(\?.*)?$/, '');

    var mLink = document.createElement('link');
    mLink.rel = 'manifest';
    mLink.href = base + 'manifest.json';
    document.head.appendChild(mLink);

    var aLink = document.createElement('link');
    aLink.rel = 'apple-touch-icon';
    aLink.href = base + 'icons/apple-touch-icon.png';
    document.head.appendChild(aLink);

    [
      ['apple-mobile-web-app-capable', 'yes'],
      ['apple-mobile-web-app-status-bar-style', 'black-translucent'],
      ['apple-mobile-web-app-title', '学習ノート']
    ].forEach(function (pair) {
      var m = document.createElement('meta');
      m.name = pair[0];
      m.content = pair[1];
      document.head.appendChild(m);
    });
  }

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
      if (a.classList.contains('nav-back')) return;
      var href = a.getAttribute('href').split('#')[0].split('/').pop();
      if (href === cur) a.classList.add('active');
    });
  });
})();
