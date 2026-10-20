"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryGroup, DriveVideoItem } from "@/types/drive";
import VideoCard from "./VideoCard";
import { useLanguage } from "@/context/LanguageContext";
import { Film, Filter, Inbox } from "lucide-react";

interface WorkSectionProps {
  categories: CategoryGroup[];
  videos: DriveVideoItem[];
  onSelectVideo: (video: DriveVideoItem) => void;
}

export default function WorkSection({
  categories,
  videos,
  onSelectVideo,
}: WorkSectionProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected category slug ("all" or specific slug)
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Number of visible videos (starts at 8, loads in batches of 8)
  const INITIAL_COUNT = 8;
  const BATCH_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);

  // Read ?cat= from URL on load
  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) {
      // Verify if slug exists in categories
      const exists = categories.some((c) => c.slug === catParam);
      if (exists) {
        setSelectedCategory(catParam);
        setVisibleCount(INITIAL_COUNT);
      }
    }
  }, [searchParams, categories]);

  // Handle category change and sync with URL
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setVisibleCount(INITIAL_COUNT);
    const params = new URLSearchParams(window.location.search);
    if (slug === "all") {
      params.delete("cat");
    } else {
      params.set("cat", slug);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}#work`;
    window.history.replaceState(null, "", newUrl);
  };

  // Filter videos based on selected category
  const filteredVideos =
    selectedCategory === "all"
      ? videos
      : videos.filter((v) => v.categorySlug === selectedCategory);

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  return (
    <section id="work" className="py-24 relative overflow-hidden bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold glass-panel text-amber-400 border border-amber-500/20">
            <Film className="w-3.5 h-3.5" />
            <span>{t.work.title}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.work.subtitle}
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full my-1" />
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {/* "All" Category Pill */}
          <button
            onClick={() => handleCategoryChange("all")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105"
                : "glass-panel text-slate-200 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            <span>{t.work.allCategory}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedCategory === "all"
                  ? "bg-black/25 text-black"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {videos.length}
            </span>
          </button>

          {/* Sub-Folder Category Pills */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105"
                    : "glass-panel text-slate-200 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isSelected
                      ? "bg-black/25 text-black"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Videos Grid */}
        {displayedVideos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">
              {displayedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onSelect={onSelectVideo}
                />
              ))}
            </div>

            {/* Load More Button or Finished State */}
            {hasMore ? (
              <div className="flex flex-col items-center justify-center gap-3 mt-14">
                <button
                  onClick={() => setVisibleCount((prev) => prev + BATCH_SIZE)}
                  className="px-8 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black flex items-center gap-2.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{t.work.loadMore}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-black/20 text-black font-extrabold">
                    +{Math.min(BATCH_SIZE, filteredVideos.length - visibleCount)}
                  </span>
                </button>
                <span className="text-xs text-slate-400">
                  {t.work.showingCount
                    ?.replace("{count}", String(displayedVideos.length))
                    .replace("{total}", String(filteredVideos.length))}
                </span>
              </div>
            ) : filteredVideos.length > INITIAL_COUNT ? (
              <div className="text-center mt-12 text-xs font-medium text-slate-400">
                {t.work.allShown?.replace("{total}", String(filteredVideos.length))}
              </div>
            ) : null}
          </>
        ) : (
          /* Empty State */
          <div className="glass-panel max-w-md mx-auto p-10 rounded-2xl border border-white/10 text-center flex flex-col items-center gap-3">
            <Inbox className="w-12 h-12 text-slate-500 mb-1" />
            <h3 className="text-base font-bold text-white">
              {t.work.noVideosFound}
            </h3>
            <button
              onClick={() => handleCategoryChange("all")}
              className="mt-2 px-4 py-2 rounded-full text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
            >
              {t.work.allCategory}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
