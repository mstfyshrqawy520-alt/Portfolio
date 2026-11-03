/**
 * Single source of truth for personal details.
 *
 * Every value here is verified against the CV (MyCv.pdf) or the previous
 * live portfolio (masymas99.github.io/AbdoOwais). Do not add clients, awards,
 * stats or tools that are not confirmed — the site renders whatever is listed.
 */

export type ToolId = "ae" | "ps" | "xd" | "canva" | "pr" | "dv" | "au" | "c4d" | "blender";

export interface SiteConfig {
  name: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  taglineAr: string;
  taglineEn: string;
  locationAr: string;
  locationEn: string;
  email: string;
  phone: string;
  whatsappNumber: string; // international format, digits only
  whatsappPrefilledAr: string;
  whatsappPrefilledEn: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    behance?: string;
    vimeo?: string;
    youtube?: string;
  };
  /**
   * SHOWREEL
   * - `src`: a direct, streamable video file (e.g. "/showreel.mp4" placed in /public,
   *   or a CDN/Cloudinary/Bunny URL). Enables the custom cinematic player.
   * - `driveFileId`: alternatively, a Google Drive file id (Drive's own player is used).
   * - `poster`: optional still frame for the player.
   * When both are null the site shows a featured project in the showreel slot and
   * labels it "Featured cut — full showreel coming soon".
   */
  showreel: {
    src: string | null;
    driveFileId: string | null;
    poster: string | null;
  };
  /** Software confirmed by the CV. Add more ids (pr, dv, au…) only if they are really used. */
  tools: ToolId[];
  features: {
    courses: boolean;
    testimonials: boolean;
    stats: boolean;
  };
}

export const siteConfig: SiteConfig = {
  name: "عبدالمجيد عويس",
  nameEn: "Abdelmgeed Owais",
  roleAr: "مونتير فيديو ومصمم موشن جرافيك",
  roleEn: "Video Editor & Motion Designer",
  taglineAr:
    "مونتاج ريلز وبروموهات وأفلام عقارية وموشن جرافيك — بإيقاع محسوب وتفاصيل بصرية مصنوعة بعناية.",
  taglineEn:
    "Editing reels, promos, real-estate films and motion graphics — with deliberate pacing and carefully crafted visual detail.",
  locationAr: "منوف، المنوفية — مصر",
  locationEn: "Menouf, Minufia — Egypt",
  email: "abdoowaiss138@gmail.com",
  phone: "+201505627204",
  whatsappNumber: "201505627204",
  whatsappPrefilledAr: "أهلاً عبدالمجيد، شفت معرض أعمالك وحابب أتكلم معاك عن مشروع فيديو.",
  whatsappPrefilledEn: "Hi Abdelmgeed, I saw your portfolio and would like to talk about a video project.",
  socials: {
    instagram: "https://www.instagram.com/geedoo19/",
    tiktok: "https://www.tiktok.com/@geedoo26",
    linkedin: "https://www.linkedin.com/in/abdelmgeed-owais-b03a73336",
  },
  showreel: {
    src: null,
    driveFileId: null,
    poster: null,
  },
  tools: ["ae", "ps", "xd", "canva"],
  features: {
    courses: false,
    testimonials: false,
    stats: false,
  },
};

export const whatsappLink = (lang: "ar" | "en") =>
  `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    lang === "ar" ? siteConfig.whatsappPrefilledAr : siteConfig.whatsappPrefilledEn
  )}`;
