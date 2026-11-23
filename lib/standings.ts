import { FDStandingEntry } from "./types";

export interface NormalizedStanding {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  form: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

// football-data.org standings -> the shape our table renders.
export function normalizeStandings(entries: FDStandingEntry[] = []): NormalizedStanding[] {
  return entries.map((entry) => ({
    rank: entry.position,
    team: {
      id: entry.team.id,
      name: entry.team.name,
      logo: `/api/crest/${entry.team.id}.png`,
    },
    points: entry.points,
    goalsDiff: entry.goalDifference,
    form: entry.form || "",
    all: {
      played: entry.playedGames,
      win: entry.won,
      draw: entry.draw,
      lose: entry.lost,
      goals: { for: entry.goalsFor, against: entry.goalsAgainst },
    },
  }));
}
