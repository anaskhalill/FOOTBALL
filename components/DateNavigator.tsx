"use client";

import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect, useMemo } from "react";
import { fromLocalDateString, startOfLocalDay, toDateLocale, toLocalDateString } from "@/lib/date";

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const { t, i18n } = useTranslation();
  const locale = toDateLocale(i18n.resolvedLanguage || i18n.language);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const today = useMemo(() => startOfLocalDay(new Date()), [mounted]);
  const selected = startOfLocalDay(selectedDate);

  // 15 days either side of today.
  const dates = useMemo(() => {
    const result: Date[] = [];
    for (let i = -15; i <= 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      result.push(date);
    }
    return result;
  }, [today]);

  const formatDate = (date: Date) => ({
    day: date.getDate(),
    month: date.toLocaleString(locale, { month: "short" }).toUpperCase(),
  });

  const getDayName = (date: Date) => {
    const diff = Math.round((startOfLocalDay(date).getTime() - today.getTime()) / 86400000);
    if (diff === 0) return t("date.today");
    if (diff === -1) return t("date.yesterday");
    if (diff === 1) return t("date.tomorrow");
    return date.toLocaleString(locale, { weekday: "short" });
  };

  const shiftWeek = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    onDateChange(next);
  };

  // Keep the active pill in view, including on first render (today).
  useEffect(() => {
    if (!mounted || !scrollRef.current) return;
    const active = scrollRef.current.querySelector<HTMLElement>("[aria-current='date']");
    const target = active || scrollRef.current.querySelector<HTMLElement>("[data-today='true']");
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedDate, mounted]);

  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 15);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 15);

  return (
    <div className="card p-3">
      <div className="flex items-center gap-2">
        <button onClick={() => shiftWeek(-7)} className="icon-btn flex-shrink-0" aria-label="Previous week">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-thin flex-1 justify-center py-1">
          {mounted && dates.map((date) => {
            const dayStart = startOfLocalDay(date);
            const isSelected = dayStart.getTime() === selected.getTime();
            const fd = formatDate(date);
            const dayName = getDayName(date);
            const isToday = dayStart.getTime() === today.getTime();
            return (
              <button
                key={toLocalDateString(date)}
                onClick={() => onDateChange(date)}
                className={`date-pill flex flex-col items-center min-w-[60px] ${isSelected ? "active" : ""} ${isToday && !isSelected ? "ring-1 ring-[var(--accent-gold)]" : ""}`}
                aria-label={dayName}
                aria-current={isSelected ? "date" : undefined}
                data-today={isToday}
              >
                <span className="text-[7px] font-bold opacity-70 uppercase tracking-wider mb-0.5">{dayName}</span>
                <span className="text-[17px] font-black leading-tight">{fd.day}</span>
                <span className="text-[7px] font-bold uppercase tracking-widest opacity-60">{fd.month}</span>
              </button>
            );
          })}
        </div>

        <button onClick={() => shiftWeek(7)} className="icon-btn flex-shrink-0" aria-label="Next week">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="relative flex-shrink-0">
          <input
            type="date"
            value={toLocalDateString(selectedDate)}
            onChange={(e) => e.target.value && onDateChange(fromLocalDateString(e.target.value))}
            className="w-9 h-9 opacity-0 absolute inset-0 cursor-pointer"
            aria-label={t("date.selectDate")}
            min={toLocalDateString(minDate)}
            max={toLocalDateString(maxDate)}
          />
          <div className="w-9 h-9 flex items-center justify-center  bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
