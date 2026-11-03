"use client";

import React, { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { DriveVideoItem } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import { pad, posterFor } from "@/lib/portfolio";
import { Reveal, SectionHeading } from "./Reveal";

export default function Services({ videos, onFilter }: { videos: DriveVideoItem[]; onFilter?: (slug: string) => void }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  // One real frame per service, taken from that category's work.
  const frames = useMemo(
    () =>
      t.services.items.map((s) => {
        if (!s.slug) return null;
        const pool = videos.filter((v) => v.categorySlug === s.slug);
        return pool.find((v) => v.isFeatured) ?? pool[0] ?? null;
      }),
    [t.services.items, videos]
  );

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading id="services-title" kicker={t.services.kicker} title={t.services.title} />

        <ol className="mt-14 border-t hairline md:mt-20" onMouseLeave={() => setHover(null)}>
          {t.services.items.map((s, i) => {
            const frame = frames[i];
            const count = s.slug ? videos.filter((v) => v.categorySlug === s.slug).length : 0;
            return (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative grid gap-4 border-b hairline py-8 md:grid-cols-12 md:items-center md:gap-8 md:py-10"
                  onMouseEnter={() => setHover(i)}
                >
                  <span className="font-mono text-xs text-smoke md:col-span-1" dir="ltr">
                    {pad(i + 1)}
                  </span>
                  <h3 className="font-display text-3xl leading-tight text-bone transition-colors duration-500 group-hover:text-rec md:col-span-5 md:text-5xl">
                    {s.title}
                  </h3>
                  <div className="md:col-span-4">
                    <p className="text-sm leading-relaxed text-ash md:text-base">{s.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-ash">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                    {s.slug && count > 0 && onFilter ? (
                      <button
                        type="button"
                        onClick={() => onFilter(s.slug!)}
                        className="inline-flex items-center gap-2 text-sm text-bone underline-offset-8 hover:text-rec hover:underline"
                      >
                        <span className="font-mono text-xs text-smoke" dir="ltr">{pad(count)}</span>
                        {t.nav.work}
                        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>

                  {/* Hover frame from real work (desktop only) */}
                  {frame && (
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-1/2 z-10 hidden w-56 -translate-y-1/2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ltr:left-[38%] rtl:right-[38%] ${
                        hover === i ? "scale-100 opacity-100" : "scale-90 opacity-0"
                      } ${frame.orientation === "vertical" ? "aspect-[3/4]" : "aspect-video"}`}
                    >
                      <img src={posterFor(frame)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </span>
                  )}
                </motion.li>
            );
          })}
        </ol>

        <Reveal className="mt-12 flex justify-center md:justify-end">
          <a href="#contact" className="inline-flex h-12 items-center gap-3 rounded-full bg-bone px-6 text-sm font-medium text-ink transition-colors hover:bg-rec">
            {t.services.cta}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
