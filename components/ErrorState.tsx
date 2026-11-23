"use client";

import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-12 h-12  emerald-soft flex items-center justify-center">
        <svg className="w-6 h-6 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t("common.error")}</h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-xs">{message || t("home.error")}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-[11px]">{t("home.retry")}</button>
      )}
    </div>
  );
}
