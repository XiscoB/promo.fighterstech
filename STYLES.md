# FightersTech - Style Guide & CSS Documentation

> **For Future Agents**: This document describes the complete styling system used across the FightersTech promotional website. All styles are defined in `index.html` within a `<style>` tag (no external CSS files).

---

## Table of Contents

1. [Design Tokens (CSS Variables)](#design-tokens)
2. [Layout System](#layout-system)
3. [Background Effects](#background-effects)
4. [Components](#components)
5. [Animations](#animations)
6. [Responsive Breakpoints](#responsive-breakpoints)
7. [Common Patterns](#common-patterns)

---

## Design Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#001a33` | Main page background |
| `--bg-secondary` | `#00284e` | Section backgrounds (alternating) |
| `--bg-tertiary` | `#003366` | Cards, buttons, elevated surfaces |
| `--bg-card` | `rgba(0, 51, 102, 0.6)` | Card backgrounds with transparency |
| `--bg-card-hover` | `rgba(0, 51, 102, 0.8)` | Card hover state |
| `--accent-gold` | `#fcaf01` | Primary accent, CTAs, highlights |
| `--accent-green` | `#00c853` | Secondary accent, success states |
| `--accent-blue` | `#1e90ff` | Tertiary accent, links |
| `--text-primary` | `#ffffff` | Headlines, primary text |
| `--text-secondary` | `rgba(255, 255, 255, 0.8)` | Body text |
| `--text-muted` | `rgba(255, 255, 255, 0.6)` | Captions, subtle text |

### Gradients

```css
/* Primary gradient - Gold to Blue */
--accent-gradient: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-blue) 100%);

/* Glow effects */
--accent-glow-gold: 0 0 30px rgba(252, 175, 1, 0.3);
--accent-glow-green: 0 0 30px rgba(0, 200, 83, 0.3);
```

### Typography

| Token | Font | Usage |
|-------|------|-------|
| `--font-display` | `"Chakra Petch", sans-serif` | Headlines, buttons, labels |
| `--font-body` | `"Inter", sans-serif` | Body text, paragraphs |

**Font Loading** (in HTML `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--section-padding` | `120px` | Vertical section padding |
| `--container-max` | `1280px` | Max container width |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `8px` | Small elements, logos |
| `--radius-md` | `12px` | Buttons, cards, icons |
| `--radius-lg` | `20px` | Feature cards |
| `--radius-xl` | `28px` | Pills, toggles, badges |

### Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `0.2s ease` | Hover states, quick feedback |
| `--transition-medium` | `0.3s ease` | Most interactions |
| `--transition-slow` | `0.5s ease` | Complex animations |

---

## Layout System

### Container

```css
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}
```

### Section Structure

```css
.section {
  padding: var(--section-padding) 0;
  position: relative;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 64px;
}
```

### Grid Patterns

**Feature Cards Grid**:
```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}
```

**Footer Grid**:
```css
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
}
```

**App Showcase Grid**:
```css
.app-showcase-wrapper {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 64px;
  align-items: center;
}
```

---

## Background Effects

### Grid Overlay

```html
<div class="bg-grid"></div>
```

Creates a subtle 50px grid pattern with golden lines at 3% opacity.

### Glow Orbs

```html
<div class="bg-glow bg-glow-1"></div>
<div class="bg-glow bg-glow-2"></div>
<div class="bg-glow bg-glow-3"></div>
```

| Class | Position | Color |
|-------|----------|-------|
| `.bg-glow-1` | Top-right | Gold |
| `.bg-glow-2` | Bottom-left | Green |
| `.bg-glow-3` | Center-right | Blue |

**Common glow styles**:
```css
.bg-glow {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(150px);
  opacity: 0.15;
  pointer-events: none;
  z-index: 0;
}
```

---

## Components

### Header

```css
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  background: rgba(0, 40, 78, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(252, 175, 1, 0.1);
}

header.scrolled {
  padding: 12px 0;
  background: rgba(0, 40, 78, 0.98);
}
```

### Language Toggle

```html
<div class="lang-toggle">
  <button class="lang-btn active" data-lang="es">ES</button>
  <button class="lang-btn" data-lang="en">EN</button>
</div>
```

### Hero Section

**Structure**:
```html
<section class="hero">
  <div class="hero-content">
    <div class="hero-badge">Available Now</div>
    <h1 class="hero-title">
      <span class="word" data-text="Train.">Train.</span>
      <span class="word" data-text="Fight.">Fight.</span>
      <span class="word" data-text="Compete.">Compete.</span>
    </h1>
    <p class="hero-subtitle">...</p>
    <div class="store-buttons">...</div>
  </div>
  <div class="scroll-indicator">...</div>
</section>
```

**Gradient Text Effect**:
```css
.hero-title .word {
  display: inline-block;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Store Buttons

```html
<a href="..." class="store-btn">
  <svg><!-- Icon --></svg>
  <div class="store-btn-content">
    <span class="store-btn-label">Download on the</span>
    <span class="store-btn-title">App Store</span>
  </div>
</a>
```

**Hover Effect**: Gradient overlay slides in, button lifts up with shadow glow.

### Section Label (Badge)

```html
<span class="section-label">Features</span>
```

**Style**: Gold text, gold border, pill-shaped, uppercase, small text.

### Feature Cards

```html
<div class="feature-card">
  <div class="feature-icon">
    <svg><!-- Icon --></svg>
  </div>
  <h3>Title</h3>
  <p>Description</p>
</div>
```

**Hover Effect**:
- Card lifts up (`translateY(-8px)`)
- Border brightens
- Top gradient line appears (`transform: scaleX(1)`)
- Icon gets gradient background

### Phone Frame (App Showcase)

```html
<div class="phone-frame">
  <div class="phone-screen">
    <!-- Swiper carousel inside -->
  </div>
</div>
```

**Dimensions**: 
- Frame: 48px border-radius, 16px padding
- Screen: 36px border-radius, 9/19 aspect ratio

### Video Container

```html
<div class="video-container">
  <div class="swiper-container" id="videoSwiper">
    <div class="swiper-wrapper"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
  <div class="video-title">
    <strong id="activeVideoTitle">Title</strong>
  </div>
</div>
```

### Footer

**Structure**:
```html
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">...</div>
      <div class="footer-column">...</div>
      <div class="footer-column">...</div>
      <div class="footer-column">...</div>
    </div>
    <div class="footer-bottom">...</div>
  </div>
</footer>
```

**Social Links**:
```html
<div class="social-links">
  <a href="..." class="social-link" aria-label="Twitter">
    <svg><!-- Icon --></svg>
  </a>
</div>
```

---

## Animations

### Fade In Up (Scroll Reveal)

```css
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Usage**: Add `class="fade-in"` to elements, JavaScript adds `visible` class on scroll.

### Pulse (Badge Dot)

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Bounce (Scroll Indicator)

```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}
```

### Swipe Hint (Mobile)

```css
@keyframes swipeHint {
  0%, 100% { opacity: 0; transform: translateY(-50%) translateX(0); }
  50% { opacity: 1; transform: translateY(-50%) translateX(-10px); }
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Desktop | > 1024px | Default styles |
| Tablet | ≤ 1024px | 2-column footer, stacked app showcase |
| Mobile | ≤ 768px | Single column, hamburger menu, hidden nav arrows |
| Small Mobile | ≤ 480px | Reduced font sizes, smaller phone frame |

### Mobile Menu

```css
.main-menu {
  display: none; /* Hidden by default on mobile */
}

.main-menu.active {
  display: block; /* Shown when toggled */
}
```

### Responsive Pattern

```css
@media (max-width: 768px) {
  :root {
    --section-padding: 80px; /* Reduced from 120px */
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .swiper-button-prev,
  .swiper-button-next {
    display: none; /* Hide on mobile */
  }
}
```

---

## Common Patterns

### Gradient Text

```css
.gradient-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Glass/Card Effect

```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}
```

### Button with Gradient Hover

```css
.btn-gradient {
  position: relative;
  overflow: hidden;
  transition: var(--transition-medium);
}

.btn-gradient::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--accent-gradient);
  opacity: 0;
  transition: var(--transition-medium);
}

.btn-gradient:hover::before {
  opacity: 1;
}
```

### Feature List with Checkmarks

```css
.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-list li::before {
  content: "✓";
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(252, 175, 1, 0.1);
  border-radius: 50%;
  color: var(--accent-gold);
  font-size: 0.75rem;
  font-weight: 700;
}
```

---

## External Dependencies

### Swiper.js

Used for carousels (app images, videos).

```html
<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
```

**Common Swiper Configuration**:
```javascript
new Swiper('#appImagesSwiper', {
  effect: 'slide',
  slidesPerView: 1,
  loop: true,
  autoplay: { delay: 4000 },
  pagination: { el: '.swiper-pagination', clickable: true }
});
```

---

## Tips for Future Agents

1. **Always use CSS variables** - Don't hardcode colors or spacing
2. **Maintain z-index layering** - Background effects at 0, content at 1, header at 1000
3. **Test all hover states** - Cards, buttons, and links have specific hover effects
4. **Respect aspect ratios** - Phone frame uses `aspect-ratio: 9/19`
5. **Mobile-first approach** - Default styles are for desktop, override in media queries
6. **Keep animations subtle** - Use the defined transitions, avoid adding new ones without reason

---

## File Structure

```
promo.fighterstech/
├── index.html          # Main styles are in <style> tag here
├── kickstarter/
│   └── index.html      # Uses same design system
├── redkings/
│   └── index.html      # Uses same design system
└── lang/               # Translation files (separate)
```

**Note**: All styles are inline in each HTML file. There are no external CSS files in this project.
