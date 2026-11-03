"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig, whatsappLink } from "@/content/site.config";
import { InstagramIcon, LinkedinIcon, TiktokIcon, WhatsappIcon } from "./Icons";
import { Reveal } from "./Reveal";

export default function Contact() {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const socials = [
    siteConfig.socials.instagram && { label: "Instagram", href: siteConfig.socials.instagram, Icon: InstagramIcon, handle: "@geedoo19" },
    siteConfig.socials.tiktok && { label: "TikTok", href: siteConfig.socials.tiktok, Icon: TiktokIcon, handle: "@geedoo26" },
    siteConfig.socials.linkedin && { label: "LinkedIn", href: siteConfig.socials.linkedin, Icon: LinkedinIcon, handle: "Abdelmgeed Owais" },
  ].filter(Boolean) as { label: string; href: string; Icon: React.FC<{ className?: string }>; handle: string }[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-16 pt-24 md:pt-36">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow flex items-center gap-2 border-t hairline pt-6">
            <span className="rec-dot" aria-hidden="true" />
            {t.contact.kicker}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 id="contact-title" className="mt-10 font-display text-[clamp(3rem,10vw,9.5rem)] leading-[0.9] tracking-[-0.03em] text-bone">
            <span className="block">{t.contact.titleA}</span>
            <span className={`block text-bone/60 ${lang === "en" ? "italic" : ""}`}>{t.contact.titleB}</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <Reveal delay={0.1} className="lg:col-span-6">
            <p className="max-w-lg text-base leading-relaxed text-ash md:text-lg">{t.contact.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-rec px-7 text-base font-medium text-ink transition-colors hover:bg-bone"
              >
                <WhatsappIcon className="h-5 w-5" />
                {t.contact.whatsapp}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-bone/25 px-7 text-base text-bone transition-colors hover:border-bone hover:bg-bone hover:text-ink"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {t.contact.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8">
            <dl className="divide-y divide-line border-y border-line text-sm">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="eyebrow">Email</dt>
                <dd className="flex items-center gap-3">
                  <a href={`mailto:${siteConfig.email}`} className="text-bone underline-offset-4 hover:underline" dir="ltr">
                    {siteConfig.email}
                  </a>
                  <button type="button" onClick={copy} aria-label={t.contact.copy} className="flex h-8 w-8 items-center justify-center rounded-full text-ash hover:bg-bone/10 hover:text-bone">
                    {copied ? <Check className="h-3.5 w-3.5 text-rec" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <span className="sr-only" aria-live="polite">{copied ? t.contact.copied : ""}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="eyebrow">WhatsApp</dt>
                <dd>
                  <a href={whatsappLink(lang)} target="_blank" rel="noopener noreferrer" className="font-mono text-bone hover:text-rec" dir="ltr">
                    {siteConfig.phone.replace(/^\+20(\d{3})(\d{3})(\d{4})$/, "+20 $1 $2 $3")}
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="eyebrow">{t.contact.location}</dt>
                <dd className="text-end text-bone">
                  {lang === "ar" ? siteConfig.locationAr : siteConfig.locationEn}
                  <span className="block text-xs text-smoke">{t.contact.availability}</span>
                </dd>
              </div>
            </dl>

            <p className="eyebrow mb-3 mt-10">{t.contact.elsewhere}</p>
            <ul className="divide-y divide-line border-y border-line">
              {socials.map(({ label, href, Icon, handle }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-4 text-bone">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-ash transition-colors group-hover:text-rec" />
                      {label}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-smoke transition-colors group-hover:text-bone">
                      <bdi>{handle}</bdi>
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
