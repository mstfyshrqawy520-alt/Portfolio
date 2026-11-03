import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const title = `${siteConfig.nameEn} — ${siteConfig.roleEn}`;
const description = `${siteConfig.taglineEn} ${siteConfig.taglineAr}`;

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ${title}`,
    template: `%s | ${siteConfig.nameEn}`,
  },
  description,
  keywords: [
    siteConfig.name,
    siteConfig.nameEn,
    "Video Editor",
    "Motion Designer",
    "مونتير فيديو",
    "موشن جرافيك",
    "Real Estate Video Editing",
    "مونتاج فيديوهات عقارية",
    "Reels Editor",
    "Promo Editing",
    "Google Earth Animation",
    "After Effects",
    "Egypt",
  ],
  authors: [{ name: siteConfig.nameEn, url: siteUrl }],
  creator: siteConfig.nameEn,
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: siteUrl,
    title,
    description: siteConfig.taglineEn,
    siteName: siteConfig.nameEn,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.taglineEn,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.nameEn,
    alternateName: siteConfig.name,
    jobTitle: siteConfig.roleEn,
    description: siteConfig.taglineEn,
    url: siteUrl,
    image: `${siteUrl}/profile.jpg`,
    email: `mailto:${siteConfig.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Menouf", addressRegion: "Minufia", addressCountry: "EG" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Menoufia University" },
    sameAs: Object.values(siteConfig.socials).filter(Boolean),
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${grotesk.variable} ${serif.variable} ${mono.variable} scroll-smooth scroll-pt-20 motion-reduce:scroll-auto`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" href="/fonts/thmanyah/thmanyah-sans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/thmanyah/thmanyah-serif-display-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }} />
      </head>
      <body className="grain antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
