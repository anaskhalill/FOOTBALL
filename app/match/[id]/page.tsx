"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Fixture } from "@/lib/types";
import { isMatchLive } from "@/lib/api";
import { toDateLocale } from "@/lib/date";
import { usePolling } from "@/hooks/usePolling";
import { getStreamLinks } from "@/lib/broadcasters";
import TeamLogo from "@/components/TeamLogo";
import MatchStatus from "@/components/MatchStatus";
import MatchStats from "@/components/MatchStats";
import MatchTimeline from "@/components/MatchTimeline";
import LineupDisplay from "@/components/LineupDisplay";
import Broadcasters from "@/components/Broadcasters";
import CountrySelector from "@/components/CountrySelector";
import { PageSkeleton } from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(""); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [targetDate]);
  return timeLeft;
}

function readFavorites(): number[] {
  try {
    const stored = localStorage.getItem("favorites");
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale = toDateLocale(i18n.resolvedLanguage || i18n.language);
  const fixtureId = params?.id as string;

  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("GB");
  const [mounted, setMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsFavorite(readFavorites().includes(parseInt(fixtureId, 10)));
    const saved = localStorage.getItem("broadcastCountry");
    if (saved) setCountryCode(saved);
  }, [fixtureId]);

  const fetchFixture = useCallback(async () => {
    try {
      const res = await fetch(`/api/fixtures/${fixtureId}`);
      const data = await res.json();
      if (data.success) { setFixture(data.fixture); setError(null); }
      else setError(data.error || "Match not found");
    } catch { setError("Network error"); }
    setLoading(false);
  }, [fixtureId]);

  const isLive = fixture ? isMatchLive(fixture.fixture.status.short) : false;
  const isNS = fixture?.fixture.status.short === "NS";
  const countdown = useCountdown(fixture?.fixture.date || "");
  usePolling(fetchFixture, { interval: 30000, enabled: isLive });
  useEffect(() => { fetchFixture(); }, [fetchFixture]);

  const toggleFavorite = () => {
    const next = isFavorite
      ? readFavorites().filter((id) => id !== parseInt(fixtureId, 10))
      : [...readFavorites(), parseInt(fixtureId, 10)];
    try { localStorage.setItem("favorites", JSON.stringify(next)); } catch { /* storage unavailable */ }
    setIsFavorite(!isFavorite);
  };

  if (loading) return <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4"><PageSkeleton /></div>;
  if (error || !fixture) return <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4"><ErrorState message={error || "Match not found"} onRetry={fetchFixture} /></div>;

  const { fixture: matchInfo, league, teams, goals } = fixture;
  const primaryStream = getStreamLinks(league.name, league.name)[0];

  const timeStr = mounted
    ? new Date(matchInfo.date).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    : "";
  const dateStr = mounted
    ? new Date(matchInfo.date).toLocaleDateString(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";
  const hasScore = ["FT", "AET", "PEN"].includes(matchInfo.status.short);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-3">
      {/* Back + Favourite */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
          <svg className="w-3.5 h-3.5 rtl-flip" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M15 19l-7-7 7-7" /></svg>
          {t("common.back")}
        </button>
        <button onClick={toggleFavorite} className={`star-btn ${isFavorite ? "active" : ""}`} aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"} aria-pressed={isFavorite}>
          <svg className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      {/* Match header */}
      <section className="card p-5 sm:p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-5 justify-center">
          {league.logo && <TeamLogo src={league.logo} alt={league.name} size={24} kind="competition" />}
          <span className="text-[11px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">{league.name}</span>
          <span className="text-[10px] text-[var(--text-muted)]">{league.round}</span>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-12">
          <div className="flex flex-col items-center gap-3 min-w-0 max-w-[120px] sm:max-w-[160px]">
            <TeamLogo src={teams.home.logo} alt={teams.home.name} teamId={teams.home.id} size={80} className="sm:hidden" />
            <TeamLogo src={teams.home.logo} alt={teams.home.name} teamId={teams.home.id} size={96} className="hidden sm:block" />
            <span className="text-[12px] sm:text-sm font-bold text-[var(--text-primary)] text-center">{teams.home.name}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            {(isLive || hasScore) ? (
              <div className="flex items-center gap-3">
                <span className="score-large">{goals.home ?? "-"}</span>
                <span className="text-xl text-[var(--text-muted)] font-light">-</span>
                <span className="score-large">{goals.away ?? "-"}</span>
              </div>
            ) : isNS && mounted && countdown ? (
              <div className="text-center">
                <div className="countdown text-2xl">{countdown}</div>
                <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest mt-1 block">{t("match.untilKickoff")}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-[var(--text-muted)]">VS</span>
            )}
            <MatchStatus short={matchInfo.status.short} elapsed={matchInfo.status.elapsed} extra={matchInfo.status.extra} />
          </div>

          <div className="flex flex-col items-center gap-3 min-w-0 max-w-[120px] sm:max-w-[160px]">
            <TeamLogo src={teams.away.logo} alt={teams.away.name} teamId={teams.away.id} size={80} className="sm:hidden" />
            <TeamLogo src={teams.away.logo} alt={teams.away.name} teamId={teams.away.id} size={96} className="hidden sm:block" />
            <span className="text-[12px] sm:text-sm font-bold text-[var(--text-primary)] text-center">{teams.away.name}</span>
          </div>
        </div>

        {mounted && (
          <div className="mt-5 text-center space-y-1 border-t border-[var(--border-color)] pt-4">
            <p className="text-[11px] text-[var(--text-muted)]">{dateStr} · {timeStr}</p>
            {matchInfo.referee && <p className="text-[10px] text-[var(--text-muted)]">{t("match.referee")}: {matchInfo.referee}</p>}
          </div>
        )}
      </section>

      {/* Watch live */}
      {mounted && (isLive || isNS) && primaryStream && (
        <a
          href={primaryStream.url}
          target="_blank"
          rel="noopener noreferrer"
          className="watch-btn w-full justify-center text-center py-3"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          {isLive ? t("match.watchLive") : `${t("match.findBroadcast")} · ${primaryStream.name}`}
        </a>
      )}

      {/* Match details */}
      <section className="card p-4 space-y-3">
        <h3 className="section-title">
          <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          {t("match.details")}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="space-y-2">
            <div><span className="text-[var(--text-muted)]">{t("match.competition")}</span><p className="font-medium text-[var(--text-primary)]">{league.name}</p></div>
            <div><span className="text-[var(--text-muted)]">{t("match.matchday")}</span><p className="font-medium text-[var(--text-primary)]">{league.round || "—"}</p></div>
            {matchInfo.referee && <div><span className="text-[var(--text-muted)]">{t("match.referee")}</span><p className="font-medium text-[var(--text-primary)]">{matchInfo.referee}</p></div>}
          </div>
          <div className="space-y-2">
            <div><span className="text-[var(--text-muted)]">{t("match.date")}</span><p className="font-medium text-[var(--text-primary)]">{dateStr || "—"}</p></div>
            <div><span className="text-[var(--text-muted)]">{t("match.kickoff")}</span><p className="font-medium text-[var(--text-primary)]">{timeStr || "—"}</p></div>
          </div>
        </div>
      </section>

      <MatchTimeline events={fixture.events || []} />
      <MatchStats statistics={fixture.statistics || []} />
      <LineupDisplay lineups={fixture.lineups || []} />

      {/* Where to watch */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow">✦ &nbsp; {t("match.broadcastGuide")}</span>
          <CountrySelector selectedCountry={countryCode} onSelect={(code) => {
            setCountryCode(code);
            try { localStorage.setItem("broadcastCountry", code); } catch { /* storage unavailable */ }
          }} />
        </div>
        <Broadcasters leagueId={league.id} countryCode={countryCode} />
      </section>
    </div>
  );
}
