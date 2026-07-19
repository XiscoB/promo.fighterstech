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
  return slug.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// ─── Rendering ───

function renderGameBadges(games) {
  return games.map(game => `<span class="game-badge">${escapeHtml(game)}</span>`).join('');
}

function renderTournamentCard(tournament, lang, translations, baseUrl) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const clean = cleanSlug(tournament.slug);
  const safeDir = sanitizeDirName(clean);
  const detailUrl = `${baseUrl}${safeDir}/`;
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
    <h2><a href="${detailUrl}">${escapeHtml(tournament.name)}</a></h2>
  </div>
  <div class="card-meta">
    <time class="local-time" datetime="${toISODate(tournament.startAt)}">${formatDateUtc(tournament.startAt)}</time>
    <span>${escapeHtml(location)}</span>
    <span>${tournament.numAttendees} ${translations.attendees}</span>
  </div>
  <a href="https://www.start.gg/tournament/${escapeHtml(cleanSlug(tournament.slug))}/details" class="card-cta" rel="noopener" target="_blank">
    ${translations.goToTournament} →
  </a>
</article>`;
}

function cleanGameSlug(gameName) {
  return gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function renderItemListElement(tournament, index, baseUrl) {
  const clean = cleanSlug(tournament.slug);
  const safeDir = sanitizeDirName(clean);
  const pageUrl = `${baseUrl}tournaments/${safeDir}/`;
  return `{
      "@type": "ListItem",
      "position": ${index + 1},
      "item": {
        "@type": "Event",
        "name": "${escapeJson(tournament.name)}",
        "startDate": "${toISODate(tournament.startAt)}",
        "url": "${pageUrl}"
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

function renderRelatedTournaments(tournaments, currentTournament, lang, translations, baseUrl) {
  const currentGames = currentTournament.games;
  const related = tournaments
    .filter(function (t) {
      return t.slug !== currentTournament.slug && t.games.some(function (game) {
        return currentGames.includes(game);
      });
    })
    .sort(function (a, b) {
      return a.startAt - b.startAt;
    })
    .slice(0, 4);

  if (related.length === 0) return '';

  const heading = escapeHtml(translations.relatedTournamentsGeneric);
  const locale = lang === 'es' ? 'es-ES' : 'en-US';

  const items = related.map(function (t) {
    const clean = cleanSlug(t.slug);
    const safeDir = sanitizeDirName(clean);
    const detailUrl = `${baseUrl}${safeDir}/`;
    return `<li>
      <a href="${detailUrl}">${escapeHtml(t.name)}</a>
      <time class="related-date local-time" datetime="${toISODate(t.startAt)}">${formatDateUtc(t.startAt)}</time>
    </li>`;
  }).join('\n');

  return `<div class="sidebar-section related-tournaments">
    <h3>${heading}</h3>
    <ul>${items}</ul>
  </div>`;
}

// ─── Generators ───

function generateTournamentPage(tournament, tournaments, lang, translations, i18nFlat, baseUrl, canonicalBaseUrl, detailTemplate, partials) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const clean = cleanSlug(tournament.slug);
  const safeDir = sanitizeDirName(clean);
  const pageUrl = lang === 'es'
    ? `${canonicalBaseUrl}es/torneos/${safeDir}/`
    : `${canonicalBaseUrl}tournaments/${safeDir}/`;
  const canonicalUrl = pageUrl;
  const pageEs = lang === 'es'
    ? pageUrl
    : pageUrl.replace('/tournaments/', '/es/torneos/');
  const canonicalEn = lang === 'en'
    ? canonicalUrl
    : canonicalUrl.replace('/es/torneos/', '/tournaments/');
  const hreflangTags = buildHreflangTags(canonicalEn, pageEs);
  const location = buildLocation(tournament, translations, locale);
  const metaDescription = buildMetaDescription(translations.detailMetaDescription, tournament, locale);
  const imageUrl = tournament.imageUrl || 'https://legal.fighterstech.com/fighterstech.png';
  const mapUrl = buildMapUrl(tournament);
  const relatedTournaments = renderRelatedTournaments(tournaments, tournament, lang, translations, baseUrl);

  let html = detailTemplate;

  // Inyectar parciales
  html = injectPartial(html, '<!-- PARTIAL:head-common -->', partials.headCommon);
  html = injectPartial(html, '<!-- PARTIAL:header-footer-styles -->', partials.headerFooterStyles);
  html = injectPartial(html, '<!-- PARTIAL:header -->', partials.header);
  html = injectPartial(html, '<!-- PARTIAL:footer -->', partials.footer);
  html = injectPartial(html, '<!-- PARTIAL:header-footer-scripts -->', partials.headerFooterScripts);
  html = injectPartial(html, '<!-- PARTIAL:download-modal -->', partials.downloadModal);
  html = injectPartial(html, '<!-- PARTIAL:tournaments-scripts -->', partials.tournamentsScripts);

  // Reemplazar i18n (tournaments.* y nav.* / footer.* desde el JSON aplanado)
  const allI18n = { ...i18nFlat, ...flattenObject({ tournaments: translations }) };
  for (const [key, value] of Object.entries(allI18n)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value));
  }

  // Reemplazar marcadores dinámicos del torneo
  const gamesListHtml = tournament.games.map(game => `<span class="game-badge">${escapeHtml(game)}</span>`).join('');
  const aboutLd = tournament.games.length > 1
    ? `"about": [\n      ${tournament.games.map(game => `{"@type": "VideoGame", "name": "${escapeJson(game)}"}`).join(',\n      ')}\n    ],`
    : `"about": {\n        "@type": "VideoGame",\n        "name": "${escapeJson(tournament.games[0])}"\n      },`;

  const replacements = {
    'lang': lang,
    'tournamentUrl': lang === 'es' ? '/es/torneos/' : '/tournaments/',
    'tournaments.listUrl': lang === 'es' ? '/es/torneos/' : '/tournaments/',
    'tournament.name': escapeHtml(tournament.name),
    'tournament.game': escapeHtml(tournament.games[0]),
    'tournament.games': escapeHtml(tournament.games.join(', ')),
    'tournament.gamesList': gamesListHtml,
    'tournament.slug': escapeHtml(tournament.slug),
    'tournament.startGgUrl': `https://www.start.gg/tournament/${escapeHtml(cleanSlug(tournament.slug))}/details`,
    'tournament.dateFormatted': formatDateUtc(tournament.startAt),
    'tournament.startDateISO': toISODate(tournament.startAt),
    'tournament.endDateLD': buildEndDateLD(tournament),
    'tournament.location': escapeHtml(location),
    'tournament.numAttendees': tournament.numAttendees,
    'tournament.pageUrl': pageUrl,
    'tournament.canonicalUrl': canonicalUrl,
    'tournament.hreflangTags': hreflangTags,
    'tournament.metaDescription': escapeHtml(metaDescription),
    'tournament.attendanceMode': buildAttendanceMode(tournament.isOnline),
    'tournament.locationLD': buildLocationLD(tournament),
    'tournament.aboutLD': aboutLd,
    'tournament.imageUrl': escapeHtml(imageUrl),
    'tournament.mapUrl': mapUrl,
    'tournament.mapUrlHidden': mapUrl ? '' : 'hidden',
    'tournament.relatedTournaments': relatedTournaments
  };

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value));
  }

  return html;
}

function generateIndexPage(tournaments, lang, translations, i18nFlat, baseUrl, canonicalBaseUrl, indexTemplate, partials, fetchedAt, windowDays) {
  const locale = lang === 'es' ? 'es-ES' : 'en-US';
  const pageUrl = lang === 'es'
    ? `${canonicalBaseUrl}es/torneos/`
    : `${canonicalBaseUrl}tournaments/`;
  const canonicalUrl = pageUrl;
  const pageEs = lang === 'es'
    ? pageUrl
    : pageUrl.replace('/tournaments/', '/es/torneos/');
  const canonicalEn = lang === 'en'
    ? canonicalUrl
    : canonicalUrl.replace('/es/torneos/', '/tournaments/');
  const hreflangTags = buildHreflangTags(canonicalEn, pageEs);

  const sorted = [...tournaments].sort((a, b) => a.startAt - b.startAt);
  const tournamentCards = sorted.length > 0
    ? sorted.map(t => renderTournamentCard(t, lang, translations, baseUrl)).join('\n')
    : '';
  const emptyState = sorted.length === 0 ? renderEmptyState(translations) : '';
  const itemListElements = sorted.map((t, i) => renderItemListElement(t, i, canonicalBaseUrl)).join(',\n');
  const pageTitle = translations.pageTitle.replace('{{days}}', windowDays);

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
  for (const [key, value] of Object.entries(allI18n)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, String(value));
  }

  const replacements = {
    'lang': lang,
    'tournamentUrl': lang === 'es' ? '/es/torneos/' : '/tournaments/',
    'tournaments.listUrl': lang === 'es' ? '/es/torneos/' : '/tournaments/',
    'tournaments.pageTitle': pageTitle,
    'index.pageUrl': pageUrl,
    'index.canonicalUrl': canonicalUrl,
    'index.hreflangTags': hreflangTags,
    'tournamentCards': tournamentCards,
    'emptyState': emptyState,
    'itemListElements': itemListElements,
    'totalTournaments': sorted.length,
    'fetchedAt': fetchedAt,
    'windowDays': windowDays
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

  for (const langConfig of languages) {
    const { code, translations, i18nFlat, baseUrl, canonicalBaseUrl } = langConfig;

    // Índice
    const indexHtml = generateIndexPage(
      tournaments,
      code,
      translations,
      i18nFlat,
      baseUrl,
      canonicalBaseUrl,
      indexTemplate,
      partials,
      fetchedAt,
      windowDays
    );
    const indexDir = code === 'en' ? enTournamentsDir : esTournamentsDir;
    mkdirSync(indexDir, { recursive: true });
    writeFileSync(join(indexDir, 'index.html'), indexHtml);
    console.log(`✅ Índice ${code.toUpperCase()}: ${indexDir}\\index.html`);

    // Páginas individuales
    for (const tournament of tournaments) {
      const pageHtml = generateTournamentPage(
        tournament,
        tournaments,
        code,
        translations,
        i18nFlat,
        baseUrl,
        canonicalBaseUrl,
        detailTemplate,
        partials
      );
      const clean = cleanSlug(tournament.slug);
      const safeDir = sanitizeDirName(clean);
      const tournamentDir = join(indexDir, safeDir);
      mkdirSync(tournamentDir, { recursive: true });
      writeFileSync(join(tournamentDir, 'index.html'), pageHtml);
    }
    console.log(`✅ ${tournaments.length} páginas de torneo ${code.toUpperCase()} generadas`);
  }


}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
