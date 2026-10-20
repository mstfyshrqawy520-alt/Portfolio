"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DriveCMSData } from "@/types/drive";
import { useLanguage } from "@/context/LanguageContext";
import {
  RefreshCw,
  LogOut,
  Folder,
  Film,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Monitor,
  Sparkles,
  Database,
  ArrowLeft,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  initialData: DriveCMSData;
}

export default function AdminDashboardClient({
  initialData,
}: AdminDashboardClientProps) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [data, setData] = useState<DriveCMSData>(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRefreshNow = async () => {
    setRefreshing(true);
    setRefreshMessage(null);

    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
      });

      if (res.ok) {
        setRefreshMessage({
          type: "success",
          text: t.admin.revalidateSuccess,
        });
        router.refresh();
      } else {
        setRefreshMessage({
          type: "error",
          text: t.admin.revalidateError,
        });
      }
    } catch {
      setRefreshMessage({
        type: "error",
        text: t.admin.revalidateError,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Back to Portfolio"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-amber-400" />
                <span>{t.admin.title}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.admin.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Refresh Now Button */}
            <button
              onClick={handleRefreshNow}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>
                {refreshing ? t.admin.revalidating : t.admin.revalidateBtn}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 transition-colors"
              title={t.admin.logoutBtn}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Refresh Notification Banner */}
        {refreshMessage && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 ${
              refreshMessage.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/15 border border-red-500/30 text-red-300"
            }`}
          >
            {refreshMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <span>{refreshMessage.text}</span>
          </div>
        )}

        {/* Sync Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">
              {t.admin.totalVideos}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {data.stats.totalVideos}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span>{data.stats.verticalCount} vertical</span>
              <span>•</span>
              <span>{data.stats.horizontalCount} horizontal</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">
              {t.admin.categoriesCount}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {data.stats.totalCategories}
            </span>
            <span className="text-[11px] text-amber-400 mt-1">
              Active Folders
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">
              {t.admin.featuredVideos}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {data.stats.featuredCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Marked with ⭐
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">
              {t.admin.lastSync}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-200 mt-1">
              {new Date(data.lastSyncTime).toLocaleTimeString()}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{data.isMock ? "Local Mock" : "Live Google Drive"}</span>
            </div>
          </div>
        </div>

        {/* Per-Category Video Counts Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-400" />
            <span>{lang === "ar" ? "تفاصيل الأقسام والمجلدات" : "Category Breakdown"}</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-start">
                  <th className="pb-3 text-start font-semibold">
                    {lang === "ar" ? "اسم المجلد (القسم)" : "Folder / Category"}
                  </th>
                  <th className="pb-3 text-start font-semibold">
                    {lang === "ar" ? "معرّف الرابط" : "Slug"}
                  </th>
                  <th className="pb-3 text-center font-semibold">
                    {lang === "ar" ? "العدد" : "Count"}
                  </th>
                  <th className="pb-3 text-end font-semibold">
                    {lang === "ar" ? "النسبة" : "Percentage"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.categories.map((cat) => {
                  const percentage =
                    data.stats.totalVideos > 0
                      ? Math.round((cat.count / data.stats.totalVideos) * 100)
                      : 0;
                  return (
                    <tr key={cat.slug} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white font-medium flex items-center gap-2">
                        <span>{cat.name}</span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-xs">
                        ?cat={cat.slug}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold text-xs">
                          {cat.count}
                        </span>
                      </td>
                      <td className="py-3 text-end text-slate-400">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Warnings and Diagnostics */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t.admin.auditTitle}</span>
          </h2>

          {data.warnings && data.warnings.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {data.warnings.map((w, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-white">{w.message}</span>
                    {w.targetName && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        File: {w.targetName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.admin.noWarnings}</span>
            </div>
          )}
        </div>

        {/* How to add a video Cheat Sheet */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{t.admin.cheatSheetTitle}</span>
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 leading-relaxed">
            {t.admin.cheatRules.map((rule, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
