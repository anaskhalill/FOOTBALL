"use client";

import { useTranslation } from "react-i18next";

export default function LoadingSpinner({ text }: { text?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-[var(--border-color)]" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-[var(--accent-navy)] animate-spin" />
      </div>
      <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">{text || t("common.loading")}</p>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="p-4 animate-pulse border-b border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-3">
        <div className="h-2.5 w-10 shimmer" />
        <div className="h-3.5 w-8 shimmer" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-5 h-5 shimmer" />
          <div className="h-2.5 w-20 shimmer" />
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-3.5 shimmer" />
          <div className="h-2.5 w-1.5 shimmer" />
          <div className="h-4 w-3.5 shimmer" />
        </div>
        <div className="flex-1 flex items-center gap-2 justify-end">
          <div className="h-2.5 w-20 shimmer" />
          <div className="w-5 h-5 shimmer" />
        </div>
      </div>
    </div>
  );
}

export function LeagueGroupSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="league-header flex items-center gap-2">
        <div className="w-4 h-4 shimmer" />
        <div className="h-3 w-28 shimmer" />
        <div className="h-2.5 w-14 shimmer ml-auto" />
      </div>
      <div>
        <MatchCardSkeleton />
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-3">
      <div className="p-3 animate-pulse">
        <div className="h-4 w-36 shimmer mb-1.5" />
        <div className="h-2.5 w-20 shimmer" />
      </div>
      <div className="card p-2 animate-pulse">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 w-14 shimmer" />
          ))}
        </div>
      </div>
      <LeagueGroupSkeleton />
      <LeagueGroupSkeleton />
    </div>
  );
}
