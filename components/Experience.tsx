"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Briefcase, Calendar, GraduationCap } from "lucide-react";

export default function Experience() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold glass-panel text-amber-400 border border-amber-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.experience.title}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t.experience.subtitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
        </div>

        {/* CV Timeline Track */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Track Line */}
          <div className="absolute top-0 bottom-0 start-4 sm:start-1/2 w-[2px] bg-gradient-to-b from-amber-500 via-white/10 to-transparent -translate-x-1/2" />

          <div className="flex flex-col gap-10">
            {t.experience.items.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const isEducation = item.period === "التعليم" || item.period === "Education";

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Center Node */}
                  <div className="absolute start-4 sm:start-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_12px_#f59e0b] z-20">
                    {isEducation ? (
                      <GraduationCap className="w-4 h-4" />
                    ) : (
                      <Briefcase className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Card Content */}
                  <div
                    className={`w-full sm:w-1/2 ps-12 sm:ps-0 ${
                      isEven ? "sm:pe-12 text-start" : "sm:ps-12 text-start"
                    }`}
                  >
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-300 group shadow-lg shadow-black/20">
                      {/* Period Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-3">
                        <Calendar className="w-3 h-3" />
                        <span>{item.period}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.role}
                      </h3>

                      <h4 className="text-sm font-semibold text-slate-400 mt-0.5 mb-3">
                        {item.company}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty Spacer on desktop for zig-zag symmetry */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
