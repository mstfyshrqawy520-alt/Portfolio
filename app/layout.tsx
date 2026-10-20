import type { Metadata, Viewport } from "next";
import { Cairo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { siteConfig } from "@/content/site.config";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://abdo-owais.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090d" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.roleAr}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.taglineAr,
  keywords: [
    "عبدالمجيد عويس",
    "Abdelmagid Owais",
    "مونتير فيديو",
    "مخرج إعلاني",
    "Video Editor",
    "Commercial Director",
    "Reels Editor",
    "Real Estate Video",
    "DaVinci Resolve",
    "Premiere Pro",
    "After Effects",
    "Color Grading",
    "Cairo Video Production",
  ],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: siteUrl,
    title: `${siteConfig.name} | ${siteConfig.roleAr}`,
    description: siteConfig.taglineAr,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.roleAr}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.roleAr}`,
    description: siteConfig.taglineAr,
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "ar-EG": siteUrl,
      "en-US": `${siteUrl}?lang=en`,
    },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    jobTitle: siteConfig.roleEn,
    description: siteConfig.taglineEn,
    url: siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [
      siteConfig.socials.instagram,
      siteConfig.socials.youtube,
      siteConfig.socials.behance,
      siteConfig.socials.linkedin,
    ].filter(Boolean),
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${spaceGrotesk.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          href="/fonts/thmanyah/thmanyah-sans-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/thmanyah/thmanyah-sans-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/thmanyah/thmanyah-serif-display-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
