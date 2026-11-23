// Shared league catalogue. football-data.org competition ids and codes are
// kept here so every feature uses the same, correct competition data.

export { getSeasonForDate } from "./date";

export interface LeagueInfo {
  id: number;
  code: string;
  name: string;
  country: string;
  icon: string;
  available: boolean;
}

// The current API key only exposes these competitions. Search stays limited
// to them so it never fires a batch of requests that are guaranteed to fail.
export const AVAILABLE_LEAGUE_CODES = [
  "BSA",
  "ELC",
  "PL",
  "CL",
  "EC",
  "FL1",
  "BL1",
  "SA",
  "DED",
  "PPL",
  "CLI",
  "PD",
  "WC",
];

type LeagueSeed = Omit<LeagueInfo, "available">;

// Full football-data.org v4 competition catalogue. The first block contains
// the competitions highlighted in the UI (including Champions League and CAF),
// the rest follows the official lookup table.
const LEAGUE_SEEDS: LeagueSeed[] = [
  { id: 2021, code: "PL", name: "Premier League", country: "England", icon: "PL" },
  { id: 2001, code: "CL", name: "Champions League", country: "Europe", icon: "CL" },
  { id: 2146, code: "EL", name: "Europa League", country: "Europe", icon: "EL" },
  { id: 2154, code: "UCL", name: "Conference League", country: "Europe", icon: "UCL" },
  { id: 2014, code: "PD", name: "La Liga", country: "Spain", icon: "PD" },
  { id: 2019, code: "SA", name: "Serie A", country: "Italy", icon: "SA" },
  { id: 2002, code: "BL1", name: "Bundesliga", country: "Germany", icon: "BL1" },
  { id: 2015, code: "FL1", name: "Ligue 1", country: "France", icon: "FL1" },
  { id: 2016, code: "ELC", name: "Championship", country: "England", icon: "ELC" },
  { id: 2013, code: "BSA", name: "Serie A Brazil", country: "Brazil", icon: "BSA" },
  { id: 2003, code: "DED", name: "Eredivisie", country: "Netherlands", icon: "DED" },
  { id: 2017, code: "PPL", name: "Primeira Liga", country: "Portugal", icon: "PPL" },
  { id: 2152, code: "CLI", name: "Copa Libertadores", country: "South America", icon: "CLI" },
  { id: 2000, code: "WC", name: "FIFA World Cup", country: "World", icon: "WC" },
  { id: 2018, code: "EC", name: "European Championship", country: "Europe", icon: "EC" },
  { id: 2006, code: "QCAF", name: "CAF World Cup Qualifiers", country: "Africa", icon: "CAF" },

  { id: 2024, code: "ASL", name: "Liga Profesional", country: "Argentina", icon: "ASL" },
  { id: 2147, code: "QAFC", name: "AFC World Cup Qualifiers", country: "Asia", icon: "AFC" },
  { id: 2008, code: "AAL", name: "A-League", country: "Australia", icon: "AAL" },
  { id: 2022, code: "APL", name: "Austrian Playoffs", country: "Austria", icon: "APL" },
  { id: 2012, code: "ABL", name: "Austrian Bundesliga", country: "Austria", icon: "ABL" },
  { id: 2032, code: "BJPP", name: "Belgian Playoffs", country: "Belgium", icon: "BJPP" },
  { id: 2009, code: "BJL", name: "Jupiler Pro League", country: "Belgium", icon: "BJL" },
  { id: 2029, code: "BSB", name: "Serie B Brazil", country: "Brazil", icon: "BSB" },
  { id: 2048, code: "CPD", name: "Primera División", country: "Chile", icon: "CPD" },
  { id: 2044, code: "CSL", name: "Chinese Super League", country: "China PR", icon: "CSL" },
  { id: 2045, code: "CLP", name: "Liga Postobón", country: "Colombia", icon: "CLP" },
  { id: 2047, code: "PRVA", name: "Prva Liga", country: "Croatia", icon: "PRVA" },
  { id: 2141, code: "DELP", name: "Euro League Playoff", country: "Denmark", icon: "DELP" },
  { id: 2050, code: "DSU", name: "Danish Superliga", country: "Denmark", icon: "DSU" },
  { id: 2139, code: "FLC", name: "League Cup", country: "England", icon: "FLC" },
  { id: 2030, code: "EL1", name: "League One", country: "England", icon: "EL1" },
  { id: 2053, code: "ENL", name: "National League", country: "England", icon: "ENL" },
  { id: 2054, code: "EL2", name: "League Two", country: "England", icon: "EL2" },
  { id: 2055, code: "FAC", name: "FA Cup", country: "England", icon: "FAC" },
  { id: 2056, code: "COM", name: "Community Shield", country: "England", icon: "COM" },
  { id: 2157, code: "ESC", name: "UEFA Supercup", country: "Europe", icon: "ESC" },
  { id: 2007, code: "QUFA", name: "UEFA World Cup Qualifiers", country: "Europe", icon: "UEFA" },
  { id: 2031, code: "VEI", name: "Veikkausliiga", country: "Finland", icon: "VEI" },
  { id: 2142, code: "FL2", name: "Ligue 2", country: "France", icon: "FL2" },
  { id: 2143, code: "FPL", name: "French Playoffs", country: "France", icon: "FPL" },
  { id: 2129, code: "REG", name: "Regionalliga", country: "Germany", icon: "REG" },
  { id: 2134, code: "GSC", name: "DFL Super Cup", country: "Germany", icon: "GSC" },
  { id: 2140, code: "BL3", name: "3. Bundesliga", country: "Germany", icon: "BL3" },
  { id: 2156, code: "BLREL", name: "German Relegation", country: "Germany", icon: "BLREL" },
  { id: 2004, code: "BL2", name: "2. Bundesliga", country: "Germany", icon: "BL2" },
  { id: 2011, code: "DFB", name: "DFB-Pokal", country: "Germany", icon: "DFB" },
  { id: 2132, code: "GSL", name: "Greek Super League", country: "Greece", icon: "GSL" },
  { id: 2128, code: "HNB", name: "NB I", country: "Hungary", icon: "HNB" },
  { id: 2125, code: "ILH", name: "Ligat ha'Al", country: "Israel", icon: "ILH" },
  { id: 2121, code: "SB", name: "Serie B", country: "Italy", icon: "SB" },
  { id: 2122, code: "CIT", name: "Coppa Italia", country: "Italy", icon: "CIT" },
  { id: 2123, code: "ISC", name: "Serie C", country: "Italy", icon: "ISC" },
  { id: 2158, code: "IPL", name: "Italian Playoffs", country: "Italy", icon: "IPL" },
  { id: 2119, code: "JJL", name: "J. League", country: "Japan", icon: "JJL" },
  { id: 2113, code: "LMX", name: "Liga MX", country: "Mexico", icon: "LMX" },
  { id: 2109, code: "KNV", name: "KNVB Beker", country: "Netherlands", icon: "KNV" },
  { id: 2005, code: "DJL", name: "Eerste Divisie", country: "Netherlands", icon: "DJL" },
  { id: 2106, code: "TIP", name: "Tippeligaen", country: "Norway", icon: "TIP" },
  { id: 2103, code: "QOFC", name: "OFC World Cup Qualifiers", country: "Oceania", icon: "OFC" },
  { id: 2101, code: "PPD", name: "Primera División", country: "Peru", icon: "PPD" },
  { id: 2094, code: "RL1", name: "Liga I", country: "Romania", icon: "RL1" },
  { id: 2137, code: "RFPL", name: "Russian Premier League", country: "Russia", icon: "RFPL" },
  { id: 2084, code: "SPL", name: "Scottish Premier League", country: "Scotland", icon: "SPL" },
  { id: 2080, code: "CA", name: "Copa America", country: "South America", icon: "CA" },
  { id: 2082, code: "QCBL", name: "CONMEBOL World Cup Qualifiers", country: "South America", icon: "CON" },
  { id: 2077, code: "SD", name: "Segunda División", country: "Spain", icon: "SD" },
  { id: 2079, code: "CDR", name: "Copa del Rey", country: "Spain", icon: "CDR" },
  { id: 2073, code: "ALL", name: "Allsvenskan", country: "Sweden", icon: "ALL" },
  { id: 2072, code: "SSL", name: "Swiss Super League", country: "Switzerland", icon: "SSL" },
  { id: 2070, code: "TSL", name: "Süper Lig", country: "Turkey", icon: "TSL" },
  { id: 2064, code: "UPL", name: "Ukrainian Premier League", country: "Ukraine", icon: "UPL" },
  { id: 2145, code: "MLS", name: "MLS", country: "United States", icon: "MLS" },
  { id: 2148, code: "SUCU", name: "Supercopa Uruguaya", country: "Uruguay", icon: "SUCU" },
  { id: 2153, code: "OLY", name: "Summer Olympics", country: "World", icon: "OLY" },
  { id: 2155, code: "QCCF", name: "CONCACAF World Cup Qualifiers", country: "World", icon: "CONC" },
];

export const LEAGUES: LeagueInfo[] = LEAGUE_SEEDS.map((league) => ({
  ...league,
  available: AVAILABLE_LEAGUE_CODES.includes(league.code),
}));

export const LEAGUE_CODE_MAP: Record<number, string> = Object.fromEntries(
  LEAGUES.map((league) => [league.id, league.code])
);

export function getLeagueCode(leagueId: number): string {
  return LEAGUE_CODE_MAP[leagueId] || "PL";
}

export function getLeagueInfo(leagueId: number): LeagueInfo | undefined {
  return LEAGUES.find((league) => league.id === leagueId);
}
