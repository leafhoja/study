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
  /* MathJax MathList を巡回して mjx-container に data-tex を付与 */
  function tagAll() {
    if (!window.MathJax || !MathJax.startup || !MathJax.startup.document) return;
    try {
      Array.from(MathJax.startup.document.math).forEach(function (item) {
        if (item && item.typesetRoot && item.math !== undefined) {
          item.typesetRoot.setAttribute('data-tex', item.math);
          item.typesetRoot.setAttribute('data-tex-d', item.display ? '1' : '0');
        }
      });
    } catch (_) {}
  }

  /* MathJax 読み込み完了を待ってタグ付け（async 読み込みのためポーリング） */
  function waitAndTag() {
    if (window.MathJax && MathJax.startup && MathJax.startup.promise) {
      MathJax.startup.promise.then(tagAll);
    } else {
      setTimeout(waitAndTag, 200);
    }
  }
  waitAndTag();

  /* mjx-container から TeX を取得: data-tex 属性→ assistive MML annotation の順に試みる */
  function getTeX(container) {
    /* 方法1: data-tex 属性（tagAll() で付与済み） */
    var tex = container.getAttribute('data-tex');
    if (tex !== null) {
      return { tex: tex, display: container.getAttribute('data-tex-d') === '1' };
    }
    /* 方法2: getElementsByTagName（querySelector より MathML 名前空間に確実） */
    var anns = container.getElementsByTagName('annotation');
    for (var i = 0; i < anns.length; i++) {
      if (anns[i].getAttribute('encoding') === 'application/x-tex') {
        var t = anns[i].textContent.trim();
        if (t) return { tex: t, display: container.getAttribute('display') === 'true' };
      }
    }
    return null;
  }

  /* コピーイベント: 数式を含む選択範囲なら LaTeX に変換してクリップボードへ */
  document.addEventListener('copy', function (e) {
    var sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);

    /* 数式があるか確認 */
    if (!range.cloneContents().querySelector('mjx-container')) return;

    /* コピー時点では MathJax は確実に読み込み済みなので、未タグの要素にここで付与 */
    tagAll();

    var frag = range.cloneContents();
    e.preventDefault();
    e.clipboardData.setData('text/plain', toText(frag));
  });

  function toText(node) {
    if (node.nodeType === 3) return node.textContent; /* テキストノード */
    if (node.nodeType !== 1) return '';
    var t = node.tagName.toLowerCase();
    if (t === 'mjx-assistive-mml') return ''; /* スクリーンリーダー用 MathML はスキップ */
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
