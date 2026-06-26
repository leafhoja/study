/* ═══════════════════════════════════════════════
   熱力学ノート 2025 — 共通スクリプト
   ═══════════════════════════════════════════════ */

/* ─── 証明ボックスの折り畳み ─── */
document.addEventListener('DOMContentLoaded', () => {
  // 証明ボックス: デフォルトで折り畳む
  document.querySelectorAll('.box-prf').forEach(box => {
    box.classList.add('collapsed');
    box.querySelector('.box-head').addEventListener('click', () => {
      box.classList.toggle('collapsed');
    });
  });

  // サイドバー: スクロールで現在位置をハイライト
  initSidebarHighlight();
});

function initSidebarHighlight() {
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  if (!sidebarLinks.length) return;

  const sections = Array.from(sidebarLinks).map(a => {
    const id = a.getAttribute('href').slice(1);
    return { link: a, el: document.getElementById(id) };
  }).filter(s => s.el);

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY + 90;
        let active = sections[0];
        for (const s of sections) {
          if (s.el.offsetTop <= scrollY) active = s;
        }
        sidebarLinks.forEach(a => a.classList.remove('active'));
        if (active) active.link.classList.add('active');
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
