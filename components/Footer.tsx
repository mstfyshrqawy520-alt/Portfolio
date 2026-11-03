"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";

export default function Footer() {
  const { lang, t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t hairline">
      <div className="container-x flex flex-col gap-6 py-8 text-xs text-smoke sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3">
          <span className="rec-dot" aria-hidden="true" />
          <span className="text-ash">{lang === "ar" ? siteConfig.name : siteConfig.nameEn}</span>
          <span>·</span>
          <span>{lang === "ar" ? siteConfig.roleAr : siteConfig.roleEn}</span>
        </p>
        <p dir="ltr" className="font-mono">
          © {year} — {t.footer.rights}
        </p>
        <a href="#top" className="inline-flex items-center gap-2 text-ash transition-colors hover:text-bone">
          {t.footer.backToTop}
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
