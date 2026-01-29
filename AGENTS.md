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
├── index.html              # Main landing page (homepage) - redesigned with professional SaaS aesthetic
├── CNAME                   # GitHub Pages custom domain config
├── .nojekyll               # Prevents Jekyll processing on GitHub Pages
├── favicon.ico             # Site favicon
├── app-ads.txt             # Google AdSense/AdMob configuration
├── AGENTS.md               # This file - agent guidance
├── STYLES.md               # CSS design system documentation
├── assets/
│   └── kickstarter.png     # Kickstarter campaign image
├── img/                    # App screenshots (bilingual)
│   ├── 01_en.jpg ... 09_en.jpg   # English versions
│   ├── 01_es.jpg ... 09_es.jpg   # Spanish versions
├── lang/                   # Translation files (JSON)
│   ├── README.md           # Translation system documentation
│   ├── en.json             # English translations
│   └── es.json             # Spanish translations
├── kickstarter/
│   └── index.html          # Kickstarter campaign page (redesigned)
└── redkings/
    └── index.html          # RedKingsFG collaboration page (redesigned)
```

## Design System

> **📖 See `STYLES.md`** for complete CSS documentation, design tokens, component patterns, and usage examples.

### Visual Identity

The site uses a **dark, gaming-inspired aesthetic** suitable for the Fighting Game Community:

#### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a0f` | Main background |
| `--bg-secondary` | `#12121a` | Section backgrounds |
| `--bg-tertiary` | `#1a1a25` | Cards, elevated surfaces |
| `--accent-cyan` | `#00d4ff` | Primary accent, links, glows |
| `--accent-orange` | `#ff6b35` | Secondary accent, CTAs |
| `--accent-purple` | `#a855f7` | Tertiary accent, collaborations |
| `--text-primary` | `#ffffff` | Headlines, primary text |
| `--text-secondary` | `rgba(255,255,255,0.7)` | Body text |
| `--text-muted` | `rgba(255,255,255,0.5)` | Captions, footers |

#### Typography
- **Display Font**: Chakra Petch (condensed, gaming-inspired)
- **Body Font**: Inter (highly readable)
- Headlines use gradient text effects with `-webkit-background-clip: text`

#### Visual Effects
- **Background Grid**: Subtle cyan grid overlay (50px)
- **Glow Effects**: Blurred gradient orbs positioned absolutely
- **Glassmorphism**: Cards use `backdrop-filter: blur()` with semi-transparent backgrounds
- **Gradients**: Primary gradient is orange → cyan (135deg)

### Components

#### Buttons
- **Primary (Store Buttons)**: Gradient background with hover lift effect
- **Language Toggle**: Pill-shaped segmented control with active state
- **Navigation Links**: Subtle hover background with color transition

#### Cards
- Feature cards with top accent line (gradient on hover)
- Box shadows with glow effects on hover
- Smooth transitions for all interactive states

#### Video Sections
- Swiper.js carousels with fade transitions
- Custom navigation buttons (circular with gradient on hover)
- Video titles displayed below the carousel

## Key Features

1. **Bilingual Support**: Full English (EN) and Spanish (ES) localization with styled language switcher
2. **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
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
- Animated "Train. Fight. Compete." headline with gradient text
- Store badges with icon + text layout
- Scroll indicator at bottom

### Features Section
- Section label (badge style)
- Gradient headline
- Feature cards with icons in a 3-column grid
- Video carousel below

### App Showcase Section
- Two-column layout (content + phone mockup)
- Phone frame with notch and rounded corners
- Swiper fade carousel for screenshots
- Feature checklist with custom bullet styling

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

1. **Loading**: The `index.html` fetches the appropriate JSON file based on user language
2. **Fallback**: If a translation key is missing, it falls back to English
3. **Language Detection**: Automatic based on `navigator.language`
4. **Switching**: Users can switch languages via the ES/EN toggle in the header

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

## Code Organization

### Main Page (`index.html`)

**CSS Custom Properties** (CSS Variables) are defined in `:root` for the entire design system.

**Sections** (in order):
1. Background effects (grid, glow orbs)
2. Fixed header with logo, nav, and language toggle
3. Hero section with headline and store buttons
4. Main Features section with video carousel
5. App Images section with phone mockup
6. Other Features section with video carousel
7. CTA section
8. Footer with grid layout

**JavaScript**:
- `setLanguage(lang)` - Updates all translatable content
- `updateActiveVideoTitle()` - Syncs video title with active slide
- Swiper initialization on DOMContentLoaded
- IntersectionObserver for fade-in animations
- Header scroll effect
- Mobile menu toggle

### Subpages (`kickstarter/`, `redkings/`)

Share the same design system as the main page with simplified layouts:
- Centered placeholder content
- Page icon/badge
- Back to home button
- Same footer structure

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

### Adding New Screenshots

1. Add image files to `img/` with naming pattern `XX_en.jpg` and `XX_es.jpg`
2. Update translation objects with new screenshot metadata
3. Add new `<div class="swiper-slide">` elements to the app-images section

### Design Consistency

When making changes, maintain:
- Color variable usage (don't hardcode colors)
- Typography hierarchy (Chakra Petch for headlines, Inter for body)
- Border radius consistency (8px, 12px, 20px, 28px)
- Transition timing (0.2s for fast, 0.3s for medium)
- Spacing rhythm (8px base unit)

## Deployment

This site is deployed via **GitHub Pages**:

1. Push changes to the `main` branch
2. GitHub Pages automatically publishes the site
3. The `.nojekyll` file prevents Jekyll processing (allows files starting with underscores)
4. The `CNAME` file configures the custom domain (promo.fighterstech.com)

**No build step required** - changes are live immediately after push.

## External Dependencies

- `https://unpkg.com/swiper/swiper-bundle.min.css`
- `https://unpkg.com/swiper/swiper-bundle.min.js`
- `https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap`
- `https://legal.fighterstech.com/fighterstech.png` (logo)
- YouTube embed iframes

## Legal and SEO Configuration

- **Legal Pages**: Hosted at `legal.fighterstech.com` with language-specific paths
- **Structured Data**: JSON-LD for Organization and WebSite schema
- **Meta Tags**: Open Graph, Twitter Cards, viewport, description, keywords
- **Robots**: `index, follow` for search engine crawling
- **Ads**: `app-ads.txt` configured for Google AdSense/AdMob

## Testing Considerations

There is no automated testing setup. Manual testing should verify:

1. Language switching works correctly (ES/EN) - check all sections
2. Swiper carousels function properly on both mobile and desktop
3. All external links work (App Store, Google Play, social media)
4. Responsive layout at various screen sizes (320px, 768px, 1024px, 1440px)
5. YouTube videos load and play correctly
6. Smooth scroll behavior works
7. All hover effects function as expected
8. Mobile menu toggle works on small screens

## Security Notes

- All external links use `target="_blank"` with `rel="noopener noreferrer"`
- YouTube embeds use `rel=0` parameter to show related videos from same channel only
- No user input handling or server-side processing

## Related Projects

- **Main App**: FightersTech mobile app (iOS/Android)
- **Legal Site**: https://legal.fighterstech.com/ (separate repository)
