import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getDrivePortfolioData, clearDriveDataCache } from "../lib/drive";

describe("Drive CMS Cache & Revalidation Behavior", () => {
  beforeEach(() => {
    clearDriveDataCache();
  });

  afterEach(() => {
    clearDriveDataCache();
  });

  it("serves sample mock data cleanly when env credentials are empty", async () => {
    delete process.env.GOOGLE_API_KEY;
    delete process.env.DRIVE_FOLDER_ID;

    const data = await getDrivePortfolioData();
    expect(data.isMock).toBe(true);
    expect(data.videos.length).toBeGreaterThan(0);
    expect(data.categories.length).toBeGreaterThan(0);
    expect(data.featuredVideos.length).toBeGreaterThan(0);
    expect(data.stats.totalVideos).toBe(data.videos.length);
  });

  it("clears cache successfully when clearDriveDataCache is invoked", async () => {
    clearDriveDataCache();
    const data = await getDrivePortfolioData();
    expect(data).toBeDefined();
  });
});
