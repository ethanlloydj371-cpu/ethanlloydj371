function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncateText(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

function setPageMeta({ title, description, keywords, canonical, ogType }) {
  const siteName = SITE_CONFIG.name;
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  document.title = fullTitle;

  const setMeta = (selector, content) => {
    const el = document.querySelector(selector);
    if (el && content) el.setAttribute("content", content);
  };

  setMeta('meta[name="description"]', description || SITE_CONFIG.description);
  if (keywords) setMeta('meta[name="keywords"]', keywords);

  const canonicalUrl = canonical || window.location.href.split("#")[0];
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = canonicalUrl;

  setMeta('meta[property="og:title"]', fullTitle);
  setMeta('meta[property="og:description"]', description || SITE_CONFIG.description);
  setMeta('meta[property="og:type"]', ogType || "website");
  setMeta('meta[property="og:url"]', canonicalUrl);
  setMeta('meta[name="twitter:card"]', "summary_large_image");
  setMeta('meta[name="twitter:title"]', fullTitle);
  setMeta('meta[name="twitter:description"]', description || SITE_CONFIG.description);
}

function generateGameDescription(game) {
  const title = game.title;
  const cats = (game.categories || []).join(", ") || "casual";
  const base = game.description || "";
  const expanded = `Play ${title} online for free on ${SITE_CONFIG.name}. This casual HTML5 game is easy to start and works directly in your browser. Enjoy quick gameplay, simple controls, and fun challenges without downloading or installing anything. Whether you are on mobile, tablet, or desktop, you can open the game page and start playing instantly.`;
  if (base.length >= 80) return base + " " + expanded;
  return expanded + ` This ${cats.toLowerCase()} game offers fun entertainment for players of all ages.`;
}

function generateCategoryDescription(category) {
  const map = {
    Puzzle: "Play free online puzzle games and challenge your brain with logic, matching, and problem-solving games.",
    Arcade: "Enjoy fast and exciting arcade games directly in your browser with no download required.",
    Racing: "Play free racing games online and enjoy speed, driving, and challenge tracks.",
    Word: "Explore word games, spelling games, and vocabulary challenges for quick brain training.",
    Casual: "Relax and enjoy simple casual games that are easy to play anytime.",
    Action: "Dive into thrilling action games with fast-paced gameplay and exciting challenges.",
    Sports: "Play free sports games online including football, basketball, and more.",
    Adventure: "Embark on exciting adventure games with exploration and discovery.",
    Strategy: "Test your tactical skills with free online strategy games.",
    Shooting: "Enjoy shooting games with targets, challenges, and fun gameplay.",
    Girls: "Discover fun games designed for creative and casual play.",
    Boys: "Explore action-packed games with adventure and excitement.",
    Kids: "Safe and fun games designed especially for kids to enjoy.",
    Multiplayer: "Play multiplayer games and compete with friends online.",
    Racing: "Race to victory with free online racing games."
  };
  return map[category] || `Browse free online ${category} games on ${SITE_CONFIG.name}. Play instantly in your browser with no download required.`;
}

function formatCategorySlug(category) {
  return slugify(category);
}

function removeDuplicateGames(games) {
  const seen = new Set();
  return games.filter((g) => {
    const key = g.slug || g.iframeUrl;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function injectJsonLd(data) {
  let script = document.getElementById("json-ld");
  if (!script) {
    script = document.createElement("script");
    script.id = "json-ld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCategoryIcon(category) {
  const icons = {
    Puzzle: "🧩", Arcade: "🕹️", Racing: "🏎️", Word: "📝", Casual: "🎮",
    Action: "⚡", Sports: "⚽", Adventure: "🗺️", Strategy: "♟️", Shooting: "🎯",
    Girls: "💄", Boys: "🚀", Kids: "🧸", Multiplayer: "👥", Racing: "🏁",
    Football: "⚽", Basketball: "🏀", Dress: "👗", Fashion: "✨", Matching: "🔗"
  };
  return icons[category] || "🎲";
}
