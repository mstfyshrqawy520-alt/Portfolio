"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import React from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/** Fades + lifts content into view once. Collapses to a plain fade with reduced motion. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: reduce ? 0.2 : 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Splits a line into words that rise from a mask, staggered. */
export function MaskedLine({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: reduce ? 0.3 : 1.1, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
  id,
  aside,
}: {
  kicker: string;
  title: string;
  lead?: string;
  id?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 border-t hairline pt-6 md:grid-cols-12 md:gap-10">
      <Reveal className="md:col-span-3">
        <p className="eyebrow flex items-center gap-2">
          <span className="h-px w-6 bg-rec" aria-hidden="true" />
          {kicker}
        </p>
      </Reveal>
      <div className="md:col-span-9">
        <Reveal delay={0.05}>
          <h2 id={id} className="font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-bone">
            {title}
          </h2>
        </Reveal>
        {(lead || aside) && (
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {lead && (
              <Reveal delay={0.12}>
                <p className="max-w-xl text-base leading-relaxed text-ash md:text-lg">{lead}</p>
              </Reveal>
            )}
            {aside}
          </div>
        )}
      </div>
    </div>
  );
}
