export interface SiteConfig {
  name: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  taglineAr: string;
  taglineEn: string;
  email: string;
  phone: string;
  whatsappNumber: string; // e.g. "201505627204" (no + or spaces)
  whatsappPrefilledAr: string;
  whatsappPrefilledEn: string;
  socials: {
    instagram?: string;
    youtube?: string;
    behance?: string;
    linkedin?: string;
    tiktok?: string;
    vimeo?: string;
  };
  features: {
    courses: boolean; // default OFF
    testimonials: boolean; // default OFF
    stats: boolean; // default OFF
  };
  tools: {
    name: string;
    icon?: string;
    category: "editing" | "motion" | "color" | "audio" | "3d";
  }[];
}

export const siteConfig: SiteConfig = {
  name: "عبدالمجيد عويس",
  nameEn: "Abdelmagid Owais",
  roleAr: "مونتير فيديو محترف ومخرج إعلاني",
  roleEn: "Senior Video Editor & Commercial Director",
  taglineAr: "صناعة محتوى بصري عالي التأثير يخطف الأنظار ويحقق نتائج استثنائية للعلامات التجارية وصناع المحتوى.",
  taglineEn: "Crafting high-impact visual stories that captivate audiences and drive measurable results for brands and creators.",
  email: "contact@abdo-owais.com",
  phone: "+201505627204",
  whatsappNumber: "201505627204",
  whatsappPrefilledAr: "مرحباً عبدالمجيد، شاهدت معرض أعمالك وأريد الاستفسار عن مشروع مونتاج جديد.",
  whatsappPrefilledEn: "Hi Abdelmagid, I saw your portfolio and would like to discuss a video project.",
  socials: {
    instagram: "https://instagram.com/abdo_owais",
    youtube: "https://youtube.com/@abdo_owais",
    behance: "https://behance.net/abdo_owais",
    linkedin: "https://linkedin.com/in/abdo-owais",
  },
  features: {
    courses: false,
    testimonials: false,
    stats: false,
  },
  tools: [
    { name: "Adobe Premiere Pro", category: "editing" },
    { name: "After Effects", category: "motion" },
    { name: "DaVinci Resolve Studio", category: "color" },
    { name: "Adobe Audition", category: "audio" },
    { name: "Blender 3D", category: "3d" },
    { name: "Cinema 4D", category: "3d" },
    { name: "Adobe Photoshop", category: "editing" },
    { name: "Color Grading (ACES / Film Emulation)", category: "color" },
    { name: "Sound Design & Foley", category: "audio" },
    { name: "Kinetic Typography", category: "motion" },
  ],
};
