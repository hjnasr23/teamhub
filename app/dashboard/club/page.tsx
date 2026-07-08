"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  TrendingUp, 
  Users, 
  Activity,
  Globe,
  Clock,
  Loader2
} from "lucide-react";
import CreatePostForm from "./CreatePostForm";
import ClubSettingsForm from "./ClubSettingsForm";
import { getClubAdminData } from "@/lib/actions";

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
    noClubDesc: "Please contact the system administrator to configure and assign a club to your profile.",
    unauthorized: "Unauthorized. Please log in as a Club Admin.",
    loading: "Loading club dashboard..."
  },
  fr: {
    clubOverview: "Aperçu du Club",
    clubOverviewDesc: "Gérez les analyses, le contenu et les supporters de votre club.",
    totalRevenue: "Revenu Total",
    thisMonth: "ce mois-ci",
    activeMembers: "Membres Actifs",
    supporters: "Supporters",
    conversionRate: "Taux de Conversion",
    createNewPost: "Créer un Nouveau Message",
    createNewPostDesc: "Rédigez des annonces ou des mises à jour premium pour vos supporters.",
    postTitle: "Titre du Message",
    postTitlePlaceholder: "Mises à jour du jour du match...",
    content: "Contenu",
    contentPlaceholder: "Écrivez votre mise à jour ici...",
    visibility: "Visibilité",
    public: "Public",
    publicDesc: "Gratuit pour tous",
    premiumOnly: "Premium Uniquement",
    premiumDesc: "Bloqué derrière le niveau de 50 MAD/mois",
    publishPost: "Publier le Message",
    uploading: "Téléchargement...",
    recentPosts: "Messages Récents",
    tablePostTitle: "Titre du Message",
    tableDate: "Date",
    tableVisibility: "Visibilité",
    tableInteractions: "Interactions",
    revenueAmount: "MAD",
    currencyFirst: false,
    clubSettings: "Paramètres du Club",
    clubSettingsDesc: "Personnalisez votre marque et votre profil public.",
    clubLogo: "Logo du Club",
    bannerImage: "Image de Bannière",
    primaryColor: "Couleur Primaire (Hex)",
    secondaryColor: "Couleur Secondaire (Hex)",
    clubDescription: "Description du Club",
    descPlaceholder: "Brève description du club...",
    saveSettings: "Enregistrer les Paramètres",
    saving: "Enregistrement...",
    uploadLogo: "Télécharger le Logo",
    uploadBanner: "Télécharger la Bannière",
    attachMedia: "Joindre un Média (Optionnel)",
    clickToUpload: "Cliquez pour télécharger une image ou une vidéo",
    mediaSpecs: "MP4, WebM, PNG, JPG ou GIF (max. 50 Mo)",
    postVisibility: "Visibilité du Message",
    premiumLabel: "Contenu Premium 🔒",
    noPosts: "Aucun message trouvé",
    noClub: "Aucun Club Assigné",
    noClubDesc: "Veuillez contacter l'administrateur du système pour configurer et associer un club à votre profil.",
    unauthorized: "Non autorisé. Veuillez vous connecter en tant qu'administrateur de club.",
    loading: "Chargement du tableau de bord..."
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
    visibility: "الظهور",
    public: "عام",
    publicDesc: "مجاني للجميع",
    premiumOnly: "المميز فقط",
    premiumDesc: "مغلق خلف فئة 50 درهم/شهر",
    publishPost: "نشر المنشور",
    uploading: "جاري الرفع...",
    recentPosts: "المنشورات الأخيرة",
    tablePostTitle: "عنوان المنشور",
    tableDate: "التاريخ",
    tableVisibility: "الظهور",
    tableInteractions: "التفاعلات",
    revenueAmount: "درهم",
    currencyFirst: false,
    clubSettings: "إعدادات النادي",
    clubSettingsDesc: "خصص هويتك البصرية وملفك الشخصي العام.",
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
    unauthorized: "غير مصرح به. يرجى تسجيل الدخول كمشرف للنادي.",
    loading: "جاري تحميل لوحة التحكم..."
  }
} as const;

interface ClubData {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoInitials: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
}

interface PostData {
  id: string;
  title: string;
  createdAt: Date;
  mediaUrl: string | null;
  mediaType: string | null;
}

function ClubAdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const langKey = (searchParams.get("lang") || "en") as "en" | "fr" | "ar";
  const t = clubDashboardTranslations[langKey] || clubDashboardTranslations.en;
  const isRTL = langKey === "ar";

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [club, setClub] = useState<ClubData | null>(null);
  const [activeMembers, setActiveMembers] = useState(0);
  const [allFansCount, setAllFansCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState<PostData[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      const response = await getClubAdminData();
      if (response.success && response.data) {
        setClub(response.data.club);
        setActiveMembers(response.data.activeMembers);
        setAllFansCount(response.data.allFansCount);
        setRecentPosts(response.data.recentPosts);
        setAuthorized(true);
      } else {
        router.push("/login?lang=" + langKey);
      }
      setLoading(false);
    }
    loadDashboardData();
  }, [router, langKey]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-text-muted">{t.loading}</p>
      </div>
    );
  }

  if (!authorized || !club) {
    return null;
  }

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
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight">
                {t.currencyFirst ? `${t.revenueAmount} ${totalRevenue.toLocaleString()}` : `${totalRevenue.toLocaleString()} ${t.revenueAmount}`}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t.thisMonth}
            </div>
          </div>

          {/* Active Members */}
          <div className="flex flex-col bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 transition-all">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-sm font-semibold uppercase tracking-wider">{t.activeMembers}</span>
              <Users className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold tracking-tight">{activeMembers.toLocaleString()}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t.supporters}
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="flex flex-col bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 transition-all">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span className="text-sm font-semibold uppercase tracking-wider">{t.conversionRate}</span>
              <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-extrabold tracking-tight">{conversionRate}%</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t.supporters}
            </div>
          </div>
        </div>

        {/* 2. Setup forms Grid layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Post publishing form */}
          <div className="bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.createNewPost}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.createNewPostDesc}</p>
            </div>
            <CreatePostForm t={t} clubId={club.id} />
          </div>

          {/* Club profile customizer */}
          <div className="bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t.clubSettings}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.clubSettingsDesc}</p>
            </div>
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

export default function ClubAdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#060b13] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>}>
      <ClubAdminDashboardContent />
    </Suspense>
  );
}
