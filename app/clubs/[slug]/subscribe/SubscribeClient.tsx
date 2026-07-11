"use client";

import React, { useState } from "react";
import {
  Crown,
  Zap,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSubscriptionAction } from "@/lib/actions";
import Link from "next/link";

interface SubscribeClientProps {
  clubName: string;
  clubSlug: string;
  clubLogoUrl: string | null;
  clubLogoInitials: string;
  primaryColor: string;
  secondaryColor: string;
  monthlyPrice: number;
  annualOriginalPrice: number;
  annualDiscountedPrice: number;
  annualDiscountPercent: number;
  hasActiveSubscription: boolean;
}

const isColorLight = (hexColor: string | null | undefined) => {
  if (!hexColor) return false;
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = r * 0.2126 + g * 0.7152 + b * 0.0722;
  return brightness > 128;
};

export default function SubscribeClient({
  clubName,
  clubSlug,
  clubLogoUrl,
  clubLogoInitials,
  primaryColor,
  secondaryColor,
  monthlyPrice,
  annualOriginalPrice,
  annualDiscountedPrice,
  annualDiscountPercent,
  hasActiveSubscription,
}: SubscribeClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";
  const isRTL = lang === "ar";

  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const primary = primaryColor || "#10B981";
  const secondary = secondaryColor || "#059669";
  const isPrimaryLight = isColorLight(primary);
  const heroTextColor = isPrimaryLight ? "text-slate-900" : "text-white";

  const heroBackgroundStyle: React.CSSProperties =
    primary === secondary
      ? { backgroundColor: primary }
      : { background: `linear-gradient(135deg, ${primary}, ${secondary})` };

  const handleSelectPlan = async (planType: "monthly" | "annual") => {
    setError(null);
    setProcessingPlan(planType);

    const amount = planType === "monthly" ? monthlyPrice : annualDiscountedPrice;

    try {
      const res = await createSubscriptionAction(clubSlug, amount);
      if (!res.success) {
        setError(res.error || "Failed to process subscription.");
        setProcessingPlan(null);
        return;
      }
      router.push(`/clubs/${clubSlug}?lang=${lang}`);
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
      setProcessingPlan(null);
    }
  };

  const monthlyPerMonth = monthlyPrice;
  const annualPerMonth = Math.round(annualDiscountedPrice / 12);

  // i18n
  const t = {
    en: {
      title: "Choose Your Membership",
      subtitle: `Unlock exclusive premium content from ${clubName}`,
      monthly: "Monthly Supporter",
      monthlyDesc: "Essential access to all premium posts and community interaction.",
      annual: "Annual VIP Access",
      annualDesc: "Full year of premium access with exclusive VIP perks and merchandise discounts.",
      perMonth: "/ month",
      perYear: "/ year",
      billedMonthly: "Billed monthly",
      billedAnnually: "Billed annually",
      save: "Save",
      subscribe: "Subscribe Now",
      processing: "Processing...",
      back: "Back to Club",
      alreadySubscribed: "You already have an active subscription.",
      features: ["All premium posts unlocked", "Direct club interaction", "Cancel anytime"],
      vipFeatures: ["Everything in Monthly", "Exclusive VIP badge", "Merchandise discounts", "Priority support"],
      bestValue: "Best Value",
      mostPopular: "Most Popular",
      securePayment: "Secured by SSL encryption • Cancel anytime",
    },
    fr: {
      title: "Choisissez Votre Abonnement",
      subtitle: `Débloquez le contenu premium exclusif de ${clubName}`,
      monthly: "Supporter Mensuel",
      monthlyDesc: "Accès essentiel à tous les posts premium et interaction communautaire.",
      annual: "Accès VIP Annuel",
      annualDesc: "Un an complet d'accès premium avec avantages VIP exclusifs et réductions.",
      perMonth: "/ mois",
      perYear: "/ an",
      billedMonthly: "Facturé mensuellement",
      billedAnnually: "Facturé annuellement",
      save: "Économisez",
      subscribe: "S'abonner",
      processing: "Traitement...",
      back: "Retour au Club",
      alreadySubscribed: "Vous avez déjà un abonnement actif.",
      features: ["Posts premium débloqués", "Interaction avec le club", "Annulation à tout moment"],
      vipFeatures: ["Tout du mensuel", "Badge VIP exclusif", "Réductions boutique", "Support prioritaire"],
      bestValue: "Meilleure Offre",
      mostPopular: "Le Plus Populaire",
      securePayment: "Sécurisé par cryptage SSL • Annulation à tout moment",
    },
    ar: {
      title: "اختر عضويتك",
      subtitle: `افتح المحتوى المميز الحصري من ${clubName}`,
      monthly: "داعم شهري",
      monthlyDesc: "وصول أساسي لجميع المنشورات المميزة والتفاعل المجتمعي.",
      annual: "عضوية VIP سنوية",
      annualDesc: "سنة كاملة من الوصول المميز مع امتيازات VIP حصرية وخصومات.",
      perMonth: "/ شهر",
      perYear: "/ سنة",
      billedMonthly: "يُفوتر شهرياً",
      billedAnnually: "يُفوتر سنوياً",
      save: "وفر",
      subscribe: "اشترك الآن",
      processing: "جاري المعالجة...",
      back: "العودة للنادي",
      alreadySubscribed: "لديك اشتراك نشط بالفعل.",
      features: ["جميع المنشورات المميزة", "تفاعل مع النادي", "إلغاء في أي وقت"],
      vipFeatures: ["كل مميزات الشهري", "شارة VIP حصرية", "خصومات المتجر", "دعم أولوي"],
      bestValue: "أفضل قيمة",
      mostPopular: "الأكثر شعبية",
      securePayment: "مؤمن بتشفير SSL • إلغاء في أي وقت",
    },
  }[lang] || {
    title: "Choose Your Membership",
    subtitle: `Unlock exclusive premium content from ${clubName}`,
    monthly: "Monthly Supporter",
    monthlyDesc: "Essential access to all premium posts and community interaction.",
    annual: "Annual VIP Access",
    annualDesc: "Full year of premium access with exclusive VIP perks and merchandise discounts.",
    perMonth: "/ month",
    perYear: "/ year",
    billedMonthly: "Billed monthly",
    billedAnnually: "Billed annually",
    save: "Save",
    subscribe: "Subscribe Now",
    processing: "Processing...",
    back: "Back to Club",
    alreadySubscribed: "You already have an active subscription.",
    features: ["All premium posts unlocked", "Direct club interaction", "Cancel anytime"],
    vipFeatures: ["Everything in Monthly", "Exclusive VIP badge", "Merchandise discounts", "Priority support"],
    bestValue: "Best Value",
    mostPopular: "Most Popular",
    securePayment: "Secured by SSL encryption • Cancel anytime",
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col"
      style={{
        ...heroBackgroundStyle,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Subtle decorative pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 relative z-10">
        {/* Back Navigation */}
        <div className="w-full max-w-3xl mb-8">
          <Link
            href={`/clubs/${clubSlug}?lang=${lang}`}
            className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/10 rounded-xl transition-all ${heroTextColor}`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            {t.back}
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Club Logo */}
          <div className="mx-auto mb-6 h-20 w-20 rounded-2xl overflow-hidden border-[3px] border-white/30 shadow-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm">
            {clubLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={clubLogoUrl} alt={clubName} className="h-full w-full object-cover" />
            ) : (
              <span className={`font-display text-2xl font-black ${heroTextColor}`}>
                {clubLogoInitials}
              </span>
            )}
          </div>
          <h1 className={`font-display text-3xl md:text-4xl font-extrabold tracking-tight ${heroTextColor}`}
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>
            {t.title}
          </h1>
          <p className={`mt-3 text-base max-w-md mx-auto ${isPrimaryLight ? "text-slate-700" : "text-white/75"}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Already Subscribed Banner */}
        {hasActiveSubscription && (
          <div className="w-full max-w-3xl mb-8 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl text-center">
            <p className={`text-sm font-semibold ${heroTextColor}`}>
              ✓ {t.alreadySubscribed}
            </p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="w-full max-w-3xl mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl text-center">
            <p className="text-sm font-semibold text-white">{error}</p>
          </div>
        )}

        {/* ═══════════ Pricing Cards Grid ═══════════ */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Card 1: Monthly Supporter ── */}
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl p-7 flex flex-col transition-all duration-300 hover:shadow-3xl hover:translate-y-[-4px]">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center shadow-sm"
                   style={{ backgroundColor: primary }}>
                <Zap className={`h-5 w-5 ${isPrimaryLight ? "text-slate-900" : "text-white"}`} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {t.monthly}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.mostPopular}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {t.monthlyDesc}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">
                  {monthlyPerMonth}
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                  MAD {t.perMonth}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{t.billedMonthly}</p>
            </div>

            {/* Feature List */}
            <ul className="space-y-3 mb-8 flex-grow">
              {t.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleSelectPlan("monthly")}
              disabled={!!processingPlan || hasActiveSubscription}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border-2 hover:shadow-lg active:scale-[0.98]"
              style={{
                borderColor: primary,
                color: primary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primary;
                e.currentTarget.style.color = isPrimaryLight ? "#0f172a" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = primary;
              }}
            >
              {processingPlan === "monthly" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.processing}
                </span>
              ) : (
                t.subscribe
              )}
            </button>
          </div>

          {/* ── Card 2: Annual VIP Access ── */}
          <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border-2 shadow-2xl p-7 flex flex-col transition-all duration-300 hover:shadow-3xl hover:translate-y-[-4px]"
               style={{ borderColor: primary }}>

            {/* Discount Badge */}
            {annualDiscountPercent > 0 && (
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                style={{
                  backgroundColor: primary,
                  color: isPrimaryLight ? "#0f172a" : "#ffffff",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t.save} {annualDiscountPercent}% — {t.bestValue}
              </div>
            )}

            <div className="flex items-center gap-3 mb-5 mt-2">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center shadow-sm"
                   style={{ backgroundColor: primary }}>
                <Crown className={`h-5 w-5 ${isPrimaryLight ? "text-slate-900" : "text-white"}`} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {t.annual}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: primary }}>
                  {t.bestValue}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {t.annualDesc}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">
                  {annualPerMonth}
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                  MAD {t.perMonth}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                {annualDiscountPercent > 0 && (
                  <span className="text-[11px] text-slate-400 line-through">
                    {annualOriginalPrice} MAD
                  </span>
                )}
                <span className="text-[11px] font-bold" style={{ color: primary }}>
                  {annualDiscountedPrice} MAD {t.perYear}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{t.billedAnnually}</p>
            </div>

            {/* VIP Feature List */}
            <ul className="space-y-3 mb-8 flex-grow">
              {t.vipFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: primary }} />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleSelectPlan("annual")}
              disabled={!!processingPlan || hasActiveSubscription}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
              style={{
                backgroundColor: primary,
                color: isPrimaryLight ? "#0f172a" : "#ffffff",
              }}
            >
              {processingPlan === "annual" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.processing}
                </span>
              ) : (
                t.subscribe
              )}
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <Shield className={`h-4 w-4 ${isPrimaryLight ? "text-slate-600" : "text-white/50"}`} />
          <span className={`text-xs font-medium ${isPrimaryLight ? "text-slate-600" : "text-white/50"}`}>
            {t.securePayment}
          </span>
        </div>
      </div>
    </div>
  );
}
