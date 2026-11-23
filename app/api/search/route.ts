import { NextRequest, NextResponse } from "next/server";
import { AVAILABLE_LEAGUE_CODES } from "@/lib/leagues";
import { getTeamsForLeagues, searchLeagues } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") || "";

    if (query.trim().length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const needle = query.trim().toLowerCase();
    const [teams, leagues] = await Promise.all([
      getTeamsForLeagues(AVAILABLE_LEAGUE_CODES),
      Promise.resolve(searchLeagues(needle)),
    ]);

    const results = [
      ...teams
        .filter((team) => team.name.toLowerCase().includes(needle))
        .slice(0, 8)
        .map((team) => ({ type: "team", ...team })),
      ...leagues.slice(0, 5),
    ];

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}
