"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig, type ToolId } from "@/content/site.config";
import { Reveal, SectionHeading } from "./Reveal";

/** App-icon style monograms (brand colours of each product's own icon). */
const BADGES: Record<ToolId, { mark: string; bg: string; fg: string }> = {
  ae: { mark: "Ae", bg: "#00005b", fg: "#9999ff" },
  ps: { mark: "Ps", bg: "#001e36", fg: "#31a8ff" },
  xd: { mark: "Xd", bg: "#470137", fg: "#ff61f6" },
  canva: { mark: "Ca", bg: "#0e1b2b", fg: "#00c4cc" },
  pr: { mark: "Pr", bg: "#00005b", fg: "#9999ff" },
  dv: { mark: "Dv", bg: "#1b1b1b", fg: "#e8e8e8" },
  au: { mark: "Au", bg: "#00005b", fg: "#00e4bb" },
  c4d: { mark: "C4", bg: "#0b1a33", fg: "#1f7eff" },
  blender: { mark: "Bl", bg: "#1b1b1b", fg: "#ea7600" },
};

export default function Toolkit() {
  const { t } = useLanguage();

  return (
    <section id="tools" aria-labelledby="tools-title" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading id="tools-title" kicker={t.tools.kicker} title={t.tools.title} />

        <ul className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.tools.map((id, i) => {
            const b = BADGES[id];
            const info = t.tools.items[id];
            if (!b || !info) return null;
            return (
              <li key={id} className="group bg-ink">
                <Reveal delay={i * 0.06} className="flex h-full flex-col gap-12 p-6 transition-colors duration-500 group-hover:bg-coal md:p-8">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-[14px] font-mono text-xl font-medium transition-transform duration-500 group-hover:-translate-y-1"
                    style={{ background: b.bg, color: b.fg, boxShadow: `inset 0 0 0 1.5px ${b.fg}` }}
                    aria-hidden="true"
                  >
                    {b.mark}
                  </span>
                  <div>
                    <h3 className="text-lg text-bone">
                      <bdi>{info.name}</bdi>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ash">{info.role}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-10">
          <p className="eyebrow mb-4">{t.tools.craftLabel}</p>
          <ul className="flex flex-wrap gap-2">
            {t.tools.craft.map((c) => (
              <li key={c} className="rounded-full border border-line px-4 py-2 text-sm text-ash">
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
