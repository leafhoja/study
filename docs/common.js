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

  /* ── キーボードショートカット ── */
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    /* t → ページ先頭へ */
    if (e.key === 't' || e.key === 'T') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      e.preventDefault();
    }
  });
})();

/* ── MathJax コピー修正: コピー時に LaTeX ソースへ置換 ── */
(function () {
  /* mjx-container から TeX ソースを取得
     MathJax は mjx-assistive-mml > math > semantics > annotation[encoding="application/x-tex"]
     に元の TeX を格納する（MathList API に依存しない） */
  function getTeX(container) {
    /* cloneContents() で複製されたノードにも annotation は含まれる */
    var ann = container.querySelector('annotation[encoding="application/x-tex"]');
    if (ann) {
      return { tex: ann.textContent, display: container.getAttribute('display') === 'true' };
    }
    return null;
  }

  /* コピーイベント: 数式を含む選択範囲なら LaTeX に変換してクリップボードへ */
  document.addEventListener('copy', function (e) {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var frag = sel.getRangeAt(0).cloneContents();
    if (!frag.querySelector('mjx-container')) return; /* 数式なし → ブラウザ既定 */
    e.preventDefault();
    e.clipboardData.setData('text/plain', toText(frag));
  });

  function toText(node) {
    if (node.nodeType === 3) return node.textContent; /* テキストノード */
    if (node.nodeType !== 1) return '';
    var t = node.tagName.toLowerCase();
    if (t === 'mjx-assistive-mml') return ''; /* スクリーンリーダー用 MathML はスキップ（toText 再帰分） */
    if (t === 'mjx-container') {
      var info = getTeX(node);
      if (info) {
        return info.display ? '\n$$' + info.tex + '$$\n' : '$' + info.tex + '$';
      }
      return ''; /* TeX 取得不能: ガベージを出さず空文字 */
    }
    var s = Array.from(node.childNodes).map(toText).join('');
    var block = /^(p|div|h[1-6]|li|section|article|blockquote|pre|tr)$/.test(t);
    if (t === 'br') return '\n';
    if (block && s.trim()) return '\n' + s.trimEnd() + '\n';
    return s;
  }
}());
