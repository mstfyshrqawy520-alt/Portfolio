import { MetadataRoute } from "next";
import { getDrivePortfolioData } from "@/lib/drive";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abdo-owais.com";

  const data = await getDrivePortfolioData();

  const categoryUrls: MetadataRoute.Sitemap = data.categories.map((cat) => ({
    url: `${baseUrl}?cat=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...categoryUrls,
  ];
}
