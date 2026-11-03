"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { previewsAllowed } from "@/lib/previews";

interface HoverPreviewProps {
  src: string;
  /** Element whose hover / focus triggers the preview. */
  targetRef: React.RefObject<HTMLElement | null>;
  label: string;
}

/**
 * Muted looping clip layered over a poster.
 * - Mouse / pen: plays while hovered or keyboard-focused.
 * - Touch screens (no hover): plays while the card is mostly in view.
 * The <video> is only mounted once needed, so nothing downloads up front.
 */
export default function HoverPreview({ src, targetRef, label }: HoverPreviewProps) {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  // Keep the element mounted after the first activation so replays come from cache.
  const [mounted, setMounted] = useState(false);
  if (active && !mounted) setMounted(true);
  const mountedFlag = mounted;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !previewsAllowed()) return;

    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      const on = () => setActive(true);
      const off = () => setActive(false);
      el.addEventListener("pointerenter", on);
      el.addEventListener("pointerleave", off);
      el.addEventListener("focus", on);
      el.addEventListener("blur", off);
      return () => {
        el.removeEventListener("pointerenter", on);
        el.removeEventListener("pointerleave", off);
        el.removeEventListener("focus", on);
        el.removeEventListener("blur", off);
      };
    }

    const obs = new IntersectionObserver(
      (entries) => {
        // Entries can be batched; the last one is the current state.
        const latest = entries[entries.length - 1];
        setActive(latest.intersectionRatio >= 0.6);
      },
      { threshold: [0, 0.6, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [targetRef]);

  const activeRef = useRef(false);
  const tryPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || !activeRef.current) return;
    v.muted = true; // required for autoplay policies
    void v.play().catch(() => undefined);
  }, []);

  useEffect(() => {
    activeRef.current = active;
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      if (v.readyState >= 2) v.currentTime = 0;
      tryPlay();
    } else {
      v.pause();
    }
  }, [active, mountedFlag, tryPlay]);

  if (!mounted) return null;

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={tryPlay}
        onCanPlay={tryPlay}
        onPlaying={() => setVisible(true)}
        onPause={() => setVisible(false)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          active && visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        className={`pointer-events-none absolute bottom-3 end-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone transition-opacity duration-500 ${
          active && visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <span className="rec-dot" />
        {label}
      </span>
    </>
  );
}
