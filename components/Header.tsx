"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGE_OPTIONS } from "@/i18n";
import SearchBar from "./SearchBar";

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [showSearch, setShowSearch] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateFavs = () => {
      try {
        const stored = localStorage.getItem("favorites");
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        setFavCount(Array.isArray(parsed) ? parsed.length : 0);
      } catch {
        setFavCount(0);
      }
    };
    updateFavs();
    window.addEventListener("storage", updateFavs);
    return () => window.removeEventListener("storage", updateFavs);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const navItems = [
    { href: "/", label: t("nav.matches") },
    { href: "/standings", label: t("nav.standings") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className={`border-b transition-all duration-300 ${
        scrolled || showSearch
          ? "glass-header border-[var(--border-color)] shadow-lg"
          : "border-transparent bg-transparent"
      }`}>
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Go to homepage">
              <div className="w-9 h-9  flex items-center justify-center relative overflow-hidden brand-mark">
                <svg className="w-5.5 h-5.5 text-[#1a1409]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0110 10M12 2a10 10 0 00-10 10M12 2v20M2 12h20" />
                </svg>
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">FOOTBALL</h1>
                <p className="text-[8px] text-[var(--accent-gold)] uppercase tracking-[0.25em] font-bold">Maison des Scores</p>
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link px-4 py-2  ${isActive(item.href) ? "active" : ""}`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button onClick={() => setShowSearch(!showSearch)} className="icon-btn" aria-label={t("nav.search")} aria-expanded={showSearch}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              {favCount > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[var(--accent-gold)] gold-soft px-2 py-1 ">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-5.59 13.44c-.3.72.496 1.476 1.215 1.476h10.242c.719 0 1.515-.756 1.215-1.476l-5.59-13.44zM10 14.188l3.547 8.53 3.547-8.53H10z" clipRule="evenodd" /></svg>
                  {favCount}
                </span>
              )}

              <div className="relative">
                <button onClick={() => setShowLanguageMenu(!showLanguageMenu)} className="icon-btn flex items-center gap-1.5 px-3 py-2" aria-label={t("nav.language")} aria-expanded={showLanguageMenu}>
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase hidden sm:inline">{currentLanguage}</span>
                  <svg className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${showLanguageMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {showLanguageMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 card z-50 py-1.5 shadow-2xl animate-slide-down">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <button key={lang.code} onClick={() => { changeLanguage(lang.code); setShowLanguageMenu(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-[12px] transition-colors ${currentLanguage === lang.code ? "text-[var(--accent-gold)] font-bold gold-soft" : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"}`}>
                          <span className="flex items-center gap-2">
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </span>
                          {currentLanguage === lang.code && <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button onClick={toggleTheme} className="icon-btn" aria-label={t("theme.toggle")} title={theme === "dark" ? t("theme.light") : t("theme.dark")}>
                {theme === "dark" ? (
                  <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="glass-header border-b border-[var(--border-color)]">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 animate-slide-down">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-color)] glass-header shadow-[0_-4px_24px_rgba(0,0,0,0.25)]" aria-label="Mobile navigation">
        <div className="flex items-center justify-around h-14 pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`mobile-nav-item ${isActive(item.href) ? "active" : ""}`} aria-label={item.label} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.href === "/" ? (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0110 10M12 2a10 10 0 00-10 10M12 2v20M2 12h20" /></svg>
              ) : item.href === "/standings" ? (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" /></svg>
              ) : (
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              )}
              <span className="text-[9px] font-bold uppercase">{item.label}</span>
            </Link>
          ))}
          <button onClick={() => setShowSearch(!showSearch)} className={`mobile-nav-item ${showSearch ? "active" : ""}`} aria-label={t("nav.search")} aria-expanded={showSearch}>
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <span className="text-[9px] font-bold uppercase">{t("nav.search")}</span>
          </button>
          <button onClick={toggleTheme} className="mobile-nav-item" aria-label={t("theme.toggle")}>
            {theme === "dark" ? (
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            )}
            <span className="text-[9px] font-bold uppercase">{t("theme.toggle")}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
