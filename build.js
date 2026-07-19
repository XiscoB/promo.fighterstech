const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Copiar assets estáticos y archivos de configuración a /dist
const staticItems = [
  'assets', 'img', 'lang', 'redkings', '.well-known',
  'robots.txt', 'sitemap.xml', 'favicon.ico', 'CNAME', 'app-ads.txt', '.nojekyll', 'google92ad45d1abd0d250.html',
  'tournaments', 'data'
];

staticItems.forEach(item => {
  const src = path.join(__dirname, item);
  const dest = path.join(distDir, item);
  if (fs.existsSync(src)) {
    // cpSync está disponible en Node >= 16.7
    fs.cpSync(src, dest, { recursive: true }); 
  }
});

// 2. Compilar el HTML
const templatePath = path.join(__dirname, 'template.html');
let template = fs.readFileSync(templatePath, 'utf8');

// Inyectar parciales antes de los reemplazos de {{key}}
function injectPartial(template, marker, partialContent) {
  const eol = template.includes('\r\n') ? '\r\n' : '\n';
  const normalizedPartial = partialContent.replace(/\r?\n/g, eol);
  const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const markerLine = new RegExp('^[ \\t]*' + escapedMarker + eol, 'm');
  return template.replace(markerLine, normalizedPartial + eol);
}

const headerPartial = fs.readFileSync(path.join(__dirname, 'partials', 'header.html'), 'utf8');
template = injectPartial(template, '<!-- PARTIAL:header -->', headerPartial);

const footerPartial = fs.readFileSync(path.join(__dirname, 'partials', 'footer.html'), 'utf8');
template = injectPartial(template, '<!-- PARTIAL:footer -->', footerPartial);

const downloadModalPartial = fs.readFileSync(path.join(__dirname, 'partials', 'download-modal.html'), 'utf8');
template = injectPartial(template, '<!-- PARTIAL:download-modal -->', downloadModalPartial);

const headCommonPartial = fs.readFileSync(path.join(__dirname, 'partials', 'head-common.html'), 'utf8');
const [headCommonBaseRaw, headCommonMetaRaw, headCommonAssetsRaw] = headCommonPartial.split('<!-- PARTIAL:SPLIT -->');
const headCommonBase = headCommonBaseRaw.trimEnd();
const headCommonMeta = headCommonMetaRaw.replace(/^\r?\n/, '').trimEnd();
const headCommonAssets = headCommonAssetsRaw.replace(/^\r?\n/, '').trimEnd();
template = injectPartial(template, '<!-- PARTIAL:head-common -->', headCommonBase);
template = injectPartial(template, '<!-- PARTIAL:head-common-meta -->', headCommonMeta);
template = injectPartial(template, '<!-- PARTIAL:head-common-assets -->', headCommonAssets);

const enData = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', 'en.json'), 'utf8'));
const esData = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', 'es.json'), 'utf8'));

function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function cleanSlug(slug) {
  return slug.replace(/^tournament\//, '');
}

function sanitizeDirName(slug) {
  return slug.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTournamentDate(timestamp, lang) {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  };
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options) + ' UTC';
}

function formatTournamentLocation(t, lang) {
  if (t.isOnline) return lang === 'es' ? 'Online' : 'Online';
  return [t.city, t.addrState, t.countryCode].filter(Boolean).join(', ');
}

function buildFeaturedTournamentsHtml(lang, tournamentsData, count = 4) {
  if (!tournamentsData || !tournamentsData.tournaments || !tournamentsData.tournaments.length) {
    return '';
  }

  const tournaments = tournamentsData.tournaments.slice(0, count);
  return tournaments.map((t) => {
    const cleanSlugName = sanitizeDirName(cleanSlug(t.slug));
    const tournamentPath = lang === 'en'
      ? `/tournaments/${cleanSlugName}/`
      : `/es/torneos/${cleanSlugName}/`;
    const games = t.games.slice(0, 2).join(', ') + (t.games.length > 2 ? ` +${t.games.length - 2}` : '');
    const modeLabel = t.isOnline
      ? (lang === 'es' ? 'Online' : 'Online')
      : (lang === 'es' ? 'Presencial' : 'In Person');
    const badgeClass = t.isOnline ? 'online' : 'in-person';

    return `<a href="${tournamentPath}" class="featured-tournament-card" data-slug="${escapeHtml(cleanSlugName)}" data-is-online="${t.isOnline ? '1' : '0'}">
      <div class="featured-tournament-name">${escapeHtml(t.name)}</div>
      <div class="featured-tournament-game">${escapeHtml(games)}</div>
      <div class="featured-tournament-meta">
        <span class="featured-tournament-badge ${badgeClass}" data-featured-badge="${t.isOnline ? 'online' : 'in-person'}">${modeLabel}</span>
        <span class="featured-tournament-date" data-timestamp="${t.startAt}">${escapeHtml(formatTournamentDate(t.startAt, lang))}</span>
      </div>
      <div class="featured-tournament-meta">${escapeHtml(formatTournamentLocation(t, lang))}</div>
    </a>`;
  }).join('\n');
}

function buildHtml(lang, data, outputDir, tournamentsData) {
  let html = template;

  // URL de la sección de torneos según idioma
  const tournamentUrl = lang === 'en' ? '/tournaments/' : '/es/torneos/';
  html = html.replaceAll('{{tournamentUrl}}', tournamentUrl);

  const flatData = flattenObject(data);
  
  for (const [key, value] of Object.entries(flatData)) {
    // Solo reemplazamos strings y números, ignoramos arrays (que manejaremos de forma especial si hace falta)
    if (typeof value === 'string' || typeof value === 'number') {
      let finalValue = value;
      // Añadir <span> a la última palabra de los títulos
      if (key.match(/^sections\.(mainFeatures|more|faq|app|reviews|featuredTournaments)\.title$/)) {
        const parts = value.split(" ");
        if (parts.length > 1) {
          const lastWord = parts.pop();
          finalValue = `${parts.join(" ")} <span>${lastWord}</span>`;
        }
      } else if (key === 'sections.cta.title') {
        const parts = value.split(" ");
        if (parts.length > 3) {
          const lastWords = parts.splice(-3).join(" ");
          finalValue = `${parts.join(" ")} <span>${lastWords}</span>`;
        }
      }
      
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, finalValue);
    }
  }

  // Los sliders de vídeo y testimonios se dejan vacíos en el HTML estático;
  // el runtime los rellena desde lang/*.json exactamente igual que index.html.
  // Así el build output coincide con el comportamiento de la página original.
  const mainVideosHtml = '';
  const otherVideosHtml = '';
  const reviewsHtml = '';
  const featuredTournamentsHtml = buildFeaturedTournamentsHtml(lang, tournamentsData);

  html = html.replace('{{mainVideosHtml}}', mainVideosHtml);
  html = html.replace('{{otherVideosHtml}}', otherVideosHtml);
  html = html.replace('{{reviewsHtml}}', reviewsHtml);
  html = html.replace('{{featuredTournamentsHtml}}', featuredTournamentsHtml);

  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = html.replaceAll('{{active_en}}', lang === 'en' ? 'active' : '');
  html = html.replaceAll('{{active_es}}', lang === 'es' ? 'active' : '');

  const canonicalPath = lang === 'en' ? '' : 'es/';
  const seoBlock = `
    <link rel="canonical" href="https://promo.fighterstech.com/${canonicalPath}" />
    <link rel="alternate" href="https://promo.fighterstech.com/" hreflang="en" />
    <link rel="alternate" href="https://promo.fighterstech.com/es/" hreflang="es" />
    <link rel="alternate" href="https://promo.fighterstech.com/" hreflang="x-default" />
  `;
  html = html.replace('<!-- SEO_INJECTION -->', seoBlock);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log(`✅ Build completado en: /dist${lang === 'en' ? '' : '/' + lang}/index.html`);
}

// Generar Sitemap XML con hreflang
const today = new Date().toISOString().split('T')[0];

// Leer datos de torneos si existen (para sitemap y landing featured section)
const tournamentsDataPath = path.join(__dirname, 'data', 'tournaments.json');
let tournamentsData = null;
let tournamentUrls = '';

if (fs.existsSync(tournamentsDataPath)) {
  tournamentsData = JSON.parse(fs.readFileSync(tournamentsDataPath, 'utf8'));
  const lastmod = tournamentsData.fetchedAt ? tournamentsData.fetchedAt.split('T')[0] : today;

  // Índices de torneos
  tournamentUrls += `
  <url>
    <loc>https://promo.fighterstech.com/tournaments/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/tournaments/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/torneos/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/tournaments/" />
  </url>
  <url>
    <loc>https://promo.fighterstech.com/es/torneos/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/tournaments/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/torneos/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/tournaments/" />
  </url>`;

  // Torneos individuales
  for (const t of tournamentsData.tournaments || []) {
    const cleanSlugName = sanitizeDirName(cleanSlug(t.slug));
    tournamentUrls += `
  <url>
    <loc>https://promo.fighterstech.com/tournaments/${cleanSlugName}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/tournaments/${cleanSlugName}/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/torneos/${cleanSlugName}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/tournaments/${cleanSlugName}/" />
  </url>
  <url>
    <loc>https://promo.fighterstech.com/es/torneos/${cleanSlugName}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/tournaments/${cleanSlugName}/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/torneos/${cleanSlugName}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/tournaments/${cleanSlugName}/" />
  </url>`;
  }

  console.log(`✅ Sitemap: añadidas ${(tournamentsData.tournaments || []).length * 2 + 2} URLs de torneos`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://promo.fighterstech.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/" />
  </url>
  <url>
    <loc>https://promo.fighterstech.com/es/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="https://promo.fighterstech.com/es/" />
    <xhtml:link rel="alternate" hreflang="en" href="https://promo.fighterstech.com/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://promo.fighterstech.com/" />
  </url>${tournamentUrls}
</urlset>`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
console.log('✅ Sitemap generado en: /dist/sitemap.xml');

// Generar versión Inglés (Raíz de dist)
buildHtml('en', enData, distDir, tournamentsData);

// Generar versión Español (Carpeta /dist/es/)
buildHtml('es', esData, path.join(distDir, 'es'), tournamentsData);

// Copiar torneos en español (sin sobrescriber dist/es/index.html)
const esTournamentsDir = path.join(__dirname, 'es', 'torneos');
if (fs.existsSync(esTournamentsDir)) {
  const destEsTournaments = path.join(distDir, 'es', 'torneos');
  if (fs.existsSync(destEsTournaments)) {
    fs.rmSync(destEsTournaments, { recursive: true });
  }
  fs.cpSync(esTournamentsDir, destEsTournaments, { recursive: true });
  console.log('✅ Torneos ES copiados a: /dist/es/torneos/');
}

// Generar llms.txt para AI Bots (Perplexity, ChatGPT, etc)
// Leer el archivo base rico en contexto semántico
let llmsTxtBase = '';
try {
  llmsTxtBase = fs.readFileSync(path.join(__dirname, '.well-known', 'llms.txt'), 'utf8');
} catch (err) {
  try {
    // Fallback por si está en la raíz
    llmsTxtBase = fs.readFileSync(path.join(__dirname, 'llms.txt'), 'utf8');
  } catch (err2) {
    console.warn('⚠️ No se encontró llms.txt base. Se creará uno vacío.');
  }
}

const reviewsSection = `
# ------------------------------------------------------------
# WHAT THE COMMUNITY IS SAYING (LIVE REVIEWS)
# ------------------------------------------------------------
${enData.sections.reviews.reviews.map(r => `> "${r.text}"\n> — **${r.name}** (${r.handle})\n> Source: ${r.sourceUrl}`).join('\n\n')}
`;

let tournamentsSection = '';
if (tournamentsData && tournamentsData.tournaments && tournamentsData.tournaments.length > 0) {
  tournamentsSection = `
# ------------------------------------------------------------
# UPCOMING TOURNAMENTS (LIVE DATA — Updated: ${tournamentsData.fetchedAt || 'N/A'})
# ------------------------------------------------------------
${tournamentsData.tournaments.slice(0, 10).map(t =>
  `- ${t.name} | ${t.games.join(', ')} | ${new Date(t.startAt * 1000).toISOString().split('T')[0]} | ${t.isOnline ? 'Online' : (t.city || 'TBD')} | ${t.numAttendees} attendees | https://www.start.gg/tournament/${cleanSlug(t.slug)}/details`
).join('\n')}

Total upcoming tournaments: ${tournamentsData.tournaments.length}
`;
}

const llmsTxt = llmsTxtBase + '\n' + reviewsSection + '\n' + tournamentsSection;

const wellKnownDir = path.join(distDir, '.well-known');
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}
fs.writeFileSync(path.join(distDir, 'llms.txt'), llmsTxt);
fs.writeFileSync(path.join(wellKnownDir, 'llms.txt'), llmsTxt);
console.log('✅ llms.txt generado en: /dist/llms.txt y /dist/.well-known/llms.txt');
