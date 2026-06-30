document.addEventListener("DOMContentLoaded", async () => {
  await loadGames();
  mountLayout("search");
  initSearchPage();
});

function initSearchPage() {
  const query = getQueryParam("q");
  const results = searchGames(query);

  setPageMeta({
    title: query ? `Search: ${query}` : "Search Games",
    description: query
      ? `Search results for "${query}" on ${SITE_CONFIG.name}.`
      : `Search free HTML5 games on ${SITE_CONFIG.name}.`,
    canonical: `${SITE_CONFIG.domain}/search.html${query ? "?q=" + encodeURIComponent(query) : ""}`
  });

  const searchMount = document.getElementById("search-box");
  if (searchMount) searchMount.innerHTML = renderSearchBox(query, "search-page-input");

  const titleEl = document.getElementById("search-title");
  if (titleEl) {
    titleEl.textContent = query
      ? `Search Results for "${query}"`
      : "Search Games";
  }

  const countEl = document.getElementById("search-count");
  if (countEl) {
    countEl.textContent = query
      ? `${results.length} game${results.length !== 1 ? "s" : ""} found`
      : "Enter a search term to find games";
  }

  const gridEl = document.getElementById("search-results");
  if (!query) {
    if (gridEl) gridEl.innerHTML = `<div class="empty-state"><p>Type a game name, category, or keyword to search.</p></div>`;
    return;
  }

  if (!results.length) {
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="empty-state">
          <h2>No Results Found</h2>
          <p>We couldn't find any games matching "${escapeHtml(query)}". Try a different search term.</p>
          <a href="games.html" class="btn btn-primary">Browse All Games</a>
        </div>`;
    }
    return;
  }

  renderGameGrid(results, gridEl);
}
