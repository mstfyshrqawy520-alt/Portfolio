"use client";

import React from "react";
import Image from "next/image";
import { DriveVideoItem } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import {
  Play,
  FileDown,
  MessageCircle,
  Sparkles,
  ArrowDown,
  Film,
  Award,
} from "lucide-react";

interface HeroProps {
  featuredVideos: DriveVideoItem[];
  profileImage: string | null;
  cvUrl: string | null;
  onSelectVideo: (video: DriveVideoItem) => void;
}

export default function Hero({
  featuredVideos,
  profileImage,
  cvUrl,
  onSelectVideo,
}: HeroProps) {
  const { lang, t } = useLanguage();

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    lang === "ar" ? siteConfig.whatsappPrefilledAr : siteConfig.whatsappPrefilledEn
  )}`;

  const cvHref = cvUrl || "#";

  return (
    <section
      id="home"
      className="relative min-h-[95vh] pt-32 pb-16 flex flex-col justify-center overflow-hidden"
    >
      {/* Ambient Glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 ambient-glow-amber blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 ambient-glow-blue blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold glass-panel text-amber-300 border border-amber-500/30 shadow-sm animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <div className="flex flex-col gap-2">
              <span className="text-sm sm:text-base font-semibold text-slate-400 tracking-wide">
                {t.hero.greeting}
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                <span className="text-gradient-gold">
                  {lang === "ar" ? siteConfig.name : siteConfig.nameEn}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300/95 tracking-wide mt-1">
                {lang === "ar" ? "مونتير فيديو وصانع محتوى بصري إعلاني" : "Senior Video Editor & Visual Storyteller"}
              </h2>
            </div>

            {/* Description Tagline */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl leading-relaxed">
              {lang === "ar" ? siteConfig.taglineAr : siteConfig.taglineEn}
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
              {/* Watch Work CTA */}
              <a
                href="#work"
                className="px-6 py-3.5 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{t.hero.ctaWork}</span>
              </a>

              {/* Contact Me CTA */}
              <a
                href="#contact"
                className="px-5 py-3.5 rounded-full text-sm font-semibold glass-panel hover:bg-white/15 text-white border border-amber-500/30 hover:border-amber-400/50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <span>{t.hero.ctaContact}</span>
              </a>

              {/* Direct WhatsApp CTA */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-full text-sm font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.hero.ctaWhatsapp}</span>
              </a>

              {/* Download CV CTA */}
              {cvUrl && (
                <a
                  href={cvHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-full text-sm font-semibold glass-panel hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <FileDown className="w-4 h-4 text-amber-400" />
                  <span>{t.hero.ctaCv}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Profile Card / Visual Anchor */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-80 sm:w-80 sm:h-96 rounded-3xl p-1 bg-gradient-to-tr from-amber-500/40 via-white/10 to-transparent shadow-2xl shadow-black/60 group">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-900 border border-white/10">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={siteConfig.name}
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 p-6 text-center">
                    <Award className="w-16 h-16 text-amber-400 mb-3" />
                    <span className="font-bold text-white text-lg">
                      {siteConfig.name}
                    </span>
                    <span className="text-xs text-amber-400 mt-1">
                      {siteConfig.roleEn}
                    </span>
                  </div>
                )}

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Floating Experience Badge */}
                <div className="absolute bottom-4 inset-x-4 glass-panel p-3 rounded-xl border border-white/15 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">
                      {lang === "ar" ? "إتقان سينمائي متقدم" : "Cinematic Excellence"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === "ar" ? "مونتاج • ألوان • صوت" : "Edit • Color • Sound"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Showreel Strip */}
        {featuredVideos.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  {t.hero.featuredTitle}
                </h3>
              </div>
              <a
                href="#work"
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>{t.hero.ctaWork}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Horizontal Scrollable Strip of Featured Videos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {featuredVideos.slice(0, 4).map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer aspect-video bg-slate-900 border border-white/10 hover:border-amber-500/60 transition-all duration-300 hover:scale-[1.02]"
                >
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={video.thumbnailUrl.includes("google")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Title & Duration */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[11px] text-white">
                    <span className="font-semibold line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {video.title}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-black/60 px-1.5 py-0.5 rounded ml-1">
                      {video.formattedDuration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
