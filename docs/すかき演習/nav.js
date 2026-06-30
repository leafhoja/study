(function () {
  'use strict';

  /* ================================================================
     ページ定義
  ================================================================ */
  var CALC_PAGES = [
    { file: 'calc_01.html', num: '第1回', title: 'ε-N論法と数列の収束',
      problems: [
        { id: 'problem1', title: '極限の一意性' },
        { id: 'problem2', title: '極限の演算' },
        { id: 'problem3', title: '0.999… = 1' },
        { id: 'problem4', title: '部分和と収束' },
      ]},
    { file: 'calc_02.html', num: '第2回', title: '上界・下限とWeierstrass定理',
      problems: [
        { id: 'problem1', title: '上限・下限' },
        { id: 'problem2', title: '収束数列は有界' },
        { id: 'problem3', title: '単調増加＆有界→収束' },
        { id: 'problem4', title: 'はさみうちの原理' },
      ]},
    { file: 'calc_03.html', num: '第3回', title: '微分の定義とCauchy方程式',
      problems: [
        { id: 'problem1', title: 'x²sin(1/x) の微分' },
        { id: 'problem2', title: 'Cauchy 関数方程式' },
        { id: 'problem3', title: '塔型累乗の極限' },
      ]},
    { file: 'calc_04.html', num: '第4回', title: '常微分方程式',
      problems: [
        { id: 'problem1', title: '4種の ODE の解' },
        { id: 'problem2', title: '平衡点と変数変換' },
        { id: 'problem3', title: '二階線形 ODE' },
      ]},
    { file: 'calc_05.html', num: '第5回', title: '凸関数・縮小写像・方程式の根',
      problems: [
        { id: 'problem1', title: '凸関数と Jensen 不等式' },
        { id: 'problem2', title: '縮小写像' },
        { id: 'problem3', title: '方程式の根の極限' },
      ]},
  ];

  var LIN_PAGES = [
    { file: 'lin_01.html', num: '第1回', title: '線形写像と行列表現',
      problems: [
        { id: 'problem1', title: '線形写像の証明' },
        { id: 'problem2', title: '表現行列を求める' },
        { id: 'problem3', title: '合成と行列の積' },
        { id: 'problem4', title: '単射・全射と det' },
      ]},
    { file: 'lin_02.html', num: '第2回', title: '回転・鏡映・直交行列',
      problems: [
        { id: 'problem1', title: '回転行列 Rθ' },
        { id: 'problem2', title: '鏡映行列 Tτ' },
        { id: 'problem3', title: '合成の法則' },
        { id: 'problem4', title: '直交行列の特徴' },
      ]},
    { file: 'lin_03.html', num: '第3回', title: '行列式・逆行列・固有値・対角化',
      problems: [
        { id: 'problem1', title: 'detA=0 ⟺ Av=0' },
        { id: 'problem2', title: 'det(AB) と逆行列' },
        { id: 'problem3', title: '固有値・対角化' },
      ]},
    { file: 'lin_04.html', num: '第4回', title: '核と像・双対空間・内積',
      problems: [
        { id: 'problem1', title: '核と像が部分空間' },
        { id: 'problem2', title: '単射 ⟺ ker={0}' },
        { id: 'problem3', title: '双対空間 V*' },
        { id: 'problem4', title: '内積と双対写像' },
      ]},
  ];

  var KAKOMON_PAGES = [
    { file: 'kakomon_calc_01.html', num: '微積 小テスト', title: 'ε-N・Cesàro・高階微分・gₙ',
      problems: [
        { id: 'problem1', title: 'ε-N論法：e^{aₙ}→eᵃ' },
        { id: 'problem2', title: 'Cesàro 平均' },
        { id: 'problem3', title: 'arcsinh の高階微分' },
        { id: 'problem4', title: 'xⁿsin(1/x) の微分可能性' },
        { id: 'problem5', title: '指数部分和 gₙ(x)' },
      ]},
    { file: 'kakomon_lin_01.html', num: '線形 小テスト', title: '固有値・直交行列・Hom',
      problems: [
        { id: 'problem1', title: '表現行列・核・像' },
        { id: 'problem2', title: '直交行列と冪' },
        { id: 'problem3', title: '固有値・対角化' },
        { id: 'problem4', title: 'Hom空間と同型' },
      ]},
  ];

  /* ================================================================
     進捗管理（localStorage）
  ================================================================ */
  var STORAGE_KEY = 'sukami-visited';

  function getVisited() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveVisited(arr) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function markVisited(filename) {
    if (!filename || filename === 'index.html') return;
    var v = getVisited();
    if (v.indexOf(filename) === -1) { v.push(filename); saveVisited(v); }
  }

  /* ================================================================
     ユーティリティ
  ================================================================ */
  function mk(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  /* ================================================================
     buildNav — サイドナビ構築
  ================================================================ */
  function buildNav() {
    var pathname = location.pathname;
    var currentFile = pathname.split('/').pop() || '';
    var isIndex = (currentFile === 'index.html' || currentFile === '');
    var inSubdir = /\/(calculus|linear|kakomon)\//.test(pathname);
    var prefix     = inSubdir ? '../' : '';
    var calcPrefix = prefix + 'calculus/';
    var linPrefix  = prefix + 'linear/';

    /* 現在ページを訪問済みに記録 */
    markVisited(currentFile);

    var visited = getVisited();

    /* ---- sidebar ---- */
    var nav = document.createElement('nav');
    nav.id = 'sidenav';
    nav.className = 'sidenav';
    nav.setAttribute('aria-label', '問題ナビゲーション');

    var sideHead = mk('div', 'sidenav-header');
    sideHead.appendChild(mk('span', 'sidenav-brand', '問題一覧'));
    var closeBtn = mk('button', 'sidenav-close-btn');
    closeBtn.setAttribute('aria-label', '閉じる');
    closeBtn.textContent = '✕';
    sideHead.appendChild(closeBtn);
    nav.appendChild(sideHead);

    var indexRow = mk('div', 'sidenav-index-row');
    var indexA = mk('a', 'sidenav-index-link', '↑ トップページ');
    indexA.href = prefix + 'index.html';
    indexRow.appendChild(indexA);
    nav.appendChild(indexRow);

    var body = mk('div', 'sidenav-body');
    nav.appendChild(body);

    function buildGroup(pages, base, label, titleCls, itemCls, probCls) {
      var group = mk('div', 'sidenav-group');
      group.appendChild(mk('div', 'sidenav-group-title ' + titleCls, label));

      for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        var isCurrent = currentFile === page.file;
        var isVisited = visited.indexOf(page.file) !== -1;

        var item = mk('div', 'sidenav-item ' + itemCls + (isCurrent ? ' sidenav-current' : ''));

        /* 展開ボタン */
        var expandBtn = mk('button', 'sidenav-expand-btn' + (isCurrent ? ' sidenav-expand-open' : ''));
        expandBtn.setAttribute('type', 'button');
        expandBtn.setAttribute('aria-label', '問題一覧を展開');
        item.appendChild(expandBtn);

        /* ページリンク */
        var link = document.createElement('a');
        link.href = base + page.file;
        link.className = 'sidenav-item-link';
        link.appendChild(mk('span', 'sidenav-item-num', page.num));
        var titleSpan = mk('span', 'sidenav-item-title', page.title);
        link.appendChild(titleSpan);
        /* 訪問済みバッジ */
        if (isVisited) {
          link.appendChild(mk('span', 'sidenav-visited-badge', '✓'));
        }
        item.appendChild(link);

        group.appendChild(item);

        /* 問題リスト */
        var probWrap = mk('div', 'sidenav-problems ' + probCls + (isCurrent ? '' : ' sidenav-problems-hidden'));
        for (var j = 0; j < page.problems.length; j++) {
          var p = page.problems[j];
          var pnum = p.id.replace('problem', '');
          var a = document.createElement('a');
          a.href = (isCurrent ? '' : base + page.file) + '#' + p.id;
          a.className = 'sidenav-problem';
          a.dataset.target = p.id;
          a.appendChild(mk('span', 'sidenav-prob-num', '問' + pnum));
          a.appendChild(mk('span', 'sidenav-prob-title', p.title));
          probWrap.appendChild(a);
        }
        group.appendChild(probWrap);

        (function (btn, wrap) {
          btn.addEventListener('click', function (evt) {
            evt.stopPropagation();
            var isOpen = !wrap.classList.contains('sidenav-problems-hidden');
            if (isOpen) {
              wrap.classList.add('sidenav-problems-hidden');
              btn.classList.remove('sidenav-expand-open');
            } else {
              wrap.classList.remove('sidenav-problems-hidden');
              btn.classList.add('sidenav-expand-open');
            }
          });
        })(expandBtn, probWrap);
      }
      return group;
    }

    body.appendChild(buildGroup(
      CALC_PAGES, calcPrefix,
      '📐 微分積分学', 'sidenav-gtitle-calc', 'sidenav-item-calc', 'sidenav-problems-calc'
    ));
    body.appendChild(buildGroup(
      LIN_PAGES, linPrefix,
      '🔷 線形代数学', 'sidenav-gtitle-lin', 'sidenav-item-lin', 'sidenav-problems-lin'
    ));
    body.appendChild(buildGroup(
      KAKOMON_PAGES, prefix + 'kakomon/',
      '📝 過去問', 'sidenav-gtitle-lin', 'sidenav-item-lin', 'sidenav-problems-lin'
    ));

    document.body.appendChild(nav);

    /* ---- トグルボタン（navbar-inner に挿入） ---- */
    var toggleBtn = mk('button', 'sidenav-toggle-btn');
    toggleBtn.id = 'sidenav-toggle';
    toggleBtn.setAttribute('aria-label', '問題一覧');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'sidenav');
    toggleBtn.textContent = '☰';

    var headerInner = document.querySelector('.header-inner, .navbar-inner');
    if (headerInner) headerInner.insertBefore(toggleBtn, headerInner.firstChild);

    /* ---- open / close ---- */
    function openNav() {
      nav.classList.add('sidenav-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.textContent = '✕';
    }
    function closeNav() {
      nav.classList.remove('sidenav-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '☰';
    }
    function toggleNav() {
      nav.classList.contains('sidenav-open') ? closeNav() : openNav();
    }

    toggleBtn.addEventListener('click', function (evt) { evt.stopPropagation(); toggleNav(); });
    closeBtn.addEventListener('click', closeNav);
    document.addEventListener('click', function (evt) {
      if (nav.classList.contains('sidenav-open') &&
          !nav.contains(evt.target) && evt.target !== toggleBtn) closeNav();
    });

    /* モバイルで問題リンク押下時に閉じる */
    nav.querySelectorAll('.sidenav-problem').forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth < 900) closeNav(); });
    });

    /* 広い画面では自動展開（インデックスページは除く） */
    if (window.innerWidth >= 1100 && !isIndex) openNav();

    /* ================================================================
       スクロールスパイ
    ================================================================ */
    var probLinks = nav.querySelectorAll('.sidenav-problem');
    if (probLinks.length > 0) {
      var sections = [];
      probLinks.forEach(function (a) {
        var sec = document.getElementById(a.dataset.target);
        if (sec) sections.push({ el: sec, link: a });
      });
      function updateSpy() {
        var scrollY = window.scrollY + 120;
        var active = null;
        for (var k = 0; k < sections.length; k++) {
          if (sections[k].el.offsetTop <= scrollY) active = sections[k].link;
        }
        probLinks.forEach(function (a) { a.classList.remove('sidenav-problem-active'); });
        if (active) active.classList.add('sidenav-problem-active');
      }
      window.addEventListener('scroll', updateSpy, { passive: true });
      updateSpy();
    }

    /* ================================================================
       キーボードナビゲーション
       Escape : サイドナビを閉じる
       [ / ]  : 前後のページへ移動
    ================================================================ */
    var ALL_SEQUENCES = [
      { pages: CALC_PAGES,   base: calcPrefix },
      { pages: LIN_PAGES,    base: linPrefix  },
      { pages: KAKOMON_PAGES, base: prefix + 'kakomon/' },
    ];

    function findNeighbors() {
      for (var s = 0; s < ALL_SEQUENCES.length; s++) {
        var seq = ALL_SEQUENCES[s];
        for (var i = 0; i < seq.pages.length; i++) {
          if (seq.pages[i].file === currentFile) {
            return {
              prev: i > 0 ? seq.base + seq.pages[i - 1].file : null,
              next: i < seq.pages.length - 1 ? seq.base + seq.pages[i + 1].file : null,
            };
          }
        }
      }
      return { prev: null, next: null };
    }

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 'Escape':
          if (nav.classList.contains('sidenav-open')) { closeNav(); e.preventDefault(); }
          break;
        case '[': {
          var nb = findNeighbors();
          if (nb.prev) { location.href = nb.prev; e.preventDefault(); }
          break;
        }
        case ']': {
          var nb2 = findNeighbors();
          if (nb2.next) { location.href = nb2.next; e.preventDefault(); }
          break;
        }
      }
    });

    /* ================================================================
       インデックスページ専用：訪問済みバッジ＋進捗バー
    ================================================================ */
    if (isIndex) {
      /* 訪問済みカードに class を付与 */
      document.querySelectorAll('.lecture-card a[href]').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        var file = href.split('/').pop();
        if (visited.indexOf(file) !== -1) {
          var card = a.closest('.lecture-card');
          if (card) card.classList.add('lc-visited');
        }
      });

      /* 進捗バーを更新 */
      var allFiles = CALC_PAGES.concat(LIN_PAGES).concat(KAKOMON_PAGES).map(function (p) { return p.file; });
      var done = allFiles.filter(function (f) { return visited.indexOf(f) !== -1; }).length;
      var total = allFiles.length;
      var pct = total > 0 ? Math.round(done / total * 100) : 0;

      var fill = document.getElementById('progress-fill');
      var label = document.getElementById('progress-label');
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = done + ' / ' + total + ' ページ訪問済み（' + pct + '%）';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
