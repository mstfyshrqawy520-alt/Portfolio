import { describe, it, expect } from "vitest";
import {
  cleanTitle,
  extractOrderPrefix,
  isFeaturedFile,
  isHiddenFile,
  formatDurationMillis,
  extractExternalPlayerUrls,
  slugifyCategory,
} from "../lib/drive";

describe("Drive-as-CMS Sanitizer and Mapper Unit Tests", () => {
  describe("cleanTitle", () => {
    it("strips video extension", () => {
      expect(cleanTitle("Cinematic Reel.mp4")).toBe("Cinematic Reel");
      expect(cleanTitle("Summer Trip.mov")).toBe("Summer Trip");
      expect(cleanTitle("Project Promo.mkv")).toBe("Project Promo");
    });

    it("strips numeric order prefixes like '01 - ', '02_ ', '03. '", () => {
      expect(cleanTitle("01 - Brand Commercial.mp4")).toBe("Brand Commercial");
      expect(cleanTitle("02_Fashion Cut.mp4")).toBe("Fashion Cut");
      expect(cleanTitle("03. Real Estate Showcase.mp4")).toBe("Real Estate Showcase");
      expect(cleanTitle("12 - Sunset Drone.mp4")).toBe("Sunset Drone");
    });

    it("strips star emoji and asterisk markers", () => {
      expect(cleanTitle("⭐ Nike Cyber Motion.mp4")).toBe("Nike Cyber Motion");
      expect(cleanTitle("⭐ 01 - Nike Cyber Motion.mp4")).toBe("Nike Cyber Motion");
      expect(cleanTitle("* 02 - Cairo Vibes.mp4")).toBe("Cairo Vibes");
    });

    it("preserves Arabic titles correctly", () => {
      expect(cleanTitle("⭐ 01 - إعلان شركة أبل.mp4")).toBe("إعلان شركة أبل");
      expect(cleanTitle("02_جولة في فيلا التجمع.mov")).toBe("جولة في فيلا التجمع");
    });
  });

  describe("extractOrderPrefix", () => {
    it("extracts integer prefix correctly", () => {
      expect(extractOrderPrefix("01 - Brand Commercial.mp4")).toBe(1);
      expect(extractOrderPrefix("02_Fashion Cut.mp4")).toBe(2);
      expect(extractOrderPrefix("⭐ 05 - Star Item.mp4")).toBe(5);
      expect(extractOrderPrefix("99. Final Project.mp4")).toBe(99);
    });

    it("returns null if no numeric prefix exists", () => {
      expect(extractOrderPrefix("Nike Commercial.mp4")).toBeNull();
      expect(extractOrderPrefix("⭐ Featured Without Number.mp4")).toBeNull();
    });
  });

  describe("isFeaturedFile", () => {
    it("detects star emoji ⭐ or * at start", () => {
      expect(isFeaturedFile("⭐ 01 - Showreel.mp4")).toBe(true);
      expect(isFeaturedFile("⭐Reel.mp4")).toBe(true);
      expect(isFeaturedFile("* 02 - Highlight.mp4")).toBe(true);
      expect(isFeaturedFile("01 - Ordinary Reel.mp4")).toBe(false);
    });
  });

  describe("isHiddenFile", () => {
    it("detects files or folders starting with _", () => {
      expect(isHiddenFile("_draft_video.mp4")).toBe(true);
      expect(isHiddenFile("_Archive")).toBe(true);
      expect(isHiddenFile("video_final.mp4")).toBe(false);
    });
  });

  describe("formatDurationMillis", () => {
    it("formats milliseconds to MM:SS", () => {
      expect(formatDurationMillis("32000")).toBe("00:32");
      expect(formatDurationMillis(75000)).toBe("01:15");
      expect(formatDurationMillis("125000")).toBe("02:05");
    });

    it("formats hours if duration exceeds 1 hour", () => {
      expect(formatDurationMillis(3665000)).toBe("01:01:05");
    });

    it("handles undefined or zero gracefully", () => {
      expect(formatDurationMillis(undefined)).toBe("00:00");
      expect(formatDurationMillis("0")).toBe("00:00");
    });
  });

  describe("extractExternalPlayerUrls", () => {
    it("extracts YouTube embed URLs if description starts with a YouTube link", () => {
      const desc = "https://www.youtube.com/watch?v=aqz-KE-bpKQ Great commercial shot in Cairo";
      const result = extractExternalPlayerUrls(desc);
      expect(result.youtube).toBe("https://www.youtube.com/embed/aqz-KE-bpKQ");
      expect(result.vimeo).toBeNull();
    });

    it("extracts YouTube short link embed URLs", () => {
      const desc = "https://youtu.be/ScMzIvxBSi4 Color graded in DaVinci";
      const result = extractExternalPlayerUrls(desc);
      expect(result.youtube).toBe("https://www.youtube.com/embed/ScMzIvxBSi4");
    });

    it("extracts Vimeo embed URLs", () => {
      const desc = "https://vimeo.com/76979871 High production short film";
      const result = extractExternalPlayerUrls(desc);
      expect(result.vimeo).toBe("https://player.vimeo.com/video/76979871");
      expect(result.youtube).toBeNull();
    });

    it("returns nulls when description does not start with video link", () => {
      const desc = "Regular video description without any link";
      const result = extractExternalPlayerUrls(desc);
      expect(result.youtube).toBeNull();
      expect(result.vimeo).toBeNull();
    });
  });

  describe("slugifyCategory", () => {
    it("strips emoji and generates clean slug", () => {
      expect(slugifyCategory("🎬 Reels & Shorts")).toBe("reels-shorts");
      expect(slugifyCategory("✨ Commercials & Ads")).toBe("commercials-ads");
      expect(slugifyCategory("🏢 Real Estate")).toBe("real-estate");
    });

    it("handles Arabic category names", () => {
      expect(slugifyCategory("ريلز وإعلانات")).toBe("ريلز-وإعلانات");
    });
  });
});
