"use client";

import { Suspense, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import StandingsTable from "@/components/StandingsTable";
import TeamLogo from "@/components/TeamLogo";
import { PageSkeleton } from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import { getLeagueInfo } from "@/lib/leagues";

function LeagueStandings() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const leagueId = params?.leagueId as string;
  const season = searchParams.get("season") || "";

  const [standingsData, setStandingsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ league: leagueId });
        if (season) query.set("season", season);
        const res = await fetch(`/api/standings?${query.toString()}`);
        const data = await res.json();
        if (data.success && data.standings) { setStandingsData(data.standings); setError(null); }
        else setError(data.error || t("common.error"));
      } catch { setError(t("common.error")); }
      setLoading(false);
    };
    fetchStandings();
  }, [leagueId, season, t]);

  if (loading) return <PageSkeleton />;
  if (error || !standingsData) return <ErrorState message={error || t("common.error")} />;

  const info = getLeagueInfo(parseInt(leagueId, 10));

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-3">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
        <svg className="w-3.5 h-3.5 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
        {t("common.back")}
      </button>

      <div className="hero-band">
        <div className="page-heading">
          <span className="eyebrow">✦ &nbsp; {info?.country || t("standings.competition")}</span>
          <h1>{standingsData.competition?.name || info?.name || t("standings.title")}</h1>
          <p>{standingsData.season
            ? t("standings.season", { season: standingsData.season, next: String(standingsData.season + 1).slice(-2) })
            : t("standings.leagueTable")}</p>
        </div>
        {standingsData.competition?.emblem && (
          <TeamLogo src={standingsData.competition.emblem} alt={standingsData.competition.name} size={40} kind="competition" />
        )}
      </div>

      {standingsData.standings?.map((group: any, groupIdx: number) => (
        group.table?.length > 0 && <StandingsTable key={groupIdx} standings={group.table} leagueId={parseInt(leagueId, 10)} />
      ))}
    </div>
  );
}

export default function LeagueStandingsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LeagueStandings />
    </Suspense>
  );
}
