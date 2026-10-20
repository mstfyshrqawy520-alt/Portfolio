"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import { ArrowUp, Database, Layers, Sparkles } from "lucide-react";
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from "@/components/Icons";

export default function Footer() {
  const { lang, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#050609] py-12 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Rights */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base">
              {lang === "ar" ? siteConfig.name : siteConfig.nameEn}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              Portfolio
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            {t.footer.rights} © {currentYear} {siteConfig.nameEn}.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3">
          {siteConfig.socials.instagram && (
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}

          {siteConfig.socials.youtube && (
            <a
              href={siteConfig.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
          )}

          {siteConfig.socials.linkedin && (
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}

          {/* Admin Sync Link */}
          <Link
            href="/admin"
            className="p-2.5 rounded-full bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 transition-colors"
            title={t.nav.admin}
            aria-label="Sync Dashboard"
          >
            <Database className="w-4 h-4" />
          </Link>
        </div>

        {/* Back to Top & CMS Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 glass-panel px-3 py-1 rounded-full border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{t.footer.poweredBy}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors"
            aria-label="Back to top"
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
