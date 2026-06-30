document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  await loadGames();
  mountLayout(page);

  if (page === "home") initHomePage();
  if (page === "games") initGamesPage();
  if (page === "categories") initCategoriesPage();
  if (page === "category") initCategoryPage();
});

function initHomePage() {
  setPageMeta({
    title: "Play Free Online HTML5 Games",
    description: SITE_CONFIG.description,
    canonical: SITE_CONFIG.domain + "/"
  });

  injectJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: SITE_CONFIG.domain + "/search.html?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  });

  const playable = getPlayableGames();
  const shuffled = shuffleArray(playable);

  const featured = shuffled.slice(0, 12);
  const popular = shuffleArray(playable).slice(0, 12);
  const newest = playable.slice(0, 12);

  renderGameGrid(featured, document.getElementById("featured-games"));
  renderGameGrid(popular, document.getElementById("popular-games"));
  renderGameGrid(newest, document.getElementById("new-games"));

  const chipsEl = document.getElementById("category-chips");
  if (chipsEl) chipsEl.innerHTML = renderCategoryChips(getAllCategories());

  const searchMount = document.getElementById("hero-search");
  if (searchMount) searchMount.innerHTML = renderSearchBox("");
}

function initGamesPage() {
  setPageMeta({
    title: "All Games",
    description: `Browse all free HTML5 casual games on ${SITE_CONFIG.name}. Play instantly in your browser.`,
    canonical: SITE_CONFIG.domain + "/games.html"
  });

  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page") || "1", 10);
  const sort = params.get("sort") || "newest";
  const catFilter = params.get("category") || "";

  let games = getPlayableGames();
  if (catFilter) {
    games = getGamesByCategory(catFilter);
  }
  games = sortGames(games, sort);
  const { games: pageGames, currentPage, totalPages } = paginateGames(games, page);

  const searchMount = document.getElementById("games-search");
  if (searchMount) searchMount.innerHTML = renderSearchBox("");

  const chipsEl = document.getElementById("games-chips");
  if (chipsEl) chipsEl.innerHTML = renderCategoryChips(getAllCategories(), catFilter);

  const sortEl = document.getElementById("sort-select");
  if (sortEl) {
    sortEl.value = sort;
    sortEl.addEventListener("change", () => {
      const p = new URLSearchParams(window.location.search);
      p.set("sort", sortEl.value);
      p.delete("page");
      window.location.search = p.toString();
    });
  }

  const countEl = document.getElementById("games-count");
  if (countEl) countEl.textContent = `${games.length} games found`;

  renderGameGridWithAds(pageGames, document.getElementById("games-grid"), 12);

  const pagEl = document.getElementById("games-pagination");
  if (pagEl) {
    let base = "games.html";
    const p = new URLSearchParams();
    if (sort !== "newest") p.set("sort", sort);
    if (catFilter) p.set("category", catFilter);
    const qs = p.toString();
    if (qs) base += "?" + qs;
    pagEl.innerHTML = renderPagination(currentPage, totalPages, base);
  }
}

function initCategoriesPage() {
  setPageMeta({
    title: "Game Categories",
    description: `Explore game categories on ${SITE_CONFIG.name}. Find puzzle, arcade, action, sports and more.`,
    canonical: SITE_CONFIG.domain + "/categories.html"
  });

  const container = document.getElementById("categories-grid");
  if (container) {
    container.innerHTML = getAllCategories().map(renderCategoryCard).join("");
  }
}

function initCategoryPage() {
  const catSlug = getQueryParam("category");
  const cat = getCategoryBySlug(catSlug);
  const page = parseInt(getQueryParam("page") || "1", 10);

  if (!cat) {
    document.getElementById("category-content").innerHTML = `
      <div class="empty-state">
        <h2>Category Not Found</h2>
        <p>The category you are looking for does not exist.</p>
        <a href="categories.html" class="btn btn-primary">Browse Categories</a>
      </div>`;
    return;
  }

  setPageMeta({
    title: `${cat.name} Games`,
    description: generateCategoryDescription(cat.name),
    canonical: `${SITE_CONFIG.domain}/category.html?category=${cat.slug}`
  });

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = renderBreadcrumb([
      { href: "index.html", label: "Home" },
      { href: "categories.html", label: "Categories" },
      { href: "#", label: cat.name }
    ]);
  }

  const titleEl = document.getElementById("category-title");
  if (titleEl) titleEl.textContent = cat.name + " Games";

  const descEl = document.getElementById("category-desc");
  if (descEl) descEl.textContent = generateCategoryDescription(cat.name);

  const games = getGamesByCategory(catSlug);
  const { games: pageGames, currentPage, totalPages } = paginateGames(games, page);

  renderGameGrid(pageGames, document.getElementById("category-games"));

  const pagEl = document.getElementById("category-pagination");
  if (pagEl) {
    pagEl.innerHTML = renderPagination(currentPage, totalPages, `category.html?category=${encodeURIComponent(catSlug)}`);
  }

  const relatedEl = document.getElementById("related-categories");
  if (relatedEl) {
    const others = getAllCategories().filter((c) => c.slug !== catSlug).slice(0, 6);
    relatedEl.innerHTML = renderCategoryChips(others);
  }
}
