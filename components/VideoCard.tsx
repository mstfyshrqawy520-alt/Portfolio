"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DriveVideoItem } from "@/types/drive";
import { Play, Clock, Sparkles, AlertCircle, Share2 } from "lucide-react";
import { YoutubeIcon } from "@/components/Icons";
import { useLanguage } from "@/context/LanguageContext";

interface VideoCardProps {
  video: DriveVideoItem;
  onSelect: (video: DriveVideoItem) => void;
}

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isVertical = video.orientation === "vertical";
  const hasCustomCover = !!video.customCoverUrl;
  const isYoutube = !!video.youtubeFallbackUrl;

  // Placeholder fallback gradient if thumbnail fails to load
  const fallbackThumbnail =
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";

  return (
    <div
      onClick={() => onSelect(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer glass-card border border-white/10 hover:border-amber-500/50 transition-all duration-300 ${
        isVertical
          ? "aspect-[9/16] row-span-2 col-span-1"
          : "aspect-[16/9] col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(video);
        }
      }}
      aria-label={`${t.work.playVideo}: ${video.title}`}
    >
      {/* Thumbnail Image */}
      <div className="absolute inset-0 bg-slate-900">
        <Image
          src={imgError ? fallbackThumbnail : video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
          unoptimized={video.thumbnailUrl.includes("google")}
        />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-300" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
        {/* Category Chip */}
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-amber-300 border border-white/15 flex items-center gap-1 shadow-sm">
          {video.category.split("(")[0].trim()}
        </span>

        {/* Badges: Featured or Processing or External Player */}
        <div className="flex items-center gap-1.5">
          {video.isFeatured && (
            <span
              className="p-1.5 rounded-full bg-amber-500 text-black shadow-md shadow-amber-500/40"
              title="Featured"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          )}

          {isYoutube && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600/90 text-white backdrop-blur-md flex items-center gap-1"
              title="YouTube Source"
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
              <span>YT</span>
            </span>
          )}

          {video.isProcessing && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/90 text-black backdrop-blur-md flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.work.processing}</span>
            </span>
          )}
        </div>
      </div>

      {/* Center Play Button Facade */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-2xl shadow-amber-500/40 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
          <Play className="w-6 h-6 fill-current ml-0.5" />
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col gap-2">
        <h3 className="font-extrabold text-white text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors drop-shadow-md">
          {video.title}
        </h3>

        {video.description && (
          <p className="text-xs sm:text-sm text-slate-200/90 line-clamp-1 leading-relaxed">
            {video.description.replace(/^https?:\/\/\S+/i, "").trim()}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/15">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{video.formattedDuration}</span>
          </div>

          <span className="text-xs uppercase font-bold text-amber-300/95 bg-white/10 px-2.5 py-0.5 rounded-md">
            {video.aspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
}
