"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/lib/types";
import TeamLogo from "./TeamLogo";

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.success ? data.results || [] : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "team") {
      router.push(`/?team=${result.id}`);
    } else if (result.type === "league") {
      router.push(`/standings/${result.id}`);
    }
    onClose?.();
  };

  const hasQuery = query.trim().length >= 2;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          className="input-field pl-10 pr-10"
          aria-label={t("nav.search")}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={t("common.close")}
          >
            <svg className="w-5 h-5 text-[var(--text-muted)] hover:text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {loading && (
        <div className="card mt-2 p-4 text-center">
          <div className="inline-block w-5 h-5 border-2 border-[var(--accent-gold)] border-t-transparent  animate-spin" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="card mt-2 max-h-[400px] overflow-y-auto animate-slide-down">
          {results.map((result, idx) => (
            <button
              key={`${result.type}-${result.id}-${idx}`}
              onClick={() => handleResultClick(result)}
              className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-card-hover)] transition-colors text-left border-b border-[var(--border-color)] last:border-b-0"
            >
              {result.logo ? (
                <TeamLogo src={result.logo} alt={result.name} teamId={result.id} size={32} />
              ) : (
                <span className="w-8 h-8  gold-soft flex items-center justify-center text-[9px] font-bold text-[var(--accent-gold)]">
                  {result.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">{result.name}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {result.type === "team" ? t("search.teams") : t("search.leagues")}
                  {result.country ? ` · ${result.country}` : ""}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && hasQuery && results.length === 0 && (
        <div className="card mt-2 p-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">{t("search.noResults")}</p>
        </div>
      )}
    </div>
  );
}
