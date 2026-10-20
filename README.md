# Cinematic Video Editor Portfolio & Headless Google Drive CMS

A production-grade, award-level personal portfolio and CV website built for high-end video editors, commercial directors, and motion designers. 

Powered by **Google Drive as a zero-maintenance Headless CMS**: drop a video into your Google Drive folder, and the site automatically displays it within ~5 minutes via Next.js ISR (or instantly on demand)—with zero code editing, git pushes, or redeployments.

---

## 🌟 Key Features

- **Google Drive as Headless CMS (`lib/drive.ts`)**:
  - Automatically maps root subfolders into interactive category filter pills.
  - Cleans title formatting (strips extension and ordering prefixes like `01 - `, `02_`).
  - Detects aspect ratios (`9:16` vertical reels vs `16:9` horizontal films) and duration from Google Drive's `videoMediaMetadata`.
  - Automatic custom cover image detection (e.g. `video.jpg` matching `video.mp4`).
  - Hero Showreel Strip: videos prefixed with `⭐` are automatically featured in the Hero marquee.
  - Hidden drafts support: files or folders starting with `_` are excluded.
  - Quota bypass fallback: if a video's Drive description starts with a YouTube or Vimeo URL, that player is embedded instead to bypass preview quotas on heavy files.
  - Automatic CV (`CV.pdf`) and avatar (`profile.jpg`) discovery from the root folder.
- **Click-to-Load Video Playback Facade**:
  - Zero iframes loaded on page load, guaranteeing Lighthouse mobile performance scores >= 95.
  - Lightbox modal with full keyboard controls (`Esc`, `ArrowLeft`, `ArrowRight`), prev/next navigation, deep linking (`?v=ID`), and one-click share link copying with toast notifications.
- **Cinematic Bespoke Aesthetics**:
  - Deep obsidian dark mode by default (`#08090d`) with subtle ambient glows and glassmorphism.
  - Light mode toggle with smooth theme transition.
  - Arabic (RTL) default with seamless English (LTR) toggle, persisted across visits.
  - Curated typography using `next/font`: **Cairo** for Arabic and **Space Grotesk** for Latin.
  - Respects `prefers-reduced-motion`.
- **Sync Admin Dashboard (`/admin`)**:
  - Protected with `ADMIN_PASSWORD` via secure `httpOnly` session cookies.
  - IP-based sliding window rate limiting.
  - Real-time video count, vertical vs horizontal breakdown, and category statistics.
  - Diagnostic audits: empty folders, videos still processing, missing thumbnails, duplicate names.
  - "Refresh Now" button that clears the cache and triggers on-demand revalidation in under a second.
  - Interactive "How to add a video" Drive-as-CMS cheat sheet.
- **Production-Grade Architecture**:
  - Next.js 16+ App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Lucide React.
  - Server-side Drive API calls (`GOOGLE_API_KEY` is never exposed to the client).
  - Stale-while-revalidate fallback: if Google Drive hits quota or experiences connection failure, the site continues serving cached data gracefully.
  - Mock mode: if API keys are not supplied, the app automatically serves `data/sample.json` out of the box.
  - Complete security headers (Content-Security-Policy, X-Frame-Options, HSTS, Referrer-Policy).
  - Dynamic SEO: OpenGraph preview image generator, `sitemap.ts`, `robots.ts`, PWA `manifest.ts`, and JSON-LD `Person` schema markup.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Running Locally in Mock Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio with high-resolution sample video assets and full interactivity.

### 3. Running Unit Tests
```bash
npm run test
```

### 4. Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and set your credentials:

```env
GOOGLE_API_KEY="AIzaSy..."
DRIVE_FOLDER_ID="10jSZM8JUKCd08C4R-TL3q57cbDj9GKE7"
ADMIN_PASSWORD="YourSecureAdminPassword"
REVALIDATE_SECRET="YourSecretRevalidationToken"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

For click-by-click instructions on obtaining the Google Drive API key and setting up Vercel, refer to [SETUP.md](./SETUP.md) (in Egyptian Arabic).

---

## 📁 Project Structure

```
├── app/
│   ├── admin/page.tsx          # Admin Sync Dashboard & Login
│   ├── api/
│   │   ├── admin/              # Admin Login & Logout handlers
│   │   ├── health/route.ts     # Health & sync status JSON endpoint
│   │   └── revalidate/route.ts # On-demand ISR revalidation webhook
│   ├── globals.css             # Glassmorphism, ambient glow, RTL tokens
│   ├── layout.tsx              # SEO, Cairo/Space fonts, JSON-LD schema
│   ├── opengraph-image.tsx     # Dynamic social card generation
│   ├── page.tsx                # ISR 300s Server Component
│   ├── robots.ts & sitemap.ts  # Dynamic SEO crawlers
├── components/
│   ├── Header.tsx              # Sticky nav, scroll-spy, language/theme toggle
│   ├── Hero.tsx                # Headline, CTAs, profile card, showreel strip
│   ├── About.tsx               # Bio & infinite tools marquee
│   ├── Experience.tsx          # CV-style chronological timeline
│   ├── WorkSection.tsx         # Category pills, URL query sync, bento grid
│   ├── VideoCard.tsx           # Click-to-load facade (zero initial iframes)
│   ├── VideoLightbox.tsx       # Modal player, YouTube fallback, deep link share
│   ├── Services.tsx            # Service cards with direct WhatsApp triggers
│   ├── Contact.tsx             # WhatsApp & mailto deep links
│   ├── Footer.tsx              # Brand, socials, back-to-top, sync entry
│   └── admin/                  # Dashboard & Login client components
├── content/
│   ├── site.config.ts          # Single source of truth for profile & tools
│   ├── ar.ts                   # Egyptian Arabic localization dictionary
│   └── en.ts                   # English localization dictionary
├── context/
│   ├── LanguageContext.tsx     # AR/EN switcher with cookie persistence
│   └── ThemeContext.tsx        # Dark/Light theme manager
├── data/
│   └── sample.json             # Rich fallback dataset for offline/mock mode
├── lib/
│   ├── drive.ts                # Server Drive API v3 mapper & fallback cache
│   ├── admin-auth.ts           # Admin authentication & IP rate limiting
│   └── theme.ts                # Cinematic color palette tokens
├── tests/
│   ├── drive-mapper.test.ts    # Vitest unit tests for title/order/aspect logic
│   └── revalidation.test.ts    # Unit tests for cache invalidation & mock mode
├── ASSUMPTIONS.md              # Detailed record of all technical decisions
└── SETUP.md                    # Exact click-by-click guide in Egyptian Arabic
```

---

## 🛡️ License

Private portfolio template. All rights reserved.
