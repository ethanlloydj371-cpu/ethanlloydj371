document.addEventListener("DOMContentLoaded", async () => {
  await loadGames();
  mountLayout("game");
  initGamePage();
});

function initGamePage() {
  const slug = getQueryParam("slug");
  const game = getGameBySlug(slug);
  const content = document.getElementById("game-content");

  if (!game) {
    content.innerHTML = `
      <div class="empty-state">
        <h2>Game Not Found</h2>
        <p>The game you are looking for does not exist or has been removed.</p>
        <a href="games.html" class="btn btn-primary">Browse All Games</a>
      </div>`;
    setPageMeta({ title: "Game Not Found" });
    return;
  }

  setPageMeta({
    title: game.title,
    description: truncateText(game.description, 160),
    keywords: [...game.categories, ...game.tags].join(", "),
    canonical: `${SITE_CONFIG.domain}/game.html?slug=${game.slug}`,
    ogType: "website"
  });

  injectJsonLd({
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    playMode: "SinglePlayer",
    url: `${SITE_CONFIG.domain}/game.html?slug=${game.slug}`
  });

  const howToPlay = game.instructions
    ? game.instructions
    : "Use your mouse, keyboard, or touch controls to play this game. Follow the in-game instructions, complete the challenge, and try to achieve your best score.";

  const features = [
    "Free online HTML5 gameplay",
    "No download required",
    "Works on desktop and mobile browsers",
    "Quick and casual play sessions",
    "Simple controls and fun challenges"
  ];

  const faqs = [
    { q: "Can I play this game for free?", a: "Yes, you can play this game online for free." },
    { q: "Do I need to download anything?", a: "No. The game runs directly in your web browser." },
    { q: "Can I play on mobile?", a: "Most HTML5 games work on mobile, tablet, and desktop browsers." },
    { q: "Why is the game loaded in an iframe?", a: "Some games are provided through third-party HTML5 game links and are loaded directly from the original provider." }
  ];

  const iframeSection = game.playable
    ? `
      <div class="game-controls-bar">
        <button id="fullscreen-btn" class="btn btn-secondary" aria-label="Enter fullscreen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          Fullscreen
        </button>
      </div>
      <div class="game-frame-wrap" id="game-frame-wrap">
        <iframe id="gameFrame" src="${escapeHtml(game.iframeUrl)}" title="${escapeHtml(game.title)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>`
    : `
      <div class="game-unavailable">
        <p>This game is currently unavailable. Please try another game.</p>
        <a href="games.html" class="btn btn-primary">Browse Games</a>
      </div>`;

  content.innerHTML = `
    ${renderBreadcrumb([
      { href: "index.html", label: "Home" },
      { href: "games.html", label: "Games" },
      { href: "#", label: game.title }
    ])}

    <header class="game-header">
      <h1>${escapeHtml(game.title)}</h1>
      <div class="game-meta">
        ${game.categories.map((c) =>
          `<a href="category.html?category=${encodeURIComponent(formatCategorySlug(c))}" class="meta-tag">${escapeHtml(c)}</a>`
        ).join("")}
      </div>
    </header>

    <div class="game-intro">
      <p>${escapeHtml(generateGameDescription(game))}</p>
    </div>

    <div style="text-align:center;">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2612403516171637"
          crossorigin="anonymous"></script>
      <!-- dw.dynwa.com_display_02 -->
      <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-2612403516171637"
          data-ad-slot="6910559678"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
      </script>
    </div>

    <section class="game-play-area" aria-label="Game play area">
      ${iframeSection}
    </section>

    <section class="content-section">
      <h2>How to Play</h2>
      <p>${escapeHtml(howToPlay)}</p>
    </section>

    <section class="content-section">
      <h2>Game Features</h2>
      <ul class="feature-list">
        ${features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
      </ul>
    </section>

    <section class="content-section faq-section">
      <h2>FAQ</h2>
      <div class="faq-list">
        ${faqs.map((f) => `
          <details class="faq-item">
            <summary>${escapeHtml(f.q)}</summary>
            <p>${escapeHtml(f.a)}</p>
          </details>`).join("")}
      </div>
    </section>

    <div id="related-games-mount"></div>

    <aside class="source-notice">
      <h3>Third-Party Source Notice</h3>
      <p>This game is loaded through a third-party HTML5 game link. All game content belongs to its respective owner or provider. If you are a rights holder and want a game removed, please <a href="contact.html">contact us</a>.</p>
      <p><strong>Source:</strong> ${escapeHtml(game.source)}</p>
      ${game.pageUrl ? `<p><strong>Original page:</strong> <a href="${escapeHtml(game.pageUrl)}" rel="noopener noreferrer" class="source-link">${escapeHtml(truncateText(game.pageUrl, 60))}</a></p>` : ""}
      <p class="removal-note">If you are a rights holder and would like a game removed from this website, please contact us using the email address on the <a href="contact.html">Contact</a> page.</p>
    </aside>`;

  const relatedMount = document.getElementById("related-games-mount");
  if (relatedMount) relatedMount.innerHTML = renderRelatedGames(game);

  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {}

  if (game.playable) initFullscreen();
}

function initFullscreen() {
  const btn = document.getElementById("fullscreen-btn");
  const wrap = document.getElementById("game-frame-wrap");
  const frame = document.getElementById("gameFrame");
  if (!btn || !wrap) return;

  btn.addEventListener("click", () => {
    const el = wrap.requestFullscreen ? wrap : frame;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  });
}
