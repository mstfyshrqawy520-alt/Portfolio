"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/content/site.config";

const SECTIONS = ["showreel", "work", "services", "about", "contact"] as const;

export default function Header() {
  const { t, lang, toggleLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu first, then scroll once the body scroll-lock is released.
  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.body.style.overflow = "";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    });
  };

  const labels: Record<(typeof SECTIONS)[number], string> = {
    showreel: t.nav.showreel,
    work: t.nav.work,
    services: t.nav.services,
    about: t.nav.about,
    contact: t.nav.contact,
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[80] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.meta.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open ? "border-b hairline bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 md:h-20">
          <a href="#top" className="group flex items-center gap-3" aria-label={lang === "ar" ? siteConfig.name : siteConfig.nameEn}>
            <span className="rec-dot" aria-hidden="true" />
            <span className="font-display text-xl leading-none tracking-tight text-bone md:text-2xl">
              {lang === "ar" ? siteConfig.name : siteConfig.nameEn}
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? "true" : undefined}
                    className={`relative text-sm transition-colors duration-300 hover:text-bone ${
                      active === id ? "text-bone" : "text-ash"
                    }`}
                  >
                    {labels[id]}
                    <span
                      className={`absolute -bottom-1.5 start-0 h-px bg-rec transition-all duration-500 ${active === id ? "w-full" : "w-0"}`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={toggleLang}
              aria-label={t.nav.langLabel}
              className="h-9 min-w-9 px-2.5 font-mono text-xs uppercase tracking-widest text-ash transition-colors hover:text-bone"
            >
              {t.nav.langToggle}
            </button>
            <a
              href="#contact"
              className="hidden h-10 items-center gap-2 rounded-full bg-bone px-5 text-sm font-medium text-ink transition-colors hover:bg-rec sm:inline-flex"
            >
              {t.nav.cta}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="relative flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <span className={`absolute h-px w-6 bg-bone transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-6 bg-bone transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex-1">
              <ul className="flex flex-col">
                {SECTIONS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b hairline"
                  >
                    <a
                      href={`#${id}`}
                      onClick={goTo(id)}
                      className="flex items-baseline justify-between py-5 font-display text-4xl text-bone"
                    >
                      {labels[id]}
                      <span className="font-mono text-xs text-smoke" dir="ltr">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="container-x pb-10">
              <a
                href="#contact"
                onClick={goTo("contact")}
                className="flex h-14 items-center justify-center rounded-full bg-bone text-base font-medium text-ink"
              >
                {t.nav.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
