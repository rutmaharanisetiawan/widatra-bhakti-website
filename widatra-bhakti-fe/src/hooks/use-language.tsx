import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import en from "@/locales/en.json";
import id from "@/locales/id.json";

export type Language = "en" | "id";

const STORAGE_KEY = "widatra-language";

const DEFAULT_LANGUAGE: Language = "en";

// Dictionaries keyed by supported language code.
const dictionaries = { en, id } as const;

// Generic nested-object shape so both locale files must match it structurally.
type Dictionary = typeof en;

function getStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "id" ? stored : null;
}

/** Resolve a dot-notation key (e.g. "nav.home") against a locale dictionary. */
function resolveKey(dict: Dictionary, key: string): string | undefined {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = dict;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  /**
   * Translate a dot-notation key, e.g. t("nav.home"). Falls back to English, then the key itself.
   * Supports simple {{variable}} interpolation via the optional second argument,
   * e.g. t("footer.copyright", { year: 2026 }).
   */
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage() ?? DEFAULT_LANGUAGE);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "id" : "en");
  }, [language, setLanguage]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = dictionaries[language];
      const value = resolveKey(dict, key);
      const fallback = value === undefined ? resolveKey(dictionaries.en, key) : undefined;
      // Last resort: surface the key so missing translations are easy to spot.
      const resolved = value ?? fallback ?? key;

      if (!vars) return resolved;
      return resolved.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, token: string) =>
        token in vars ? String(vars[token]) : `{{${token}}}`
      );
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
