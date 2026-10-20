"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DriveCMSData, DriveVideoItem } from "@/types/drive";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import WorkSection from "./WorkSection";
import Services from "./Services";
import Contact from "./Contact";
import Footer from "./Footer";
import VideoLightbox from "./VideoLightbox";

interface PortfolioClientProps {
  initialData: DriveCMSData;
}

export default function PortfolioClient({ initialData }: PortfolioClientProps) {
  const searchParams = useSearchParams();
  const [selectedVideo, setSelectedVideo] = useState<DriveVideoItem | null>(null);

  // Deep linking: If ?v=VIDEO_ID is present, open lightbox directly
  useEffect(() => {
    const videoId = searchParams.get("v");
    if (videoId) {
      const match = initialData.videos.find((v) => v.id === videoId);
      if (match) {
        setSelectedVideo(match);
      }
    }
  }, [searchParams, initialData.videos]);

  const handleSelectVideo = (video: DriveVideoItem) => {
    setSelectedVideo(video);
    const params = new URLSearchParams(window.location.search);
    params.set("v", video.id);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleCloseLightbox = () => {
    setSelectedVideo(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("v");
    const query = params.toString() ? `?${params.toString()}` : "";
    const newUrl = `${window.location.pathname}${query}`;
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#08090d] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300">
      {/* Sticky Header with ScrollSpy */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section + Featured Showreel Strip */}
        <Hero
          featuredVideos={initialData.featuredVideos}
          profileImage={initialData.profileImage}
          cvUrl={initialData.cvUrl}
          onSelectVideo={handleSelectVideo}
        />

        {/* 2. About + Skills Marquee */}
        <About />

        {/* 3. Experience Timeline (CV-Style) */}
        <Experience />

        {/* 4. Work Section (Category chips, Bento/Masonry Grid, Click-to-load Facade) */}
        <WorkSection
          categories={initialData.categories}
          videos={initialData.videos}
          onSelectVideo={handleSelectVideo}
        />

        {/* 5. Services Section */}
        <Services />

        {/* 6. Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fullscreen Video Lightbox Modal */}
      <VideoLightbox
        video={selectedVideo}
        allVideos={initialData.videos}
        onClose={handleCloseLightbox}
        onNavigate={handleSelectVideo}
      />
    </div>
  );
}
