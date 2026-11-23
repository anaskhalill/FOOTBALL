"use client";

import { useTranslation } from "react-i18next";
import { MatchLineups } from "@/lib/types";
import TeamLogo from "./TeamLogo";

interface LineupDisplayProps {
  lineups: MatchLineups[];
}

export default function LineupDisplay({ lineups }: LineupDisplayProps) {
  const { t } = useTranslation();

  if (!lineups || lineups.length === 0) return null;

  return (
    <section className="card p-4">
      <h3 className="section-title mb-4">
        <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
        {t("match.lineups")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lineups.map((lineup) => {
          const starters = [...(lineup.startXI || [])].sort((a, b) => {
            const posOrder: Record<string, number> = { G: 0, D: 1, M: 2, F: 3 };
            const posA = (a.player.pos || "").charAt(0);
            const posB = (b.player.pos || "").charAt(0);
            return (posOrder[posA] ?? 9) - (posOrder[posB] ?? 9) || a.player.number - b.player.number;
          });

          return (
            <div key={lineup.team.id} className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-color)]">
                <TeamLogo src={lineup.team.logo} alt={lineup.team.name} teamId={lineup.team.id} size={20} />
                <span className="text-[12px] font-bold text-[var(--text-primary)]">{lineup.team.name}</span>
                {lineup.formation && (
                  <span className="text-[10px] text-[var(--accent-gold)] gold-soft px-1.5 py-0.5  ml-auto">
                    {lineup.formation}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[9px] font-bold text-[var(--accent-gold)] uppercase tracking-widest">Starting XI</span>
                <div className="mt-1.5 space-y-0.5">
                  {starters.map((p) => (
                    <div key={p.player.id} className="flex items-center gap-1.5 py-0.5">
                      <span className="w-5 text-[9px] font-bold text-[var(--accent-gold)] tabular-nums text-right">{p.player.number}</span>
                      <span className="text-[11px] font-medium text-[var(--text-primary)]">{p.player.name}</span>
                      {p.player.pos && <span className="text-[9px] text-[var(--text-muted)]">{p.player.pos}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {lineup.substitutes.length > 0 && (
                <div>
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{t("match.substitutions")}</span>
                  <div className="mt-1 space-y-0">
                    {lineup.substitutes.map((p) => (
                      <div key={p.player.id} className="flex items-center gap-1.5 py-0.5">
                        <span className="w-5 text-[9px] font-bold text-[var(--text-muted)] tabular-nums text-right">{p.player.number}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{p.player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lineup.coach && (
                <div className="pt-1.5 border-t border-[var(--border-color)]">
                  <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                    Coach: <span className="font-medium normal-case text-[var(--text-secondary)]">{lineup.coach.name}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
