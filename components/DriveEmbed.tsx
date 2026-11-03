"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface DriveEmbedProps {
  src: string;
  title: string;
  externalUrl?: string | null;
  loadingLabel: string;
  slowLabel: string;
  externalLabel: string;
}

/**
 * Iframe player (Google Drive / YouTube / Vimeo) with a loading state and a
 * graceful fallback link if the provider is slow or blocked.
 */
export default function DriveEmbed(props: DriveEmbedProps) {
  // Remount per source so loading state resets cleanly.
  return <EmbedFrame key={props.src} {...props} />;
}

function EmbedFrame({ src, title, externalUrl, loadingLabel, slowLabel, externalLabel }: DriveEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setSlow(true), 12000);
    return () => window.clearTimeout(id);
  }, [src]);

  return (
    <div className="absolute inset-0 bg-ink">
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-center" role="status">
          {!slow ? (
            <>
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-bone/15 border-t-rec" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">{loadingLabel}</span>
            </>
          ) : (
            <>
              <span className="text-sm text-ash">{slowLabel}</span>
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-4 py-2 text-sm text-bone hover:border-rec hover:text-rec"
                >
                  {externalLabel}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </>
          )}
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
