import {
  FDEvent,
  FDMatch,
  FDMatchStatus,
  FDLineup,
  FDStandingsResponse,
  Fixture,
  LeagueGroup,
  MatchEvent,
  MatchLineups,
  MatchStatistics,
} from "./types";
import { getLeagueCode, LEAGUES } from "./leagues";
import { getSeasonForDate } from "./date";

const API_BASE = "https://api.football-data.org/v4";
const API_KEY = process.env.FOOTBALL_DATA_KEY || "";
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION || "60", 10) * 1000;

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(endpoint: string, params: Record<string, string>): string {
  return `${endpoint}:${JSON.stringify(params)}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function apiFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const cacheKey = getCacheKey(endpoint, params);
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE}${endpoint}${queryString ? "?" + queryString : ""}`;

  const response = await fetch(url, {
    headers: { "X-Auth-Token": API_KEY },
    next: { revalidate: Math.max(1, Math.floor(CACHE_DURATION / 1000)) },
  });

  if (!response.ok) {
    throw new Error(`football-data.org error: ${response.status}`);
  }

  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

// ─── Status mapping ──────────────────────────────────────────────
function mapStatus(status: FDMatchStatus, minute?: number | null): { long: string; short: string; elapsed: number | null } {
  switch (status) {
    case "TIMED":       return { long: "Not Started", short: "NS", elapsed: null };
    case "SCHEDULED":   return { long: "Not Started", short: "NS", elapsed: null };
    case "IN_PLAY":     return { long: "In Play",     short: "1H", elapsed: minute ?? null };
    case "PAUSED":      return { long: "Half Time",   short: "HT", elapsed: minute ?? null };
    case "FINISHED":    return { long: "Finished",     short: "FT", elapsed: 90 };
    case "SUSPENDED":   return { long: "Suspended",   short: "SUSP", elapsed: minute ?? null };
    case "POSTPONED":   return { long: "Postponed",   short: "PST", elapsed: null };
    case "CANCELLED":   return { long: "Cancelled",   short: "CANC", elapsed: null };
    case "AWARDED":     return { long: "Awarded",     short: "AWD", elapsed: null };
    default:            return { long: status,         short: status, elapsed: minute ?? null };
  }
}

const teamLogo = (id: number) => `/api/crest/${id}.png`;

// ─── Normalize a football-data.org match to our internal Fixture format ──
function normalizeMatch(m: FDMatch): Fixture {
  const status = mapStatus(m.status, m.minute);
  const homeScore = m.score?.fullTime?.home ?? null;
  const awayScore = m.score?.fullTime?.away ?? null;
  const htHome = m.score?.halfTime?.home ?? null;
  const htAway = m.score?.halfTime?.away ?? null;
  const winnerSide = m.score?.winner === "HOME_TEAM" ? "home" : m.score?.winner === "AWAY_TEAM" ? "away" : null;

  return {
    fixture: {
      id: m.id,
      referee: m.referees?.[0]?.name ?? null,
      timezone: "UTC",
      date: m.utcDate,
      timestamp: new Date(m.utcDate).getTime(),
      periods: { first: null, second: null },
      venue: { id: null, name: m.venue ?? null, city: null },
      status,
    },
    league: {
      id: m.competition.id,
      name: m.competition.name,
      country: m.area?.name ?? "",
      logo: m.competition.emblem ?? "",
      flag: m.area?.flag ?? null,
      season: m.season?.id ?? 0,
      round: m.matchday ? `Matchday ${m.matchday}` : m.stage ?? "",
    },
    teams: {
      home: { id: m.homeTeam.id, name: m.homeTeam.name, logo: teamLogo(m.homeTeam.id), winner: winnerSide === "home" },
      away: { id: m.awayTeam.id, name: m.awayTeam.name, logo: teamLogo(m.awayTeam.id), winner: winnerSide === "away" },
    },
    goals: { home: homeScore, away: awayScore },
    score: {
      halftime: { home: htHome, away: htAway },
      fulltime: { home: homeScore, away: awayScore },
      extratime: { home: null, away: null },
      penalty: { home: null, away: null },
    },
  };
}

// ─── Match detail normalization ─────────────────────────────────
function normalizeEvents(events: FDEvent[] = [], fixture: Fixture): MatchEvent[] {
  const teamLogoFor = (id: number | undefined) =>
    id === fixture.teams.home.id
      ? fixture.teams.home.logo
      : id === fixture.teams.away.id
        ? fixture.teams.away.logo
        : "";

  return events.map((event) => {
    const rawType = (event.type || "").toLowerCase();
    const type = rawType.includes("goal")
      ? "Goal"
      : rawType.includes("card")
        ? "Card"
        : rawType.includes("subst")
          ? "subst"
          : rawType.includes("var")
            ? "Var"
            : "Other";

    const playerName = event.player?.name || "";
    const assistName = event.assist?.name || null;

    return {
      time: { elapsed: event.minute ?? 0, extra: event.injuryTime ?? null },
      team: {
        id: event.team?.id ?? 0,
        name: event.team?.name || "",
        logo: teamLogoFor(event.team?.id),
      },
      player: { id: event.player?.id ?? null, name: playerName },
      assist: { id: event.assist?.id ?? null, name: assistName },
      type,
      detail: event.text || (type === "subst" ? assistName || "" : playerName),
      comments: event.text || null,
    };
  });
}

type FDLineupPlayer = NonNullable<FDLineup["lineup"]>[number];

function normalizeLineups(lineups: FDLineup[], fixture: Fixture): MatchLineups[] {
  return lineups.map((lineup) => {
    const known = lineup.team.id === fixture.teams.away.id ? fixture.teams.away : fixture.teams.home;
    const mapPlayer = (entry: FDLineupPlayer) => ({
      player: {
        id: entry.player.id,
        name: entry.player.name,
        number: entry.player.number ?? 0,
        pos: entry.player.position || entry.player.pos || "",
      },
    });

    return {
      team: {
        id: lineup.team.id,
        name: lineup.team.name,
        logo: known.logo || lineup.team.crest || "",
      },
      formation: lineup.formation ?? null,
      coach: lineup.coach?.name
        ? { id: lineup.coach.id ?? null, name: lineup.coach.name }
        : null,
      startXI: (lineup.lineup || []).map(mapPlayer),
      substitutes: (lineup.substitutes || []).map(mapPlayer),
    };
  });
}

function normalizeStatistics(
  stats: Array<{ team?: { id: number; name: string; crest?: string | null } | null; stats?: Array<{ type: string; value: number | string | null }> }>,
  fixture: Fixture
): MatchStatistics[] {
  return stats.map((entry) => {
    const id = entry.team?.id ?? 0;
    const known = id === fixture.teams.away.id ? fixture.teams.away : fixture.teams.home;
    return {
      team: { id, name: entry.team?.name || known.name, logo: known.logo || entry.team?.crest || "" },
      statistics: (entry.stats || []).map((stat) => ({ type: stat.type, value: stat.value })),
    };
  });
}

// ─── Get matches by date ────────────────────────────────────────
export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  try {
    const data = await apiFetch<{ matches?: FDMatch[] }>("/matches", { date });
    return (data.matches || []).map(normalizeMatch);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return [];
  }
}

export async function getLiveFixtures(): Promise<Fixture[]> {
  try {
    const data = await apiFetch<{ matches?: FDMatch[] }>("/matches", { status: "IN_PLAY,PAUSED" });
    return (data.matches || []).map(normalizeMatch);
  } catch (error) {
    console.error("Error fetching live fixtures:", error);
    return [];
  }
}

// Detail endpoint plus events/lineups/statistics. Each extra request is
// optional so a restricted API plan never breaks the match page.
export async function getFixtureDetails(fixtureId: number): Promise<Fixture | null> {
  try {
    const [matchData, eventsData, lineupsData, statsData] = await Promise.allSettled([
      apiFetch<FDMatch>(`/matches/${fixtureId}`),
      apiFetch<{ events?: FDEvent[] }>(`/matches/${fixtureId}/events`),
      apiFetch<{ lineups?: FDLineup[] }>(`/matches/${fixtureId}/lineups`),
      apiFetch<{ statistics?: Array<{ team?: { id: number; name: string; crest?: string | null } | null; stats?: Array<{ type: string; value: number | string | null }> }> }>(`/matches/${fixtureId}/statistics`),
    ]);

    if (matchData.status !== "fulfilled") {
      console.error("Error fetching fixture details:", matchData.reason);
      return null;
    }

    const fixture = normalizeMatch(matchData.value);
    fixture.events = normalizeEvents(eventsData.status === "fulfilled" ? eventsData.value.events || [] : [], fixture);
    fixture.lineups = lineupsData.status === "fulfilled" ? normalizeLineups(lineupsData.value.lineups || [], fixture) : [];
    fixture.statistics = statsData.status === "fulfilled" ? normalizeStatistics(statsData.value.statistics || [], fixture) : [];
    return fixture;
  } catch (error) {
    console.error("Error fetching fixture details:", error);
    return null;
  }
}

// ─── Standings ──────────────────────────────────────────────────
export async function getStandings(leagueId: number, season?: number): Promise<FDStandingsResponse | null> {
  try {
    const code = getLeagueCode(leagueId);
    const params: Record<string, string> = {};
    if (season && season > 1900) params.season = String(season);
    const data = await apiFetch<FDStandingsResponse>(`/competitions/${code}/standings`, params);
    return data;
  } catch (error) {
    console.error("Error fetching standings:", error);
    return null;
  }
}

// ─── Teams & search (uses the same football-data.org key) ───────
export interface TeamSearchResult {
  id: number;
  name: string;
  logo: string;
  country: string;
}

export async function getTeamsForLeagues(codes: string[]): Promise<TeamSearchResult[]> {
  const results = await Promise.allSettled(
    codes.map((code) => apiFetch<{ teams?: Array<{ id: number; name: string; crest: string | null }> }>(`/competitions/${code}/teams`))
  );

  const teams = new Map<number, TeamSearchResult>();
  results.forEach((result, index) => {
    if (result.status !== "fulfilled") return;
    const league = LEAGUES.find((item) => item.code === codes[index]);
    (result.value.teams || []).forEach((team) => {
      if (!teams.has(team.id)) {
        teams.set(team.id, {
          id: team.id,
          name: team.name,
          logo: teamLogo(team.id),
          country: league?.country || "",
        });
      }
    });
  });

  return Array.from(teams.values());
}

export function searchLeagues(query: string) {
  const needle = query.trim().toLowerCase();
  return LEAGUES.filter(
    (league) =>
      league.name.toLowerCase().includes(needle) ||
      league.country.toLowerCase().includes(needle) ||
      league.code.toLowerCase().includes(needle)
  ).map((league) => ({
    type: "league" as const,
    id: league.id,
    name: league.name,
    logo: "",
    country: league.country,
    countryCode: "",
  }));
}

// ─── Group fixtures by league ───────────────────────────────────
export function groupFixturesByLeague(fixtures: Fixture[]): LeagueGroup[] {
  const groupMap = new Map<number, LeagueGroup>();

  for (const fixture of fixtures) {
    const leagueId = fixture.league.id;
    if (!groupMap.has(leagueId)) {
      groupMap.set(leagueId, { league: fixture.league, fixtures: [] });
    }
    groupMap.get(leagueId)!.fixtures.push(fixture);
  }

  return Array.from(groupMap.values()).sort((a, b) => {
    const aLive = a.fixtures.some((f) => ["1H", "2H", "HT"].includes(f.fixture.status.short));
    const bLive = b.fixtures.some((f) => ["1H", "2H", "HT"].includes(f.fixture.status.short));
    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;
    return a.league.name.localeCompare(b.league.name);
  });
}

// ─── Helpers ─────────────────────────────────────────────────────
export function isMatchLive(status: string): boolean {
  return ["1H", "2H", "HT", "ET", "P", "BT", "SUSP", "INT", "IN_PLAY", "PAUSED"].includes(status);
}

export function formatMatchMinute(elapsed: number | null, extra?: number | null): string {
  if (elapsed === null) return "";
  if (extra && extra > 0) return `${elapsed}+${extra}'`;
  return `${elapsed}'`;
}

export { getSeasonForDate };
