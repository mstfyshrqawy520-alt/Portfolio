"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DriveCMSData, DriveVideoItem } from "@/types/drive";
import { brandsInWork } from "@/lib/portfolio";
import Header from "./Header";
import Hero from "./Hero";
import Showreel from "./Showreel";
import WorkSection from "./WorkSection";
import Services from "./Services";
import About from "./About";
import Toolkit from "./Toolkit";
import Experience from "./Experience";
import Contact from "./Contact";
import Footer from "./Footer";
import VideoLightbox from "./VideoLightbox";

export default function PortfolioClient({ initialData }: { initialData: DriveCMSData }) {
  const searchParams = useSearchParams();
  const { videos, categories, featuredVideos, profileImage } = initialData;

  // Deep link: ?v=VIDEO_ID opens the lightbox on load
  const [selected, setSelected] = useState<DriveVideoItem | null>(() => {
    const id = searchParams.get("v");
    return id ? videos.find((v) => v.id === id) ?? null : null;
  });
  const [navList, setNavList] = useState<DriveVideoItem[]>(videos);
  const [reelSignal, setReelSignal] = useState(0);
  const [workFilterKey, setWorkFilterKey] = useState(0);
  const [workFilter, setWorkFilter] = useState<string | null>(null);

  const featured = featuredVideos.length ? featuredVideos : videos.slice(0, 8);
  const brands = useMemo(() => brandsInWork(videos), [videos]);
  const formats = useMemo(() => {
    const f: string[] = [];
    if (videos.some((v) => v.orientation === "horizontal")) f.push("16:9");
    if (videos.some((v) => v.orientation === "vertical")) f.push("9:16");
    return f;
  }, [videos]);
  const activeCategories = useMemo(() => categories.filter((c) => videos.some((v) => v.categorySlug === c.slug)).length, [categories, videos]);

  const setUrl = (id: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (id) params.set("v", id);
    else params.delete("v");
    const q = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`);
  };

  const open = useCallback((video: DriveVideoItem, list: DriveVideoItem[] = videos) => {
    setNavList(list);
    setSelected(video);
    setUrl(video.id);
  }, [videos]);

  const close = useCallback(() => {
    setSelected(null);
    setUrl(null);
  }, []);

  const watchReel = () => {
    document.getElementById("showreel")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setReelSignal((n) => n + 1);
  };

  const filterWork = (slug: string) => {
    setWorkFilter(slug);
    setWorkFilterKey((k) => k + 1);
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Hero
          featured={featured}
          totalProjects={videos.length}
          totalCategories={activeCategories}
          formats={formats}
          onWatchReel={watchReel}
        />
        <Showreel featured={featured} playSignal={reelSignal} />
        <WorkSection
          key={workFilterKey}
          initialFilter={workFilter ?? "all"}
          categories={categories}
          videos={videos}
          onSelect={open}
        />
        <Services videos={videos} onFilter={filterWork} />
        <About profileImage={profileImage} />
        <Toolkit />
        <Experience totalProjects={videos.length} brands={brands} />
        <Contact />
      </main>
      <Footer />
      <VideoLightbox video={selected} list={navList} onClose={close} onNavigate={(v) => open(v, navList)} />
    </div>
  );
}
