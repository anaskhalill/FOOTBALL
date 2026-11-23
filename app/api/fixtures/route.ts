import { NextRequest, NextResponse } from "next/server";
import { getFixturesByDate, groupFixturesByLeague } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    const dateStr = date || new Date().toISOString().split("T")[0];
    const fixtures = await getFixturesByDate(dateStr);
    const grouped = groupFixturesByLeague(fixtures);

    return NextResponse.json({ success: true, fixtures, grouped, timestamp: Date.now() });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { success: true, fixtures: [], grouped: [], timestamp: Date.now() },
      { status: 200 }
    );
  }
}
