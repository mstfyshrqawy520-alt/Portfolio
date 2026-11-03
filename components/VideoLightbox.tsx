"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Link2, X } from "lucide-react";
import type { DriveVideoItem } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import { categoryBlurb, categoryLabel, driveViewUrl, embedUrlFor, hasRealDuration, pad } from "@/lib/portfolio";
import DriveEmbed from "./DriveEmbed";

interface VideoLightboxProps {
  video: DriveVideoItem | null;
  list: DriveVideoItem[];
  onClose: () => void;
  onNavigate: (video: DriveVideoItem) => void;
}

export default function VideoLightbox({ video, list, onClose, onNavigate }: VideoLightboxProps) {
  const { t, dir } = useLanguage();
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const idx = video ? list.findIndex((v) => v.id === video.id) : -1;
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;

  const goPrev = useCallback(() => prev && onNavigate(prev), [prev, onNavigate]);
  const goNext = useCallback(() => next && onNavigate(next), [next, onNavigate]);

  const isOpen = Boolean(video);

  // Focus management + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Arrow keys follow reading direction
      if (e.key === "ArrowRight") (dir === "rtl" ? goPrev : goNext)();
      if (e.key === "ArrowLeft") (dir === "rtl" ? goNext : goPrev)();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], iframe");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, dir, goNext, goPrev, onClose]);

  const share = async () => {
    if (!video) return;
    const url = `${window.location.origin}${window.location.pathname}?v=${video.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            onClick={(e) => e.stopPropagation()}
            className="flex h-full flex-col"
          >
            {/* Top bar */}
            <div className="container-x flex h-16 shrink-0 items-center justify-between gap-4 md:h-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-smoke" dir="ltr">
                {pad(idx + 1, 3)} <span className="text-line">/</span> {pad(list.length, 3)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-xs text-ash transition-colors hover:border-bone/40 hover:text-bone"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-rec" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span aria-live="polite">{copied ? t.work.lightbox.copied : t.work.lightbox.share}</span>
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={onClose}
                  aria-label={t.work.lightbox.close}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-bone text-ink transition-colors hover:bg-rec"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Stage + details */}
            <div className="container-x grid min-h-0 flex-1 grid-cols-1 content-start gap-6 overflow-y-auto pb-6 lg:content-stretch lg:grid-cols-12 lg:gap-10 lg:overflow-hidden">
              <div className="flex min-w-0 items-center justify-center lg:col-span-8 lg:min-h-0 xl:col-span-9">
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative bg-char ${
                    video.orientation === "vertical" ? "mx-auto aspect-[9/16]" : "aspect-video w-full"
                  }`}
                  style={
                    video.orientation === "vertical"
                      ? { width: "min(calc(100vw - 2rem), calc((100svh - 9rem) * 9 / 16), 506px)" }
                      : { maxWidth: "calc((100svh - 9rem) * 16 / 9)" }
                  }
                >
                  <DriveEmbed
                    src={embedUrlFor(video)}
                    title={video.title}
                    externalUrl={driveViewUrl(video)}
                    loadingLabel={t.work.lightbox.loading}
                    slowLabel={t.work.lightbox.error}
                    externalLabel={t.work.lightbox.openDrive}
                  />
                </motion.div>
              </div>

              <aside className="flex min-w-0 flex-col justify-between gap-8 lg:col-span-4 lg:py-6 xl:col-span-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rec">{categoryLabel(video.categorySlug, video.category, t.categories)}</p>
                  <h2 id="lightbox-title" className="mt-3 font-display text-3xl leading-tight text-bone md:text-4xl">
                    {video.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-ash">{video.description || categoryBlurb(video.categorySlug, t.categories)}</p>

                  <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-smoke">{t.work.lightbox.format}</dt>
                      <dd className="text-bone">{video.orientation === "vertical" ? t.work.vertical : t.work.horizontal}</dd>
                    </div>
                    {hasRealDuration(video) && (
                      <div className="flex justify-between gap-4 py-3">
                        <dt className="text-smoke">{t.work.lightbox.duration}</dt>
                        <dd className="font-mono text-bone" dir="ltr">{video.formattedDuration}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="text-smoke">{t.work.lightbox.index}</dt>
                      <dd className="font-mono text-bone" dir="ltr">
                        {pad(idx + 1, 3)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!prev}
                    className="flex h-12 items-center justify-center gap-2 rounded-full border border-line text-sm text-bone transition-colors hover:border-bone disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    {t.work.lightbox.prev}
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!next}
                    className="flex h-12 items-center justify-center gap-2 rounded-full border border-line text-sm text-bone transition-colors hover:border-bone disabled:pointer-events-none disabled:opacity-30"
                  >
                    {t.work.lightbox.next}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
