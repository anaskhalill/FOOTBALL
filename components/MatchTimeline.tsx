"use client";

import { useTranslation } from "react-i18next";
import { MatchEvent } from "@/lib/types";

interface MatchTimelineProps {
  events: MatchEvent[];
}

function GoalIcon() {
  return (
    <svg className="w-4 h-4 text-[var(--accent-emerald)]" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fillOpacity="0.18" />
      <circle cx="10" cy="10" r="4" />
    </svg>
  );
}

function YellowCardIcon() {
  return <div className="w-3 h-4  bg-[var(--accent-gold)]" />;
}

function RedCardIcon() {
  return <div className="w-3 h-4  bg-[var(--red-card)]" />;
}

function SubInIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[var(--accent-emerald)]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
  );
}

function SubOutIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[var(--red-card)]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}

export default function MatchTimeline({ events }: MatchTimelineProps) {
  const { t } = useTranslation();

  if (!events || events.length === 0) return null;

  const sortedEvents = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

  return (
    <section className="card p-4">
      <h3 className="section-title mb-4">
        <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        {t("match.timeline")}
      </h3>

      <ol className="space-y-3">
        {sortedEvents.map((event, idx) => {
          const minute = event.time.elapsed;
          const extra = event.time.extra;
          const isCard = event.type === "Card";
          const isYellow = isCard && (event.detail || "").toLowerCase().includes("yellow");

          return (
            <li key={`${event.type}-${idx}`} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 text-right">
                <span className="text-[11px] font-bold text-[var(--accent-gold)] tabular-nums">
                  {minute}{extra && extra > 0 ? `+${extra}` : ""}'
                </span>
              </div>

              <div className="flex-shrink-0 mt-0.5">
                {event.type === "Goal" && <GoalIcon />}
                {isCard && (isYellow ? <YellowCardIcon /> : <RedCardIcon />)}
                {event.type === "subst" && <SubInIcon />}
                {event.type === "Var" && (
                  <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                )}
                {event.type === "Other" && <span className="block w-1.5 h-1.5  bg-[var(--text-muted)] mt-1.5" />}
              </div>

              <div className="flex-1 min-w-0">
                {event.type === "Goal" && (
                  <div>
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{event.player.name}</span>
                    {event.assist?.name && (
                      <span className="text-[11px] text-[var(--text-muted)] ml-1">(a. {event.assist.name})</span>
                    )}
                    <span className="text-[10px] text-[var(--text-muted)] block">{event.team.name}</span>
                  </div>
                )}
                {isCard && (
                  <div>
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{event.player.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block">{event.detail} · {event.team.name}</span>
                  </div>
                )}
                {event.type === "subst" && (
                  <div className="text-[11px]">
                    <div className="flex items-center gap-1 text-[var(--accent-emerald)]">
                      <SubInIcon /> <span className="font-medium">{event.player.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--red-card)] mt-0.5">
                      <SubOutIcon /> <span className="font-medium">{event.assist?.name || "—"}</span>
                    </div>
                    <span className="text-[var(--text-muted)] block">{event.team.name}</span>
                  </div>
                )}
                {(event.type === "Var" || event.type === "Other") && (
                  <div>
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{event.detail}</span>
                    {(event.player.name || event.team.name) && (
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        {[event.player.name, event.team.name].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
