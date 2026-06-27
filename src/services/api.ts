import { getCachedValue, setCachedValue } from "./cache";
import type {
  AllLeaguesResponse,
  AllSeasonsResponse,
  League,
  SeasonBadgeData,
} from "../types";

const ALL_LEAGUES_URL =
  "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php";
const BADGE_LOOKUP_URL =
  "https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=";

const LEAGUES_TTL_MS = 60 * 60 * 1000;
const BADGE_TTL_MS = 6 * 60 * 60 * 1000;
const USE_MOCK_ALL_LEAGUES = false; // Set to true to use mock data for all leagues instead of fetching from the API

const MOCK_SPORTS = [
  "Soccer",
  "Basketball",
  "Cricket",
  "Tennis",
  "Motorsport",
  "Baseball",
  "Rugby",
  "Hockey",
];

const MOCK_LEAGUES: League[] = Array.from({ length: 50 }, (_, index) => {
  const id = `9${String(index + 1).padStart(4, "0")}`;
  const sport = MOCK_SPORTS[index % MOCK_SPORTS.length];
  const isPremierGroup = index < 12;
  const leagueOrder = index + 1;
  const nonPremierOrder = index - 11;

  return {
    idLeague: id,
    strLeague: isPremierGroup
      ? `Premier Test League ${leagueOrder}`
      : `${sport} Challenge League ${nonPremierOrder}`,
    strSport: sport,
    strLeagueAlternate: isPremierGroup
      ? `PTL ${leagueOrder}`
      : `${sport} CL ${nonPremierOrder}`,
  };
});

/**
 * Fetches JSON and throws a typed error for non-2xx responses.
 */
async function fetchJsonResponse<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

/**
 * Normalizes raw API league rows into the minimal contract used by the UI.
 */
function normalizeLeague(rawLeagueMetadata: Partial<League>): League | null {
  if (!rawLeagueMetadata.idLeague) {
    return null;
  }

  return {
    idLeague: String(rawLeagueMetadata.idLeague),
    strLeague: rawLeagueMetadata.strLeague ?? null,
    strSport: rawLeagueMetadata.strSport ?? null,
    strLeagueAlternate: rawLeagueMetadata.strLeagueAlternate ?? null,
  };
}

/**
 * Returns all leagues from cache/mock/API in that priority order.
 */
export async function fetchAllLeagues(): Promise<League[]> {
  const cacheKey = USE_MOCK_ALL_LEAGUES ? "all-leagues-mock" : "all-leagues";
  const cached = getCachedValue<League[]>(cacheKey);
  if (cached) {
    return cached;
  }

  if (USE_MOCK_ALL_LEAGUES) {
    setCachedValue(cacheKey, MOCK_LEAGUES, LEAGUES_TTL_MS);
    return MOCK_LEAGUES;
  }

  const payload = await fetchJsonResponse<AllLeaguesResponse>(ALL_LEAGUES_URL);
  const leagues = (payload.leagues ?? [])
    .map(normalizeLeague)
    .filter((league): league is League => Boolean(league));
  setCachedValue(cacheKey, leagues, LEAGUES_TTL_MS);
  return leagues;
}

/**
 * Returns a season badge payload for a league, preferring a season that has a badge URL.
 */
export async function fetchSeasonBadge(
  leagueId: string,
): Promise<SeasonBadgeData> {
  const cacheKey = `season-badge:${leagueId}`;
  const cached = getCachedValue<SeasonBadgeData>(cacheKey);
  if (cached) {
    return cached;
  }

  const payload = await fetchJsonResponse<AllSeasonsResponse>(
    `${BADGE_LOOKUP_URL}${leagueId}`,
  );
  const seasons = payload.seasons ?? [];
  const seasonWithBadge =
    seasons.find((season) => season.strBadge) || seasons[0] || null;

  const result: SeasonBadgeData = {
    season: seasonWithBadge?.strSeason ?? null,
    badgeUrl: seasonWithBadge?.strBadge ?? null,
  };

  setCachedValue(cacheKey, result, BADGE_TTL_MS);
  return result;
}
