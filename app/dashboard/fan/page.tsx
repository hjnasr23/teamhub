"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  CreditCard,
  Calendar,
  Heart,
  MessageCircle,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFanData, updateProfileAction } from "@/lib/actions";

/* ════════════════════════════════════════════════════════════════════
 *  Type definitions matching live Prisma query response shapes
 * ════════════════════════════════════════════════════════════════════ */

interface SubscriptionCard {
  id: string;
  status: string;
  clubName: string;
  clubColor: string;
  createdAt: Date;
}

interface ActivityItem {
  id: number;
  action: string;
  time: string;
  iconType: "heart" | "message" | "shield";
  iconColor: string;
  bg: string;
}

/* ════════════════════════════════════════════════════════════════════
 *  i18n Dictionary — en / fr / ar
 * ════════════════════════════════════════════════════════════════════ */

const fanDashboardTranslations = {
  en: {
    loading: "Loading your profile from the database...",
    profileTitle: "Supporter Profile",
    profileDesc: "Manage your personal details, active memberships, and interactions.",
    personalInfo: "Personal Information",
    personalInfoDesc: "Update your profile identity and security settings.",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    newPassword: "New Password",
    passwordPlaceholder: "Leave blank to keep unchanged",
    saveChanges: "Save Changes",
    saving: "Saving...",
    recentActivity: "Recent Activity Log",
    recentActivityDesc: "A history of your interactions with your clubs.",
    noActivity: "No interactions logged yet.",
    myMemberships: "My Memberships",
    myMembershipsDesc: "Your active club subscriptions.",
    noMemberships: "No active memberships found.",
    activeTier: "Active Tier",
    memberSince: "Member since:",
    manageBilling: "Manage Billing",
    discoverMore: "Discover More Clubs",
    discoverMoreDesc: "Find exclusive digital locker rooms, insider content, and connect with supporters across the league.",
    exploreDirectory: "Explore Directory",
    successMsg: "Profile updated successfully in the database!",
    errorMsg: "Failed to update profile.",
  },
  fr: {
    loading: "Chargement de votre profil depuis la base de données...",
    profileTitle: "Profil Supporter",
    profileDesc: "Gérez vos informations personnelles, vos adhésions actives et vos interactions.",
    personalInfo: "Informations Personnelles",
    personalInfoDesc: "Mettez à jour votre identité et vos paramètres de sécurité.",
    firstName: "Prénom",
    lastName: "Nom",
    emailAddress: "Adresse e-mail",
    newPassword: "Nouveau mot de passe",
    passwordPlaceholder: "Laissez vide pour conserver l'actuel",
    saveChanges: "Enregistrer les modifications",
    saving: "Enregistrement...",
    recentActivity: "Journal d'activité récent",
    recentActivityDesc: "Un historique de vos interactions avec vos clubs.",
    noActivity: "Aucune interaction enregistrée pour le moment.",
    myMemberships: "Mes Adhésions",
    myMembershipsDesc: "Vos abonnements actifs aux clubs.",
    noMemberships: "Aucune adhésion active trouvée.",
    activeTier: "Niveau Actif",
    memberSince: "Membre depuis :",
    manageBilling: "Gérer la facturation",
    discoverMore: "Découvrir plus de clubs",
    discoverMoreDesc: "Trouvez des vestiaires numériques exclusifs, du contenu inédit et connectez-vous avec d'autres supporters de la ligue.",
    exploreDirectory: "Explorer le répertoire",
    successMsg: "Profil mis à jour avec succès dans la base de données !",
    errorMsg: "Échec de la mise à jour du profil.",
  },
  ar: {
    loading: "جاري تحميل ملفك الشخصي من قاعدة البيانات...",
    profileTitle: "ملف المشجع",
    profileDesc: "إدارة بياناتك الشخصية، عضوياتك النشطة، وتفاعلاتك.",
    personalInfo: "المعلومات الشخصية",
    personalInfoDesc: "تحديث هويتك وإعدادات الأمان.",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    emailAddress: "البريد الإلكتروني",
    newPassword: "كلمة المرور الجديدة",
    passwordPlaceholder: "اتركه فارغاً للاحتفاظ بالكلمة الحالية",
    saveChanges: "حفظ التغييرات",
    saving: "جاري الحفظ...",
    recentActivity: "سجل النشاط الحديث",
    recentActivityDesc: "سجل لتفاعلاتك مع أنديتك.",
    noActivity: "لم يتم تسجيل أي تفاعلات بعد.",
    myMemberships: "عضوياتي",
    myMembershipsDesc: "اشتراكات أنديتك النشطة.",
    noMemberships: "لم يتم العثور على أي عضويات نشطة.",
    activeTier: "الفئة النشطة",
    memberSince: "عضو منذ:",
    manageBilling: "إدارة الفواتير",
    discoverMore: "اكتشف المزيد من الأندية",
    discoverMoreDesc: "ابحث عن غرف ملابس رقمية حصرية، محتوى داخلي، وتواصل مع المشجعين في جميع أنحاء الدوري.",
    exploreDirectory: "استكشاف الدليل",
    successMsg: "تم تحديث الملف الشخصي بنجاح في قاعدة البيانات!",
    errorMsg: "فشل في تحديث الملف الشخصي.",
  }
} as const;

/* ════════════════════════════════════════════════════════════════════
 *  Fan Dashboard Page Component
 * ════════════════════════════════════════════════════════════════════ */

export default function FanDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const langKey = (searchParams.get("lang") || "en") as "en" | "fr" | "ar";
  const t = fanDashboardTranslations[langKey] || fanDashboardTranslations.en;
  const isRTL = langKey === "ar";

  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Live database state
  const [subscriptions, setSubscriptions] = useState<SubscriptionCard[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  /* ── Fetch live fan data on mount ─────────────────────────────── */
  useEffect(() => {
    async function loadData() {
      const response = await getFanData();
      if (response.success && response.data) {
        const { user, subscriptions, activities } = response.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setSubscriptions(subscriptions);
        setActivities(activities);
      } else {
        router.push("/login?lang=" + langKey);
      }
      setLoading(false);
    }
    loadData();
  }, [router, langKey]);

  /* ── Profile update handler ───────────────────────────────────── */
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);

    startTransition(async () => {
      const response = await updateProfileAction(formData);
      if (response.success) {
        setMessage({
          type: "success",
          text: t.successMsg,
        });
        setPassword("");
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: response.error || t.errorMsg,
        });
      }
    });
  };

  /* ── Loading State ────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-text-muted">
          {t.loading}
        </p>
      </div>
    );
  }

  return (
    <main className="pt-36 pb-16 min-h-screen bg-neutral-bg text-text-dark px-4 md:px-8">
      <div dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-6xl space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-dark dark:text-white">
            {t.profileTitle}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {t.profileDesc}
          </p>
        </div>

        {/* Feedback Banner */}
        {message && (
          <div
            className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-950/30 dark:bg-emerald-950/10 dark:text-emerald-400"
                : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ═══════════════════════════════════════════════════════════ */}
          {/*  LEFT COLUMN                                               */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Component A: Account Details Card ──────────────────── */}
            <section className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-text-dark dark:text-white">
                  {t.personalInfo}
                </h2>
                <p className="text-sm text-text-muted">
                  {t.personalInfoDesc}
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                      {t.firstName}
                    </label>
                    <div className="relative">
                      <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                        <User className="h-4 w-4 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                      {t.lastName}
                    </label>
                    <div className="relative">
                      <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                        <User className="h-4 w-4 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                    {t.emailAddress}
                  </label>
                  <div className="relative">
                    <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                      <Mail className="h-4 w-4 text-text-muted" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                    {t.newPassword}
                  </label>
                  <div className="relative">
                    <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                      <Lock className="h-4 w-4 text-text-muted" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className={`w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white`}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-colors"
                  >
                    {isPending ? t.saving : t.saveChanges}
                  </Button>
                </div>
              </form>
            </section>

            {/* ── Component C: Historical Activities Log ─────────────── */}
            <section className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-text-dark dark:text-white">
                  {t.recentActivity}
                </h2>
                <p className="text-sm text-text-muted">
                  {t.recentActivityDesc}
                </p>
              </div>

              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    {t.noActivity}
                  </p>
                ) : (
                  activities.map((activity) => {
                    const Icon =
                      activity.iconType === "heart"
                        ? Heart
                        : activity.iconType === "message"
                          ? MessageCircle
                          : ShieldCheck;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 rounded-xl border border-border-custom bg-neutral-bg-alt p-4 transition-colors hover:border-text-muted/30 dark:bg-slate-950"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.bg}`}
                        >
                          <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-dark dark:text-slate-200">
                            {activity.action}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                            <Clock className="h-3.5 w-3.5" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/*  RIGHT COLUMN                                              */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-6">

            {/* ── Component B: Active Subscriptions Monitor ──────────── */}
            <section className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text-dark dark:text-white">
                    {t.myMemberships}
                  </h2>
                  <p className="mt-1 text-xs text-text-muted">
                    {t.myMembershipsDesc}
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>

              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    {t.noMemberships}
                  </p>
                ) : (
                  subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="group relative overflow-hidden rounded-xl border border-border-custom bg-neutral-bg-alt p-5 transition-all hover:shadow-md dark:bg-slate-950"
                    >
                      <div
                        className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-1.5`}
                        style={{ backgroundColor: sub.clubColor }}
                      />

                      <div className={isRTL ? "pr-3" : "pl-3"}>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-display font-bold text-text-dark dark:text-white">
                            {sub.clubName}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                              sub.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-text-muted dark:text-slate-300">
                          {t.activeTier}
                        </p>

                        <div className="mt-4 flex items-center gap-2 border-t border-border-custom pt-4 text-xs text-text-muted">
                          <Calendar className="h-3.5 w-3.5" />
                          {t.memberSince}{" "}
                          <span className="font-medium text-text-dark dark:text-slate-300">
                            {new Date(sub.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button
                variant="outline"
                className="mt-6 w-full gap-2 border-dashed"
              >
                <CreditCard className="h-4 w-4 text-text-muted" />
                {t.manageBilling}
              </Button>
            </section>

            {/* Quick Find Card */}
            <section className="rounded-2xl border border-border-custom bg-emerald-50 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/10">
              <h3 className="font-display font-bold text-emerald-900 dark:text-emerald-400">
                {t.discoverMore}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-emerald-700 dark:text-emerald-500/80">
                {t.discoverMoreDesc}
              </p>
              <Button
                className="mt-4 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm"
                onClick={() => router.push(`/clubs?lang=${langKey}`)}
              >
                {t.exploreDirectory}
                <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
