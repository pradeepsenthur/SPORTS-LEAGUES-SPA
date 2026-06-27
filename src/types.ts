export interface League {
  idLeague: string;
  strLeague: string | null;
  strSport: string | null;
  strLeagueAlternate: string | null;
}

export interface SeasonBadgeData {
  season: string | null;
  badgeUrl: string | null;
}

export interface AllLeaguesResponse {
  leagues?: Array<Partial<League>>;
}

export interface AllSeasonsResponse {
  seasons?: Array<{
    strSeason?: string | null;
    strBadge?: string | null;
  }>;
}
