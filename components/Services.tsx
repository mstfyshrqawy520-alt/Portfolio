"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import { Film, Tv, Building2, Sparkles, MessageCircle, ArrowUpRight } from "lucide-react";

export default function Services() {
  const { lang, t } = useLanguage();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Film":
        return <Film className="w-6 h-6 text-amber-400" />;
      case "Tv":
        return <Tv className="w-6 h-6 text-cyan-400" />;
      case "Building2":
        return <Building2 className="w-6 h-6 text-emerald-400" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      default:
        return <Film className="w-6 h-6 text-amber-400" />;
    }
  };

  const createServiceWhatsappLink = (serviceTitle: string) => {
    const text =
      lang === "ar"
        ? `مرحباً عبدالمجيد، أود الاستفسار عن خدمة: ${serviceTitle}`
        : `Hi Abdelmagid, I am interested in inquiring about: ${serviceTitle}`;
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold glass-panel text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.services.title}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t.services.subtitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((srv, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg shadow-black/20"
            >
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getServiceIcon(srv.icon)}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href={createServiceWhatsappLink(srv.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-white/5 hover:bg-amber-500 text-slate-200 hover:text-black border border-white/10 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.services.requestBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
