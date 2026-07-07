import React from "react";
import { 
  TrendingUp, 
  Users, 
  Activity,
  Globe,
  Clock
} from "lucide-react";
import CreatePostForm from "./CreatePostForm";
import ClubSettingsForm from "./ClubSettingsForm";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";

/* ────────────────────────────────────────────────────────────────────
 *  i18n Dictionary — en / fr / ar
 * ──────────────────────────────────────────────────────────────────── */

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
    uploading: "Uploading...",
    recentPosts: "Recent Posts",
    tablePostTitle: "Post Title",
    tableDate: "Date",
    tableVisibility: "Visibility",
    tableInteractions: "Interactions",
    revenueAmount: "MAD",
    currencyFirst: false,
    clubSettings: "Club Settings",
    clubSettingsDesc: "Customize your branding and public profile.",
    clubLogo: "Club Logo",
    bannerImage: "Banner Image",
    primaryColor: "Primary Color (Hex)",
    secondaryColor: "Secondary Color (Hex)",
    clubDescription: "Club Description",
    descPlaceholder: "Brief description about the club...",
    saveSettings: "Save Settings",
    saving: "Saving...",
    uploadLogo: "Upload Logo",
    uploadBanner: "Upload Banner",
    attachMedia: "Attach Media (Optional)",
    clickToUpload: "Click to upload image or video",
    mediaSpecs: "MP4, WebM, PNG, JPG or GIF (max. 50MB)",
    postVisibility: "Post Visibility",
    premiumLabel: "Premium Content 🔒",
    noPosts: "No posts found",
    noClub: "No Club Assigned",
    noClubDesc: "Please contact the Super-Admin to provision a club for your account.",
    unauthorized: "Unauthorized. Please sign in as a Club Administrator."
  },
  fr: {
    clubOverview: "Vue d'ensemble du club",
    clubOverviewDesc: "Gérez les analyses, le contenu et les supporters de votre club.",
    totalRevenue: "Revenu Total",
    thisMonth: "ce mois-ci",
    activeMembers: "Membres Actifs",
    supporters: "Supporters",
    conversionRate: "Taux de Conversion",
    createNewPost: "Créer un nouveau post",
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
    uploading: "Téléchargement...",
    recentPosts: "Publications Récentes",
    tablePostTitle: "Titre",
    tableDate: "Date",
    tableVisibility: "Visibilité",
    tableInteractions: "Interactions",
    revenueAmount: "MAD",
    currencyFirst: false,
    clubSettings: "Paramètres du Club",
    clubSettingsDesc: "Personnalisez votre image de marque et votre profil public.",
    clubLogo: "Logo du Club",
    bannerImage: "Image de Bannière",
    primaryColor: "Couleur Primaire (Hex)",
    secondaryColor: "Couleur Secondaire (Hex)",
    clubDescription: "Description du Club",
    descPlaceholder: "Brève description du club...",
    saveSettings: "Enregistrer les paramètres",
    saving: "Enregistrement...",
    uploadLogo: "Télécharger le logo",
    uploadBanner: "Télécharger la bannière",
    attachMedia: "Joindre un média (Optionnel)",
    clickToUpload: "Cliquez pour télécharger une image ou vidéo",
    mediaSpecs: "MP4, WebM, PNG, JPG ou GIF (max. 50 Mo)",
    postVisibility: "Visibilité du post",
    premiumLabel: "Contenu Premium 🔒",
    noPosts: "Aucun post trouvé",
    noClub: "Aucun Club Assigné",
    noClubDesc: "Veuillez contacter le Super-Admin pour attribuer un club à votre compte.",
    unauthorized: "Non autorisé. Veuillez vous connecter en tant qu'administrateur de club."
  },
  ar: {
    clubOverview: "نظرة عامة على النادي",
    clubOverviewDesc: "إدارة تحليلات النادي والمحتوى والمشجعين.",
    totalRevenue: "إجمالي الإيرادات",
    thisMonth: "هذا الشهر",
    activeMembers: "الأعضاء النشطون",
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
    uploading: "جاري الرفع...",
    recentPosts: "المنشورات الحديثة",
    tablePostTitle: "عنوان المنشور",
    tableDate: "التاريخ",
    tableVisibility: "الرؤية",
    tableInteractions: "التفاعلات",
    revenueAmount: "درهم",
    currencyFirst: true,
    clubSettings: "إعدادات النادي",
    clubSettingsDesc: "تخصيص الهوية البصرية والملف التعريفي العام للنادي.",
    clubLogo: "شعار النادي",
    bannerImage: "صورة الغلاف",
    primaryColor: "اللون الأساسي (Hex)",
    secondaryColor: "اللون الثانوي (Hex)",
    clubDescription: "وصف النادي",
    descPlaceholder: "نبذة مختصرة عن النادي...",
    saveSettings: "حفظ الإعدادات",
    saving: "جاري الحفظ...",
    uploadLogo: "رفع الشعار",
    uploadBanner: "رفع صورة الغلاف",
    attachMedia: "إرفاق وسائط (اختياري)",
    clickToUpload: "انقر لرفع صورة أو مقطع فيديو",
    mediaSpecs: "MP4, WebM, PNG, JPG أو GIF (بحد أقصى 50 ميغابايت)",
    postVisibility: "خصوصية المنشور",
    premiumLabel: "محتوى مميز 🔒",
    noPosts: "لم يتم العثور على منشورات",
    noClub: "لم يتم تعيين نادٍ",
    noClubDesc: "يرجى الاتصال بالمسؤول العام لإنشاء وتعيين نادٍ لحسابك.",
    unauthorized: "غير مصرح به. يرجى تسجيل الدخول كمشرف للنادي."
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
      <div className="pt-44 pb-16 min-h-screen w-full bg-slate-50 dark:bg-[#060b13] text-gray-900 dark:text-white flex items-center justify-center p-4">
        {t.unauthorized}
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
      <div className="pt-44 pb-16 min-h-screen w-full bg-slate-50 dark:bg-[#060b13] text-gray-900 dark:text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t.noClub}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{t.noClubDesc}</p>
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#060b13] text-gray-900 dark:text-white pt-44 pb-16 px-4 sm:px-6 md:px-12 transition-all duration-200">
      <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-5xl space-y-8 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-800 text-white font-bold shadow-sm"
            style={{ backgroundColor: club.primaryColor || '#10B981' }}
          >
            {club.logoInitials || "C"}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="font-bold text-emerald-500">{club.name}</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium text-xl">/ {t.clubOverview}</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.clubOverviewDesc}
            </p>
          </div>
        </div>

        {/* 1. Analytics Overview Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Total Revenue */}
          <div className="flex flex-col bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 transition-all">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-sm font-semibold uppercase tracking-wider">{t.totalRevenue}</span>
              <Activity className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {t.currencyFirst ? `${t.revenueAmount} ${totalRevenue.toLocaleString()}` : `${totalRevenue.toLocaleString()} ${t.revenueAmount}`}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              +12% {t.thisMonth}
            </div>
          </div>

          {/* Active Members */}
          <div className="flex flex-col bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 transition-all">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-sm font-semibold uppercase tracking-wider">{t.activeMembers}</span>
              <Users className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{activeMembers.toLocaleString()}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">/ {t.supporters}</span>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="flex flex-col bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 transition-all">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-sm font-semibold uppercase tracking-wider">{t.conversionRate}</span>
              <Activity className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{conversionRate}%</span>
            </div>
          </div>
        </div>

        {/* 2. Content Publisher Engine & Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.createNewPost}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.createNewPostDesc}</p>
            
            <CreatePostForm t={t} clubId={club.id} />
          </div>

          <div className="bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.clubSettings}</h2>
            <p className="mt-1 mb-6 text-sm text-gray-500 dark:text-gray-400">{t.clubSettingsDesc}</p>
            
            <ClubSettingsForm 
              t={t}
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
        <div className="overflow-hidden bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl">
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{t.recentPosts}</h2>
          </div>
          <div className="overflow-x-auto">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 p-6 text-center">{t.noPosts}</p>
            ) : (
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 dark:bg-slate-950/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className={`px-6 py-4 font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t.tablePostTitle}</th>
                    <th className={`px-6 py-4 font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t.tableDate}</th>
                    <th className={`px-6 py-4 font-semibold ${isRTL ? "text-right" : "text-left"}`}>{t.tableVisibility}</th>
                    <th className={`px-6 py-4 font-semibold ${isRTL ? "text-left" : "text-right"}`}>{t.tableInteractions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                      <td className={`px-6 py-4 font-medium text-gray-900 dark:text-slate-200 ${isRTL ? "text-right" : "text-left"}`}>
                        {post.title}
                      </td>
                      <td className={`whitespace-nowrap px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                        <div className="flex items-center gap-1.5 justify-start">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(post.createdAt).toLocaleDateString(langKey)}
                        </div>
                      </td>
                      <td className={`whitespace-nowrap px-6 py-4 ${isRTL ? "text-right" : "text-left"}`}>
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                        >
                          <Globe className="h-3 w-3" />
                          {t.public}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-medium text-gray-900 dark:text-slate-300 ${isRTL ? "text-left" : "text-right"}`}>
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
