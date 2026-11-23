import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CREST_HOST = "https://crests.football-data.org";
const SAFE_FILE = /^[A-Za-z0-9]{1,10}\.png$/i;

// Serve official football-data.org PNG crests through our own origin.
// This guarantees a PNG response, keeps the club id explicit, and avoids
// browser/network restrictions on third-party image hosts.
export async function GET(
  _request: NextRequest,
  { params }: { params: { file: string } }
) {
  const file = params.file;

  if (!SAFE_FILE.test(file)) {
    return new Response("Invalid crest", { status: 400 });
  }

  try {
    const upstream = await fetch(`${CREST_HOST}/${file}`, {
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new Response("Crest not found", {
        status: upstream.status === 404 ? 404 : 502,
      });
    }

    return new Response(await upstream.arrayBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response("Crest unavailable", { status: 502 });
  }
}
