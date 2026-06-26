(function () {
  'use strict';

  /* ── ページ先頭へ戻るボタン ── */
  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.textContent = '↑';
  btn.title = 'ページ先頭へ';
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 320);
  }, { passive: true });
})();
