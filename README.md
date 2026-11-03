# Cinematic Video Editor Portfolio & Headless Google Drive CMS

A production-grade, award-level personal portfolio and CV website built for a professional video editor & motion designer. 

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
- **Cinematic editorial design**:
  - Ink-black stage, bone-white type and a single "REC" signal colour (`#ff4b2b`); film-grain overlay, timecode and viewfinder motifs.
  - Typography: **Thmanyah Serif Display / Sans** (Arabic), **Instrument Serif**, **Space Grotesk** and **JetBrains Mono** (Latin).
  - Sections: Hero (live monitor of featured cuts) → Showreel → Selected Work (filterable, asymmetric masonry with a lead film) → Services → About → Toolkit → Experience & brands → Contact.
  - Custom showreel player (`components/CinemaPlayer.tsx`): play/pause, scrub, time, mute/volume, fullscreen, keyboard shortcuts (Space/K, ←/→, M, F), lazy source, buffering & error states.
  - Arabic (RTL) default with English (LTR) toggle (also `?lang=en`), persisted across visits.
  - Respects `prefers-reduced-motion` (parallax and reveals collapse to fades).
- **Hover previews**: short muted clips in `public/previews/<driveId>.mp4` play when a project card is hovered (or scrolled into view on phones) and in the hero monitor. Generate or refresh them with `pip install imageio-ffmpeg` then `python scripts/make_previews.py` (existing clips are skipped; Google Drive's daily download quota may require re-running the next day). Projects without a clip simply show their poster. Previews are disabled for reduced-motion and data-saver users.
- **Showreel**: set `showreel.src` in `content/site.config.ts` to a direct MP4/WebM (e.g. `/showreel.mp4` in `public/`, or a CDN URL) to enable the custom player, or `showreel.driveFileId` for a Drive-hosted reel. Until then the slot plays featured projects and is labelled "Featured cut — full showreel coming soon".
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
│   ├── globals.css             # Design tokens, grain, scrubber, marquee
│   ├── layout.tsx              # SEO, fonts, JSON-LD schema
│   ├── opengraph-image.png     # Social card built from real project frames
│   ├── page.tsx                # ISR 300s Server Component
│   ├── robots.ts & sitemap.ts  # Dynamic SEO crawlers
├── components/
│   ├── Header.tsx              # Sticky nav, scroll-spy, language toggle, mobile menu
│   ├── Hero.tsx                # Headline, CTAs, monitor of featured cuts, live stats
│   ├── Showreel.tsx            # Showreel stage (custom player or featured cuts)
│   ├── CinemaPlayer.tsx        # Custom HTML5 video player
│   ├── DriveEmbed.tsx          # Drive/YouTube/Vimeo iframe with loading & fallback
│   ├── WorkSection.tsx         # Filters, lead film, masonry project grid
│   ├── VideoLightbox.tsx       # Modal player, details, prev/next, deep link share
│   ├── Services.tsx            # Editorial service list with frames from real work
│   ├── About.tsx               # Bio, philosophy, approach, facts
│   ├── Toolkit.tsx             # Software confirmed by the CV
│   ├── Experience.tsx          # Background + brands appearing in the work
│   ├── Contact.tsx             # WhatsApp, email, socials
│   ├── Reveal.tsx / Timecode.tsx # Motion primitives
│   └── admin/                  # Dashboard & Login client components
├── content/
│   ├── site.config.ts          # Single source of truth for profile & tools
│   ├── ar.ts                   # Egyptian Arabic localization dictionary
│   └── en.ts                   # English localization dictionary
├── context/
│   └── LanguageContext.tsx     # AR/EN switcher with cookie persistence
├── data/
│   └── sample.json             # Rich fallback dataset for offline/mock mode
├── lib/
│   ├── drive.ts                # Server Drive API v3 mapper & fallback cache
│   ├── admin-auth.ts           # Admin authentication & IP rate limiting
│   ├── portfolio.ts            # Category labels, brand detection, helpers
│   └── usePosterOrder.ts       # Prefers well-framed posters for large stages
├── tests/
│   ├── drive-mapper.test.ts    # Vitest unit tests for title/order/aspect logic
│   └── revalidation.test.ts    # Unit tests for cache invalidation & mock mode
├── ASSUMPTIONS.md              # Detailed record of all technical decisions
└── SETUP.md                    # Exact click-by-click guide in Egyptian Arabic
```

---

## 🛡️ License

Private portfolio template. All rights reserved.
