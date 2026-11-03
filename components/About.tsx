"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";
import { pad } from "@/lib/portfolio";
import { Reveal } from "./Reveal";

export default function About({ profileImage }: { profileImage: string | null }) {
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow flex items-center gap-2 border-t hairline pt-6">
            <span className="h-px w-6 bg-rec" aria-hidden="true" />
            {t.about.kicker}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <div ref={ref} className="lg:col-span-5">
            <Reveal>
              <figure className="relative">
                <div className="relative aspect-[4/5] overflow-hidden bg-char">
                  {profileImage ? (
                    <motion.img
                      style={{ y: imgY }}
                      src={profileImage}
                      alt={t.about.portraitAlt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-[112%] w-full -translate-y-[6%] object-cover grayscale-[35%] contrast-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-smoke">{siteConfig.nameEn}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
                  {["top-4 start-4 border-t border-s", "top-4 end-4 border-t border-e", "bottom-4 start-4 border-b border-s", "bottom-4 end-4 border-b border-e"].map((c) => (
                    <span key={c} className={`absolute h-5 w-5 border-bone/60 ${c}`} aria-hidden="true" />
                  ))}
                </div>
                <figcaption className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-smoke">
                  <span>{lang === "ar" ? siteConfig.name : siteConfig.nameEn}</span>
                  <span>{lang === "ar" ? siteConfig.locationAr : siteConfig.locationEn}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Bio */}
          <div className="lg:col-span-7">
            <Reveal>
              <h2 id="about-title" className="font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.02em] text-bone">
                {t.about.title}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 text-base leading-relaxed text-ash md:grid-cols-2 md:text-lg">
              <Reveal delay={0.05}>
                <p>{t.about.p1}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>{t.about.p2}</p>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <blockquote className="mt-14 border-s-2 border-rec ps-6">
                <p className="eyebrow mb-3">{t.about.philosophyLabel}</p>
                <p className={`font-display text-2xl leading-snug text-bone md:text-4xl ${lang === "en" ? "italic" : ""}`}>{lang === "ar" ? `«${t.about.philosophy}»` : `“${t.about.philosophy}”`}</p>
              </blockquote>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-14 divide-y divide-line border-y border-line">
                {t.about.facts.map((f) => (
                  <div key={f.k} className="grid gap-1 py-4 sm:grid-cols-3 sm:gap-6">
                    <dt className="eyebrow">{f.k}</dt>
                    <dd className="text-sm text-bone sm:col-span-2 md:text-base">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* Approach */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <p className="eyebrow">{t.about.approachLabel}</p>
          </Reveal>
          <ol className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.about.approach.map((step, i) => (
              <li key={step.title} className="bg-ink">
                <Reveal delay={i * 0.06} className="flex h-full flex-col gap-10 p-6 md:p-8">
                  <span className="font-mono text-xs text-rec" dir="ltr">
                    {pad(i + 1)} —
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-bone md:text-3xl">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ash">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* Focus */}
        <Reveal className="mt-14">
          <p className="eyebrow mb-5">{t.about.focusLabel}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 font-display text-2xl text-bone/80 md:text-4xl">
            {t.about.focus.map((f, i) => (
              <li key={f} className="flex items-center gap-6">
                {f}
                {i < t.about.focus.length - 1 && <span className="h-1.5 w-1.5 rounded-full bg-rec" aria-hidden="true" />}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
