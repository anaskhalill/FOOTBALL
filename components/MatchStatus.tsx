"use client";

import { useTranslation } from "react-i18next";

interface MatchStatusProps {
  short: string;
  elapsed: number | null;
  extra?: number | null;
}

export default function MatchStatus({ short, elapsed, extra }: MatchStatusProps) {
  const { t } = useTranslation();

  const isLive = ["1H", "2H", "HT", "ET", "P", "BT", "SUSP", "INT"].includes(short);

  if (short === "NS") {
    return <span className="badge-not-started">{t("match.notStarted")}</span>;
  }

  if (short === "FT" || short === "AET" || short === "PEN") {
    return <span className="badge-finished">{t("match.finished")}</span>;
  }

  if (short === "PST") {
    return (
      <span className="text-[var(--text-muted)] text-xs font-medium italic">
        {t("match.postponed")}
      </span>
    );
  }

  if (short === "CANC") {
    return (
      <span className="text-[var(--red-card)] text-xs font-medium italic">
        {t("match.cancelled")}
      </span>
    );
  }

  if (isLive) {
    const minuteText =
      elapsed !== null
        ? extra && extra > 0
          ? `${elapsed}+${extra}'`
          : `${elapsed}'`
        : "";

    if (short === "HT") {
      return <span className="badge-live">{t("match.halftime")}</span>;
    }

    return (
      <span className="badge-live">
        {minuteText || t("match.live")}
      </span>
    );
  }

  return <span className="text-xs text-[var(--text-muted)]">{short}</span>;
}
