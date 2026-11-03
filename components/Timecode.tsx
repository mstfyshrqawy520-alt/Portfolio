"use client";

import { useEffect, useRef } from "react";

/** Running SMPTE-style timecode (HH:MM:SS:FF @ 25fps). Updates the DOM directly — no re-renders. */
export default function Timecode({ className = "", start = 0 }: { className?: string; start?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now() - start * 1000;
    let raf = 0;
    const p = (n: number) => String(n).padStart(2, "0");
    const tick = (now: number) => {
      const total = (now - t0) / 1000;
      const f = Math.floor((total % 1) * 25);
      const s = Math.floor(total) % 60;
      const m = Math.floor(total / 60) % 60;
      const h = Math.floor(total / 3600);
      if (ref.current) ref.current.textContent = `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start]);

  return (
    <span ref={ref} dir="ltr" className={`font-mono tabular-nums ${className}`} aria-hidden="true">
      00:00:00:00
    </span>
  );
}
