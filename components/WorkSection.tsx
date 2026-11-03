"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, Plus } from "lucide-react";
import type { CategoryGroup, DriveVideoItem } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import { categoryBlurb, categoryLabel, hasRealDuration, pad, posterFor } from "@/lib/portfolio";
import { SectionHeading } from "./Reveal";
import { usePosterOrder } from "@/lib/usePosterOrder";

const PAGE = 12;
const EASE = [0.16, 1, 0.3, 1] as const;

interface WorkSectionProps {
  categories: CategoryGroup[];
  videos: DriveVideoItem[];
  onSelect: (video: DriveVideoItem, list: DriveVideoItem[]) => void;
  initialFilter?: string;
}

export default function WorkSection({ categories, videos, onSelect, initialFilter = "all" }: WorkSectionProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string>(initialFilter);
  const [visible, setVisible] = useState(PAGE);

  const cats = useMemo(
    () => [...categories].filter((c) => videos.some((v) => v.categorySlug === c.slug)).sort((a, b) => a.order - b.order),
    [categories, videos]
  );

  const filtered = useMemo(() => (filter === "all" ? videos : videos.filter((v) => v.categorySlug === filter)), [filter, videos]);

  // Lead piece: the first featured landscape film in the current view.
  const leadCandidates = useMemo(() => {
    const wide = filtered.filter((v) => v.orientation === "horizontal");
    const feat = wide.filter((v) => v.isFeatured);
    return (feat.length ? feat : wide).slice(0, 6);
  }, [filtered]);
  const lead = usePosterOrder(leadCandidates)[0] ?? null;
  const rest = useMemo(() => filtered.filter((v) => v.id !== lead?.id), [filtered, lead]);
  const shown = rest.slice(0, Math.max(0, visible - (lead ? 1 : 0)));
  const shownCount = shown.length + (lead ? 1 : 0);

  const choose = (slug: string) => {
    setFilter(slug);
    setVisible(PAGE);
  };

  const indexOf = (v: DriveVideoItem) => videos.indexOf(v) + 1;

  return (
    <section id="work" aria-labelledby="work-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="work-title"
          kicker={t.work.kicker}
          title={t.work.title}
          lead={t.work.lead}
          aside={
            <p className="font-mono text-xs text-smoke" dir="ltr" aria-live="polite">
              {t.work.showing.replace("{count}", pad(shownCount)).replace("{total}", pad(filtered.length))}
            </p>
          }
        />

        {/* Filters */}
        <div className="sticky top-16 z-30 -mx-4 mt-12 bg-ink/85 px-4 py-3 backdrop-blur-md md:top-20 md:mx-0 md:px-0">
          <div role="group" aria-label={t.work.filterLabel} className="no-scrollbar flex gap-2 overflow-x-auto">
            {[{ slug: "all", label: t.work.all, count: videos.length }, ...cats.map((c) => ({ slug: c.slug, label: categoryLabel(c.slug, c.name, t.categories), count: videos.filter((v) => v.categorySlug === c.slug).length }))].map(
              (c) => {
                const on = filter === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => choose(c.slug)}
                    aria-pressed={on}
                    className={`relative flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 ${
                      on ? "border-bone bg-bone text-ink" : "border-line text-ash hover:border-bone/40 hover:text-bone"
                    }`}
                  >
                    {c.label}
                    <sup className={`font-mono text-[10px] ${on ? "text-ink/60" : "text-smoke"}`}>{c.count}</sup>
                  </button>
                );
              }
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-8"
          >
            {filter !== "all" && categoryBlurb(filter, t.categories) && (
              <p className="mb-8 max-w-2xl border-s-2 border-rec ps-4 text-sm leading-relaxed text-ash md:text-base">{categoryBlurb(filter, t.categories)}</p>
            )}

            {filtered.length === 0 ? (
              <p className="py-24 text-center text-ash">{t.work.empty}</p>
            ) : (
              <>
                {lead && <ProjectCard video={lead} index={indexOf(lead)} variant="lead" onOpen={() => onSelect(lead, filtered)} />}

                <ul className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
                  {shown.map((v, i) => (
                    <motion.li
                      key={v.id}
                      className="break-inside-avoid"
                      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                      transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: EASE }}
                    >
                      <ProjectCard video={v} index={indexOf(v)} onOpen={() => onSelect(v, filtered)} />
                    </motion.li>
                  ))}
                </ul>

                {shownCount < filtered.length && (
                  <div className="mt-12 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisible((n) => n + PAGE)}
                      className="group inline-flex h-12 items-center gap-3 rounded-full border border-bone/25 px-6 text-sm text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
                    >
                      <Plus className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true" />
                      {t.work.loadMore}
                      <span className="font-mono text-xs opacity-60" dir="ltr">
                        +{Math.min(PAGE, filtered.length - shownCount)}
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectCard({ video, index, onOpen, variant = "default" }: { video: DriveVideoItem; index: number; onOpen: () => void; variant?: "default" | "lead" }) {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const vertical = video.orientation === "vertical";
  const isLead = variant === "lead";
  const aspect = isLead ? "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]" : vertical ? "aspect-[4/5]" : "aspect-video";
  const label = categoryLabel(video.categorySlug, video.category, t.categories);

  return (
    <button type="button" onClick={onOpen} className="group block w-full text-start" aria-label={`${t.work.watch}: ${video.title} — ${label}`}>
      <span className={`relative block overflow-hidden bg-char ${aspect}`}>
        {!loaded && !failed && <span className="absolute inset-0 animate-pulse bg-graphite" aria-hidden="true" />}
        {failed ? (
          <span className="absolute inset-0 flex items-center justify-center p-6 text-center font-display text-2xl text-smoke">{video.title}</span>
        ) : (
          <img
            src={posterFor(video)}
            alt=""
            loading={isLead ? "eager" : "lazy"}
            decoding="async"
            ref={(el) => {
              // Image may finish loading before hydration attaches onLoad.
              if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity,filter] duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05] ${
              loaded ? "opacity-100" : "opacity-0"
            } grayscale-[25%] group-hover:grayscale-0`}
          />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

        {/* Corner meta */}
        <span className="absolute start-3 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/80" dir="ltr">
          {pad(index, 3)}
        </span>
        <span className="absolute end-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/70">
          {vertical ? "9:16" : "16:9"}
          {hasRealDuration(video) && <span className="ms-2">{video.formattedDuration}</span>}
        </span>

        {/* Play cue */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex translate-y-3 scale-90 items-center gap-2 rounded-full bg-bone px-4 py-2 text-xs font-medium text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            {t.work.watch}
          </span>
        </span>

        {isLead && (
          <span className="absolute inset-x-0 bottom-0 p-5 md:p-10">
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-rec md:text-xs">{label}</span>
            <span className="mt-2 block max-w-3xl font-display text-3xl leading-tight text-bone md:text-6xl">{video.title}</span>
          </span>
        )}
      </span>

      {!isLead && (
        <span className="mt-3 flex items-baseline justify-between gap-4">
          <span className="min-w-0">
            <span className="block truncate text-base text-bone transition-colors group-hover:text-rec">{video.title}</span>
            <span className="mt-0.5 block text-xs text-smoke">{label}</span>
          </span>
          <span className="h-px w-6 shrink-0 bg-line transition-all duration-500 group-hover:w-10 group-hover:bg-rec" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}
