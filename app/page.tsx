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
        <div className="flex min-h-screen items-center justify-center bg-ink">
          <span className="rec-dot" aria-label="Loading" />
        </div>
      }
    >
      <PortfolioClient initialData={data} />
    </Suspense>
  );
}
