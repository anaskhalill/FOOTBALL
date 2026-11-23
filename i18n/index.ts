import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  fr: { translation: fr },
  es: { translation: es },
  zh: { translation: zh },
};

const RTL_LANGUAGES = ["ar"];

export function isRtlLanguage(lng: string): boolean {
  return RTL_LANGUAGES.includes(lng);
}

export const LANGUAGE_OPTIONS = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr", flag: "🇪🇸" },
  { code: "zh", name: "Chinese", nativeName: "中文", dir: "ltr", flag: "🇨🇳" },
];

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Keep SSR and the first client render identical. The saved language is
    // restored after hydration by LanguageProvider, which prevents the
    // server/navigator locale from causing a hydration mismatch.
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ar", "fr", "es", "zh"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
