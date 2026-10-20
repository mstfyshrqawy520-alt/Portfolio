"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function Contact() {
  const { lang, t } = useLanguage();

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    lang === "ar" ? siteConfig.whatsappPrefilledAr : siteConfig.whatsappPrefilledEn
  )}`;

  const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    lang === "ar" ? "استفسار بخصوص مشروع مونتاج وفيديو" : "Video Project Inquiry"
  )}`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold glass-panel text-amber-400 border border-amber-500/20">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.contact.title}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            {t.contact.subtitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* WhatsApp Direct Card */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-emerald-950/20">
            <div className="flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {t.contact.whatsappCardTitle}
              </h3>

              <p className="text-sm text-slate-300/80 leading-relaxed">
                {t.contact.whatsappCardDesc}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>{t.contact.whatsappBtn}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Email Inquiry Card */}
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-amber-950/20">
            <div className="flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                {t.contact.emailCardTitle}
              </h3>

              <p className="text-sm text-slate-300/80 leading-relaxed">
                {t.contact.emailCardDesc}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10">
              <a
                href={mailtoHref}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
              >
                <span>{t.contact.emailBtn}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Availability & Location Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 text-slate-300 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>

              <h3 className="text-xl font-bold text-white">
                {t.contact.infoCardTitle}
              </h3>

              <div className="flex flex-col gap-3 text-sm text-slate-300/90 pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t.contact.infoLocation}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t.contact.infoAvailability}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for immediate booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
