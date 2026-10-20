import { NextResponse } from "next/server";
import { getDrivePortfolioData, getCachedDriveData } from "@/lib/drive";

export async function GET() {
  const startTime = Date.now();
  const cached = getCachedDriveData();
  const isDriveConfigured = !!(
    process.env.GOOGLE_API_KEY && process.env.DRIVE_FOLDER_ID
  );

  let dataStatus = "healthy";
  let videoCount = cached?.stats.totalVideos || 0;
  let isMock = !isDriveConfigured;

  try {
    const data = await getDrivePortfolioData();
    videoCount = data.stats.totalVideos;
    isMock = data.isMock;
  } catch {
    dataStatus = "degraded";
  }

  return NextResponse.json({
    status: dataStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - startTime,
    drive: {
      configured: isDriveConfigured,
      isMock,
      totalVideos: videoCount,
      lastSync: cached?.lastSyncTime || null,
      warningsCount: cached?.warnings.length || 0,
    },
    environment: process.env.NODE_ENV,
  });
}
