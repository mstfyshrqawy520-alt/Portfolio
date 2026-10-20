import { MetadataRoute } from "next";
import { siteConfig } from "@/content/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} - ${siteConfig.roleAr}`,
    short_name: siteConfig.name,
    description: siteConfig.taglineAr,
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
