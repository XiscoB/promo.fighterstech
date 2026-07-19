import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf8'));

const apiKey = process.env.STARTGG_API_KEY;
if (!apiKey) {
  console.error('❌ STARTGG_API_KEY no está definida en las variables de entorno');
  process.exit(1);
}

const allowedGameIds = new Set(config.videogameIds.map(String));

const QUERY = `
  query TournamentsByVideogame($perPage: Int!, $page: Int!, $videogameIds: [ID]!, $afterDate: Timestamp, $beforeDate: Timestamp) {
    tournaments(query: {
      perPage: $perPage,
      page: $page,
      sortBy: "startAt asc",
      filter: {
        upcoming: true,
        videogameIds: $videogameIds,
        afterDate: $afterDate,
        beforeDate: $beforeDate
      }
    }) {
      pageInfo {
        totalPages
      }
      nodes {
        name
        slug
        startAt
        endAt
        city
        addrState
        countryCode
        lat
        lng
        isOnline
        numAttendees
        images(type: "profile") {
          url
        }
        events {
          videogame {
            id
            name
          }
        }
      }
    }
  }
`;

async function fetchWithRetry(url, options, maxRetries = config.maxRetries || 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
    if (response.status === 429 || response.status >= 500) {
      const waitMs = Math.pow(2, attempt) * 1000;
      console.warn(`⚠️ Intento ${attempt}/${maxRetries} falló (${response.status}). Reintentando en ${waitMs}ms...`);
      await new Promise(r => setTimeout(r, waitMs));
      continue;
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  throw new Error(`API no respondió después de ${maxRetries} intentos`);
}

async function fetchPage(page, variables) {
  const response = await fetchWithRetry(config.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { ...variables, page }
    })
  });
  return response.json();
}

function normalizeTournament(raw) {
  const matchingGames = [...new Map(
    (raw.events || [])
      .filter(event => {
        const gameId = event.videogame?.id;
        return gameId && allowedGameIds.has(String(gameId));
      })
      .map(event => [event.videogame.id, event.videogame.name])
  ).values()].sort();

  if (matchingGames.length === 0) return null;

  return {
    name: raw.name,
    slug: raw.slug,
    startAt: raw.startAt,
    endAt: raw.endAt || null,
    city: raw.city || null,
    addrState: raw.addrState || null,
    countryCode: raw.countryCode || null,
    lat: raw.lat || null,
    lng: raw.lng || null,
    isOnline: raw.isOnline || false,
    numAttendees: raw.numAttendees || 0,
    games: matchingGames,
    imageUrl: raw.images?.[0]?.url || null
  };
}

async function main() {
  const now = Date.now();
  const afterDate = Math.floor(now / 1000);
  const beforeDate = afterDate + (config.windowDays * 24 * 60 * 60);

  const variables = {
    perPage: config.perPage || 50,
    videogameIds: config.videogameIds,
    afterDate,
    beforeDate
  };

  const allTournaments = [];
  const maxPages = config.maxPages || 5;

  for (let page = 1; page <= maxPages; page++) {
    console.log(`📡 Fetching page ${page}/${maxPages}...`);
    const data = await fetchPage(page, variables);

    if (data.errors) {
      console.error('❌ Errores de GraphQL:', data.errors.map(e => e.message).join('; '));
      process.exit(1);
    }

    const nodes = data.data?.tournaments?.nodes || [];
    if (nodes.length === 0) break;

    const normalized = nodes.map(normalizeTournament).filter(Boolean);
    allTournaments.push(...normalized);

    const totalPages = data.data?.tournaments?.pageInfo?.totalPages || 1;
    if (page >= totalPages) break;
  }

  const outputDir = join(__dirname, '..', 'data');
  mkdirSync(outputDir, { recursive: true });

  const fetchedAt = new Date(now).toISOString();
  const tournamentsOutput = {
    fetchedAt,
    windowDays: config.windowDays,
    tournaments: allTournaments
  };

  const summaryOutput = {
    fetchedAt,
    totalTournaments: allTournaments.length,
    games: [...new Set(allTournaments.flatMap(t => t.games))].sort(),
    windowDays: config.windowDays
  };

  writeFileSync(join(outputDir, 'tournaments.json'), JSON.stringify(tournamentsOutput, null, 2));
  writeFileSync(join(outputDir, 'tournaments-summary.json'), JSON.stringify(summaryOutput, null, 2));

  console.log(`✅ ${allTournaments.length} torneos guardados en data/tournaments.json`);
  console.log(`✅ Resumen guardado en data/tournaments-summary.json`);
}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  process.exit(1);
});
