"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { isRtlLanguage, LANGUAGE_OPTIONS } from "@/i18n";

interface LanguageContextType {
  currentLanguage: string;
  isRtl: boolean;
  changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED = LANGUAGE_OPTIONS.map((option) => option.code);

function normalizeLanguage(lng: string): string {
  const base = (lng || "en").toLowerCase().split("-")[0];
  return SUPPORTED.includes(base) ? base : "en";
}

const LANGUAGE_STORAGE_KEY = "i18nextLng";

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  // Start from a deterministic value on both server and client, then sync
  // with the saved language after mount to avoid hydration mismatches.
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      const lng = normalizeLanguage(readStoredLanguage() || i18n.language || "en");
      if (i18n.language !== lng) {
        void i18n.changeLanguage(lng);
      }
      setCurrentLanguage(lng);
      setIsRtl(isRtlLanguage(lng));
      document.documentElement.dir = isRtlLanguage(lng) ? "rtl" : "ltr";
      document.documentElement.lang = lng;
    };

    // The marker lives at the end of the hydrated tree. Give nested Suspense
    // boundaries a short grace period after it appears before changing i18n,
    // so no translated text is swapped while React is still hydrating.
    let timer = 0;
    const schedule = () => {
      if (timer) return;
      timer = window.setTimeout(apply, 300);
    };

    if (document.documentElement.dataset.appHydrated === "true") {
      schedule();
    } else {
      const observer = new MutationObserver(() => {
        if (document.documentElement.dataset.appHydrated === "true") {
          observer.disconnect();
          schedule();
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-app-hydrated"],
      });
      // Safety net if the marker is ever missing.
      timer = window.setTimeout(apply, 1000);
      return () => {
        observer.disconnect();
        window.clearTimeout(timer);
      };
    }

    return () => window.clearTimeout(timer);
  }, [i18n]);

  const changeLanguage = useCallback(
    (lng: string) => {
      const normalized = normalizeLanguage(lng);
      i18n.changeLanguage(normalized);
      setCurrentLanguage(normalized);
      setIsRtl(isRtlLanguage(normalized));
      document.documentElement.dir = isRtlLanguage(normalized) ? "rtl" : "ltr";
      document.documentElement.lang = normalized;
      try { localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized); } catch { /* storage unavailable */ }
    },
    [i18n]
  );

  return (
    <LanguageContext.Provider value={{ currentLanguage, isRtl, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
