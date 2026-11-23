import { NextRequest, NextResponse } from "next/server";
import { getFixtureDetails } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fixtureId = parseInt(params.id, 10);
    if (isNaN(fixtureId)) {
      return NextResponse.json({ success: false, error: "Invalid fixture ID" }, { status: 400 });
    }

    const fixture = await getFixtureDetails(fixtureId);
    if (!fixture) {
      return NextResponse.json({ success: false, error: "Fixture not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, fixture, timestamp: Date.now() });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch fixture details" }, { status: 500 });
  }
}
