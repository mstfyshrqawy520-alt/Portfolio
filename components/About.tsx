"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import { Sparkles, Cpu, Layers, Palette, Headphones } from "lucide-react";

export default function About() {
  const { lang, dir, t } = useLanguage();

  const getToolIcon = (category: string) => {
    switch (category) {
      case "editing":
        return <Layers className="w-4 h-4 text-amber-400" />;
      case "motion":
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case "color":
        return <Palette className="w-4 h-4 text-purple-400" />;
      case "audio":
        return <Headphones className="w-4 h-4 text-emerald-400" />;
      case "3d":
        return <Cpu className="w-4 h-4 text-pink-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  // Duplicate tools array for continuous infinite marquee
  const marqueeItems = [...siteConfig.tools, ...siteConfig.tools];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Section Heading & Badge */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold glass-panel text-amber-400 border border-amber-500/20 w-max">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.about.title}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {t.about.subtitle}
            </h2>

            <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full my-1" />
          </div>

          {/* Bio Paragraphs */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-slate-300/90 text-base sm:text-lg leading-relaxed">
            <p className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
              {t.about.p1}
            </p>
            <p className="glass-panel p-6 rounded-2xl border border-white/10 shadow-sm">
              {t.about.p2}
            </p>
          </div>
        </div>

        {/* Skills & Tools Infinite Marquee */}
        <div className="mt-16 pt-10 border-t border-white/10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              {t.about.toolsTitle}
            </span>
            <span className="text-xs text-slate-500">
              {siteConfig.tools.length}+ Professional Suites
            </span>
          </div>

          {/* Marquee Track */}
          <div className="relative w-full overflow-hidden mask-fade">
            <div
              className={`flex gap-3 py-2 ${
                dir === "rtl" ? "animate-marquee-rtl" : "animate-marquee-ltr"
              }`}
            >
              {marqueeItems.map((tool, idx) => (
                <div
                  key={`${tool.name}-${idx}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-slate-200 text-xs sm:text-sm font-semibold whitespace-nowrap hover:border-amber-500/50 hover:bg-white/10 transition-colors shadow-sm"
                >
                  {getToolIcon(tool.category)}
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
