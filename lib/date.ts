// Date helpers that respect the visitor's local timezone. Using toISOString()
// for date-only values shifts the day for anyone outside UTC.

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromLocalDateString(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function startOfLocalDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

// football-data.org labels seasons by their starting year (2025 = 2025/26).
export function getSeasonForDate(date: Date = new Date()): number {
  const year = date.getFullYear();
  return date.getMonth() + 1 >= 7 ? year : year - 1;
}

// Intl locale matching the languages exposed in the UI. Keeping this shared
// stops dates from staying in the browser locale after a language switch.
export function toDateLocale(language?: string): string {
  const base = (language || "en").toLowerCase().split("-")[0];
  if (base === "zh") return "zh-CN";
  return ["en", "ar", "fr", "es", "zh"].includes(base) ? base : "en";
}
