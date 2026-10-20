"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DriveVideoItem } from "@/types/drive";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface VideoLightboxProps {
  video: DriveVideoItem | null;
  allVideos: DriveVideoItem[];
  onClose: () => void;
  onNavigate: (video: DriveVideoItem) => void;
}

export default function VideoLightbox({
  video,
  allVideos,
  onClose,
  onNavigate,
}: VideoLightboxProps) {
  const { lang, dir, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Sync current index for Prev / Next
  const currentIndex = video
    ? allVideos.findIndex((v) => v.id === video.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIframeLoaded(false);
      onNavigate(allVideos[currentIndex - 1]);
    }
  }, [currentIndex, allVideos, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < allVideos.length - 1) {
      setIframeLoaded(false);
      onNavigate(allVideos[currentIndex + 1]);
    }
  }, [currentIndex, allVideos, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (dir === "rtl") handleNext();
        else handlePrev();
      } else if (e.key === "ArrowRight") {
        if (dir === "rtl") handlePrev();
        else handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [video, dir, handleNext, handlePrev, onClose]);

  if (!video) return null;

  // Determine embed source
  let embedUrl = video.previewUrl;
  let isExternal = false;

  if (video.youtubeFallbackUrl) {
    embedUrl = `${video.youtubeFallbackUrl}?autoplay=1&rel=0`;
    isExternal = true;
  } else if (video.vimeoFallbackUrl) {
    embedUrl = `${video.vimeoFallbackUrl}?autoplay=1`;
    isExternal = true;
  } else if (video.id.startsWith("mock-")) {
    embedUrl = "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0";
    isExternal = true;
  } else if (embedUrl.includes("drive.google.com")) {
    embedUrl = `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`;
  }

  const handleCopyShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?v=${video.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const isVertical = video.orientation === "vertical";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Lightbox Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full flex flex-col glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${
          isVertical ? "max-w-lg max-h-[95vh]" : "max-w-5xl max-h-[95vh]"
        }`}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {video.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{video.formattedDuration}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Link Button */}
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title={t.work.lightbox.share}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.work.lightbox.shareCopied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.work.lightbox.share}</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title={t.work.lightbox.close}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame Area */}
        <div
          className={`relative w-full bg-black flex items-center justify-center ${
            isVertical ? "aspect-[9/16] max-h-[70vh]" : "aspect-[16/9] max-h-[68vh]"
          }`}
        >
          {/* Skeleton Spinner while iframe loads */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 z-10">
              <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
              <span className="text-xs text-slate-400">
                {isExternal ? t.work.lightbox.externalFallback : t.work.lightbox.drivePreview}
              </span>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIframeLoaded(true)}
          />

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-amber-500 text-white hover:text-black border border-white/10 transition-all z-20 shadow-lg shadow-black/40"
              title={t.work.lightbox.prev}
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < allVideos.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-amber-500 text-white hover:text-black border border-white/10 transition-all z-20 shadow-lg shadow-black/40"
              title={t.work.lightbox.next}
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Caption & Metadata Footer */}
        <div className="p-4 sm:p-6 bg-[#0c0e15] border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
              {video.title}
            </h2>
            <span dir="ltr" className="text-xs text-slate-500 whitespace-nowrap font-mono">
              {currentIndex + 1} / {allVideos.length}
            </span>
          </div>

          {video.description && (
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-h-24 overflow-y-auto pr-1">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
