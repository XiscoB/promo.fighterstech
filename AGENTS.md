# FightersTech Promo Website - Agent Guide

## Project Overview

This is the **FightersTech promotional landing page** - a static website for the FightersTech mobile application, which serves the Fighting Game Community (FGC). The website showcases the app's features through embedded YouTube videos, app screenshots, and provides download links for iOS and Android platforms.

**Primary Domain**: https://promo.fighterstech.com/  
**Repository**: https://github.com/XiscoB/promo.fighterstech.git  
**Hosting**: GitHub Pages (custom domain configured via CNAME)

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript (no frameworks)
- **External Libraries**: 
  - [Swiper.js](https://swiperjs.com/) (via CDN) for image and video carousels
  - YouTube iframe embeds for video content
  - Google Fonts (Chakra Petch for display, Inter for body text)
- **Build Process**: None - this is a static site with no build step required
- **Package Management**: None - no package.json, requirements.txt, or similar
- **Hosting**: GitHub Pages with custom domain (promo.fighterstech.com)

## Project Structure

```
promo.fighterstech/
├── index.html              # Main landing page (homepage) - ~77KB inline CSS/JS
├── CNAME                   # GitHub Pages custom domain config (promo.fighterstech.com)
├── .nojekyll               # Prevents Jekyll processing on GitHub Pages
├── favicon.ico             # Site favicon
├── app-ads.txt             # Google AdSense/AdMob configuration
├── AGENTS.md               # This file - agent guidance
├── STYLES.md               # CSS design system documentation
├── assets/
│   └── kickstarter.png     # Kickstarter campaign image asset
├── img/                    # App screenshots (bilingual - 18 total)
│   ├── 01_en.jpg ... 09_en.jpg   # English versions
│   ├── 01_es.jpg ... 09_es.jpg   # Spanish versions
├── lang/                   # Translation files (JSON)
│   ├── README.md           # Translation system documentation
│   ├── en.json             # English translations (fallback)
│   └── es.json             # Spanish translations
├── kickstarter/
│   └── index.html          # Kickstarter campaign placeholder page
└── redkings/
    └── index.html          # RedKingsFG collaboration placeholder page
```

## Design System

> **📖 See `STYLES.md`** for complete CSS documentation, design tokens, component patterns, and usage examples.

### Visual Identity

The site uses a **dark, gaming-inspired aesthetic** with a navy blue base and gold/green accents:

#### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#001a33` | Main page background |
| `--bg-secondary` | `#00284e` | Light sections (Main Features, App Gallery, Testimonials, footer), mobile menu |
| `--bg-tertiary` | `#003366` | Cards, buttons, elevated surfaces |
| `--bg-card` | `rgba(0, 51, 102, 0.6)` | Card backgrounds with transparency |
| `--accent-gold` | `#fcaf01` | Primary accent, CTAs, highlights |
| `--accent-green` | `#00c853` | Secondary accent, success states |
| `--accent-blue` | `#1e90ff` | Tertiary accent, links |
| `--accent-red` | `#ff4757` | Fourth card accent (features, why sections) |
| `--text-primary` | `#ffffff` | Headlines, primary text |
| `--text-secondary` | `rgba(255, 255, 255, 0.8)` | Body text |
| `--text-muted` | `rgba(255, 255, 255, 0.6)` | Captions, subtle text |

#### Typography
- **Display Font**: Chakra Petch (condensed, gaming-inspired)
- **Body Font**: Inter (highly readable)
- Headlines use gradient text effects with `-webkit-background-clip: text`
- Section titles (`.section-title`) have an animated shimmer sweep and a gold bloom (`::after` fed by `data-title`) revealed on hover, press, and touch

#### Visual Effects
- **Background Grid**: Subtle golden grid overlay (50px)
- **Section Rhythm**: Strict dark/light background alternation top to bottom (hero dark → … → footer light); `.video-section--dark` marks the dark variant
- **Glow Effects**: Deliberately localized — animated aurora blobs only in the hero, plus static radial accents in Why and CTA sections. No global fixed glow orbs, so the hero stays the visual peak
- **Glassmorphism**: Cards use `backdrop-filter: blur()` with semi-transparent backgrounds
- **Gradients**: Primary gradient is gold → blue (135deg)

### Components

#### Buttons
- **Primary (Store Buttons)**: Gradient background with hover lift effect
- **Language Toggle**: Pill-shaped segmented control with active state
- **Navigation Links**: Subtle hover background with color transition

#### Cards
- Feature cards with per-card palette accents (gold/blue/green), corner glow and sheen sweep on hover
- Box shadows with glow effects on hover
- Smooth transitions for all interactive states

#### Video Sections
- Swiper.js carousels with fade transitions
- Custom navigation buttons (circular with gradient on hover)
- Video titles displayed below the carousel
- Mobile vs desktop video formats (9:16 vs 16:9 aspect ratios)

## Key Features

1. **Bilingual Support**: Full English (EN) and Spanish (ES) localization with styled language switcher
2. **Responsive Design**: Mobile-first approach with breakpoints at 1024px, 768px, and 480px
3. **Video Carousels**: Three Swiper.js sliders:
   - Main Features (tutorial/promo videos)
   - App Images (screenshot gallery in phone frame)
   - Other Features (quick feature videos)
4. **SEO Optimized**: JSON-LD structured data, Open Graph tags, Twitter Cards, canonical URLs
5. **Store Links**: Direct links to App Store and Google Play with hover effects
6. **Professional Design**: Gaming/SaaS aesthetic with smooth animations

## Layout Structure

### Hero Section
- Full viewport height with centered content
- Animated headline with gradient text (words: "Train. Fight. Compete.")
- Store badges with icon + text layout
- Scroll indicator at bottom

### Features Section
- Section label (badge style)
- Gradient headline
- Feature cards with icons in a 3-column grid
- Video carousel below with dynamic titles

### App Showcase Section
- Two-column layout (content + phone mockup)
- Phone frame with rounded corners (48px border-radius)
- Swiper fade carousel for screenshots
- Feature checklist: cardless rows with hairline dividers and check markers that invert to solid gold on hover

### CTA Section
- Centered layout with radial gradient background
- Repeat of store buttons

### Footer
- 4-column grid (brand + 3 link columns)
- Social media icons with hover effects
- Copyright and legal links

## Internationalization (i18n)

Translations are stored in separate JSON files in the `lang/` folder:
- `lang/en.json` - English translations (fallback language)
- `lang/es.json` - Spanish translations

### Translation Structure

Each JSON file follows a hierarchical structure organized by sections:

```json
{
  "_meta": { "language": "English", "code": "en", "fallback": true },
  "nav": { "menuMainFeatures": "Features", ... },
  "hero": { "title": "Train. Fight. Compete.", ... },
  "sections": { "mainFeatures": {...}, "appGallery": {...}, ... },
  "featureCards": [...],
  "footer": { "brand": {...}, "columns": {...} },
  "legalUrls": { ... },
  "screenshots": { ... },
  "videoSwiper": { "mobileVideos": [...], "desktopVideos": [...], ... }
}
```

### How it Works

1. **Loading**: The `index.html` fetches the appropriate JSON file based on user language (`navigator.language`)
2. **Fallback**: If a translation key is missing, it falls back to English
3. **Language Detection**: Automatic based on browser language; defaults to English
4. **Switching**: Users can switch languages via the ES/EN toggle in the header
5. **Video Adaptation**: Videos switch between mobile (9:16) and desktop (16:9) formats based on screen width

### Adding a New Language

1. Copy `lang/en.json` to `lang/{code}.json` (e.g., `fr.json` for French)
2. Translate all text values, keeping keys unchanged
3. Update `_meta` section with language info
4. Add the language option to the language toggle in `index.html`
5. Update `lang/README.md` with the new language

### Translation Guidelines

- Keep keys in English (e.g., `menuMainFeatures`, not `menuCaracteristicas`)
- Maintain the same JSON structure
- Test that all links and video IDs work for the new language
- Ensure screenshot paths point to the correct language-specific images
- YouTube video IDs can be different per language for localized content

## Code Organization

### Main Page (`index.html`)

**CSS Custom Properties** (CSS Variables) are defined in `:root` for the entire design system (~400 lines of CSS).

**Sections** (in order):
1. Background effects (grid overlay)
2. Fixed header with logo, nav, and language toggle
3. Hero section with headline and store buttons
4. Main Features section with video carousel
5. App Images section with phone mockup
6. Other Features section with video carousel
7. CTA section
8. Footer with grid layout

**JavaScript** (~400 lines):
- `setLanguage(lang)` - Updates all translatable content dynamically
- `updateActiveVideoTitle()` - Syncs video title with active slide
- `initTranslations()` - Loads translation files with fallback handling
- `getVideoView()` - Detects mobile vs desktop for video format
- Swiper initialization on DOMContentLoaded
- IntersectionObserver for fade-in animations
- Header scroll effect
- Mobile menu toggle

### Subpages (`kickstarter/`, `redkings/`)

Share a similar design system with simplified layouts:
- Centered placeholder content with page icon/badge
- Language toggle (ES/EN) with inline translations
- Navigation menu linking to main site sections
- Back to home button
- Footer with social links and legal navigation

Each subpage has inline JavaScript translation objects (not external JSON) for simpler maintenance.

## Development Guidelines

### Making Changes

1. **HTML**: Edit the relevant `.html` file directly
2. **CSS**: Styles are inline within `<style>` tags in each file (see `STYLES.md` for design system reference)
3. **JavaScript**: Scripts are inline within `<script>` tags at the bottom of each file
4. **Images**: Add to `img/` directory, update references in translation files for bilingual support
5. **Translations**: Edit files in `lang/` folder - update all language files when adding new text

### Design System Reference

Before making style changes, consult `STYLES.md` which documents:
- All CSS variables (colors, spacing, typography)
- Component patterns (cards, buttons, sections)
- Animation guidelines
- Responsive breakpoints
- Common CSS patterns

### Adding New Videos

1. Upload video to YouTube
2. Add video entry to both `translations.es.videoSwiper` and `translations.en.videoSwiper`
3. Use different video IDs for different languages if content differs
4. Specify appropriate array (`mobileVideos`/`desktopVideos` or `mobileOtherVideos`/`desktopOtherVideos`)
5. Videos automatically adapt format based on screen width (window.innerWidth < 768)

### Adding New Screenshots

1. Add image files to `img/` with naming pattern `XX_en.jpg` and `XX_es.jpg`
2. Update translation objects in `lang/en.json` and `lang/es.json` with new screenshot metadata
3. Add new `<div class="swiper-slide">` elements to the app-images section in `index.html`

### Design Consistency

When making changes, maintain:
- Color variable usage (don't hardcode colors)
- Typography hierarchy (Chakra Petch for headlines, Inter for body)
- Border radius consistency (8px, 12px, 20px, 28px, 36px, 48px)
- Transition timing (0.2s for fast, 0.3s for medium, 0.5s for slow)
- Spacing rhythm (8px base unit, 120px section padding)
- Z-index layering (background: 0, content: 1, header: 1000)

## Build and Deployment

### No Build Step

This project has **no build process**. It is a pure static HTML site.

### Deployment

This site is deployed via **GitHub Pages**:

1. Push changes to the `main` branch
2. GitHub Pages automatically publishes the site
3. The `.nojekyll` file prevents Jekyll processing (allows files starting with underscores)
4. The `CNAME` file configures the custom domain (promo.fighterstech.com)

**Changes are live immediately after push** - no build step required.

### Local Development

To preview locally:

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node's npx
npx serve .

# Or using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Testing Strategy

There is **no automated testing setup**. Manual testing should verify:

1. **Language switching** works correctly (ES/EN) - check all sections
2. **Swiper carousels** function properly on both mobile and desktop
3. **All external links** work (App Store, Google Play, social media)
4. **Responsive layout** at various screen sizes (320px, 768px, 1024px, 1440px)
5. **YouTube videos** load and play correctly in both formats
6. **Smooth scroll** behavior works for anchor links
7. **All hover effects** function as expected
8. **Mobile menu toggle** works on small screens
9. **Video format switching** - resize browser to verify mobile/desktop video swap

### Testing Checklist for Changes

- [ ] Test in both English and Spanish
- [ ] Test on mobile viewport (375px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1440px width)
- [ ] Verify all carousels function correctly
- [ ] Check all external links open correctly
- [ ] Validate no console errors

## External Dependencies

| Resource | URL | Usage |
|----------|-----|-------|
| Swiper CSS | `https://unpkg.com/swiper/swiper-bundle.min.css` | Carousel styling |
| Swiper JS | `https://unpkg.com/swiper/swiper-bundle.min.js` | Carousel functionality |
| Google Fonts | `https://fonts.googleapis.com/css2?family=Chakra+Petch...` | Typography |
| Logo CDN | `https://legal.fighterstech.com/fighterstech.png` | Brand logo |
| YouTube | `https://www.youtube.com/embed/{id}` | Video embeds |

## Security Considerations

- All external links use `target="_blank"` with `rel="noopener noreferrer"`
- YouTube embeds use `rel=0` parameter to show related videos from same channel only
- No user input handling or server-side processing
- Static site with no authentication or sensitive data
- Ad configuration in `app-ads.txt` follows Google AdSense standards

## Legal and SEO Configuration

- **Legal Pages**: Hosted at `legal.fighterstech.com` with language-specific paths
- **Structured Data**: JSON-LD for Organization and WebSite schema
- **Meta Tags**: Open Graph, Twitter Cards, viewport, description, keywords
- **Robots**: `index, follow` for search engine crawling
- **Canonical URLs**: Set to `https://promo.fighterstech.com/`
- **Hreflang**: Alternate links for English and Spanish
- **Ads**: `app-ads.txt` configured for Google AdSense/AdMob

## Related Projects

- **Main App**: FightersTech mobile app (iOS/Android)
- **Legal Site**: https://legal.fighterstech.com/ (separate repository)
- **Kickstarter**: Future crowdfunding campaign (placeholder page)
- **RedKingsFG**: Collaboration page for tournaments (placeholder page)

## Tips for AI Agents

1. **Always check `STYLES.md`** before modifying CSS - it contains the design system reference
2. **Test both languages** when making content changes
3. **Update both JSON files** (`en.json` and `es.json`) when adding new translatable content
4. **Verify mobile layout** - the site is heavily used on mobile devices
5. **Don't add build tools** - keep it simple as a static site
6. **Use CSS variables** - never hardcode colors or spacing values
7. **Maintain z-index layering** - background at 0, content at 1, header at 1000
8. **Test hover states** - many elements have specific hover effects
9. **Respect aspect ratios** - Phone frame uses `aspect-ratio: 9/19`
10. **Keep animations subtle** - use defined transitions, avoid adding new ones without reason
