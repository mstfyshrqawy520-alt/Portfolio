# Technical & Product Assumptions

This document records all decisions and assumptions made during the design, development, and architecture of the Google Drive-powered personal portfolio/CV website.

---

## 1. CMS Architecture & Google Drive Integration
- **Server-Side Exclusivity**: `GOOGLE_API_KEY` is strictly used server-side in `lib/drive.ts`. The client browser never receives or needs the API key.
- **Drive Folder Permissions**: The Google Drive root folder (`10jSZM8JUKCd08C4R-TL3q57cbDj9GKE7`) is shared as *"Anyone with the link – Viewer"*. This enables public thumbnail fetching and standard Drive preview iframe loading.
- **Folder Recursion (Depth 2)**:
  - Root folder = site root files (`CV.pdf`, `profile.jpg`) and general/uncategorized videos.
  - Depth 1 subfolders = public categories (e.g. `🎬 Reels & Shorts`, `✨ Commercials & Ads`, `🏢 Real Estate Tours`).
  - Depth 2 = video files and companion cover images inside those category subfolders.
- **Fault-Tolerant Stale Fallback**:
  - If Google Drive API returns an HTTP error, quota exceeded (429), or network timeout, the application logs the error and serves the last successfully cached dataset.
  - If no live data has ever been fetched (e.g. fresh installation or missing `GOOGLE_API_KEY`), the site falls back to `data/sample.json` so the app is always fully interactive.
- **ISR & Cache Invalidation**:
  - The homepage uses Next.js ISR with `export const revalidate = 300` (5 minutes).
  - An on-demand revalidation endpoint `POST /api/revalidate` is provided for immediate cache flushing via header secret `REVALIDATE_SECRET` or the Admin Dashboard "Refresh Now" button.

---

## 2. Drive-as-CMS File Naming Conventions
- **Clean Titles**: Numeric prefixes (`01 - `, `02_`, `03.`) and star markers (`⭐`, `*`) are automatically stripped from titles, preserving clean, human-readable video titles.
- **Sorting Hierarchy**: Items with explicit numerical prefixes sort ascending (`01`, `02`, `03`), followed by items without prefixes sorted newest `createdTime` first.
- **Featured Videos**: Files prefixed with a star emoji `⭐` or `*` are marked as featured and displayed in the Hero Showreel Strip.
- **Hidden Drafts**: Any file or folder prefixed with an underscore `_` (e.g. `_draft_reel.mp4`) is filtered out and ignored.
- **Custom Covers**: An image file (`.jpg`, `.png`, `.webp`) uploaded to the same folder with the exact same base name as a video is automatically used as the high-resolution cover. If omitted, Google Drive's generated thumbnail (`=s1280`) is used.
- **Quota Bypass / External Player**: If the Google Drive file `Description` starts with a YouTube or Vimeo URL, the player automatically embeds the YouTube/Vimeo player in the Lightbox, bypassing Drive preview quotas on large files.
- **Orientation & Processing**:
  - If `videoMediaMetadata` reports `height > width`, the video card renders as vertical (9:16 aspect ratio).
  - If `width >= height`, the video card renders as horizontal (16:9 aspect ratio).
  - If Drive hasn't finished video encoding (`videoMediaMetadata` is missing), the item is still listed with a "Processing" badge and an audit warning in `/admin`.

---

## 3. Profile & Content Customization
- **Persona**: **Abdelmgeed Owais (عبدالمجيد عويس)**, Video Editor & Motion Designer. Name spelling, email, education, tools and skills come from his CV; WhatsApp, Instagram and TikTok from the previous live site (`masymas99.github.io/AbdoOwais/`).
- **No fabricated content**: the earlier invented experience timeline, "Curated" stock-image projects (Nike, Porsche…), placeholder durations, placeholder email/YouTube/Behance links and the "Senior / Commercial Director" title were removed. Stats on the page (project count, disciplines, formats) are computed from the live library. The "Names that appear in the work" strip lists only brands whose names occur in real video titles (`lib/portfolio.ts`).
- **Tools**: only software confirmed by the CV is shown (After Effects, Photoshop, Adobe XD, Canva). Add ids such as `pr` or `dv` in `site.config.ts` if they are really used.
- **Single Source of Truth**: All text, bio, social links, contact info, and tools are centralized in:
  - `content/site.config.ts` (profile details, tools, social URLs, WhatsApp number)
  - `content/ar.ts` (Arabic localization dictionary)
  - `content/en.ts` (English localization dictionary)
- **Feature Flags**:
  - `features.courses`: `false` (default OFF)
  - `features.testimonials`: `false` (default OFF)
  - `features.stats`: `false` (default OFF)
  - No fabricated statistics, testimonials, or fake client logos were created.

---

## 4. UI/UX, Aesthetics & Internationalization
- **Bilingual & RTL-First**: Egyptian Arabic is the primary default language with standard `dir="rtl"`. English toggle is available in the header and persists across visits via `portfolio_lang` in `localStorage` and `NEXT_LOCALE` cookie.
- **Cinematic Aesthetic**: Dark-only ink-black interface (`#070707`), bone-white type, single REC-red accent (`#ff4b2b`), film grain, timecode/viewfinder motifs; no glassmorphism or gradient decoration.
- **Accessibility & Motion**: All CSS animations respect `@media (prefers-reduced-motion: reduce)`.
- **Performance / Facade Playback**:
  - Video cards are click-to-load facades with optimized thumbnails and duration badges. Zero video iframes are loaded on page load.
  - Video iframes load only inside the VideoLightbox when a user clicks a video card, ensuring Lighthouse Performance >= 95.

---

## 5. Admin Dashboard (`/admin`)
- **Password Protection**: Protected via `ADMIN_PASSWORD` server verification setting a secure, `httpOnly` cookie (`gedo_admin_session`).
- **Rate Limiting**: IP-based sliding window rate limits login attempts (max 5 failed attempts per minute, triggers a 60-second cooldown).
- **Diagnostics & Health**:
  - Audits empty folders, processing videos, missing covers, and duplicate video titles.
  - Provides a one-click "Refresh Now" button calling `/api/revalidate`.
  - Includes a quick-reference cheat sheet for uploading videos to Drive.
  - Dedicated `GET /api/health` JSON endpoint for uptime and Drive connection monitoring.
