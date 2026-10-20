"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

type Language = "ar" | "en";
type Direction = "rtl" | "ltr";

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  t: typeof ar;
  toggleLang: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check saved preference or document cookie
    const saved = localStorage.getItem("portfolio_lang") as Language | null;
    if (saved === "en" || saved === "ar") {
      setLang(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    } else {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    }
    setMounted(true);
  }, []);

  const handleSetLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("portfolio_lang", newLang);
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const toggleLang = () => {
    handleSetLanguage(lang === "ar" ? "en" : "ar");
  };

  const t = lang === "ar" ? ar : en;
  const dir: Direction = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir,
        t,
        toggleLang,
        setLanguage: handleSetLanguage,
      }}
    >
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
