"use client";

import { useEffect, useMemo, useState } from "react";
import type { DriveVideoItem } from "@/types/drive";
import { posterFor } from "./portfolio";

/**
 * Re-orders videos so items whose poster really is close to 16:9 come first.
 * Drive sometimes returns letterboxed or very wide thumbnails; those look soft
 * when cropped into a large 16:9 stage, so they move to the back of the queue.
 */
export function usePosterOrder(list: DriveVideoItem[]): DriveVideoItem[] {
  const [ratios, setRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    list.forEach((v) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!cancelled && img.naturalHeight) {
          setRatios((r) => ({ ...r, [v.id]: img.naturalWidth / img.naturalHeight }));
        }
      };
      img.src = posterFor(v);
    });
    return () => {
      cancelled = true;
    };
  }, [list]);

  return useMemo(() => {
    const good = (v: DriveVideoItem) => {
      const r = ratios[v.id];
      return r === undefined ? 1 : r > 1.5 && r < 2 ? 0 : 2;
    };
    return [...list].sort((a, b) => good(a) - good(b));
  }, [list, ratios]);
}
