"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { LeagueGroup as LeagueGroupType, Fixture } from "@/lib/types";
import { groupFixturesByLeague, isMatchLive } from "@/lib/api";
import { toDateLocale, toLocalDateString } from "@/lib/date";
import { usePolling } from "@/hooks/usePolling";
import DateNavigator from "@/components/DateNavigator";
import LeagueGroup from "@/components/LeagueGroup";
import { PageSkeleton } from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";

function HomeContent() {
  const { t, i18n } = useTranslation();
  const locale = toDateLocale(i18n.resolvedLanguage || i18n.language);
  const searchParams = useSearchParams();
  const teamFilter = searchParams.get("team");

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [grouped, setGrouped] = useState<LeagueGroupType[]>([]);
  const [allFixtures, setAllFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchFixtures = useCallback(async () => {
    try {
      const res = await fetch(`/api/fixtures?date=${toLocalDateString(selectedDate)}`);
      const data = await res.json();

      if (data.success) {
        let fixtures: Fixture[] = data.fixtures || [];
        if (teamFilter) {
          fixtures = fixtures.filter(
            (f) =>
              f.teams.home.id.toString() === teamFilter ||
              f.teams.away.id.toString() === teamFilter
          );
        }
        setAllFixtures(fixtures);
        setGrouped(groupFixturesByLeague(fixtures));
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(data.error || "Failed to load matches");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, teamFilter]);

  const hasLiveMatches = allFixtures.some((f) => isMatchLive(f.fixture.status.short));
  const { lastUpdated: pollLastUpdated, refreshNow } = usePolling(fetchFixtures, {
    interval: 30000,
    enabled: hasLiveMatches,
  });

  useEffect(() => {
    setLoading(true);
    fetchFixtures();
  }, [fetchFixtures]);

  const liveCount = allFixtures.filter((f) => isMatchLive(f.fixture.status.short)).length;
  const finishedCount = allFixtures.filter((f) =>
    ["FT", "AET", "PEN"].includes(f.fixture.status.short)
  ).length;
  const upcomingCount = allFixtures.filter((f) => f.fixture.status.short === "NS").length;

  const isToday = mounted && toLocalDateString(selectedDate) === toLocalDateString(new Date());
  const dateLabel = mounted
    ? isToday
      ? t("date.today")
      : selectedDate.toLocaleDateString(locale, {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })
    : "";

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-3">
      <div className="hero-band">
        <div className="page-heading">
          <span className="eyebrow">✦ &nbsp; {t("home.subtitle")}</span>
          <h1>{t("home.title")}</h1>
          <p>{dateLabel || "\u00a0"}</p>
        </div>
        {mounted && (
          <div className="hero-meta">
            {(lastUpdated || pollLastUpdated) && (
              <span className="text-[10px] text-[var(--text-muted)]">
                {t("home.lastUpdated")}: {(pollLastUpdated || lastUpdated)!.toLocaleTimeString()}
              </span>
            )}
            <button onClick={refreshNow} className="icon-btn !w-8 !h-8" aria-label={t("common.refresh")} title={t("common.refresh")}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 11-3-6.7L21 8M21 3v5h-5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {!loading && allFixtures.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap px-1">
          {liveCount > 0 && (
            <span className="badge-live">{liveCount} {t("match.live")}</span>
          )}
          {finishedCount > 0 && (
            <span className="text-[11px] text-[var(--text-muted)]">
              {finishedCount} {t("match.finished").toLowerCase()}
            </span>
          )}
          {upcomingCount > 0 && (
            <span className="text-[11px] text-[var(--text-muted)]">
              {upcomingCount} {t("match.notStarted").toLowerCase()}
            </span>
          )}
        </div>
      )}

      {loading && <PageSkeleton />}

      {error && !loading && <ErrorState message={error} onRetry={fetchFixtures} />}

      {!loading && !error && grouped.length === 0 && (
        <div className="card p-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3  emerald-soft flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path strokeWidth="1.5" d="M12 2a10 10 0 0110 10M12 2a10 10 0 00-10 10M12 2v20M2 12h20" />
            </svg>
          </div>
          <p className="text-sm text-[var(--text-muted)]">{t("home.noMatches")}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {grouped.map((group) => (
            <LeagueGroup key={group.league.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
