"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface TeamLogoProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  /** Official football-data.org team id. Always used for club crests. */
  teamId?: number;
  /** Competition emblems use the same PNG proxy, keyed by emblem file name. */
  kind?: "club" | "competition";
}

const CREST_ROUTE = "/api/crest";

function crestPng(teamId?: number): string | null {
  return teamId && Number.isFinite(teamId) && teamId > 0
    ? `${CREST_ROUTE}/${teamId}.png`
    : null;
}

function isPngSource(src: string): boolean {
  return /\.png(?:\?|$)/i.test(src) || src.startsWith("data:image/png");
}

function teamIdFromPngCrest(src: string): number | undefined {
  const match = src.match(/(?:api\/crest\/|crests\.football-data\.org\/)(\d+)\.png(?:\?|$)/i);
  if (!match) return undefined;
  const id = parseInt(match[1], 10);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

function proxiedCompetitionPng(src: string): string | null {
  const match = src.match(/(?:api\/crest\/|crests\.football-data\.org\/)([A-Za-z0-9]{1,10}\.png)(?:\?|$)/i);
  return match ? `${CREST_ROUTE}/${match[1]}` : null;
}

export default function TeamLogo({
  src,
  alt,
  size = 28,
  className = "",
  teamId,
  kind = "club",
}: TeamLogoProps) {
  const [failed, setFailed] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (kind === "competition") return proxiedCompetitionPng(src) ?? src ?? null;

    // A club crest is always built from the official team id and always PNG.
    const officialId = teamId ?? teamIdFromPngCrest(src);
    return crestPng(officialId) ?? (isPngSource(src) ? src : null);
  }, [kind, teamId, src]);

  useEffect(() => {
    setFailed(false);
  }, [resolvedSrc]);

  if (!resolvedSrc || failed) {
    return (
      <div
        className={`relative flex-shrink-0 bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: size, height: size }}
        aria-label={alt}
      >
        <span className="text-[var(--text-muted)] font-bold leading-none" style={{ fontSize: size * 0.35 }}>
          {alt.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image
        src={resolvedSrc}
        alt={alt}
        width={200}
        height={200}
        className="object-contain logo-3d"
        style={{ width: size, height: size }}
        loading="eager"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
