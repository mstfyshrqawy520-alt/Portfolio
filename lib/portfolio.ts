import type { DriveVideoItem } from "@/types/drive";

/** Strip emoji and the "(English)" suffix Drive folder names carry, e.g. "✨ بروموهات (Promos)". */
export function cleanCategoryName(name: string): string {
  return name
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

type CategoryDict = Record<string, { label: string; short: string; blurb: string }>;

export function categoryLabel(slug: string, fallbackName: string, dict: CategoryDict, short = false) {
  const entry = dict[slug];
  if (entry) return short ? entry.short : entry.label;
  return cleanCategoryName(fallbackName);
}

export function categoryBlurb(slug: string, dict: CategoryDict): string {
  return dict[slug]?.blurb ?? "";
}

export function posterFor(video: DriveVideoItem): string {
  return video.customCoverUrl || video.thumbnailUrl;
}

/** Duration is only shown when Drive actually reported one. */
export function hasRealDuration(video: DriveVideoItem): boolean {
  return Boolean(video.durationMillis && video.durationMillis > 0 && video.formattedDuration && video.formattedDuration !== "00:00");
}

export function embedUrlFor(video: DriveVideoItem, autoplay = true): string {
  if (video.youtubeFallbackUrl) return `${video.youtubeFallbackUrl}${video.youtubeFallbackUrl.includes("?") ? "&" : "?"}autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
  if (video.vimeoFallbackUrl) return `${video.vimeoFallbackUrl}${video.vimeoFallbackUrl.includes("?") ? "&" : "?"}autoplay=${autoplay ? 1 : 0}&dnt=1`;
  return video.previewUrl;
}

export function driveViewUrl(video: DriveVideoItem): string | null {
  if (video.youtubeFallbackUrl || video.vimeoFallbackUrl) return null;
  return `https://drive.google.com/file/d/${video.id}/view`;
}

/** Pad an index as a timecode-like label: 1 → "001". */
export const pad = (n: number, size = 2) => String(n).padStart(size, "0");

/** Seconds → "00:00" */
export function formatClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${pad(m)}:${pad(s)}`;
}

/**
 * Brand / project names that appear in the actual video titles.
 * Names are written as they appear in the work. Each entry lists title fragments; a name is only shown
 * when at least one current video title matches, so nothing is invented.
 */
const BRAND_PATTERNS: { name: string; match: RegExp }[] = [
  { name: "Artas — أرتاس للتطوير العقاري", match: /artas|أرتاس|ارتاس/i },
  { name: "QMM E3mar", match: /qmm/i },
  { name: "مطارح العقارية", match: /مطارح/ },
  { name: "أعيان العقارية", match: /أعيان|اعيان/ },
  { name: "إشراق العقارية", match: /إشراق|اشراق/ },
  { name: "امتثال المساكن", match: /امتثال/ },
  { name: "Ishbilia — إشبيلية", match: /ishbilia|إشبيلية|اشبيلية/i },
  { name: "Mazaya Mall", match: /mazaya/i },
  { name: "Cairo Mall", match: /cairo mall/i },
  { name: "Gilan", match: /gilan/i },
  { name: "بوابة الصفوة", match: /بوابة الصفوة/ },
  { name: "محافظ التميز", match: /محافظ التميز/ },
  { name: "الدلتا", match: /الدلتا/ },
];

export function brandsInWork(videos: DriveVideoItem[]): string[] {
  const haystack = videos.map((v) => `${v.title} ${v.originalName}`).join(" \n ");
  return BRAND_PATTERNS.filter((b) => b.match.test(haystack)).map((b) => b.name);
}
