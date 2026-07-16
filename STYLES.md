# FightersTech Design System

> **📖 Universal Design Reference**: This document describes a complete, reusable design system for building modern, gaming-inspired web experiences. It can be adapted for any website, app, or media project.
> 
> **Current Implementation**: FightersTech promotional website (`index.html`)
> **Aesthetic**: Dark gaming/SaaS with navy blue base and gold/green accents

---

## Table of Contents

1. [Quick Start for Agents](#quick-start-for-agents)
2. [Design Philosophy](#design-philosophy)
3. [Design Tokens (CSS Variables)](#design-tokens)
4. [Layout System](#layout-system)
5. [Typography System](#typography-system)
6. [Color System](#color-system)
7. [Background Effects](#background-effects)
8. [Component Library](#component-library)
9. [Animations & Motion](#animations--motion)
10. [Responsive Design](#responsive-design)
11. [Accessibility Guidelines](#accessibility-guidelines)
12. [Common Patterns & Recipes](#common-patterns--recipes)
13. [Implementation Examples](#implementation-examples)

---

## Quick Start for Agents

### Copy-Paste Starter Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Project</title>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ===== CSS VARIABLES (Design Tokens) ===== */
    :root {
      /* Background Colors - Navy Blue Theme */
      --bg-primary: #001a33;
      --bg-secondary: #00284e;
      --bg-tertiary: #003366;
      --bg-card: rgba(0, 51, 102, 0.6);
      --bg-card-hover: rgba(0, 51, 102, 0.8);
      
      /* Accent Colors */
      --accent-gold: #fcaf01;
      --accent-green: #00c853;
      --accent-blue: #1e90ff;
      --accent-red: #ff4757;
      --accent-purple: #7c3aed;
      
      /* Text Colors */
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.8);
      --text-muted: rgba(255, 255, 255, 0.6);
      
      /* Gradients */
      --accent-gradient: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-blue) 100%);
      
      /* Typography */
      --font-display: "Chakra Petch", sans-serif;
      --font-body: "Inter", sans-serif;
      
      /* Spacing Scale (8px base) */
      --space-xs: 4px;
      --space-sm: 8px;
      --space-md: 16px;
      --space-lg: 24px;
      --space-xl: 32px;
      --space-2xl: 48px;
      --space-3xl: 64px;
      --space-4xl: 96px;
      --space-5xl: 120px;
      
      /* Border Radius Scale */
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 20px;
      --radius-xl: 28px;
      --radius-2xl: 36px;
      --radius-full: 9999px;
      
      /* Transitions */
      --transition-fast: 0.2s ease;
      --transition-medium: 0.3s ease;
      --transition-slow: 0.5s ease;
      
      /* Layout */
      --container-max: 1280px;
      --section-padding: 120px;
      
      /* Z-Index Scale */
      --z-background: 0;
      --z-content: 1;
      --z-sticky: 100;
      --z-header: 1000;
      --z-modal: 2000;
      --z-tooltip: 3000;
    }

    /* ===== RESET & BASE ===== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: var(--font-body);
      background-color: var(--bg-primary);
      color: var(--text-secondary);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-display);
      color: var(--text-primary);
      line-height: 1.2;
    }
  </style>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```

---

## Design Philosophy

### Core Principles

1. **Dark Mode First**: The system is designed for dark backgrounds with light text. All color tokens assume a dark theme.

2. **Gaming Aesthetic**: Sharp edges, bold gradients, and subtle glow effects create a modern gaming/SaaS feel without being overwhelming.

3. **Glassmorphism**: Cards and overlays use semi-transparent backgrounds with `backdrop-filter: blur()` for depth.

4. **Motion with Purpose**: Animations guide attention and provide feedback - never use animation just for decoration.

5. **Consistent Rhythm**: 8px base grid ensures all spacing feels harmonious.

### When to Use This System

**✅ Good for:**
- Gaming websites and apps
- SaaS landing pages
- Tech/product showcases
- Dark-themed portfolios
- Crypto/Web3 interfaces

**❌ Not ideal for:**
- Light/corporate themes (requires color inversion)
- Editorial/content-heavy sites (typography is display-focused)
- E-commerce (too gaming-focused)

---

## Design Tokens

Design tokens are the single source of truth for visual properties. **Always use these variables** - never hardcode values.

### Color Tokens

#### Background Colors

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--bg-primary` | Navy Blue | `#001a33` | Page background |
| `--bg-secondary` | Lighter Navy | `#00284e` | Section backgrounds (video/CTA/footer), mobile menu |
| `--bg-tertiary` | Card Background | `#003366` | Buttons, elevated surfaces |
| `--bg-card` | Semi-transparent | `rgba(0,51,102,0.6)` | Card backgrounds |
| `--bg-card-hover` | More opaque | `rgba(0,51,102,0.8)` | Card hover states |

#### Accent Colors

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--accent-gold` | Golden Yellow | `#fcaf01` | Primary CTAs, highlights, gold accents |
| `--accent-green` | Bright Green | `#00c853` | Success states, secondary accents |
| `--accent-blue` | Dodger Blue | `#1e90ff` | Tertiary accent, links, info states |
| `--accent-red` | Coral Red | `#ff4757` | Fourth card accent (features, why sections) |
| `--accent-purple` | Violet | `#7c3aed` | Optional accent variety |

#### Text Colors (on Dark Backgrounds)

| Token | Value | Opacity | Usage |
|-------|-------|---------|-------|
| `--text-primary` | White | 100% | Headlines, important text |
| `--text-secondary` | White | 80% | Body text, descriptions |
| `--text-muted` | White | 60% | Captions, metadata, disabled |
| `--text-subtle` | White | 40% | Placeholder text |

#### Opacity Modifiers for Colors

Instead of creating new color variables, use CSS opacity for variations:

```css
/* Instead of --bg-card: rgba(0,51,102,0.6) */
background: var(--bg-tertiary);
opacity: 0.6;

/* Or use color-mix (modern browsers) */
background: color-mix(in srgb, var(--bg-tertiary) 60%, transparent);
```

### Spacing Scale

All spacing uses an 8px base unit. This creates visual rhythm and consistency.

| Token | Value | Pixels | Common Usage |
|-------|-------|--------|--------------|
| `--space-xs` | 0.25rem | 4px | Icon gaps, tight spacing |
| `--space-sm` | 0.5rem | 8px | Component internal padding |
| `--space-md` | 1rem | 16px | Default padding, gap |
| `--space-lg` | 1.5rem | 24px | Card padding, section gaps |
| `--space-xl` | 2rem | 32px | Component margins |
| `--space-2xl` | 3rem | 48px | Section internal gaps |
| `--space-3xl` | 4rem | 64px | Large section spacing |
| `--space-4xl` | 6rem | 96px | Hero spacing |
| `--space-5xl` | 7.5rem | 120px | Section vertical padding |

**Usage Guidelines:**
- Component padding: `--space-sm` to `--space-lg`
- Section gaps: `--space-xl` to `--space-3xl`
- Vertical rhythm: `--space-5xl` for section padding

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small buttons, tags, input fields |
| `--radius-md` | 12px | Cards, modals, buttons |
| `--radius-lg` | 20px | Feature cards, large containers |
| `--radius-xl` | 28px | Pills, toggles, badges |
| `--radius-2xl` | 36px | Phone frames, large UI elements |
| `--radius-full` | 9999px | Circular buttons, avatars |

### Shadow & Glow Tokens

```css
/* Subtle elevation */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);

/* Card elevation */
--shadow-md: 0 4px 20px rgba(0, 0, 0, 0.3);

/* Hover/Active states */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Glow effects */
--glow-gold: 0 0 30px rgba(252, 175, 1, 0.3);
--glow-green: 0 0 30px rgba(0, 200, 83, 0.3);
--glow-blue: 0 0 30px rgba(30, 144, 255, 0.3);
```

### Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `0.2s ease` | Hover states, quick feedback |
| `--transition-medium` | `0.3s ease` | Most interactions, modals |
| `--transition-slow` | `0.5s ease` | Page transitions, reveals |

### Z-Index Scale

| Token | Value | Layer |
|-------|-------|-------|
| `--z-background` | 0 | Background effects, grid |
| `--z-content` | 1 | Main content |
| `--z-sticky` | 100 | Sticky elements |
| `--z-header` | 1000 | Fixed header/navigation |
| `--z-modal` | 2000 | Modals, overlays |
| `--z-tooltip` | 3000 | Tooltips, dropdowns |
| `--z-toast` | 4000 | Toast notifications |

---

## Layout System

### Container Pattern

```css
.container {
  width: 100%;
  max-width: var(--container-max);  /* 1280px */
  margin: 0 auto;
  padding: 0 var(--space-lg);        /* 24px horizontal padding */
  position: relative;
  z-index: var(--z-content);
}
```

**Container Variants:**

| Class | Max Width | Usage |
|-------|-----------|-------|
| `.container` | 1280px | Default content |
| `.container-sm` | 768px | Narrow content, text-heavy |
| `.container-lg` | 1440px | Wide layouts, galleries |
| `.container-fluid` | 100% | Full-width sections |

### Section Pattern

```css
.section {
  padding: var(--section-padding) 0;  /* 120px vertical */
  position: relative;
}

/* Strict dark/light alternation, top to bottom:
   hero (dark, aurora) → Main Features (light) → Why (dark gradient)
   → App Gallery (light) → Other Features (dark) → Testimonials (light)
   → CTA (dark) → Footer (light) */
.video-section,
.app-showcase,
.testimonials-section,
footer {
  background: var(--bg-secondary);  /* light sections */
}

/* Dark variant so Other Features contrasts with its light neighbors */
.video-section--dark {
  background: var(--bg-primary);
}

/* Why section uses a primary-based vertical gradient (dark).
   Ambient glow is deliberately localized: the animated aurora lives
   only in the hero, plus one static radial accent in
   .why-section::after and .cta-section::before */
```

**Section Structure:**

```html
<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Label</span>
      <!-- data-title feeds the hover/touch gold bloom (::after content);
           keep it in sync with the visible text (i18n JS does this).
           The shimmer + bloom treatment is shared by .section-title,
           .app-showcase-content h2 and .cta-content h2 -->
      <h2 class="section-title" data-title="Section Title">Section Title</h2>
      <p class="section-description">Description text...</p>
    </div>
    <div class="section-content">
      <!-- Your content here -->
    </div>
  </div>
</section>
```

### Grid Patterns

#### Feature Cards Grid (Auto-fit)

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);  /* 32px */
}
```

- Automatically creates as many columns as fit
- Each column minimum 300px, maximum 1fr
- Responsive without media queries

#### Footer Grid (Asymmetric)

```css
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-2xl);  /* 48px */
}
```

- First column 2x width (brand section)
- Three equal columns for links

#### Two Column Layout

```css
.two-column {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-3xl);  /* 64px */
  align-items: center;
}
```

#### Three Column Layout

```css
.three-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}
```

---

## Typography System

### Font Families

| Token | Font | Usage |
|-------|------|-------|
| `--font-display` | Chakra Petch | Headlines, buttons, labels, UI |
| `--font-body` | Inter | Body text, paragraphs, descriptions |

**Google Fonts URL:**
```html
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Font | Size | Weight | Line Height | Letter Spacing |
|---------|------|------|--------|-------------|----------------|
| H1 (Hero) | Display | 4rem (64px) | 700 | 1.1 | -0.02em |
| H2 | Display | 2.5rem (40px) | 700 | 1.2 | -0.01em |
| H3 | Display | 1.75rem (28px) | 600 | 1.3 | 0 |
| H4 | Display | 1.25rem (20px) | 600 | 1.4 | 0 |
| H5 | Display | 1rem (16px) | 600 | 1.4 | 0.02em |
| Body Large | Body | 1.125rem (18px) | 400 | 1.6 | 0 |
| Body | Body | 1rem (16px) | 400 | 1.6 | 0 |
| Body Small | Body | 0.875rem (14px) | 400 | 1.5 | 0 |
| Caption | Body | 0.75rem (12px) | 500 | 1.4 | 0.02em |
| Label | Display | 0.75rem (12px) | 600 | 1 | 0.05em |

### Typography Patterns

#### Gradient Text Effect

```css
.gradient-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Usage: Apply to headlines, important words, or brand elements for emphasis.

#### Section Label (Badge)

```css
.section-label {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-xl);
  padding: var(--space-sm) var(--space-md);
}
```

---

## Color System

### Primary Gradient

```css
--accent-gradient: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-blue) 100%);
```

**Gradient Directions:**
- `135deg` - Top-left to bottom-right (diagonal ↘)
- `90deg` - Left to right (→)
- `180deg` - Top to bottom (↓)
- `45deg` - Bottom-left to top-right (diagonal ↗)

### Background Treatment

The primary background uses a layered approach:

1. **Base Color**: `--bg-primary` solid color
2. **Grid Overlay**: Subtle grid pattern at 3% opacity
3. **Localized Glow**: Animated aurora blobs only in the hero; static radial accents in Why and CTA sections — no global fixed glow orbs, so the hero stays the visual peak

### Creating Color Variations

```css
/* Lighter variation */
background: rgba(255, 255, 255, 0.1);

/* Darker variation */
background: rgba(0, 0, 0, 0.2);

/* Color with transparency */
background: rgba(252, 175, 1, 0.1);  /* Gold at 10% */

/* Using CSS color-mix (modern) */
background: color-mix(in srgb, var(--accent-gold) 20%, transparent);
```

### State Colors

| State | Color | Usage |
|-------|-------|-------|
| Success | `--accent-green` | Success messages, checkmarks |
| Error | `#ef4444` (Red-500) | Error states, validation |
| Warning | `#f59e0b` (Amber-500) | Warnings, alerts |
| Info | `--accent-blue` | Information, links |

---

## Background Effects

### Grid Overlay

Creates a subtle grid pattern that adds texture without distraction.

```css
.bg-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(252, 175, 1, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(252, 175, 1, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: var(--z-background);
}
```

**Customization:**
- Grid size: Change `background-size`
- Opacity: Adjust alpha value (0.03 = 3%)
- Color: Change RGB values in `rgba()`

**HTML Structure:**
```html
<div class="bg-grid"></div>
```

> **Note:** The site intentionally has no global fixed glow orbs.
> Ambient glow is localized: the animated aurora system lives only
> in the hero (`.hero-aurora`, `.aurora-blob-*`), with static radial
> accents in `.why-section::after` and `.cta-section::before`.

---

## Component Library

### Header/Navigation

```css
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  padding: var(--space-md) 0;
  background: rgba(0, 40, 78, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(252, 175, 1, 0.1);
  transition: var(--transition-medium);
}

/* Shrinks when scrolled */
header.scrolled {
  padding: var(--space-sm) 0;
  background: rgba(0, 40, 78, 0.98);
}
```

**Header Structure:**
```html
<header>
  <div class="container">
    <div class="header-content">
      <a href="/" class="logo">
        <img src="logo.png" alt="Brand">
      </a>
      <nav class="main-nav">
        <a href="#features">Features</a>
        <a href="#gallery">Gallery</a>
        <a href="#download">Download</a>
      </nav>
      <div class="header-actions">
        <!-- Language toggle, CTA button, etc. -->
      </div>
    </div>
  </div>
</header>
```

### Buttons

#### Primary Button (Gradient)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text-primary);
  background: var(--accent-gradient);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-medium);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-gold), var(--shadow-lg);
}
```

#### Secondary Button (Outlined)

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-medium);
}

.btn-secondary:hover {
  border-color: var(--accent-gold);
  background: rgba(252, 175, 1, 0.1);
}
```

#### Store Button (App Store / Play Store)

```css
.store-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition-medium);
  position: relative;
  overflow: hidden;
}

.store-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--accent-gradient);
  opacity: 0;
  transition: var(--transition-medium);
}

.store-btn:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-gold);
}

.store-btn:hover::before {
  opacity: 1;
}

.store-btn-content {
  position: relative;
  z-index: 1;
}

.store-btn-label {
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
}

.store-btn-title {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.125rem;
}
```

### Cards

#### Feature Card

Each feature card carries its own accent from the app palette via the
`--card-accent` / `--card-accent-rgb` custom properties. The default is gold;
`nth-child(2)` is blue and `nth-child(3)` is green. Every hover effect
(border, glow, icon, title) derives from those two variables.

```css
.feature-card {
  --card-accent: var(--accent-gold);
  --card-accent-rgb: 252, 175, 1;
  background: linear-gradient(
    150deg,
    rgba(var(--card-accent-rgb), 0.08) 0%,
    rgba(255, 255, 255, 0.02) 55%
  );
  border: 1px solid rgba(var(--card-accent-rgb), 0.18);
  border-radius: var(--radius-lg);
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.features-grid .feature-card:nth-child(2) {
  --card-accent: var(--accent-blue);
  --card-accent-rgb: 30, 144, 255;
}

.features-grid .feature-card:nth-child(3) {
  --card-accent: var(--accent-green);
  --card-accent-rgb: 0, 200, 83;
}

/* Corner glow that wakes up on hover */
.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    420px circle at 85% -10%,
    rgba(var(--card-accent-rgb), 0.18) 0%,
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

/* Diagonal sheen sweeping across the card on hover */
.feature-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 42%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 58%
  );
  transform: translateX(-130%);
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(var(--card-accent-rgb), 0.45);
  box-shadow: 0 0 44px rgba(var(--card-accent-rgb), 0.18);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover::after {
  transform: translateX(130%);
}

/* Icon chip tinted with the card accent; inverts on hover */
.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--card-accent-rgb), 0.1);
  border: 1px solid rgba(var(--card-accent-rgb), 0.28);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
  color: var(--card-accent);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.35s ease,
    border-color 0.35s ease,
    color 0.35s ease,
    box-shadow 0.35s ease;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  /* No fill override: each SVG declares its own fill/stroke */
}

.feature-card:hover .feature-icon {
  background: var(--card-accent);
  border-color: transparent;
  color: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 0 24px rgba(var(--card-accent-rgb), 0.45);
}

.feature-card h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  transition: color 0.35s ease;
}

.feature-card:hover h3 {
  color: var(--card-accent);
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.7;
}
```

#### Glass Card

```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}
```

### Forms / Inputs

```css
.input-field {
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--bg-tertiary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(252, 175, 1, 0.1);
}
```

### Language Toggle

```css
.lang-toggle {
  display: inline-flex;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  padding: 4px;
  gap: 4px;
}

.lang-btn {
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-fast);
}

.lang-btn:hover {
  color: var(--text-primary);
}

.lang-btn.active {
  color: var(--text-primary);
  background: var(--accent-gold);
}
```

### Phone Frame (Device Mockup)

```css
.phone-frame {
  background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
  border-radius: var(--radius-2xl);  /* 36px */
  padding: var(--space-md);          /* 16px */
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.phone-screen {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);   /* 20px */
  overflow: hidden;
  aspect-ratio: 9 / 19;              /* Phone aspect ratio */
}
```

---

## Animations & Motion

### Scroll Reveal (Fade In Up)

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

**JavaScript Usage:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
```

### Stagger Animation

```css
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Pulse Animation

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

### Bounce Animation

```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.bounce {
  animation: bounce 2s infinite;
}
```

### Gradient Shift (Subtle)

```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;
}
```

### Hover Lift Effect

```css
.hover-lift {
  transition: transform var(--transition-medium), box-shadow var(--transition-medium);
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}
```

---

## Responsive Design

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| Mobile | ≤ 480px | Small phones |
| Mobile Large | ≤ 768px | Phones, small tablets |
| Tablet | ≤ 1024px | Tablets, small laptops |
| Desktop | > 1024px | Desktops, large screens |

### Responsive Patterns

```css
/* Mobile First: Default styles for mobile */
.features-grid {
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

/* Tablet */
@media (min-width: 769px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-xl);
  }
}
```

### Mobile-Specific Adjustments

```css
@media (max-width: 768px) {
  :root {
    --section-padding: 80px;
  }
  
  h1 { font-size: 2.5rem; }
  h2 { font-size: 1.75rem; }
  
  .container {
    padding: 0 var(--space-md);
  }
  
  /* Hide desktop-only elements */
  .desktop-only {
    display: none;
  }
}
```

### Touch-Friendly Targets

On mobile, ensure interactive elements are at least 44px × 44px:

```css
@media (max-width: 768px) {
  button, a, .interactive {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## Accessibility Guidelines

### Color Contrast

All text must meet WCAG AA standards:

| Text Type | Minimum Contrast |
|-----------|------------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |

**Current values:**
- `--text-primary` (white on navy): ~15:1 ✅
- `--text-secondary` (80% white): ~12:1 ✅
- `--text-muted` (60% white): ~8:1 ✅

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}

/* Remove default outline but keep accessibility */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Common Patterns & Recipes

### Gradient Text

```css
.gradient-text {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Feature List with Checkmarks

Cardless checklist: full-width rows separated by hairlines, check marker
that inverts to solid gold on hover, row nudges right.

```css
.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 0;
  color: var(--text-secondary);
  transition:
    color 0.3s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Hairline divider between rows */
.feature-list li + li {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.feature-list li::before {
  content: "✓";
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: rgba(252, 175, 1, 0.1);
  border: 1px solid rgba(252, 175, 1, 0.25);
  border-radius: 50%;
  color: var(--accent-gold);
  font-size: 0.75rem;
  font-weight: 700;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-list li:hover {
  color: var(--text-primary);
  transform: translateX(4px);
}

.feature-list li:hover::before {
  background: var(--accent-gold);
  border-color: transparent;
  color: var(--bg-primary);
  box-shadow: 0 0 16px rgba(252, 175, 1, 0.4);
}

/* ≤1024px: cap width, center the block, keep rows left-aligned */
@media (max-width: 1024px) {
  .feature-list {
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
  }

  .feature-list li {
    text-align: left;
  }
}
```

### Button with Icon

```css
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.btn-icon svg {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-fast);
}

.btn-icon:hover svg {
  transform: translateX(4px);
}
```

### Card with Image

```css
.card-image {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.card-image img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card-image:hover img {
  transform: scale(1.05);
}
```

### Loading Skeleton

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Implementation Examples

### Hero Section

```html
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <span class="section-label">Available Now</span>
      <h1 class="hero-title">
        <span class="gradient-text">Train. Fight. Compete.</span>
      </h1>
      <p class="hero-subtitle">The ultimate app for fighting game enthusiasts</p>
      <div class="hero-actions">
        <a href="#" class="store-btn">
          <!-- Icon -->
          <div class="store-btn-content">
            <span class="store-btn-label">Download on the</span>
            <span class="store-btn-title">App Store</span>
          </div>
        </a>
        <a href="#" class="store-btn">
          <!-- Icon -->
          <div class="store-btn-content">
            <span class="store-btn-label">Get it on</span>
            <span class="store-btn-title">Google Play</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>
```

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--section-padding) 0;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4rem);
  margin: var(--space-lg) 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: var(--space-2xl);
}

.hero-actions {
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  flex-wrap: wrap;
}
```

### Feature Grid

```html
<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Features</span>
      <h2 class="section-title" data-title="Everything you need">Everything you need</h2>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <!-- SVG Icon (declares its own fill/stroke) -->
        </div>
        <h3>Feature Name</h3>
        <p>Feature description goes here</p>
      </div>
      <!-- Repeat for more features -->
    </div>
  </div>
</section>
```

### Footer

```html
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo.png" alt="Brand" class="footer-logo">
        <p class="footer-tagline">Tagline or description</p>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Twitter">
            <!-- Icon -->
          </a>
        </div>
      </div>
      <div class="footer-column">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">Download</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Brand Name. All rights reserved.</p>
    </div>
  </div>
</footer>
```

```css
.footer {
  padding: var(--space-4xl) 0 var(--space-2xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
}

.footer-column h4 {
  font-size: 1rem;
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.footer-column ul {
  list-style: none;
}

.footer-column li {
  margin-bottom: var(--space-sm);
}

.footer-column a {
  color: var(--text-muted);
  text-decoration: none;
  transition: var(--transition-fast);
}

.footer-column a:hover {
  color: var(--accent-gold);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--space-2xl);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
  font-size: 0.875rem;
}
```

---

## Tips for Future Agents

### ✅ Do

1. **Use CSS variables** for all visual properties
2. **Maintain z-index layering** - Background at 0, content at 1, header at 1000
3. **Test hover states** - Cards, buttons, and links have specific hover effects
4. **Respect aspect ratios** - Phone frame uses `aspect-ratio: 9/19`
5. **Mobile-first approach** - Default styles for mobile, enhance for desktop
6. **Use semantic HTML** - Proper heading hierarchy, ARIA labels where needed
7. **Check color contrast** - Ensure WCAG AA compliance
8. **Use the spacing scale** - 8px base unit for consistency

### ❌ Don't

1. **Don't hardcode colors** - Always use CSS variables
2. **Don't add random animations** - Use the defined transition tokens
3. **Don't forget focus states** - Accessibility matters
4. **Don't use magic numbers** - Use spacing and radius tokens
5. **Don't break the z-index scale** - Follow the defined layers
6. **Don't forget reduced motion** - Respect user preferences

### Adapting This System

To adapt this design system for a different project:

1. **Change the color palette** - Update the CSS variables for backgrounds and accents
2. **Adjust the typography** - Swap the Google Fonts URL and font variables
3. **Modify the spacing** - Adjust the 8px base unit if needed
4. **Keep the patterns** - The component patterns work regardless of colors

---

## External Dependencies

### Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Swiper.js (for carousels)

```html
<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css">
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
```

---

## File Structure

```
project/
├── index.html          # Main page with inline styles
├── kickstarter/
│   └── index.html      # Subpage using same design system
├── redkings/
│   └── index.html      # Subpage using same design system
├── img/                # Images and assets
└── lang/               # Translation files
```

**Note**: This project uses inline styles within `<style>` tags. There are no external CSS files.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024 | Initial design system documentation |

---

> **💡 Remember**: This design system is a foundation. Use it as a starting point, but adapt it to your specific needs while maintaining consistency with the core principles.
