import { Suspense } from "react";
import { getDrivePortfolioData } from "@/lib/drive";
import PortfolioClient from "@/components/PortfolioClient";

// Incremental Static Regeneration: revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

export default async function HomePage() {
  const data = await getDrivePortfolioData();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      }
    >
      <PortfolioClient initialData={data} />
    </Suspense>
  );
}
