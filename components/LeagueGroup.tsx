"use client";

import Link from "next/link";
import { LeagueGroup as LeagueGroupType } from "@/lib/types";
import MatchCard from "./MatchCard";
import TeamLogo from "./TeamLogo";

interface LeagueGroupProps {
  group: LeagueGroupType;
}

export default function LeagueGroup({ group }: LeagueGroupProps) {
  const { league, fixtures } = group;
  const liveCount = fixtures.filter((fixture) =>
    ["1H", "2H", "HT", "ET", "P", "BT", "SUSP", "INT"].includes(fixture.fixture.status.short)
  ).length;

  return (
    <section className="card overflow-hidden">
      <div className="league-header flex items-center gap-2">
        {league.logo && <TeamLogo src={league.logo} alt={league.name} size={24} kind="competition" />}
        <Link
          href={`/standings/${league.id}`}
          className="text-sm font-bold text-[var(--accent-gold)] hover:text-[var(--accent-gold-light)] transition-colors"
        >
          {league.name}
        </Link>
        <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">{league.country}</span>
        {liveCount > 0 && (
          <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--live-text)] emerald-soft px-1.5 py-0.5 ">
            {liveCount} live
          </span>
        )}
        <span className="text-[10px] text-[var(--text-muted)] ml-auto hidden sm:inline">{league.round}</span>
      </div>
      <div className="space-y-2 p-2">
        {fixtures.map((fixture) => (
          <MatchCard key={fixture.fixture.id} fixture={fixture} />
        ))}
      </div>
    </section>
  );
}
