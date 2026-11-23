"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import StandingsTable from "@/components/StandingsTable";
import TeamLogo from "@/components/TeamLogo";
import ErrorState from "@/components/ErrorState";
import { LEAGUES, getLeagueInfo } from "@/lib/leagues";

export default function StandingsPage() {
  const { t } = useTranslation();
  const [selectedLeague, setSelectedLeague] = useState(2021);
  const [standingsData, setStandingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/standings?league=${selectedLeague}`);
        const data = await res.json();
        if (data.success && data.standings) { setStandingsData(data.standings); setError(null); }
        else setError(data.error || t("common.error"));
      } catch { setError(t("common.error")); }
      setLoading(false);
    };
    fetchStandings();
  }, [selectedLeague, t]);

  const leagueInfo = getLeagueInfo(selectedLeague);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-3">
      <div className="hero-band">
        <div className="page-heading">
          <span className="eyebrow">✦ &nbsp; {t("standings.leagueTable")}</span>
          <h1>{t("standings.title")}</h1>
          <p>{t("standings.subtitle")}</p>
        </div>
      </div>

      <div className="card p-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-0.5" role="tablist" aria-label={t("standings.selectCompetition")}>
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              role="tab"
              aria-selected={selectedLeague === league.id}
              title={league.available ? league.name : `${league.name} — not available on current API plan`}
              onClick={() => setSelectedLeague(league.id)}
              className={`flex-shrink-0 px-3 py-2  text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedLeague === league.id
                  ? "text-[#1a1409] shadow-md"
                  : league.available
                    ? "text-[var(--text-muted)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-card-hover)]"
                    : "text-[var(--text-muted-light)] opacity-60 hover:text-[var(--accent-gold)]"
              }`}
              style={selectedLeague === league.id ? { background: "linear-gradient(135deg, var(--accent-gold-light), var(--accent-gold))" } : undefined}
            >
              {league.icon}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="card p-4 animate-pulse">
          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--border-color)] last:border-b-0">
              <div className="w-4 h-3 shimmer " />
              <div className="w-5 h-5 shimmer " />
              <div className="h-2.5 w-28 shimmer  flex-1" />
              <div className="h-2.5 w-5 shimmer " />
            </div>
          ))}
        </div>
      )}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && standingsData && (
        <div className="space-y-3">
          <div className="card p-3 flex items-center gap-3">
            {standingsData.competition?.emblem && (
              <TeamLogo src={standingsData.competition.emblem} alt={standingsData.competition.name} size={32} kind="competition" />
            )}
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">{standingsData.competition?.name || leagueInfo?.name}</h2>
              <p className="text-[10px] text-[var(--text-muted)]">{leagueInfo?.country}</p>
            </div>
            <Link href="/" className="ml-auto text-[10px] font-semibold text-[var(--accent-gold)] hover:text-[var(--accent-gold-light)]">
              {t("standings.matchesLink")} →
            </Link>
          </div>
          {standingsData.standings?.map((group: any, groupIdx: number) => (
            group.table?.length > 0 && <StandingsTable key={groupIdx} standings={group.table} leagueId={selectedLeague} />
          ))}
        </div>
      )}
    </div>
  );
}
