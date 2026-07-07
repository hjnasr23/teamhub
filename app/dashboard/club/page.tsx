import React from "react";
import { 
  TrendingUp, 
  Users, 
  Activity,
  Lock,
  Globe,
  Clock
} from "lucide-react";
import CreatePostForm from "./CreatePostForm";
import ClubSettingsForm from "./ClubSettingsForm";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";

/* ════════════════════════════════════════════════════════════════════
 *  i18n Dictionary — en / fr / ar
 * ════════════════════════════════════════════════════════════════════ */

const clubDashboardTranslations = {
  en: {
    clubOverview: "Club Overview",
    clubOverviewDesc: "Manage your club's analytics, content, and supporters.",
    totalRevenue: "Total Revenue",
    thisMonth: "this month",
    activeMembers: "Active Members",
    supporters: "Supporters",
    conversionRate: "Conversion Rate",
    createNewPost: "Create New Post",
    createNewPostDesc: "Draft announcements or premium updates to your supporters.",
    postTitle: "Post Title",
    postTitlePlaceholder: "Matchday updates...",
    content: "Content",
    contentPlaceholder: "Write your update here...",
    visibility: "Visibility",
    public: "Public",
    publicDesc: "Free for everyone",
    premiumOnly: "Premium Only",
    premiumDesc: "Locked behind the 50 MAD/month tier",
    publishPost: "Publish Post",
    recentPosts: "Recent Posts",
    tablePostTitle: "Post Title",
    tableDate: "Date",
    tableVisibility: "Visibility",
    tableInteractions: "Interactions",
    revenueAmount: "MAD",
    currencyFirst: false
  },
  fr: {
    clubOverview: "Aperçu du Club",
    clubOverviewDesc: "Gérez les analyses, le contenu et les supporters de votre club.",
    totalRevenue: "Revenu Total",
    thisMonth: "ce mois-ci",
    activeMembers: "Membres Actifs",
    supporters: "Supporters",
    conversionRate: "Taux de Conversion",
    createNewPost: "Créer une Nouvelle Publication",
    createNewPostDesc: "Rédigez des annonces ou des mises à jour premium pour vos supporters.",
    postTitle: "Titre de la Publication",
    postTitlePlaceholder: "Mises à jour du jour de match...",
    content: "Contenu",
    contentPlaceholder: "Écrivez votre mise à jour ici...",
    visibility: "Visibilité",
    public: "Public",
    publicDesc: "Gratuit pour tous",
    premiumOnly: "Premium Uniquement",
    premiumDesc: "Verrouillé par le niveau à 50 MAD/mois",
    publishPost: "Publier",
    recentPosts: "Publications Récentes",
    tablePostTitle: "Titre",
    tableDate: "Date",
    tableVisibility: "Visibilité",
    tableInteractions: "Interactions",
    revenueAmount: "MAD",
    currencyFirst: false
  },
  ar: {
    clubOverview: "نظرة عامة على النادي",
    clubOverviewDesc: "إدارة تحليلات النادي والمحتوى والمشجعين.",
    totalRevenue: "إجمالي الإيرادات",
    thisMonth: "هذا الشهر",
    activeMembers: "الأعضاء النشطين",
    supporters: "المشجعين",
    conversionRate: "معدل التحويل",
    createNewPost: "إنشاء منشور جديد",
    createNewPostDesc: "صياغة إعلانات أو تحديثات مميزة لمشجعيك.",
    postTitle: "عنوان المنشور",
    postTitlePlaceholder: "تحديثات يوم المباراة...",
    content: "المحتوى",
    contentPlaceholder: "اكتب تحديثك هنا...",
    visibility: "الرؤية",
    public: "عام",
    publicDesc: "مجاني للجميع",
    premiumOnly: "مميز فقط",
    premiumDesc: "مقفل خلف فئة 50 درهم/شهر",
    publishPost: "نشر المنشور",
    recentPosts: "المنشورات الحديثة",
    tablePostTitle: "عنوان المنشور",
    tableDate: "التاريخ",
    tableVisibility: "الرؤية",
    tableInteractions: "التفاعلات",
    revenueAmount: "درهم",
    currencyFirst: true
  }
} as const;

export default async function ClubAdminDashboard({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const langKey = (params.lang || "en") as "en" | "fr" | "ar";
  const t = clubDashboardTranslations[langKey] || clubDashboardTranslations.en;
  const isRTL = langKey === "ar";

  const session = await getSession();
  
  if (!session || session.role !== "CLUB_ADMIN") {
    return (
      <div className="pt-36 min-h-screen flex items-center justify-center text-white bg-[#060b13]">
        Unauthorized. Please sign in as a Club Administrator.
      </div>
    );
  }

  // Fetch the logged-in user's assigned club
  const adminUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { managedClub: true }
  });

  if (!adminUser?.managedClub) {
    return (
      <div className="pt-36 min-h-screen flex items-center justify-center text-white bg-[#060b13]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No Club Assigned</h1>
          <p className="text-slate-400">Please contact the Super-Admin to provision a club for your account.</p>
        </div>
      </div>
    );
  }

  const club = adminUser.managedClub;

  // 1. Parallel Prisma Query Execution
  const [activeMembers, allFansCount, recentPosts] = await Promise.all([
    prisma.subscription.count({ where: { clubId: club.id, status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'FAN' } }),
    prisma.post.findMany({ 
      where: { clubId: club.id }, 
      select: { id: true, title: true, createdAt: true, mediaUrl: true, mediaType: true },
      orderBy: { createdAt: 'desc' }, 
      take: 5 
    })
  ]);

  // Statistics Calculation
  const totalRevenue = activeMembers * 50;
  const conversionRate = allFansCount > 0 ? ((activeMembers / allFansCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="pt-36 pb-16 min-h-screen bg-[#060b13] text-white px-4 md:px-8">
      <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-5xl space-y-8 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-border-custom pb-6">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border-custom text-white font-bold shadow-sm"
            style={{ backgroundColor: club.primaryColor || '#10B981' }}
          >
            {club.logoInitials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-dark dark:text-white flex items-center gap-2">
              <span className="font-bold text-emerald-500">{club.name}</span>
              <span className="text-text-muted font-medium text-xl">/ {t.clubOverview}</span>
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {t.clubOverviewDesc}
            </p>
          </div>
        </div>

      {/* 1. Analytics Overview Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Revenue */}
        <div className="flex flex-col rounded-xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-sm font-medium">{t.totalRevenue}</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-dark dark:text-white">
              {t.currencyFirst ? `${t.revenueAmount} ${totalRevenue.toLocaleString()}` : `${totalRevenue.toLocaleString()} ${t.revenueAmount}`}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            +12% {t.thisMonth}
          </div>
        </div>

        {/* Active Members */}
        <div className="flex flex-col rounded-xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-sm font-medium">{t.activeMembers}</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-dark dark:text-white">{activeMembers.toLocaleString()}</span>
            <span className="text-sm text-text-muted">{t.supporters}</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="flex flex-col rounded-xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-sm font-medium">{t.conversionRate}</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-dark dark:text-white">{conversionRate}%</span>
          </div>
        </div>
      </div>

      {/* 2. Content Publisher Engine & Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
          <h2 className="text-lg font-bold text-text-dark dark:text-white">{t.createNewPost}</h2>
          <p className="mt-1 text-sm text-text-muted">{t.createNewPostDesc}</p>
          
          <CreatePostForm t={t} clubId={club.id} />
        </div>

        <div className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
          <h2 className="text-lg font-bold text-text-dark dark:text-white">Club Settings</h2>
          <p className="mt-1 mb-6 text-sm text-text-muted">Customize your branding and public profile.</p>
          
          <ClubSettingsForm 
            clubId={club.id}
            initialDescription={club.description}
            initialPrimaryColor={club.primaryColor}
            initialSecondaryColor={club.secondaryColor}
            initialLogoUrl={club.logoUrl}
            initialBannerUrl={club.bannerUrl}
          />
        </div>
      </div>

      {/* 3. Posts Monitoring Log Table */}
      <div className="overflow-hidden rounded-2xl border border-border-custom bg-neutral-bg shadow-sm dark:bg-slate-900">
        <div className="border-b border-border-custom px-6 py-5">
          <h2 className="text-base font-bold text-text-dark dark:text-white">{t.recentPosts}</h2>
        </div>
        <div className="overflow-x-auto">
          {recentPosts.length === 0 ? (
            <p className="text-sm text-text-muted p-6 text-center">No posts found</p>
          ) : (
            <table className="w-full text-left text-sm text-text-muted">
              <thead className="bg-neutral-bg-alt text-xs uppercase text-text-muted dark:bg-slate-950/50">
                <tr>
                  <th className={`px-6 py-4 font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t.tablePostTitle}</th>
                  <th className={`px-6 py-4 font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t.tableDate}</th>
                  <th className={`px-6 py-4 font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t.tableVisibility}</th>
                  <th className={`px-6 py-4 font-semibold ${isRTL ? "text-left" : "text-right"}`}>{t.tableInteractions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-neutral-bg-alt/50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-text-dark dark:text-slate-200">
                      {post.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(post.createdAt).toLocaleDateString(langKey)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      >
                        <Globe className="h-3 w-3" />
                        {t.public}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium text-text-dark dark:text-slate-300 ${isRTL ? "text-left" : "text-right"}`}>
                      0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
