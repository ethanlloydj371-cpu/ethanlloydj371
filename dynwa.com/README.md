# PlayMiniFun - HTML5 Casual Games Website

A complete, mobile-friendly HTML5 casual games portal built with vanilla HTML, CSS, and JavaScript. No build tools or frameworks required.

## Project Overview

PlayMiniFun is a static game portal that reads game metadata from `data/html5games-list.json` and embeds playable games through third-party iframe links. The site includes 150+ games across multiple categories with full SEO support, responsive design, and AdSense-friendly page structure.

## How to Run Locally

```bash
cd html5-casual-games-site
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## How to Update Games JSON

1. Replace or edit `data/html5games-list.json` with your game data.
2. Each game record should include: `title`, `slug`, `iframeUrl`, `categories`, `description`, and optionally `thumbnail`, `tags`, `pageUrl`, `source`.
3. Regenerate the sitemap after updating: `npm run sitemap`

## How to Generate Sitemap

```bash
npm run sitemap
```

Or directly:

```bash
node scripts/generate-sitemap.js
```

This generates `sitemap.xml` with all static pages, game pages, and category pages.

## How to Change Site Name / Domain / Email

Edit `assets/js/config.js`:

```js
const SITE_CONFIG = {
  name: "PlayMiniFun",
  domain: "https://example.com",
  description: "...",
  email: "support@example.com",
  gamesPerPage: 24,
  relatedGamesLimit: 8,
  defaultCategory: "Casual"
};
```

After changing the domain, also update `robots.txt` and regenerate the sitemap.

## How to Add AdSense or Google Ad Manager Later

1. Replace the ad placeholder `<div class="ad-slot">` elements with your AdSense ad unit code.
2. Ad slots are located in:
   - Homepage (`index.html`) - leaderboard slot
   - Games list page - in-content slots every 12 games
   - Game detail page - leaderboard (above game) and banner (below game)
3. All ad slots are labeled "Advertisement" and placed with safe spacing from game controls.
4. Do not place ads over game iframes or too close to Play buttons.

## How to Deploy to Nginx

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/html5-casual-games-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Upload the entire `html5-casual-games-site` directory to your server, update `SITE_CONFIG.domain`, regenerate sitemap, and configure your domain.

## Project Structure

```
html5-casual-games-site/
  index.html          - Homepage
  games.html          - All games with pagination
  game.html           - Game detail page
  categories.html     - Category listing
  category.html       - Category detail page
  search.html         - Search results
  about.html          - About page
  contact.html        - Contact page
  privacy-policy.html - Privacy policy
  terms.html          - Terms of service
  404.html            - Not found page
  data/               - Game data JSON
  assets/             - CSS, JS, images
  scripts/            - Sitemap generator
```

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript
- CSS Grid & Flexbox responsive layout
- No React, Vue, or build tools
- Static file deployment
