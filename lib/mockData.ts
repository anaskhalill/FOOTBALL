import { Fixture, LeagueGroup } from "./types";

// Mock data for demo when no valid API key is set
export function getMockFixtures(): Fixture[] {
  const today = new Date().toISOString().split("T")[0];

  return [
    // Premier League
    {
      fixture: { id: 1001, referee: "Michael Oliver", timezone: "UTC", date: `${today}T15:00:00+00:00`, timestamp: Date.now(), periods: { first: null, second: null }, venue: { id: 1, name: "Emirates Stadium", city: "London" }, status: { long: "Not Started", short: "NS", elapsed: null } },
      league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://flagcdn.com/gb.svg", season: 2025, round: "Matchday 3" },
      teams: { home: { id: 42, name: "Arsenal", logo: "https://media.api-sports.io/football/teams/42.png" }, away: { id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" } },
      goals: { home: null, away: null }, score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
    },
    {
      fixture: { id: 1002, referee: "Anthony Taylor", timezone: "UTC", date: `${today}T17:30:00+00:00`, timestamp: Date.now(), periods: { first: null, second: null }, venue: { id: 2, name: "Old Trafford", city: "Manchester" }, status: { long: "Not Started", short: "NS", elapsed: null } },
      league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://flagcdn.com/gb.svg", season: 2025, round: "Matchday 3" },
      teams: { home: { id: 33, name: "Manchester United", logo: "https://media.api-sports.io/football/teams/33.png" }, away: { id: 49, name: "Chelsea", logo: "https://media.api-sports.io/football/teams/49.png" } },
      goals: { home: null, away: null }, score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
    },
    {
      fixture: { id: 1003, referee: "Stuart Attwell", timezone: "UTC", date: `${today}T20:00:00+00:00`, timestamp: Date.now(), periods: { first: null, second: null }, venue: { id: 3, name: "Stamford Bridge", city: "London" }, status: { long: "Not Started", short: "NS", elapsed: null } },
      league: { id: 39, name: "Premier League", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png", flag: "https://flagcdn.com/gb.svg", season: 2025, round: "Matchday 3" },
      teams: { home: { id: 50, name: "Manchester City", logo: "https://media.api-sports.io/football/teams/50.png" }, away: { id: 47, name: "Tottenham", logo: "https://media.api-sports.io/football/teams/47.png" } },
      goals: { home: null, away: null }, score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
    },
    // La Liga
    {
      fixture: { id: 2001, referee: "Jesus Gil Manzano", timezone: "UTC", date: `${today}T19:00:00+00:00`, timestamp: Date.now(), periods: { first: null, second: null }, venue: { id: 4, name: "Santiago Bernabeu", city: "Madrid" }, status: { long: "Not Started", short: "NS", elapsed: null } },
      league: { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "https://flagcdn.com/es.svg", season: 2025, round: "Matchday 3" },
      teams: { home: { id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" }, away: { id: 530, name: "Atletico Madrid", logo: "https://media.api-sports.io/football/teams/530.png" } },
      goals: { home: null, away: null }, score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
    },
    {
      fixture: { id: 2002, referee: "Ricardo de Burgos", timezone: "UTC", date: `${today}T21:00:00+00:00`, timestamp: Date.now(), periods: { first: null, second: null }, venue: { id: 5, name: "Spotify Camp Nou", city: "Barcelona" }, status: { long: "Not Started", short: "NS", elapsed: null } },
      league: { id: 140, name: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png", flag: "https://flagcdn.com/es.svg", season: 2025, round: "Matchday 3" },
      teams: { home: { id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png" }, away: { id: 536, name: "Sevilla", logo: "https://media.api-sports.io/football/teams/536.png" } },
      goals: { home: null, away: null }, score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
    },
    // Champions League
    {
      fixture: { id: 3001, referee: "Daniele Orsato", timezone: "UTC", date: `${today}T19:00:00+00:00`, timestamp: Date.now(), periods: { first: null, second: null }, venue: { id: 6, name: "Allianz Arena", city: "Munich" }, status: { long: "Not Started", short: "NS", elapsed: null } },
      league: { id: 2, name: "UEFA Champions League", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png", flag: null, season: 2025, round: "Group Stage - Matchday 1" },
      teams: { home: { id: 157, name: "Bayern Munich", logo: "https://media.api-sports.io/football/teams/157.png" }, away: { id: 489, name: "AC Milan", logo: "https://media.api-sports.io/football/teams/489.png" } },
      goals: { home: null, away: null }, score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null }, extratime: { home: null, away: null }, penalty: { home: null, away: null } },
    },
  ];
}

export function getMockLeagueGroups(): LeagueGroup[] {
  const fixtures = getMockFixtures();
  const groupMap = new Map<number, LeagueGroup>();

  for (const fixture of fixtures) {
    const leagueId = fixture.league.id;
    if (!groupMap.has(leagueId)) {
      groupMap.set(leagueId, { league: fixture.league, fixtures: [] });
    }
    groupMap.get(leagueId)!.fixtures.push(fixture);
  }

  return Array.from(groupMap.values());
}
