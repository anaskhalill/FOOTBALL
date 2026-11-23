"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Fixture } from "@/lib/types";
import { getStreamLinks } from "@/lib/broadcasters";
import MatchStatus from "./MatchStatus";
import TeamLogo from "./TeamLogo";

interface MatchCardProps {
  fixture: Fixture;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(""); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setIsUrgent(h < 1);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, [targetDate]);

  return { timeLeft, isUrgent };
}

export default function MatchCard({ fixture }: MatchCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showWatchMenu, setShowWatchMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("favorites");
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) setFavorites(parsed.filter((id): id is number => typeof id === "number"));
    } catch {
      setFavorites([]);
    }
  }, []);

  const { fixture: matchInfo, teams, goals, league } = fixture;
  const status = matchInfo.status.short;
  const isNS = status === "NS";
  const isLive = ["1H", "2H", "HT", "ET", "P", "BT", "SUSP", "INT"].includes(status);
  const hasScore = ["FT", "AET", "PEN"].includes(status);
  const { timeLeft, isUrgent } = useCountdown(matchInfo.date);
  const isFav = favorites.includes(matchInfo.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = isFav ? prev.filter((id) => id !== matchInfo.id) : [...prev, matchInfo.id];
      try { localStorage.setItem("favorites", JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  };

  const streamLinks = getStreamLinks(league.name, league.name);
  const primaryLink = streamLinks[0];
  const openMatch = () => router.push(`/match/${matchInfo.id}`);

  return (
    <div
      className={`match-card ${isLive ? "is-live" : ""}`}
      onClick={openMatch}
      role="button"
      tabIndex={0}
      aria-label={`${teams.home.name} vs ${teams.away.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openMatch();
        }
      }}
    >
      {/* Top Row: League + Favourite + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
          {league.round || league.name}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={toggleFavorite} className={`star-btn ${isFav ? "active" : ""}`} aria-label={isFav ? "Remove from favourites" : "Add to favourites"} aria-pressed={isFav}>
            <svg className="w-3.5 h-3.5" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <MatchStatus short={status} elapsed={matchInfo.status.elapsed} extra={matchInfo.status.extra} />
        </div>
      </div>

      {/* Teams + score / countdown */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamLogo src={teams.home.logo} alt={teams.home.name} teamId={teams.home.id} size={72} className="sm:hidden" />
          <TeamLogo src={teams.home.logo} alt={teams.home.name} teamId={teams.home.id} size={80} className="hidden sm:block" />
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] text-center truncate max-w-[80px] leading-tight">
            {teams.home.name}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[90px]">
          {isNS && mounted && timeLeft ? (
            <>
              <div className={`countdown text-lg ${isUrgent ? "urgent-countdown" : ""}`}>
                {timeLeft}
              </div>
              <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest font-bold">starts in</span>
            </>
          ) : (isLive || hasScore) ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tabular-nums">{goals.home ?? "-"}</span>
              <span className="text-base text-[var(--text-muted)] font-light">-</span>
              <span className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tabular-nums">{goals.away ?? "-"}</span>
            </div>
          ) : (
            <span className="text-sm font-bold text-[var(--text-muted)]">VS</span>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <TeamLogo src={teams.away.logo} alt={teams.away.name} teamId={teams.away.id} size={72} className="sm:hidden" />
          <TeamLogo src={teams.away.logo} alt={teams.away.name} teamId={teams.away.id} size={80} className="hidden sm:block" />
          <span className="text-[10px] font-semibold text-[var(--text-secondary)] text-center truncate max-w-[80px] leading-tight">
            {teams.away.name}
          </span>
        </div>
      </div>

      {/* Watch + stream info */}
      {mounted && (
        <div className="mt-3 flex items-center justify-between gap-2">
          {primaryLink && (
            <div className="flex items-center gap-1.5 min-w-0">
              {primaryLink.quality && (
                <span className="text-[8px] font-bold gold-soft text-[var(--accent-gold)] px-1.5 py-0.5 ">
                  {primaryLink.quality}
                </span>
              )}
              {primaryLink.lang && (
                <span className="text-[8px] font-bold px-1.5 py-0.5  text-[var(--accent-emerald)] emerald-soft">
                  {primaryLink.lang}
                </span>
              )}
              <span className="text-[9px] text-[var(--text-muted)] truncate">{primaryLink.name}</span>
            </div>
          )}

          <div className="relative flex-shrink-0">
            <button
              className="watch-btn text-[9px] px-3 py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                if (streamLinks.length === 1) {
                  window.open(streamLinks[0].url, "_blank", "noopener,noreferrer");
                } else {
                  setShowWatchMenu(!showWatchMenu);
                }
              }}
              aria-expanded={showWatchMenu}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              {isLive ? "Watch now" : "Watch"}
            </button>

            {showWatchMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowWatchMenu(false)} />
                <div className="absolute bottom-full mb-2 right-0 card z-50 overflow-hidden shadow-2xl min-w-[200px]">
                  <div className="px-3 py-2 border-b border-[var(--border-color)]">
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Stream options</span>
                  </div>
                  {streamLinks.map((link, idx) => (
                    <a
                      key={`${link.name}-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-[var(--bg-card-hover)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <div>
                          <span className="text-[10px] font-medium text-[var(--text-primary)] block">{link.name}</span>
                          {link.quality && <span className="text-[8px] text-[var(--text-muted)]">{link.quality} {link.lang}</span>}
                        </div>
                      </div>
                      {link.isPrimary && (
                        <span className="text-[7px] font-bold text-[var(--accent-emerald)] emerald-soft px-1.5 py-0.5 ">BEST</span>
                      )}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
