// football-data.org v4 Types

export interface FDApiResponse<T> {
  filters: Record<string, unknown>;
  resultSet: {
    count: number;
    competitions?: string;
    first?: string;
    last?: string;
    played?: number;
  };
  matches?: T[];
  competition?: any;
  standings?: any[];
}

export interface FDCompetition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string | null;
}

export interface FDTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest: string | null;
}

export interface FDScore {
  winner: string | null;
  duration: string;
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface FDReferee {
  id: number;
  name: string;
  type: string;
  nationality: string | null;
}

// Football-data.org match status values
export type FDMatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED"
  | "WO";

export interface FDMatch {
  id: number;
  area: { id: number; name: string; code: string | null; flag: string | null };
  competition: FDCompetition;
  season: { id: number; startDate: string; endDate: string; currentMatchday: number | null };
  utcDate: string;
  status: FDMatchStatus;
  venue: string | null;
  matchday: number | null;
  stage: string | null;
  group: string | null;
  lastUpdated: string;
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  score: FDScore;
  odds: any;
  referees: FDReferee[];
  minute?: number | null;
}

// Standings
export interface FDStandingTable {
  stage: string;
  type: string;
  group: string | null;
  table: FDStandingEntry[];
}

export interface FDStandingEntry {
  position: number;
  team: FDTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string | null;
}

export interface FDStandingsResponse {
  competition: FDCompetition;
  season: any;
  standings: FDStandingTable[];
}

// Grouped fixtures (our internal format)
export interface LeagueGroup {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  fixtures: Fixture[];
}

// Normalized fixture (wraps FD match for our components)
export interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: { first: number | null; second: number | null };
    venue: { id: number | null; name: string | null; city: string | null };
    status: { long: string; short: string; elapsed: number | null; extra?: number | null };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner?: boolean };
    away: { id: number; name: string; logo: string; winner?: boolean };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
  // Extra fields for match detail
  events?: MatchEvent[];
  lineups?: MatchLineups[];
  statistics?: MatchStatistics[];
}

export interface MatchEvent {
  time: { elapsed: number; extra?: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number | null; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
}

export interface MatchLineups {
  team: { id: number; name: string; logo: string };
  formation: string | null;
  coach: { id: number | null; name: string } | null;
  startXI: MatchPlayer[];
  substitutes: MatchPlayer[];
}

export interface MatchPlayer {
  player: { id: number; name: string; number: number; pos: string | null };
}

export interface MatchStatistics {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: string | number | null }>;
}

// Raw football-data.org payloads for the match detail endpoints
export interface FDEvent {
  minute?: number | null;
  injuryTime?: number | null;
  type?: string | null;
  text?: string | null;
  team?: { id: number; name: string } | null;
  player?: { id: number | null; name: string | null } | null;
  assist?: { id: number | null; name: string | null } | null;
}

export interface FDLineup {
  team: { id: number; name: string; crest?: string | null };
  formation?: string | null;
  coach?: { id: number | null; name: string | null } | null;
  lineup?: Array<{ player: { id: number; name: string; number: number | null; position?: string | null; pos?: string | null } }>;
  substitutes?: Array<{ player: { id: number; name: string; number: number | null; position?: string | null; pos?: string | null } }>;
}

export interface FDStatistics {
  team?: { id: number; name: string; crest?: string | null } | null;
  stats?: Array<{ type: string; value: number | string | null }>;
}

// Broadcasters
export interface CountryBroadcasters {
  [countryCode: string]: Array<{ name: string; url: string }>;
}

export interface SearchResult {
  type: "team" | "league" | "country";
  id: number;
  name: string;
  logo?: string;
  country?: string;
  countryCode?: string;
}
