import { NextRequest, NextResponse } from "next/server";
import { getSeasonForDate, getStandings } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const leagueId = searchParams.get("league");
    const seasonParam = searchParams.get("season");

    if (!leagueId) {
      return NextResponse.json({ success: false, error: "League ID is required" }, { status: 400 });
    }

    const parsedSeason = seasonParam ? parseInt(seasonParam, 10) : NaN;
    const season = Number.isNaN(parsedSeason) ? getSeasonForDate() : parsedSeason;
    const standings = await getStandings(parseInt(leagueId, 10), season);

    if (!standings) {
      return NextResponse.json(
        { success: false, error: "This competition is not available on the current API plan.", standings: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, standings, season, timestamp: Date.now() });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch standings", standings: null }, { status: 500 });
  }
}
