"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal, SectionHeading } from "./Reveal";

export default function Experience({ totalProjects, brands }: { totalProjects: number; brands: string[] }) {
  const { t } = useLanguage();

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading id="experience-title" kicker={t.experience.kicker} title={t.experience.title} />

        <ol className="mt-14 border-t hairline">
          {t.experience.items.map((item, i) => (
            <li key={item.role} className="border-b hairline">
              <Reveal delay={i * 0.05} className="grid gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-rec md:col-span-2">
                  <bdi>{item.period}</bdi>
                </p>
                <div className="md:col-span-5">
                  <h3 className="font-display text-2xl leading-tight text-bone md:text-3xl">{item.role}</h3>
                  <p className="mt-1 text-sm text-smoke">
                    <bdi>{item.place}</bdi>
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-ash md:col-span-5 md:text-base">
                  {item.text.replace("{count}", String(totalProjects))}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {brands.length > 0 && (
        <div className="mt-20 md:mt-28">
          <div className="container-x mb-6 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
            <p className="eyebrow">{t.experience.brandsLabel}</p>
            <p className="text-xs text-smoke">{t.experience.brandsNote}</p>
          </div>
          <div dir="ltr" className="marquee overflow-hidden border-y hairline py-8" aria-label={t.experience.brandsLabel}>
            <ul className="marquee-track items-center">
              {[...brands, ...brands].map((b, i) => (
                <li
                  key={`${b}-${i}`}
                  aria-hidden={i >= brands.length ? "true" : undefined}
                  className="flex shrink-0 items-center gap-10 px-5 font-display text-3xl text-bone/70 transition-colors hover:text-bone md:text-5xl"
                >
                  <bdi>{b}</bdi>
                  <span className="h-2 w-2 rounded-full bg-rec/80" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
