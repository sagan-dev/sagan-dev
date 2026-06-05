"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en, pl } from "@/i18n";
import type { Translations } from "@/i18n";
import type { SiteTranslations } from "@/content/default-site-content";

type Lang = "en" | "pl";

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  t: en,
  setLang: () => {},
});

interface LanguageProviderProps {
  children: React.ReactNode;
  translations?: Partial<SiteTranslations>;
}

export function LanguageProvider({ children, translations }: LanguageProviderProps) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "pl" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("lang", next);
  };

  const t = translations?.[lang] ?? (lang === "pl" ? pl : en);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
