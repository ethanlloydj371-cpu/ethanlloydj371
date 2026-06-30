function renderHeader(activePage) {
  const nav = [
    { href: "index.html", label: "Home", id: "home" },
    { href: "games.html", label: "Games", id: "games" },
    { href: "categories.html", label: "Categories", id: "categories" },
    { href: "search.html", label: "Search", id: "search" },
    { href: "about.html", label: "About", id: "about" },
    { href: "contact.html", label: "Contact", id: "contact" }
  ];

  const navLinks = nav.map((n) =>
    `<a href="${n.href}" class="nav-link${activePage === n.id ? " active" : ""}">${escapeHtml(n.label)}</a>`
  ).join("");

  const mobileNavLinks = nav.map((n) =>
    `<a href="${n.href}" class="mobile-nav-link${activePage === n.id ? " active" : ""}">${escapeHtml(n.label)}</a>`
  ).join("");

  const cats = typeof getAllCategories === "function" ? getAllCategories().slice(0, 10) : [];
  const catLinks = cats.map((c) =>
    `<a href="category.html?category=${encodeURIComponent(c.slug)}" class="mobile-cat-link">
      <span class="mobile-cat-icon">${getCategoryIcon(c.name)}</span>
      <span class="mobile-cat-name">${escapeHtml(c.name)}</span>
      <span class="mobile-cat-count">${c.count}</span>
    </a>`
  ).join("");

  return `
    <header class="site-header" id="site-header">
      <div class="header-inner container">
        <a href="index.html" class="logo" aria-label="${escapeHtml(SITE_CONFIG.name)} Home">
          <img src="assets/images/logo.svg" alt="${escapeHtml(SITE_CONFIG.name)} logo" width="40" height="40">
          <span class="logo-text">${escapeHtml(SITE_CONFIG.name)}</span>
        </a>
        <nav class="desktop-nav" aria-label="Main navigation">
          ${navLinks}
        </nav>
        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav">
          <span class="hamburger"></span>
        </button>
      </div>
    </header>
    <div class="mobile-nav-backdrop" id="mobile-nav-backdrop" hidden></div>
    <aside class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" aria-hidden="true">
      <div class="mobile-nav-header">
        <span class="mobile-nav-title">Menu</span>
        <button type="button" class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">&times;</button>
      </div>
      <div class="mobile-nav-body">
        <div class="mobile-nav-section">
          ${mobileNavLinks}
        </div>
        ${catLinks ? `
        <div class="mobile-nav-section">
          <h3 class="mobile-nav-heading">Game Categories</h3>
          <div class="mobile-cat-list">${catLinks}</div>
        </div>` : ""}
      </div>
    </aside>`;
}

function renderFooter() {
  const cats = getAllCategories().slice(0, 6);
  const catLinks = cats.map((c) =>
    `<a href="category.html?category=${encodeURIComponent(c.slug)}">${escapeHtml(c.name)}</a>`
  ).join("");

  return `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-col">
          <a href="index.html" class="footer-logo">
            <img src="assets/images/logo.svg" alt="" width="32" height="32">
            <span>${escapeHtml(SITE_CONFIG.name)}</span>
          </a>
          <p class="footer-desc">${escapeHtml(SITE_CONFIG.description)}</p>
        </div>
        <div class="footer-col">
          <h3>Popular Categories</h3>
          <div class="footer-links">${catLinks || '<a href="categories.html">Browse All</a>'}</div>
        </div>
        <div class="footer-col">
          <h3>Useful Links</h3>
          <div class="footer-links">
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms.html">Terms</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom container">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(SITE_CONFIG.name)}. All rights reserved.</p>
      </div>
    </footer>`;
}

function renderGameCard(game) {
  const thumb = game.thumbnail
    ? `<img src="${escapeHtml(game.thumbnail)}" alt="${escapeHtml(game.title)} thumbnail" loading="lazy" width="256" height="192">`
    : `<div class="card-placeholder" aria-label="${escapeHtml(game.title)}">
         <img src="assets/images/placeholder-game.svg" alt="" width="64" height="64">
       </div>`;

  const playBtn = game.playable
    ? `<a href="game.html?slug=${encodeURIComponent(game.slug)}" class="btn btn-primary btn-sm">Play Now</a>`
    : `<span class="btn btn-disabled btn-sm">Unavailable</span>`;

  return `
    <article class="game-card">
      <a href="game.html?slug=${encodeURIComponent(game.slug)}" class="card-thumb-link" tabindex="-1" aria-hidden="true">
        <div class="card-thumb">${thumb}</div>
      </a>
      <div class="card-body">
        <span class="card-category">${escapeHtml(game.category)}</span>
        <h3 class="card-title">
          <a href="game.html?slug=${encodeURIComponent(game.slug)}">${escapeHtml(game.title)}</a>
        </h3>
        <p class="card-desc">${escapeHtml(truncateText(game.description, 90))}</p>
        ${playBtn}
      </div>
    </article>`;
}

function renderGameGrid(games, container) {
  if (!container) return;
  if (!games.length) {
    container.innerHTML = `<div class="empty-state"><p>No games found.</p></div>`;
    return;
  }
  container.innerHTML = games.map(renderGameCard).join("");
}

function renderAdSlot(type) {
  const cls = `ad-slot ad-slot-${type || "banner"}`;
  return `<div class="${cls}" aria-label="Advertisement">
  <span>Advertisement</span>
  </div>`;
}

function renderCategoryChips(categories, activeSlug) {
  const all = `<a href="games.html" class="chip${!activeSlug ? " active" : ""}">All Games</a>`;
  const chips = categories.map((c) =>
    `<a href="category.html?category=${encodeURIComponent(c.slug)}" class="chip${activeSlug === c.slug ? " active" : ""}">
      <span class="chip-icon">${getCategoryIcon(c.name)}</span>
      ${escapeHtml(c.name)}
      <span class="chip-count">${c.count}</span>
    </a>`
  ).join("");
  return `<div class="category-chips">${all}${chips}</div>`;
}

function renderPagination(currentPage, totalPages, baseUrl) {
  if (totalPages <= 1) return "";
  const sep = baseUrl.includes("?") ? "&" : "?";
  const pages = [];
  const range = 2;
  let start = Math.max(1, currentPage - range);
  let end = Math.min(totalPages, currentPage + range);

  if (currentPage > 1) {
    pages.push(`<a href="${baseUrl}${sep}page=${currentPage - 1}" class="page-btn" aria-label="Previous page">&laquo;</a>`);
  }
  if (start > 1) {
    pages.push(`<a href="${baseUrl}${sep}page=1" class="page-btn">1</a>`);
    if (start > 2) pages.push(`<span class="page-dots">…</span>`);
  }
  for (let i = start; i <= end; i++) {
    pages.push(
      i === currentPage
        ? `<span class="page-btn active" aria-current="page">${i}</span>`
        : `<a href="${baseUrl}${sep}page=${i}" class="page-btn">${i}</a>`
    );
  }
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push(`<span class="page-dots">…</span>`);
    pages.push(`<a href="${baseUrl}${sep}page=${totalPages}" class="page-btn">${totalPages}</a>`);
  }
  if (currentPage < totalPages) {
    pages.push(`<a href="${baseUrl}${sep}page=${currentPage + 1}" class="page-btn" aria-label="Next page">&raquo;</a>`);
  }
  return `<nav class="pagination" aria-label="Pagination">${pages.join("")}</nav>`;
}

function renderRelatedGames(currentGame) {
  const related = getRelatedGames(currentGame);
  if (!related.length) return "";
  return `
    <section class="section related-games">
      <h2 class="section-title">Related Games</h2>
      <div class="game-grid">${related.map(renderGameCard).join("")}</div>
    </section>`;
}

function renderBreadcrumb(items) {
  const crumbs = items.map((item, i) => {
    if (i === items.length - 1) {
      return `<span aria-current="page">${escapeHtml(item.label)}</span>`;
    }
    return `<a href="${item.href}">${escapeHtml(item.label)}</a>`;
  }).join('<span class="breadcrumb-sep" aria-hidden="true">/</span>');
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>`;
}

function renderCategoryCard(cat) {
  const icon = getCategoryIcon(cat.name);
  const desc = generateCategoryDescription(cat.name);
  return `
    <article class="category-card">
      <div class="category-card-icon">${icon}</div>
      <h3>${escapeHtml(cat.name)}</h3>
      <p>${escapeHtml(truncateText(desc, 100))}</p>
      <span class="category-count">${cat.count} games</span>
      <a href="category.html?category=${encodeURIComponent(cat.slug)}" class="btn btn-primary btn-sm">View Games</a>
    </article>`;
}

function renderSearchBox(value, id) {
  id = id || "search-input";
  return `
    <form class="search-form" action="search.html" method="get" role="search">
      <label for="${id}" class="sr-only">Search games</label>
      <input type="search" id="${id}" name="q" value="${escapeHtml(value || "")}" placeholder="Search games…" aria-label="Search games">
      <button type="submit" class="btn btn-primary search-btn" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </form>`;
}

function closeMobileMenu() {
  const nav = document.getElementById("mobile-nav");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  const toggle = document.getElementById("menu-toggle");
  if (!nav) return;
  nav.classList.remove("open");
  nav.setAttribute("aria-hidden", "true");
  if (backdrop) backdrop.setAttribute("hidden", "");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("active");
  }
  document.body.classList.remove("menu-open");
}

function openMobileMenu() {
  const nav = document.getElementById("mobile-nav");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  const toggle = document.getElementById("menu-toggle");
  if (!nav) return;
  nav.classList.add("open");
  nav.setAttribute("aria-hidden", "false");
  if (backdrop) backdrop.removeAttribute("hidden");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("active");
  }
  document.body.classList.add("menu-open");
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("mobile-nav-close");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  const nav = document.getElementById("mobile-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  closeBtn?.addEventListener("click", closeMobileMenu);
  backdrop?.addEventListener("click", closeMobileMenu);

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMobileMenu();
      toggle.focus();
    }
  });
}

function mountLayout(activePage) {
  const headerEl = document.getElementById("header-mount");
  const footerEl = document.getElementById("footer-mount");
  if (headerEl) headerEl.innerHTML = renderHeader(activePage);
  if (footerEl) footerEl.innerHTML = renderFooter();
  initMobileMenu();
}

function renderGameGridWithAds(games, container, adInterval) {
  if (!container) return;
  adInterval = adInterval || 12;
  if (!games.length) {
    container.innerHTML = `<div class="empty-state"><p>No games found.</p></div>`;
    return;
  }
  let html = '<div class="game-grid">';
  games.forEach((game, i) => {
    html += renderGameCard(game);
    if ((i + 1) % adInterval === 0 && i < games.length - 1) {
      html += `</div>${renderAdSlot("in-content")}<div class="game-grid">`;
    }
  });
  html += "</div>";
  container.innerHTML = html;
}
