"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, Play } from "lucide-react";
import type { DriveVideoItem } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import { MaskedLine } from "./Reveal";
import Timecode from "./Timecode";
import { usePosterOrder } from "@/lib/usePosterOrder";
import { previewFor, previewsAllowed } from "@/lib/previews";

const noopSubscribe = () => () => {};
import { categoryLabel, posterFor } from "@/lib/portfolio";

const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  featured: DriveVideoItem[];
  totalProjects: number;
  totalCategories: number;
  formats: string[];
  onWatchReel: () => void;
}

export default function Hero({ featured, totalProjects, totalCategories, formats, onWatchReel }: HeroProps) {
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const monitorY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Landscape posters read best in the monitor frame.
  const candidates = useMemo(() => {
    const wide = featured.filter((v) => v.orientation === "horizontal");
    return (wide.length >= 3 ? wide : featured).slice(0, 8);
  }, [featured]);
  const reel = usePosterOrder(candidates);

  const canPlayClips = useSyncExternalStore(noopSubscribe, previewsAllowed, () => false);
  const [frame, setFrame] = useState(0);
  const current = reel[frame];
  const clip = current && canPlayClips ? previewFor(current.id) : null;

  // Hold each shot a little longer when its clip is playing.
  useEffect(() => {
    if (reduce || reel.length < 2) return;
    const id = window.setTimeout(() => setFrame((f) => (f + 1) % reel.length), clip ? 6000 : 3800);
    return () => window.clearTimeout(id);
  }, [reduce, reel.length, frame, clip]);


  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28">
      <div className="container-x relative z-10 grid flex-1 items-center gap-12 pb-10 lg:grid-cols-12 lg:gap-10">
        {/* Copy */}
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-6 xl:col-span-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="eyebrow mb-8 flex items-center gap-3"
          >
            <span className="rec-dot" aria-hidden="true" />
            {t.hero.eyebrow}
          </motion.p>

          <h1 id="hero-title" className="font-display text-[clamp(3.4rem,9.5vw,8.75rem)] leading-[0.92] tracking-[-0.03em] text-bone">
            <span className="block">
              <MaskedLine text={t.hero.titleA} delay={0.15} />
            </span>
            <span className="block">
              <MaskedLine text={t.hero.titleB} delay={0.35} className={`${lang === "en" ? "italic" : ""} text-bone/90`} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-8 max-w-lg text-base leading-relaxed text-ash md:text-lg"
          >
            {t.hero.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={onWatchReel}
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-rec ps-2 pe-6 text-sm font-medium text-ink transition-colors hover:bg-bone"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/15">
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              </span>
              {t.hero.ctaReel}
            </button>
            <a
              href="#work"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-bone/25 px-6 text-sm text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
            >
              {t.hero.ctaWork}
            </a>
            <a href="#contact" className="inline-flex h-12 items-center gap-2 px-3 text-sm text-ash underline-offset-8 transition-colors hover:text-bone hover:underline">
              {t.hero.ctaContact}
              <ArrowDownRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>

        {/* Monitor */}
        <motion.div
          style={{ y: monitorY }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
          className="lg:col-span-6"
        >
          <button
            type="button"
            onClick={onWatchReel}
            className="group relative block w-full text-start"
            aria-label={t.hero.ctaReel}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-char">
              <AnimatePresence initial={false}>
                {current && (
                  <motion.img
                    key={current.id}
                    src={posterFor(current)}
                    alt=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="ken-burns absolute inset-0 h-full w-full object-cover"
                    fetchPriority={frame === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                )}
                {current && clip && (
                  <motion.video
                    key={`clip-${current.id}`}
                    src={clip}
                    muted
                    autoPlay
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
              {/* Grade + letterbox */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/30" aria-hidden="true" />
              <div className="absolute inset-x-0 top-0 h-[7%] bg-ink" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 h-[7%] bg-ink" aria-hidden="true" />

              {/* Frame guides */}
              {["top-[10%] start-[4%] border-t border-s", "top-[10%] end-[4%] border-t border-e", "bottom-[10%] start-[4%] border-b border-s", "bottom-[10%] end-[4%] border-b border-e"].map((c) => (
                <span key={c} className={`absolute h-5 w-5 border-bone/50 ${c}`} aria-hidden="true" />
              ))}

              <div className="absolute inset-x-[4%] top-[10%] flex items-start justify-between pt-3 text-[10px] uppercase tracking-[0.2em] text-bone/80" dir="ltr">
                <span className="flex items-center gap-2 font-mono">
                  <span className="rec-dot" /> REC
                </span>
                <Timecode className="text-[10px] md:text-xs" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-bone/40 bg-ink/30 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-rec group-hover:bg-rec md:h-24 md:w-24">
                  <Play className="ms-1 h-6 w-6 fill-bone text-bone transition-colors group-hover:fill-ink group-hover:text-ink" aria-hidden="true" />
                </span>
              </div>

              {current && (
                <div className="absolute inset-x-[4%] bottom-[10%] flex items-end justify-between gap-4 pb-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rec">{t.hero.monitorLabel}</p>
                    <p className="mt-1 truncate text-sm text-bone md:text-base">{current.title}</p>
                  </div>
                  <p className="shrink-0 font-mono text-[10px] text-bone/60" dir="ltr">
                    {String(frame + 1).padStart(2, "0")} / {String(reel.length).padStart(2, "0")}
                  </p>
                </div>
              )}
            </div>
          </button>
          {current && (
            <p className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
              <span>{categoryLabel(current.categorySlug, current.category, t.categories)}</span>
              <span dir="ltr">16:10 · Preview</span>
            </p>
          )}
        </motion.div>
      </div>

      {/* Stats bar — every number is computed from the live project library */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="container-x relative z-10 pb-8"
      >
        <dl className="grid grid-cols-3 border-t hairline pt-5">
          {[
            { v: String(totalProjects), k: t.hero.statFilms },
            { v: String(totalCategories).padStart(2, "0"), k: t.hero.statFormats },
            { v: formats.join(" · "), k: t.hero.statRatios },
          ].map((s) => (
            <div key={s.k} className="flex flex-col gap-1">
              <dt className="order-2 text-xs text-ash md:text-sm">{s.k}</dt>
              <dd className="order-1 font-display text-2xl text-bone md:text-4xl">
                <span dir="ltr">{s.v}</span>
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
