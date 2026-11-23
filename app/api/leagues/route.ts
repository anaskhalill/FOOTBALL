import { NextRequest, NextResponse } from "next/server";
import { LEAGUES } from "@/lib/leagues";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const search = (request.nextUrl.searchParams.get("search") || "").trim().toLowerCase();
  const leagues = search
    ? LEAGUES.filter(
        (league) =>
          league.name.toLowerCase().includes(search) ||
          league.country.toLowerCase().includes(search) ||
          league.code.toLowerCase().includes(search)
      )
    : LEAGUES;

  return NextResponse.json({ success: true, leagues });
}
