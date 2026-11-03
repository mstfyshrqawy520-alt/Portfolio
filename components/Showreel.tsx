"use client";

import React, { useMemo, useState } from "react";
import { Play } from "lucide-react";
import type { DriveVideoItem } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import { categoryLabel, driveViewUrl, embedUrlFor, pad, posterFor } from "@/lib/portfolio";
import { Reveal, SectionHeading } from "./Reveal";
import CinemaPlayer from "./CinemaPlayer";
import DriveEmbed from "./DriveEmbed";
import Timecode from "./Timecode";
import { usePosterOrder } from "@/lib/usePosterOrder";

interface ShowreelProps {
  featured: DriveVideoItem[];
  playSignal: number;
}

export default function Showreel({ featured, playSignal }: ShowreelProps) {
  const { t } = useLanguage();
  const { src, driveFileId, poster } = siteConfig.showreel;
  const hasRealReel = Boolean(src || driveFileId);

  // Without a dedicated showreel we present landscape featured projects as a playlist.
  const candidates = useMemo(() => {
    const wide = featured.filter((v) => v.orientation === "horizontal");
    return (wide.length ? wide : featured).slice(0, 6);
  }, [featured]);
  const playlist = usePosterOrder(candidates);

  const [index, setIndex] = useState(0);
  const [clicked, setActive] = useState(false);
  // The hero's "Watch showreel" button also starts the stage.
  const active = clicked || playSignal > 0;
  const current = playlist[index];

  const stagePoster = poster || (current ? posterFor(current) : null);

  return (
    <section id="showreel" aria-labelledby="showreel-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading id="showreel-title" kicker={t.showreel.kicker} title={t.showreel.title} lead={t.showreel.lead} />

        <Reveal delay={0.1} className="mt-14 md:mt-20">
          <div className="relative">
            {/* Viewfinder meta */}
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-smoke md:text-[11px]">
              <span className="flex items-center gap-2">
                <span className="rec-dot" aria-hidden="true" />
                {hasRealReel ? "Showreel" : `${t.showreel.featuredCut} — ${t.showreel.comingSoon}`}
              </span>
              <Timecode className="hidden sm:inline" />
            </div>

            <div className="relative aspect-video w-full overflow-hidden bg-char ring-1 ring-line">
              {src ? (
                <CinemaPlayer src={src} poster={poster} title="Showreel" labels={t.showreel} playSignal={playSignal} />
              ) : active && (driveFileId || current) ? (
                <DriveEmbed
                  src={driveFileId ? `https://drive.google.com/file/d/${driveFileId}/preview` : embedUrlFor(current!)}
                  title={current?.title ?? "Showreel"}
                  externalUrl={driveFileId ? `https://drive.google.com/file/d/${driveFileId}/view` : current ? driveViewUrl(current) : null}
                  loadingLabel={t.showreel.loading}
                  slowLabel={t.work.lightbox.error}
                  externalLabel={t.showreel.openExternal}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setActive(true)}
                  className="group absolute inset-0 block h-full w-full"
                  aria-label={`${t.showreel.play}${current ? ` — ${current.title}` : ""}`}
                >
                  {stagePoster ? (
                    <img
                      src={stagePoster}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-ash">{t.showreel.comingSoon}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/10" aria-hidden="true" />
                  <span className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rec text-ink transition-transform duration-500 group-hover:scale-110 md:h-32 md:w-32">
                    <Play className="ms-1 h-8 w-8 fill-current md:h-10 md:w-10" aria-hidden="true" />
                  </span>
                  {current && !hasRealReel && (
                    <span className="absolute bottom-0 start-0 p-5 text-start md:p-8">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-rec md:text-xs">
                        {categoryLabel(current.categorySlug, current.category, t.categories)}
                      </span>
                      <span className="mt-2 block font-display text-2xl text-bone md:text-5xl">{current.title}</span>
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Playlist of featured cuts */}
        {!hasRealReel && playlist.length > 1 && (
          <Reveal delay={0.15} className="mt-4">
            <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-6 md:px-0">
              {playlist.map((v, i) => (
                <li key={v.id} className="w-40 shrink-0 snap-start md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIndex(i);
                      setActive(true);
                    }}
                    aria-pressed={i === index}
                    className={`group block w-full text-start transition-opacity ${i === index ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
                  >
                    <span className={`relative block aspect-video overflow-hidden bg-char ${i === index ? "ring-1 ring-rec" : ""}`}>
                      <img src={posterFor(v)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </span>
                    <span className="mt-2 flex gap-2 text-xs">
                      <span className="font-mono text-smoke" dir="ltr">{pad(i + 1)}</span>
                      <span className="truncate text-bone/80">{v.title}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
