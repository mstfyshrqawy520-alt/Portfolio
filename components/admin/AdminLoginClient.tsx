"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, KeyRound, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLoginClient() {
  const { t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setError("");
    setLoading("logging_in");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t.admin.invalidPass);
        setLoading("");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للرئيسية / Back to Home</span>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-bold text-white">
            {t.admin.loginTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {t.admin.subtitle}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              {t.admin.passwordLabel}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.admin.passwordPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute end-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={!!loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            ) : (
              <span>{t.admin.loginBtn}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
