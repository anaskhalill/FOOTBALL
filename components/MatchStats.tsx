"use client";

import { useTranslation } from "react-i18next";
import { MatchStatistics } from "@/lib/types";

interface MatchStatsProps {
  statistics: MatchStatistics[];
}

const STAT_TRANSLATIONS: Record<string, string> = {
  "Ball Possession": "match.possession",
  "Total Shots": "match.shots",
  "Shots on Goal": "match.shotsOnTarget",
  "Corner Kicks": "match.corners",
  "Offsides": "match.offsides",
  "Fouls": "match.fouls",
  "Yellow Cards": "match.yellowCards",
  "Red Cards": "match.redCards",
};

export default function MatchStats({ statistics }: MatchStatsProps) {
  const { t } = useTranslation();

  if (!statistics || statistics.length < 2) return null;

  const homeStats = statistics[0];
  const awayStats = statistics[1];
  const statKeys = homeStats.statistics.map((s) => s.type);

  const relevantStats = [
    "Ball Possession", "Total Shots", "Shots on Goal", "Corner Kicks",
    "Offsides", "Fouls", "Yellow Cards", "Red Cards",
  ].filter((key) => statKeys.includes(key));

  if (relevantStats.length === 0) return null;

  return (
    <section className="card p-4">
      <h3 className="section-title mb-4">
        <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {t("match.stats")}
      </h3>

      <div className="space-y-3">
        {relevantStats.map((statType) => {
          const homeValue = homeStats.statistics.find((s) => s.type === statType)?.value ?? "0";
          const awayValue = awayStats.statistics.find((s) => s.type === statType)?.value ?? "0";
          const homeNum = parseInt(String(homeValue).replace("%", ""), 10) || 0;
          const awayNum = parseInt(String(awayValue).replace("%", ""), 10) || 0;
          const total = homeNum + awayNum;
          const homePercent = total > 0 ? (homeNum / total) * 100 : 50;
          const translationKey = STAT_TRANSLATIONS[statType];

          return (
            <div key={statType}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-[var(--text-primary)] w-12 text-right tabular-nums">{homeValue}</span>
                <span className="text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex-shrink-0 mx-2 text-center">
                  {translationKey ? t(translationKey) : statType}
                </span>
                <span className="text-[12px] font-semibold text-[var(--text-primary)] w-12 tabular-nums">{awayValue}</span>
              </div>
              <div className="flex h-1.5 overflow-hidden  bg-[var(--bg-secondary)]">
                <div className="stat-bar-home transition-all duration-500" style={{ width: `${homePercent}%` }} />
                <div className="stat-bar-away transition-all duration-500 flex-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
