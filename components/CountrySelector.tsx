"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

const COUNTRIES = [
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "UAE" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" },
  { code: "DZ", name: "Algeria" },
  { code: "IQ", name: "Iraq" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "BR", name: "Brazil" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "AU", name: "Australia" },
];

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (code: string) => void;
}

export default function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selected = COUNTRIES.find((c) => c.code === selectedCountry);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1  border border-[var(--border-color)] hover:border-[var(--accent-gold)] transition-colors text-[10px]"
      >
        <span className="text-[var(--text-secondary)]">{selected?.name || t("common.selectCountry")}</span>
        <svg className={`w-2.5 h-2.5 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 card z-50 py-1 max-h-[240px] overflow-y-auto shadow-xl">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => { onSelect(country.code); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] transition-colors ${
                  selectedCountry === country.code
                    ? "text-[var(--accent-gold)] font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <span>{country.name}</span>
                {selectedCountry === country.code && (
                  <svg className="w-3 h-3 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
