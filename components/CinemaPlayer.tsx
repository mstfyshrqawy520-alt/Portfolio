"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { formatClock } from "@/lib/portfolio";

export interface PlayerLabels {
  play: string;
  pause: string;
  mute: string;
  unmute: string;
  fullscreen: string;
  exitFullscreen: string;
  seek: string;
  loading: string;
  error: string;
  retry: string;
}

interface CinemaPlayerProps {
  src: string;
  poster?: string | null;
  title: string;
  labels: PlayerLabels;
  /** Increment to request playback from outside (e.g. the hero CTA). */
  playSignal?: number;
}

/**
 * Custom HTML5 video player: play/pause, scrubbable progress, time, mute + volume,
 * fullscreen, keyboard shortcuts (Space/K, ←/→, M, F), auto-hiding controls,
 * lazy source loading, buffering and error states.
 */
export default function CinemaPlayer({ src, poster, title, labels, playSignal = 0 }: CinemaPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFs, setIsFs] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Lazy-load: attach the source only when the player approaches the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { rootMargin: "300px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const play = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    setInView(true);
    try {
      await v.play();
    } catch {
      // Browsers may block audible playback without a direct gesture: retry muted.
      try {
        v.muted = true;
        await v.play();
      } catch {
        /* the user can still press play */
      }
    }
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void play();
    else v.pause();
  }, [play]);

  useEffect(() => {
    if (playSignal > 0) void play();
  }, [playSignal, play]);

  const nudgeControls = useCallback(() => {
    setControlsVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsVisible(false);
    }, 2600);
  }, []);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const wrap = wrapRef.current;
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!wrap || !v) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (wrap.requestFullscreen) {
      await wrap.requestFullscreen();
    } else if (v.webkitEnterFullscreen) {
      v.webkitEnterFullscreen(); // iOS Safari
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.volume === 0) v.volume = 0.6;
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v) return;
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT") return;
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        toggle();
        break;
      case "ArrowRight":
        e.preventDefault();
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
        break;
      case "ArrowLeft":
        e.preventDefault();
        v.currentTime = Math.max(0, v.currentTime - 5);
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        void toggleFullscreen();
        break;
    }
    nudgeControls();
  };

  const retry = () => {
    setError(false);
    videoRef.current?.load();
  };

  const progress = duration ? (time / duration) * 100 : 0;
  const showControls = controlsVisible || !playing;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      role="region"
      aria-label={title}
      onKeyDown={onKeyDown}
      onMouseMove={nudgeControls}
      onTouchStart={nudgeControls}
      className={`group/player relative h-full w-full overflow-hidden bg-ink outline-none ${!showControls ? "cursor-none" : ""}`}
    >
      <video
        ref={videoRef}
        src={inView ? src : undefined}
        poster={poster ?? undefined}
        preload="metadata"
        playsInline
        className="absolute inset-0 h-full w-full object-contain"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          nudgeControls();
        }}
        onPause={() => {
          setPlaying(false);
          setControlsVisible(true);
        }}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
        onError={() => setError(true)}
      />

      {/* Poster play button */}
      {!started && !error && (
        <button
          type="button"
          onClick={() => void play()}
          className="absolute inset-0 z-10 flex items-center justify-center bg-ink/20"
          aria-label={labels.play}
        >
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-rec text-ink transition-transform duration-500 hover:scale-110 md:h-28 md:w-28">
            <Play className="ms-1 h-8 w-8 fill-current" aria-hidden="true" />
          </span>
        </button>
      )}

      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" role="status" aria-label={labels.loading}>
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-bone/15 border-t-rec" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-ink/90 text-center" role="alert">
          <p className="text-sm text-ash">{labels.error}</p>
          <button type="button" onClick={retry} className="inline-flex items-center gap-2 rounded-full border border-bone/25 px-4 py-2 text-sm text-bone hover:border-rec hover:text-rec">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {labels.retry}
          </button>
        </div>
      )}

      {/* Control bar */}
      {started && !error && (
        <div
          dir="ltr"
          className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent px-4 pb-3 pt-12 transition-opacity duration-500 md:px-6 md:pb-5 ${
            showControls ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <input
            type="range"
            className="scrubber block w-full"
            min={0}
            max={duration || 0}
            step={0.05}
            value={time}
            aria-label={labels.seek}
            aria-valuetext={`${formatClock(time)} / ${formatClock(duration)}`}
            style={{ ["--progress" as string]: `${progress}%` }}
            onChange={(e) => {
              const v = videoRef.current;
              if (v) v.currentTime = Number(e.target.value);
              setTime(Number(e.target.value));
            }}
          />
          <div className="mt-2 flex items-center gap-3 text-bone">
            <button type="button" onClick={toggle} aria-label={playing ? labels.pause : labels.play} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bone/10">
              {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            </button>
            <button type="button" onClick={toggleMute} aria-label={muted || volume === 0 ? labels.unmute : labels.mute} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bone/10">
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              aria-label={labels.mute}
              className="scrubber hidden w-20 sm:block"
              style={{ ["--progress" as string]: `${(muted ? 0 : volume) * 100}%` }}
              onChange={(e) => {
                const v = videoRef.current;
                if (!v) return;
                v.volume = Number(e.target.value);
                v.muted = v.volume === 0;
              }}
            />
            <span className="whitespace-nowrap font-mono text-xs tabular-nums text-bone/70">
              {formatClock(time)} <span className="text-bone/30">/</span> {formatClock(duration)}
            </span>
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              aria-label={isFs ? labels.exitFullscreen : labels.fullscreen}
              className="ms-auto flex h-9 w-9 items-center justify-center rounded-full hover:bg-bone/10"
            >
              {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
