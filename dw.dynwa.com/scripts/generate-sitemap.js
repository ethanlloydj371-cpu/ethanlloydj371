const fs = require("fs");
const path = require("path");

const DOMAIN = "https://example.com";
const DATA_FILE = path.join(__dirname, "..", "data", "html5games-list.json");
const OUTPUT = path.join(__dirname, "..", "sitemap.xml");

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatCategorySlug(category) {
  return slugify(category);
}

const staticPages = [
  "",
  "index.html",
  "games.html",
  "categories.html",
  "about.html",
  "contact.html",
  "privacy-policy.html",
  "terms.html"
];

const games = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const seen = new Set();
const urls = [];

staticPages.forEach((page) => {
  const loc = page ? `${DOMAIN}/${page}` : `${DOMAIN}/`;
  urls.push({ loc, priority: page === "" || page === "index.html" ? "1.0" : "0.8" });
});

const categories = new Set();
games.forEach((g) => {
  if (!g.iframeUrl || !g.title) return;
  const slug = g.slug || slugify(g.title);
  const key = slug;
  if (seen.has(key)) return;
  seen.add(key);
  urls.push({ loc: `${DOMAIN}/game.html?slug=${encodeURIComponent(slug)}`, priority: "0.7" });

  const cats = g.categories && g.categories.length ? g.categories : g.category ? [g.category] : ["Casual"];
  cats.forEach((c) => categories.add(formatCategorySlug(c)));
});

categories.forEach((cat) => {
  urls.push({ loc: `${DOMAIN}/category.html?category=${encodeURIComponent(cat)}`, priority: "0.6" });
});

const today = new Date().toISOString().split("T")[0];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(OUTPUT, xml);
console.log(`Sitemap generated with ${urls.length} URLs at ${OUTPUT}`);
