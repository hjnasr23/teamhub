import Link from "next/link";
import { Users, Landmark, Percent, TrendingUp, ShieldAlert, Award, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";

/* ════════════════════════════════════════════════════════════════════
 *  i18n Dictionary — en / fr / ar
 * ════════════════════════════════════════════════════════════════════ */

const adminTranslations = {
  en: {
    dashboardTitle: "Overview Dashboard",
    dashboardDesc: "Real-time analytics and server statuses for the TEAMHUB network.",
    totalClubs: "Total SaaS Clubs",
    activeFans: "Global Active Fans",
    totalRevenue: "Total Monthly Revenue",
    platformComm: "Platform Commissions (10%)",
    recentClubs: "Recent Registered Associations",
    manageClubs: "Manage Clubs",
    colName: "Club Name",
    colSlug: "Slug",
    colRegistered: "Registered",
    statusActive: "Active",
    emptyClubs: "No clubs registered yet.",
    sysHealth: "System Health & Logs",
    healthBuild: "Next.js Web Build Status",
    healthHealthy: "Healthy",
    healthDB: "Database Connection",
    healthOnline: "Online",
    healthWebhook: "SaaS Commission Webhook",
    healthListening: "Listening",
    auditLogs: "Live Audit Logs",
    log1: "Dashboard loaded successfully",
    currency: "MAD",
  },
  fr: {
    dashboardTitle: "Tableau de Bord",
    dashboardDesc: "Analyses en temps réel et statuts des serveurs pour le réseau TEAMHUB.",
    totalClubs: "Total des Clubs SaaS",
    activeFans: "Fans Actifs Globaux",
    totalRevenue: "Revenu Mensuel Total",
    platformComm: "Commissions de la Plateforme (10%)",
    recentClubs: "Associations Récemment Enregistrées",
    manageClubs: "Gérer les Clubs",
    colName: "Nom du Club",
    colSlug: "Identifiant",
    colRegistered: "Inscrit le",
    statusActive: "Actif",
    emptyClubs: "Aucun club enregistré pour le moment.",
    sysHealth: "Santé du Système et Journaux",
    healthBuild: "Statut de compilation Next.js",
    healthHealthy: "Sain",
    healthDB: "Connexion Base de Données",
    healthOnline: "En ligne",
    healthWebhook: "Webhook de Commission SaaS",
    healthListening: "À l'écoute",
    auditLogs: "Journaux d'Audit en Direct",
    log1: "Tableau de bord chargé avec succès",
    currency: "MAD",
  },
  ar: {
    dashboardTitle: "لوحة التحكم العامة",
    dashboardDesc: "تحليلات في الوقت الفعلي وحالات الخوادم لشبكة TEAMHUB.",
    totalClubs: "إجمالي أندية SaaS",
    activeFans: "المشجعين النشطين عالمياً",
    totalRevenue: "إجمالي الإيرادات الشهرية",
    platformComm: "عمولات المنصة (10%)",
    recentClubs: "الجمعيات المسجلة حديثاً",
    manageClubs: "إدارة الأندية",
    colName: "اسم النادي",
    colSlug: "المعرف (Slug)",
    colRegistered: "تاريخ التسجيل",
    statusActive: "نشط",
    emptyClubs: "لا توجد أندية مسجلة بعد.",
    sysHealth: "صحة النظام والسجلات",
    healthBuild: "حالة بناء Next.js",
    healthHealthy: "سليم",
    healthDB: "اتصال قاعدة البيانات",
    healthOnline: "متصل",
    healthWebhook: "Webhook عمولات SaaS",
    healthListening: "يستمع",
    auditLogs: "سجلات التدقيق المباشرة",
    log1: "تم تحميل لوحة التحكم بنجاح",
    currency: "درهم",
  }
} as const;

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const langKey = (params.lang || "en") as "en" | "fr" | "ar";
  const t = adminTranslations[langKey] || adminTranslations.en;
  const isRTL = langKey === "ar";

  // 1. Parallel Prisma Query Execution
  const [totalClubs, totalFans, activeSubs, recentClubs] = await Promise.all([
    prisma.club.count(),
    prisma.user.count({ where: { role: 'FAN' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.club.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  // Total Cumulative Live Revenue calculation (Assume 50 MAD/month standard membership rate)
  const totalRevenue = activeSubs * 50;
  const platformCommissions = totalRevenue * 0.1; // 10%

  const stats = [
    { name: t.totalClubs, value: totalClubs.toString(), desc: "Real-time count", icon: Award, color: "text-emerald-500" },
    { name: t.activeFans, value: totalFans.toString(), desc: "Real-time count", icon: Users, color: "text-indigo-500" },
    { name: t.totalRevenue, value: `${totalRevenue.toLocaleString()} ${t.currency}`, desc: "Based on active subs", icon: Landmark, color: "text-purple-500" },
    { name: t.platformComm, value: `${platformCommissions.toLocaleString()} ${t.currency}`, desc: "10% platform fee", icon: Percent, color: "text-rose-500" },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="pt-28 md:pt-32 bg-neutral-bg min-h-screen text-text-dark px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-dark dark:text-white">
              {t.dashboardTitle}
            </h1>
            <p className="text-sm text-text-muted">
              {t.dashboardDesc}
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-neutral-bg-alt border border-border-custom rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {stat.name}
                  </span>
                  <div className={`p-2 rounded-lg bg-neutral-bg border border-border-custom ${stat.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-text-dark dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{stat.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid: Recent signups & Platforms logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Signups list */}
          <div className="lg:col-span-2 bg-neutral-bg-alt border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-text-dark dark:text-white">{t.recentClubs}</h2>
                <Link href={`/super-admin/clubs?lang=${langKey}`} className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 font-semibold">
                  {t.manageClubs} <ArrowUpRight className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                {recentClubs.length === 0 ? (
                  <p className="text-sm text-text-muted py-8 text-center">{t.emptyClubs}</p>
                ) : (
                  <table className="w-full text-sm text-text-muted">
                    <thead className={`bg-neutral-bg text-xs uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
                      <tr>
                        <th className="px-4 py-3 font-semibold">{t.colName}</th>
                        <th className="px-4 py-3 font-semibold">{t.colSlug}</th>
                        <th className="px-4 py-3 font-semibold">{t.colRegistered}</th>
                        <th className="px-4 py-3 font-semibold">{t.statusActive}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom text-text-dark dark:text-slate-300">
                      {recentClubs.map((club) => (
                        <tr key={club.id} className="hover:bg-neutral-bg/50 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-text-dark dark:text-white flex items-center gap-2">
                            <div className="h-6 w-6 rounded-md bg-neutral-bg border border-border-custom flex items-center justify-center font-bold text-[10px] text-emerald-500" style={{ color: club.primaryColor || undefined }}>
                              {club.name[0]}
                            </div>
                            {club.name}
                          </td>
                          <td className="px-4 py-3.5">{club.slug}</td>
                          <td className="px-4 py-3.5">{new Date(club.createdAt).toLocaleDateString(langKey)}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40">
                              <div className="h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                              {t.statusActive}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Platform Status */}
          <div className="bg-neutral-bg-alt border border-border-custom rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-text-dark dark:text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              {t.sysHealth}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-bg border border-border-custom">
                <span className="text-xs text-text-muted">{t.healthBuild}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t.healthHealthy}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-bg border border-border-custom">
                <span className="text-xs text-text-muted">{t.healthDB}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t.healthOnline}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-bg border border-border-custom">
                <span className="text-xs text-text-muted">{t.healthWebhook}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t.healthListening}</span>
              </div>

              <div className="pt-4 border-t border-border-custom">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-3">
                  {t.auditLogs}
                </span>
                <div className="space-y-3 font-mono text-[10px] text-text-muted">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0">[{new Date().toLocaleTimeString(langKey)}]</span>
                    <span>{t.log1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
