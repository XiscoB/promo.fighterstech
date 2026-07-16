# FightersTech Promo Website

The official promotional landing page for **FightersTech** — the social app built for the Fighting Game Community (FGC).

**Live site:** [https://promo.fighterstech.com/](https://promo.fighterstech.com/)

---

## What is FightersTech?

FightersTech is a social platform for fighting game players. Whether you are a casual player or a competitive contender, the app helps you:

- **Discover tournaments** — find local and online events for your favorite fighting games.
- **Train with others** — connect with sparring partners and level up your game.
- **Stay in the loop** — get notifications about upcoming tournaments, brackets, and community news.
- **Build your profile** — showcase your characters, ranks, and tournament results.
- **Compete** — track your progress and find the next event to enter.

This repository contains the static marketing site that showcases the app, its features, and download links for iOS and Android.

---

## Website Features

- **Bilingual** — full English and Spanish support, switchable from the header.
- **Responsive design** — optimized for desktop, tablet, and mobile.
- **Video carousels** — embedded YouTube videos showcasing app features and gameplay.
- **Screenshot gallery** — app screenshots inside a phone mockup, localized per language.
- **Community testimonials** — quotes and reviews from players in the FGC.
- **SEO ready** — JSON-LD structured data, Open Graph tags, canonical URLs, and sitemap.

---

## Tech Stack

This is a static site with no server-side runtime:

- **HTML / CSS / JavaScript** — vanilla, no frontend framework.
- **Swiper.js** — for image and video carousels.
- **YouTube iframe embeds** — for feature and tutorial videos.
- **Google Fonts** — Chakra Petch and Inter.
- **GitHub Pages** — hosting with custom domain.
- **GitHub Actions** — builds and deploys automatically on every merge to `main`.

The build process (`build.js`) compiles `template.html` together with `lang/en.json` and `lang/es.json` into the `dist/` folder:

```
template.html + lang/*.json
        │
        ▼   npm run build
      dist/
      ├── index.html      # English version
      ├── es/index.html   # Spanish version
      └── img/ lang/ assets/ ...
```

`dist/` is a build artifact and is gitignored. It is regenerated on every deploy.

---

## Local Development

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve the output locally
python -m http.server 8766 --directory dist
# or: npx serve dist -l 8766

# Open in browser
# EN: http://localhost:8766/
# ES: http://localhost:8766/es/
```

Do **not** open `dist/*.html` directly via `file://` — browser security blocks the language fetch, so sliders and the language toggle will not work. Always use a local HTTP server for testing.

---

## Deployment

Any push or merge into the `main` branch triggers `.github/workflows/deploy.yml`:

1. Checks out the repository.
2. Runs `npm run build`.
3. Uploads `dist/` as a GitHub Pages artifact.
4. Publishes to [https://promo.fighterstech.com/](https://promo.fighterstech.com/).

Changes are usually live within 1–2 minutes after the Actions run completes. GitHub's CDN caches pages for about 10 minutes, so use `Ctrl+Shift+R` (hard refresh) if you do not see updates immediately.

---

## Project Structure

```
.
├── template.html       # Source of truth for the landing page markup
├── build.js            # Build script that generates dist/
├── package.json        # npm scripts and dependencies
├── AGENTS.md           # Contributor guide for AI agents
├── STYLES.md           # CSS design system documentation
├── lang/               # Translation files
│   ├── en.json
│   └── es.json
├── img/                # App screenshots and assets
├── assets/             # Additional static assets
├── dist/               # Build output (gitignored)
├── kickstarter/        # Kickstarter placeholder page
└── redkings/           # RedKingsFG collaboration placeholder page
```

---

## Contributing

- Edit content in `lang/en.json` and `lang/es.json` (keep both languages in sync).
- Edit structure, styles, and scripts in `template.html`.
- Do not edit files inside `dist/` — they are generated automatically.

---

## Links

- **Promo site:** [https://promo.fighterstech.com/](https://promo.fighterstech.com/)
- **Main app:** FightersTech on iOS and Android
- **Legal:** [https://legal.fighterstech.com/](https://legal.fighterstech.com/)

---

Built with passion for the FGC. 🥊
