// MENA-first streaming links for each league
// These link to the official platform's match page (not pirated streams)

interface StreamLink {
  name: string;
  url: string;
  quality?: string;
  lang?: string;
  isPrimary?: boolean;
}

// Base URLs for MENA streaming platforms
const PLATFORMS = {
  TOD: { name: "TOD (beIN)", url: "https://www.tod.tv", flag: "Qatar" },
  SHAHID: { name: "Shahid", url: "https://shahid.mbc.net", flag: "UAE" },
  SSC: { name: "SSC", url: "https://www.sbc.sa", flag: "Saudi" },
  BEIN: { name: "beIN Sports Connect", url: "https://connect.bein.com", flag: "MENA" },
  SKY: { name: "Sky Sports", url: "https://www.skysports.com", flag: "UK" },
  DAZN: { name: "DAZN", url: "https://www.dazn.com", flag: "Global" },
  PARAMOUNT: { name: "Paramount+", url: "https://www.paramountplus.com", flag: "US" },
  NBC: { name: "Peacock / NBC Sports", url: "https://www.peacocktv.com", flag: "US" },
  VIAPLAY: { name: "Viaplay", url: "https://www.viaplay.nl", flag: "NL" },
  LIVESOCCERTV: { name: "LiveSoccerTV", url: "https://www.livesoccertv.com", flag: "Global" },
};

// League-specific streaming options (MENA first)
export function getStreamLinks(leagueCode: string, leagueName: string): StreamLink[] {
  const links: StreamLink[] = [];
  const name = leagueName.toLowerCase();

  if (name.includes("premier")) {
    links.push(
      { name: "TOD - PL", url: "https://www.tod.tv/en/show/premier-league/1000058183", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "beIN Connect", url: "https://connect.bein.com/en/premier-league", quality: "HD", lang: "AR" },
      { name: "Shahid", url: "https://shahid.mbc.net/en/sport/premier-league", quality: "HD", lang: "AR" },
      { name: "Sky Sports", url: "https://www.skysports.com/premier-league", quality: "FHD", lang: "EN" },
      { name: "Peacock", url: "https://www.peacocktv.com/sports/premier-league", quality: "HD", lang: "EN" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("champions")) {
    links.push(
      { name: "TOD - UCL", url: "https://www.tod.tv/en/show/champions-league/1000058184", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "beIN Connect", url: "https://connect.bein.com/en/champions-league", quality: "HD", lang: "AR" },
      { name: "Shahid", url: "https://shahid.mbc.net/en/sport/champions-league", quality: "HD", lang: "AR" },
      { name: "Paramount+", url: "https://www.paramountplus.com/shows/uefa-champions-league", quality: "FHD", lang: "EN" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("serie a") || name.includes("italy")) {
    links.push(
      { name: "TOD - Serie A", url: "https://www.tod.tv/en/show/serie-a/1000058185", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "beIN Connect", url: "https://connect.bein.com/en/serie-a", quality: "HD", lang: "AR" },
      { name: "DAZN", url: "https://www.dazn.com/en-US/schedules/serie-a", quality: "FHD", lang: "EN/IT" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("bundesliga")) {
    links.push(
      { name: "TOD - BL", url: "https://www.tod.tv/en/show/bundesliga/1000058186", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "beIN Connect", url: "https://connect.bein.com/en/bundesliga", quality: "HD", lang: "AR" },
      { name: "DAZN", url: "https://www.dazn.com/en-US/schedules/bundesliga", quality: "FHD", lang: "EN/DE" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("ligue 1")) {
    links.push(
      { name: "TOD - Ligue 1", url: "https://www.tod.tv/en/show/ligue-1/1000058187", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "beIN Connect", url: "https://connect.bein.com/en/ligue-1", quality: "HD", lang: "AR" },
      { name: "DAZN", url: "https://www.dazn.com/en-US/schedules/ligue-1", quality: "FHD", lang: "EN/FR" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("la liga") || name.includes("primera")) {
    links.push(
      { name: "TOD - La Liga", url: "https://www.tod.tv/en/show/la-liga/1000058188", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "beIN Connect", url: "https://connect.bein.com/en/la-liga", quality: "HD", lang: "AR" },
      { name: "DAZN", url: "https://www.dazn.com/en-US/schedules/la-liga", quality: "FHD", lang: "EN/ES" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("eredivisie")) {
    links.push(
      { name: "Viaplay", url: "https://www.viaplay.nl/sport/voetbal/eredivisie", quality: "FHD", lang: "NL" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("primeira")) {
    links.push(
      { name: "TOD - Liga Portugal", url: "https://www.tod.tv/en/show/primeira-liga/1000058189", quality: "FHD", lang: "AR/EN", isPrimary: true },
      { name: "DAZN", url: "https://www.dazn.com/en-US/schedules/primeira-liga", quality: "FHD", lang: "EN/PT" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("championship")) {
    links.push(
      { name: "Sky Sports", url: "https://www.skysports.com/championship", quality: "FHD", lang: "EN" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else if (name.includes("brasileiro") || name.includes("brasil")) {
    links.push(
      { name: "TOD", url: "https://www.tod.tv", quality: "HD", lang: "AR", isPrimary: true },
      { name: "DAZN", url: "https://www.dazn.com/en-US/schedules/brasileirao", quality: "FHD", lang: "PT" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  } else {
    links.push(
      { name: "TOD", url: "https://www.tod.tv", quality: "HD", lang: "AR/EN", isPrimary: true },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com/schedules/2026-08-29", quality: "", lang: "" },
    );
  }

  return links;
}

// Country-based broadcaster info (for the "Where to Watch" section)
export function getMatchBroadcasters(leagueId: number, countryCode: string): Array<{ name: string; url: string }> {
  const links: Array<{ name: string; url: string }> = [];

  // MENA countries get TOD/SSC/Shahid
  if (["SA", "AE", "EG", "MA", "TN", "DZ", "IQ", "QA", "KW", "BH", "OM", "JO", "LB", "PS", "LY", "SD"].includes(countryCode)) {
    links.push(
      { name: "TOD (beIN Sports)", url: "https://www.tod.tv" },
      { name: "Shahid", url: "https://shahid.mbc.net" },
      { name: "SSC (Saudi)", url: "https://www.sbc.sa" },
    );
  } else if (countryCode === "GB") {
    links.push(
      { name: "Sky Sports", url: "https://www.skysports.com" },
      { name: "TNT Sports", url: "https://www.tnt-sports.co.uk" },
    );
  } else if (countryCode === "US") {
    links.push(
      { name: "Peacock / NBC Sports", url: "https://www.peacocktv.com" },
      { name: "Paramount+", url: "https://www.paramountplus.com" },
    );
  } else if (countryCode === "FR") {
    links.push(
      { name: "beIN Sports", url: "https://www.beinsports.com" },
      { name: "DAZN", url: "https://www.dazn.com" },
    );
  } else {
    links.push(
      { name: "TOD", url: "https://www.tod.tv" },
      { name: "LiveSoccerTV", url: "https://www.livesoccertv.com" },
    );
  }

  return links;
}
