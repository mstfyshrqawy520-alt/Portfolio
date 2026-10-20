"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { siteConfig } from "@/content/site.config";
import {
  Menu,
  X,
  Globe,
  Moon,
  Sun,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function Header() {
  const { lang, dir, t, toggleLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener for sticky header styling & scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ["home", "about", "experience", "work", "services", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "experience", label: t.nav.experience },
    { id: "work", label: t.nav.work },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ];

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    lang === "ar" ? siteConfig.whatsappPrefilledAr : siteConfig.whatsappPrefilledEn
  )}`;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-panel shadow-lg shadow-black/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo / Personal Monogram */}
          <Link
            href="#home"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-[1px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0f17] rounded-[11px] flex items-center justify-center font-bold text-amber-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {lang === "ar" ? siteConfig.name : siteConfig.nameEn}
              </span>
              <span className="text-[11px] font-medium text-amber-500/90 tracking-wider uppercase">
                {lang === "ar" ? "معرض أعمال المونتاج" : "Cinematic Editor"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu (Centered) */}
          <nav className="hidden md:flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white bg-amber-500/20 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -bottom-1 inset-x-3 h-[2px] bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]" />
                  )}
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action Controls (Right side in RTL) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors focus:outline-none"
              title="Change Language"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.langToggle}</span>
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors focus:outline-none"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-300" />
              )}
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-md shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.nav.whatsappBtn}</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-400" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl md:hidden flex flex-col pt-24 px-6 pb-8 animate-in fade-in duration-200">
          <div className="flex flex-col gap-3 my-auto">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-bold py-3 px-4 rounded-xl border transition-colors ${
                  activeSection === item.id
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "text-slate-300 hover:text-white bg-white/5 border-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-2.5 px-4 text-slate-400 hover:text-white flex items-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.nav.admin}</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl font-bold text-center bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.nav.whatsappBtn}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
