import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf8'));

// ─── Helpers ───

function flattenObject(ob) {
  const result = {};
  for (const key in ob) {
    if (!Object.prototype.hasOwnProperty.call(ob, key)) continue;
    const value = ob[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const flat = flattenObject(value);
      for (const subKey in flat) {
        result[key + '.' + subKey] = flat[subKey];
      }
    } else if (typeof value === 'string' || typeof value === 'number') {
      result[key] = value;
    }
  }
  return result;
}

function injectPartial(template, marker, partialContent) {
  const eol = template.includes('\r\n') ? '\r\n' : '\n';
  const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const markerLine = new RegExp('^[ \\t]*' + escapedMarker + eol, 'm');
  return template.replace(markerLine, partialContent + eol);
}

function formatDate(unixTimestamp, locale) {
  const date = new Date(unixTimestamp * 1000);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
}

function formatFetchedAt(isoString, locale) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatDateUtc(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  }).format(date);
}

function formatFetchedAtUtc(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  }).format(date);
}

function toISODate(unixTimestamp) {
  return new Date(unixTimestamp * 1000).toISOString();
}

function cleanSlug(slug) {
  return slug.replace(/^tournament\//, '');
}

function getCountryName(countryCode, locale) {
  if (!countryCode) return '';
  try {
    return new Intl.DisplayNames(locale, { type: 'region' }).of(countryCode.toUpperCase()) || countryCode;
  } catch {
    return countryCode;
  }
}

function buildLocation(tournament, translations, locale) {
  if (tournament.isOnline) return translations.online;
  const countryName = getCountryName(tournament.countryCode, locale);
  const parts = [tournament.city, tournament.addrState, countryName].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : translations.online;
}

function buildAttendanceMode(isOnline) {
  return isOnline
    ? 'https://schema.org/OnlineEventAttendanceMode'
    : 'https://schema.org/OfflineEventAttendanceMode';
}

function buildEndDateLD(tournament) {
  if (!tournament.endAt) return '';
  return `"endDate": "${toISODate(tournament.endAt)}",`;
}

function buildLocationLD(tournament) {
  if (tournament.isOnline) {
    return `"location": {
      "@type": "VirtualLocation",
      "url": "https://www.start.gg/tournament/${tournament.slug}/details"
    },`;
  }
  return `"location": {
      "@type": "Place",
      "name": "${escapeJson(tournament.city || 'Unknown')}",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${escapeJson(tournament.city || '')}",
        "addressRegion": "${escapeJson(tournament.addrState || '')}",
        "addressCountry": "${escapeJson(tournament.countryCode || '')}"
      }
    },`;
}

function escapeJson(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHreflangTags(canonicalEn, pageEs) {
  return `
    <link rel="alternate" hreflang="en" href="${canonicalEn}" />
    <link rel="alternate" hreflang="es" href="${pageEs}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalEn}" />`;
}

function buildMetaDescription(template, tournament, locale) {
  const onlineLabel = locale.startsWith('es') ? 'Online' : 'Online';
  const gamesText = tournament.games.join(', ');
  return template
    .replace(/\{\{name\}\}/g, tournament.name)
    .replace(/\{\{game\}\}/g, gamesText)
    .replace(/\{\{date\}\}/g, formatDateUtc(tournament.startAt))
    .replace(/\{\{location\}\}/g, buildLocation(tournament, { online: onlineLabel }, locale));
}

function sanitizeDirName(slug) {
  return slug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// ─── Rendering ───

function renderGameBadges(games) {
  return games.map(game => `<span class="game-badge">${escapeHtml(game)}</span>`).join('');
}

function renderTournamentCard(tournament, lang, translations, baseUrl) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const startGgUrl = `https://www.start.gg/tournament/${escapeHtml(cleanSlug(tournament.slug))}/details`;
  const modeLabel = tournament.isOnline ? translations.online : translations.inPerson;
  const location = buildLocation(tournament, translations, locale);

  const countryCode = tournament.isOnline ? '' : (tournament.countryCode || '');
  const gameSlugs = tournament.games.map(cleanGameSlug).join(' ');

  return `<article class="tournament-card" data-game="${escapeHtml(gameSlugs)}" data-online="${tournament.isOnline}" data-country="${escapeHtml(countryCode)}">
  <div class="card-main">
    <div class="card-header">
      ${renderGameBadges(tournament.games)}
      <span class="mode-badge">${escapeHtml(modeLabel)}</span>
    </div>
    <h2><a href="${startGgUrl}" rel="noopener" target="_blank">${escapeHtml(tournament.name)}</a></h2>
  </div>
  <div class="card-meta">
    <time class="local-time" datetime="${toISODate(tournament.startAt)}">${formatDateUtc(tournament.startAt)}</time>
    <span>${escapeHtml(location)}</span>
    <span>${tournament.numAttendees} ${translations.attendees}</span>
  </div>
  <a href="${startGgUrl}" class="card-cta" rel="noopener" target="_blank">
    ${translations.goToTournament} →
  </a>
</article>`;
}

function cleanGameSlug(gameName) {
  return gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderItemListElement(tournament, index, baseUrl) {
  const startGgUrl = `https://www.start.gg/tournament/${cleanSlug(tournament.slug)}/details`;
  const locationLD = buildLocationLD(tournament);
  const attendanceMode = buildAttendanceMode(tournament.isOnline);
  const endDateLD = buildEndDateLD(tournament);

  return `{
      "@type": "ListItem",
      "position": ${index + 1},
      "item": {
        "@type": "Event",
        "name": "${escapeJson(tournament.name)}",
        "startDate": "${toISODate(tournament.startAt)}",
        ${endDateLD}
        "eventAttendanceMode": "${attendanceMode}",
        "url": "${startGgUrl}",
        ${locationLD.replace(/,$/, '')}
      }
    }`;
}

function renderEmptyState(translations) {
  return `<div class="empty-state">
  <p>${translations.noTournaments}</p>
  <a href="/" class="cta-button">${translations.downloadCta}</a>
</div>`;
}

function buildMapUrl(tournament) {
  if (tournament.isOnline) return '';
  if (tournament.lat != null && tournament.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${tournament.lat},${tournament.lng}`;
  }
  const query = encodeURIComponent(buildLocation(tournament, { online: 'Online' }, 'en-US'));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}


function getTopGames(tournaments, limit = 10) {
  const counts = {};
  for (const t of tournaments) {
    if (t.games && t.games.length > 0) {
      const g = t.games[0];
      counts[g] = (counts[g] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(entry => entry[0]);
}

function renderGamePills(topGames, currentGame, lang) {
  const basePath = lang === 'es' ? '/es/torneos/' : '/tournaments/';
  const allText = lang === 'es' ? 'Todos los juegos' : 'All games';
  
  let html = `<div class="game-pills">\n`;
  html += `  <a href="${basePath}" class="game-pill ${!currentGame ? 'active' : ''}">${allText}</a>\n`;
  
  for (const game of topGames) {
    const isActive = game === currentGame;
    const gameSlug = sanitizeDirName(cleanSlug(game));
    const targetHref = isActive ? basePath : `${basePath}${gameSlug}/`;
    html += `  <a href="${targetHref}" class="game-pill ${isActive ? 'active' : ''}">${escapeHtml(game)}</a>\n`;
  }
  html += `</div>\n`;
  return html;
}

function renderCountryPills(topCountries, currentCountryCode, lang) {
  const basePath = lang === 'es' ? '/es/torneos/' : '/tournaments/';
  
  let html = `<div class="country-pills">\n`;
  
  for (const code of topCountries) {
    const isActive = code === currentCountryCode;
    const countryName = getCountryName(code, lang === 'es' ? 'es-ES' : 'en-US');
    const slug = sanitizeDirName(countryName);
    const targetHref = isActive ? basePath : `${basePath}${slug}/`;
    html += `  <a href="${targetHref}" class="country-pill ${isActive ? 'active' : ''}">${escapeHtml(countryName)}</a>\n`;
  }
  html += `</div>\n`;
  return html;
}

function renderBreadcrumbsUI(lang, translations, baseUrl, currentGame, currentCountryCode) {
  const homeUrl = lang === 'es' ? '/es/' : '/';
  const tournamentsUrl = lang === 'es' ? '/es/torneos/' : '/tournaments/';
  
  let html = `<nav class="breadcrumbs" aria-label="Breadcrumb">\n  <ol>\n`;
  html += `    <li><a href="${homeUrl}">${translations.breadcrumbHome}</a><span class="separator">/</span></li>\n`;
  
  if (!currentGame && !currentCountryCode) {
    html += `    <li aria-current="page">${translations.breadcrumbTournaments}</li>\n`;
  } else {
    html += `    <li><a href="${tournamentsUrl}">${translations.breadcrumbTournaments}</a><span class="separator">/</span></li>\n`;
    
    if (currentGame) {
      html += `    <li aria-current="page">${escapeHtml(currentGame)}</li>\n`;
    } else if (currentCountryCode) {
      const countryName = getCountryName(currentCountryCode, lang === 'es' ? 'es-ES' : 'en-US');
      html += `    <li aria-current="page">${escapeHtml(countryName)}</li>\n`;
    }
  }
  
  html += `  </ol>\n</nav>\n`;
  return html;
}

function getFaqData(translations, currentGame, currentCountryCode, count, windowDays, lang) {
  let q1, a1, q2, a2;
  
  if (currentGame) {
    q1 = translations.faqGameQ1.replace('{{gameName}}', currentGame).replace('{{days}}', windowDays);
    a1 = translations.faqGameA1.replace('{{gameName}}', currentGame).replace('{{count}}', count).replace('{{days}}', windowDays);
    q2 = translations.faqGameQ2.replace('{{gameName}}', currentGame).replace('{{days}}', windowDays);
    a2 = translations.faqGameA2.replace('{{gameName}}', currentGame).replace('{{count}}', count).replace('{{days}}', windowDays);
  } else if (currentCountryCode) {
    const countryName = getCountryName(currentCountryCode, lang === 'es' ? 'es-ES' : 'en-US');
    q1 = translations.faqCountryQ1.replace('{{countryName}}', countryName).replace('{{days}}', windowDays);
    a1 = translations.faqCountryA1.replace('{{countryName}}', countryName).replace('{{count}}', count).replace('{{days}}', windowDays);
    q2 = translations.faqCountryQ2.replace('{{countryName}}', countryName).replace('{{days}}', windowDays);
    a2 = translations.faqCountryA2.replace('{{countryName}}', countryName).replace('{{count}}', count).replace('{{days}}', windowDays);
  } else {
    q1 = translations.faqGlobalQ1.replace('{{days}}', windowDays);
    a1 = translations.faqGlobalA1.replace('{{days}}', windowDays);
    q2 = translations.faqGlobalQ2.replace('{{days}}', windowDays);
    a2 = translations.faqGlobalA2.replace('{{days}}', windowDays);
  }
  
  return [
    { q: q1, a: a1 },
    { q: q2, a: a2 }
  ];
}

function renderFaqUI(translations, currentGame, currentCountryCode, count, windowDays, lang) {
  if (count === 0) return '';
  const faqs = getFaqData(translations, currentGame, currentCountryCode, count, windowDays, lang);
  
  let html = `<section class="faq-section" id="faqSection">\n  <div class="section-header">\n    <h2 class="section-title" data-title="FAQ">${translations.faqTitle}</h2>\n  </div>\n  <div class="faq-list">\n`;
  
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    html += `    <details class="faq-item">\n      <summary class="faq-question" id="faqQuestion${i}">${escapeHtml(faq.q)}</summary>\n      <div class="faq-answer" id="faqAnswer${i}">${faq.a}</div>\n    </details>\n`;
  }
  
  html += `  </div>\n</section>\n`;
  return html;
}

function renderFaqSchema(translations, currentGame, currentCountryCode, count, windowDays, lang) {
  if (count === 0) return '';
  const faqs = getFaqData(translations, currentGame, currentCountryCode, count, windowDays, lang);
  
  let schema = `{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n`;
  
  const elements = faqs.map(faq => {
    return `    {\n      "@type": "Question",\n      "name": "${escapeJson(faq.q)}",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "${escapeJson(faq.a)}"\n      }\n    }`;
  });
  
  schema += elements.join(',\n') + `\n  ]\n}`;
  return schema;
}

function renderBreadcrumbSchema(lang, translations, baseUrl, canonicalBaseUrl, currentGame, currentCountryCode) {
  const homeUrl = lang === 'es' ? canonicalBaseUrl + 'es/' : canonicalBaseUrl;
  const tournamentsUrl = lang === 'es' ? canonicalBaseUrl + 'es/torneos/' : canonicalBaseUrl + 'tournaments/';
  
  const items = [
    { name: translations.breadcrumbHome, url: homeUrl },
    { name: translations.breadcrumbTournaments, url: tournamentsUrl }
  ];
  
  if (currentGame) {
    const safeDir = sanitizeDirName(cleanSlug(currentGame));
    items.push({ name: currentGame, url: `${tournamentsUrl}${safeDir}/` });
  } else if (currentCountryCode) {
    const countryName = getCountryName(currentCountryCode, lang === 'es' ? 'es-ES' : 'en-US');
    const safeDir = sanitizeDirName(countryName);
    items.push({ name: countryName, url: `${tournamentsUrl}${safeDir}/` });
  }
  
  let schema = `{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n`;
  
  const elements = items.map((item, index) => {
    return `    {\n      "@type": "ListItem",\n      "position": ${index + 1},\n      "name": "${escapeJson(item.name)}",\n      "item": "${item.url}"\n    }`;
  });
  
  schema += elements.join(',\n') + `\n  ]\n}`;
  return schema;
}

function generateIndexPage({
  tournaments,
  lang,
  translations,
  i18nFlat,
  baseUrl,
  canonicalBaseUrl,
  indexTemplate,
  partials,
  fetchedAt,
  windowDays,
  currentGame = null,
  currentCountryCode = null,
  topGames = [],
  TOP_COUNTRIES = []
}) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  
  const basePathEn = '/tournaments/';
  const basePathEs = '/es/torneos/';
  
  let subPathEn = '';
  let subPathEs = '';
  if (currentGame) {
    subPathEn = sanitizeDirName(cleanSlug(currentGame)) + '/';
    subPathEs = subPathEn;
  } else if (currentCountryCode) {
    const countryNameEn = getCountryName(currentCountryCode, 'en-US');
    const countryNameEs = getCountryName(currentCountryCode, 'es-ES');
    subPathEn = sanitizeDirName(countryNameEn) + '/';
    subPathEs = sanitizeDirName(countryNameEs) + '/';
  }
  
  const pageUrl = lang === 'es'
    ? `${canonicalBaseUrl}es/torneos/${subPathEs}`
    : `${canonicalBaseUrl}tournaments/${subPathEn}`;
  const canonicalUrl = pageUrl;
  
  const pageEs = `${canonicalBaseUrl}es/torneos/${subPathEs}`;
  const canonicalEn = `${canonicalBaseUrl}tournaments/${subPathEn}`;
  const hreflangTags = buildHreflangTags(canonicalEn, pageEs);

  const sorted = [...tournaments].sort((a, b) => a.startAt - b.startAt);
  const tournamentCards = sorted.length > 0
    ? sorted.map(t => renderTournamentCard(t, lang, translations, baseUrl)).join('\n')
    : '';
  const emptyState = sorted.length === 0 ? renderEmptyState(translations) : '';
  const itemListElements = sorted.map((t, i) => renderItemListElement(t, i, canonicalBaseUrl)).join(',\n');
  
  let pageTitle = translations.pageTitle.replace('{{days}}', windowDays);
  let pageSubtitle = translations.pageSubtitle.replace('{{days}}', windowDays);
  let indexMetaDescription = translations.indexMetaDescription.replace('{{days}}', windowDays);
  
  let gameFilterStyle = '';
  let countryFilterStyle = '';

  if (currentGame) {
    pageTitle = translations.gamePageTitle.replace('{{gameName}}', currentGame).replace('{{days}}', windowDays);
    pageSubtitle = translations.gamePageSubtitle.replace('{{gameName}}', currentGame).replace('{{count}}', sorted.length).replace('{{days}}', windowDays);
    indexMetaDescription = translations.gameMetaDescription.replace('{{gameName}}', currentGame).replace('{{count}}', sorted.length).replace('{{days}}', windowDays);
    gameFilterStyle = 'display: none;';
  } else if (currentCountryCode) {
    const countryName = getCountryName(currentCountryCode, locale);
    pageTitle = translations.countryPageTitle.replace('{{countryName}}', countryName).replace('{{days}}', windowDays);
    pageSubtitle = translations.countryPageSubtitle.replace('{{countryName}}', countryName).replace('{{count}}', sorted.length).replace('{{days}}', windowDays);
    indexMetaDescription = translations.countryMetaDescription.replace('{{countryName}}', countryName).replace('{{count}}', sorted.length).replace('{{days}}', windowDays);
    countryFilterStyle = 'display: none;';
  }

  let html = indexTemplate;

  html = injectPartial(html, '<!-- PARTIAL:head-common -->', partials.headCommon);
  html = injectPartial(html, '<!-- PARTIAL:header-footer-styles -->', partials.headerFooterStyles);
  html = injectPartial(html, '<!-- PARTIAL:header -->', partials.header);
  html = injectPartial(html, '<!-- PARTIAL:footer -->', partials.footer);
  html = injectPartial(html, '<!-- PARTIAL:header-footer-scripts -->', partials.headerFooterScripts);
  html = injectPartial(html, '<!-- PARTIAL:download-modal -->', partials.downloadModal);
  html = injectPartial(html, '<!-- PARTIAL:tournaments-scripts -->', partials.tournamentsScripts);

  const allI18n = { ...i18nFlat, ...flattenObject({ tournaments: translations }) };
  allI18n['tournaments.pageTitle'] = pageTitle;
  allI18n['tournaments.pageSubtitle'] = pageSubtitle;
  allI18n['tournaments.indexMetaDescription'] = indexMetaDescription;
  
  for (const [key, value] of Object.entries(allI18n)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value));
  }

  const replacements = {
    'lang': lang,
    'tournamentUrl': lang === 'es' ? '/es/torneos/' : '/tournaments/',
    'gamesUrl': lang === 'es' ? '/es/juegos/' : '/games/',
    'tournaments.listUrl': lang === 'es' ? '/es/torneos/' : '/tournaments/',
    'tournaments.pageTitle': pageTitle,
    'index.pageUrl': pageUrl,
    'index.canonicalUrl': canonicalUrl,
    'index.hreflangTags': hreflangTags,
    'tournamentCards': tournamentCards,
    'emptyState': emptyState,
    'itemListElements': itemListElements,
    'totalTournaments': sorted.length,
    'robotsMeta': sorted.length === 0 ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow" />',
    'fetchedAt': fetchedAt,
    'windowDays': windowDays,
    'breadcrumbsUI': renderBreadcrumbsUI(lang, translations, baseUrl, currentGame, currentCountryCode),
    'breadcrumbSchema': renderBreadcrumbSchema(lang, translations, baseUrl, canonicalBaseUrl, currentGame, currentCountryCode),
    'faqUI': renderFaqUI(translations, currentGame, currentCountryCode, sorted.length, windowDays, lang),
    'faqSchema': renderFaqSchema(translations, currentGame, currentCountryCode, sorted.length, windowDays, lang),
    'gamePills': renderGamePills(topGames, currentGame, lang),
    'countryPills': renderCountryPills(TOP_COUNTRIES, currentCountryCode, lang),
    'filtersHidden': '',
    'gameFilterStyle': gameFilterStyle,
    'countryFilterStyle': countryFilterStyle
  };

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value));
  }

  return html;
}

// ─── Main ───

async function main() {
  const dataPath = join(rootDir, 'data', 'tournaments.json');
  let tournamentData = { fetchedAt: new Date().toISOString(), windowDays: config.windowDays, tournaments: [] };
  if (existsSync(dataPath)) {
    tournamentData = JSON.parse(readFileSync(dataPath, 'utf8'));
  } else {
    console.warn('⚠️ No se encontró data/tournaments.json. Se generarán páginas con estado vacío.');
  }

  const tournaments = tournamentData.tournaments || [];
  const fetchedAt = tournamentData.fetchedAt || new Date().toISOString();
  const windowDays = tournamentData.windowDays || config.windowDays;

  const enTranslations = JSON.parse(readFileSync(join(rootDir, 'lang', 'en.json'), 'utf8'));
  const esTranslations = JSON.parse(readFileSync(join(rootDir, 'lang', 'es.json'), 'utf8'));

  const detailTemplate = readFileSync(join(__dirname, 'tournament-template.html'), 'utf8');
  const indexTemplate = readFileSync(join(__dirname, 'tournament-index-template.html'), 'utf8');

  const headerPartialRaw = readFileSync(join(rootDir, 'partials', 'header.html'), 'utf8');
  const footerPartialRaw = readFileSync(join(rootDir, 'partials', 'footer.html'), 'utf8');
  const headCommonPartialRaw = readFileSync(join(rootDir, 'partials', 'head-common.html'), 'utf8');
  const headerFooterStylesPartial = readFileSync(join(rootDir, 'partials', 'header-footer-styles.html'), 'utf8');
  const headerFooterScriptsPartial = readFileSync(join(rootDir, 'partials', 'header-footer-scripts.html'), 'utf8');
  const downloadModalPartial = readFileSync(join(rootDir, 'partials', 'download-modal.html'), 'utf8');
  const tournamentsScriptsPartial = readFileSync(join(rootDir, 'partials', 'tournaments-scripts.html'), 'utf8');

  // Para los templates de torneos usamos el parcial head-common completo (sin splits internos)
  const headCommonPartial = headCommonPartialRaw.split('<!-- PARTIAL:SPLIT -->').map(s => s.trim()).join('\n');

  // Limpieza segura
  const enTournamentsDir = join(rootDir, 'tournaments');
  if (existsSync(enTournamentsDir)) {
    rmSync(enTournamentsDir, { recursive: true });
  }
  const esTournamentsDir = join(rootDir, 'es', 'torneos');
  if (existsSync(esTournamentsDir)) {
    rmSync(esTournamentsDir, { recursive: true });
  }
  const partials = {
    header: headerPartialRaw,
    footer: footerPartialRaw,
    headCommon: headCommonPartial,
    headerFooterStyles: headerFooterStylesPartial,
    headerFooterScripts: headerFooterScriptsPartial,
    downloadModal: downloadModalPartial,
    tournamentsScripts: tournamentsScriptsPartial
  };
  const siteBaseUrl = config.siteBaseUrl.endsWith('/') ? config.siteBaseUrl : config.siteBaseUrl + '/';
  const navBaseUrl = '/tournaments/';
  const esNavBaseUrl = '/es/torneos/';

  const languages = [
    { code: 'en', translations: enTranslations.tournaments, i18nFlat: flattenObject(enTranslations), baseUrl: navBaseUrl, canonicalBaseUrl: siteBaseUrl },
    { code: 'es', translations: esTranslations.tournaments, i18nFlat: flattenObject(esTranslations), baseUrl: esNavBaseUrl, canonicalBaseUrl: siteBaseUrl }
  ];

  const topGames = getTopGames(tournaments, 12);
  const TOP_COUNTRIES = ['US', 'ES', 'FR', 'GB', 'MX', 'JP', 'BR', 'DE', 'CA', 'IT', 'AR', 'CL', 'CO'];

  for (const langConfig of languages) {
    const { code, translations, i18nFlat, baseUrl, canonicalBaseUrl } = langConfig;

    // Índice principal
    const indexHtml = generateIndexPage({
      tournaments,
      lang: code,
      translations,
      i18nFlat,
      baseUrl,
      canonicalBaseUrl,
      indexTemplate,
      partials,
      fetchedAt,
      windowDays,
      topGames,
      TOP_COUNTRIES
    });
    const indexDir = code === 'en' ? enTournamentsDir : esTournamentsDir;
    mkdirSync(indexDir, { recursive: true });
    writeFileSync(join(indexDir, 'index.html'), indexHtml);
    console.log(`✅ Índice principal ${code.toUpperCase()}: ${indexDir}\\index.html`);

    // Páginas Agregadoras por Juego (Game Hubs)
    for (const game of topGames) {
      const gameTournaments = tournaments.filter(t => t.games && t.games.includes(game));
      if (gameTournaments.length === 0) continue;

      const gameHtml = generateIndexPage({
        tournaments: gameTournaments,
        lang: code,
        translations,
        i18nFlat,
        baseUrl,
        canonicalBaseUrl,
        indexTemplate,
        partials,
        fetchedAt,
        windowDays,
        currentGame: game,
        topGames,
        TOP_COUNTRIES
      });
      
      const gameSlug = sanitizeDirName(cleanSlug(game));
      const gameDir = join(indexDir, gameSlug);
      mkdirSync(gameDir, { recursive: true });
      writeFileSync(join(gameDir, 'index.html'), gameHtml);
    }
    console.log(`✅ ${topGames.length} Game Hubs ${code.toUpperCase()} generados`);

    // Páginas Agregadoras por País (Country Hubs)
    for (const countryCode of TOP_COUNTRIES) {
      const countryTournaments = tournaments.filter(t => t.countryCode === countryCode);
      // Generate the page EVEN IF EMPTY to avoid URL churn
      
      const countryHtml = generateIndexPage({
        tournaments: countryTournaments,
        lang: code,
        translations,
        i18nFlat,
        baseUrl,
        canonicalBaseUrl,
        indexTemplate,
        partials,
        fetchedAt,
        windowDays,
        currentCountryCode: countryCode,
        topGames,
        TOP_COUNTRIES
      });
      
      const countryName = getCountryName(countryCode, code === 'es' ? 'es-ES' : 'en-US');
      const countrySlug = sanitizeDirName(countryName);
      const countryDir = join(indexDir, countrySlug);
      mkdirSync(countryDir, { recursive: true });
      writeFileSync(join(countryDir, 'index.html'), countryHtml);
    }
    console.log(`✅ ${TOP_COUNTRIES.length} Country Hubs ${code.toUpperCase()} generados`);
  }


}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
