# FightersTech Translations

This folder contains all the translations for the FightersTech promotional website.

## Structure

Each language has its own JSON file named with the language code (e.g., `en.json`, `es.json`).

## Adding a New Language

1. Copy `en.json` to a new file named with your language code (e.g., `fr.json` for French)
2. Translate all the text values while keeping the keys unchanged
3. Update the `_meta` section with the language name and code
4. Update the `index.html` to load the new language file

## Translation Structure

```json
{
  "_meta": {
    "language": "Language Name",
    "code": "lang-code",
    "fallback": true/false  // Use true for the default language
  },
  "nav": { ... },           // Navigation menu items
  "hero": { ... },          // Hero section text
  "sections": { ... },      // Section titles and descriptions
  "featureCards": [ ... ],  // Feature card content
  "footer": { ... },        // Footer content
  "legalUrls": { ... },     // Legal page URLs
  "screenshots": { ... },   // Screenshot alt text and paths
  "videoSwiper": { ... }    // Video IDs and titles
}
```

## Available Languages

| Code | Language | File |
|------|----------|------|
| `en` | English | `en.json` |
| `es` | Español (Spanish) | `es.json` |

## Notes

- Do not change the structure or keys, only the values
- Keep HTML entities encoded (e.g., `&quot;` for quotes)
- For videos, you can use different YouTube IDs per language if you have localized versions
- Screenshot paths should point to the language-specific images in `img/`
