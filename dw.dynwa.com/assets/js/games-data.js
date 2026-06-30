let _gamesCache = null;
let _playableCache = null;

function normalizeGame(raw) {
  if (!raw || !raw.title) return null;

  const slug = raw.slug || slugify(raw.title);
  const categories = (raw.categories && raw.categories.length)
    ? raw.categories
    : raw.category
      ? [raw.category]
      : [SITE_CONFIG.defaultCategory];

  let description = raw.description || "";
  if (description.length < 30) {
    description = generateGameDescription({ title: raw.title, categories, description });
  }

  return {
    id: raw.id || slug,
    title: raw.title.trim(),
    slug,
    source: raw.source || "Third-party provider",
    pageUrl: raw.pageUrl || "",
    iframeUrl: raw.iframeUrl || "",
    thumbnail: raw.thumbnail || "",
    categories,
    category: categories[0],
    tags: raw.tags || [],
    description,
    instructions: raw.instructions || "",
    width: raw.width || "800",
    height: raw.height || "600",
    playable: !!(raw.iframeUrl && raw.iframeUrl.trim())
  };
}

async function loadGames() {
  if (_gamesCache) return _gamesCache;
  try {
    const res = await fetch("data/html5games-list.json");
    const raw = await res.json();
    _gamesCache = removeDuplicateGames(
      raw.map(normalizeGame).filter(Boolean)
    );
    _playableCache = _gamesCache.filter((g) => g.playable);
    return _gamesCache;
  } catch (e) {
    console.error("Failed to load games:", e);
    _gamesCache = [];
    _playableCache = [];
    return [];
  }
}

function getAllGames() {
  return _gamesCache || [];
}

function getPlayableGames() {
  return _playableCache || [];
}

function getGameBySlug(slug) {
  return getAllGames().find((g) => g.slug === slug) || null;
}

function getAllCategories() {
  const map = new Map();
  getPlayableGames().forEach((g) => {
    g.categories.forEach((cat) => {
      if (!map.has(cat)) map.set(cat, { name: cat, slug: formatCategorySlug(cat), count: 0 });
      map.get(cat).count++;
    });
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

function getGamesByCategory(categorySlug) {
  return getPlayableGames().filter((g) =>
    g.categories.some((c) => formatCategorySlug(c) === categorySlug)
  );
}

function getCategoryBySlug(categorySlug) {
  const cats = getAllCategories();
  return cats.find((c) => c.slug === categorySlug) || null;
}

function searchGames(query) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return [];
  return getPlayableGames().filter((g) => {
    const haystack = [
      g.title, g.description,
      ...g.categories, ...g.tags
    ].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

function getRelatedGames(game, limit) {
  limit = limit || SITE_CONFIG.relatedGamesLimit;
  const others = getPlayableGames().filter((g) => g.slug !== game.slug);
  const sameCategory = others.filter((g) =>
    g.categories.some((c) => game.categories.includes(c))
  );
  const related = shuffleArray(sameCategory).slice(0, limit);
  if (related.length < limit) {
    const rest = shuffleArray(others.filter((g) => !related.includes(g)));
    related.push(...rest.slice(0, limit - related.length));
  }
  return related;
}

function sortGames(games, sortBy) {
  const list = [...games];
  switch (sortBy) {
    case "az":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "category":
      return list.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    case "newest":
    default:
      return list;
  }
}

function paginateGames(games, page, perPage) {
  perPage = perPage || SITE_CONFIG.gamesPerPage;
  const totalPages = Math.max(1, Math.ceil(games.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    games: games.slice(start, start + perPage),
    currentPage,
    totalPages,
    total: games.length
  };
}
