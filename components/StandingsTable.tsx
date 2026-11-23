"use client";

import { useTranslation } from "react-i18next";
import { FDStandingEntry } from "@/lib/types";
import { normalizeStandings } from "@/lib/standings";
import TeamLogo from "./TeamLogo";

interface StandingsTableProps {
  standings: FDStandingEntry[];
  leagueId?: number;
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  const { t } = useTranslation();
  const rows = normalizeStandings(standings);
  const relegationStart = Math.max(rows.length - 2, 1);

  return (
    <section className="card overflow-hidden overflow-x-auto scrollbar-thin">
      <table className="standings-table">
        <thead>
          <tr>
            <th className="w-7 text-center">#</th>
            <th>{t("standings.team")}</th>
            <th className="text-center">{t("standings.played")}</th>
            <th className="text-center hidden sm:table-cell">{t("standings.won")}</th>
            <th className="text-center hidden sm:table-cell">{t("standings.drawn")}</th>
            <th className="text-center hidden sm:table-cell">{t("standings.lost")}</th>
            <th className="text-center hidden md:table-cell">{t("standings.goalsFor")}</th>
            <th className="text-center hidden md:table-cell">{t("standings.goalsAgainst")}</th>
            <th className="text-center">{t("standings.goalDifference")}</th>
            <th className="text-center font-bold text-[var(--accent-gold)]">{t("standings.points")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry) => (
            <tr key={entry.team.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
              <td className="text-center">
                <span className={`text-[11px] font-bold ${
                  entry.rank === 1
                    ? "text-[var(--accent-gold-light)]"
                    : entry.rank <= 4
                      ? "text-[var(--accent-gold)]"
                      : entry.rank >= relegationStart
                        ? "text-[var(--red-card)]"
                        : "text-[var(--text-muted)]"
                }`}>
                  {entry.rank}
                </span>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <TeamLogo src={entry.team.logo} alt={entry.team.name} teamId={entry.team.id} size={20} />
                  <div>
                    <span className="text-[12px] font-medium text-[var(--text-primary)]">{entry.team.name}</span>
                    {entry.form && (
                      <div className="flex gap-0.5 mt-0.5">
                        {entry.form.split("").slice(-5).map((result, idx) => (
                          <span
                            key={idx}
                            className={`inline-block w-3 h-3 text-[7px] font-bold flex items-center justify-center  ${
                              result === "W" ? "bg-[var(--accent-emerald)] text-[#0a140e]"
                                : result === "D" ? "bg-[var(--accent-gold)] text-[#1a1409]"
                                  : "bg-[var(--red-card)] text-white"
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="text-center text-[12px] tabular-nums">{entry.all.played}</td>
              <td className="text-center text-[12px] tabular-nums hidden sm:table-cell">{entry.all.win}</td>
              <td className="text-center text-[12px] tabular-nums hidden sm:table-cell">{entry.all.draw}</td>
              <td className="text-center text-[12px] tabular-nums hidden sm:table-cell">{entry.all.lose}</td>
              <td className="text-center text-[12px] tabular-nums hidden md:table-cell">{entry.all.goals.for}</td>
              <td className="text-center text-[12px] tabular-nums hidden md:table-cell">{entry.all.goals.against}</td>
              <td className="text-center text-[12px] tabular-nums font-medium">
                <span className={entry.goalsDiff > 0 ? "text-[var(--accent-emerald)]" : entry.goalsDiff < 0 ? "text-[var(--red-card)]" : ""}>
                  {entry.goalsDiff > 0 ? "+" : ""}{entry.goalsDiff}
                </span>
              </td>
              <td className="text-center text-[12px] font-bold tabular-nums text-[var(--text-primary)]">{entry.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 flex flex-wrap gap-3 text-[9px] text-[var(--text-muted)] border-t border-[var(--border-color)] uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-[var(--accent-gold)]" /> Champions League
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-[var(--accent-emerald)]" /> Europa League
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-[var(--red-card)]" /> Relegation
        </span>
      </div>
    </section>
  );
}
