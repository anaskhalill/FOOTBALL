"use client";

import { useTranslation } from "react-i18next";
import { getMatchBroadcasters } from "@/lib/broadcasters";

interface BroadcastersProps {
  leagueId: number;
  countryCode?: string;
}

export default function Broadcasters({ leagueId, countryCode = "GB" }: BroadcastersProps) {
  const { t } = useTranslation();
  const broadcasters = getMatchBroadcasters(leagueId, countryCode);

  return (
    <div className="card p-4">
      <h3 className="text-[10px] font-bold text-[var(--text-primary)] mb-3 uppercase tracking-widest flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
        {t("match.whereToWatch")}
      </h3>

      <div className="space-y-1.5">
        {broadcasters.map((broadcaster, idx) => (
          <a
            key={idx}
            href={broadcaster.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 border border-[var(--border-color)]  hover:border-[var(--accent-gold)] hover:bg-[var(--bg-card-hover)] transition-all group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <span className="text-[11px] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                {broadcaster.name}
              </span>
            </div>
            <svg className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        ))}
      </div>

      {/* Quick links to MENA platforms */}
      <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
        <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">All Platforms</span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: "TOD", url: "https://www.tod.tv", color: "var(--accent-gold)" },
            { name: "Shahid", url: "https://shahid.mbc.net", color: "var(--accent-emerald)" },
            { name: "SSC", url: "https://www.sbc.sa", color: "var(--accent-gold-light)" },
            { name: "beIN", url: "https://www.beinsports.com", color: "var(--accent-purple)" },
            { name: "DAZN", url: "https://www.dazn.com", color: "var(--accent-orange)" },
          ].map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold px-2.5 py-1  transition-all hover:scale-105"
              style={{
                background: `color-mix(in srgb, ${platform.color} 14%, transparent)`,
                color: platform.color,
                border: `1px solid color-mix(in srgb, ${platform.color} 32%, transparent)`,
              }}
            >
              {platform.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
