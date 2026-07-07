"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Users, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/lib/actions";

/* ────────────────────────────────────────────────────────────────────
 *  i18n Dictionary — en / fr / ar
 * ──────────────────────────────────────────────────────────────────── */

const loginTranslations = {
  en: {
    returnHome: "← Return to Home",
    title: "Sign in to TEAMHUB",
    subtitle: "Access your custom digital workspace",
    fanTab: "Supporter Workspace",
    adminTab: "Club Admin Portal",
    emailLabel: "Email address",
    emailPlaceholderFan: "fan@teamhub.ma",
    emailPlaceholderAdmin: "admin@teamhub.ma",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    verifying: "Verifying...",
    signInFan: "Sign In as Supporter",
    signInAdmin: "Sign In as Admin",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    defaultError: "Invalid login credentials.",
  },
  fr: {
    returnHome: "← Retour à l'accueil",
    title: "Connectez-vous à TEAMHUB",
    subtitle: "Accédez à votre espace numérique personnalisé",
    fanTab: "Espace Supporter",
    adminTab: "Portail Admin Club",
    emailLabel: "Adresse e-mail",
    emailPlaceholderFan: "fan@teamhub.ma",
    emailPlaceholderAdmin: "admin@teamhub.ma",
    passwordLabel: "Mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    verifying: "Vérification...",
    signInFan: "Se connecter en tant que Supporter",
    signInAdmin: "Se connecter en tant qu'Admin",
    noAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    defaultError: "Identifiants de connexion invalides.",
  },
  ar: {
    returnHome: "→ العودة إلى الرئيسية",
    title: "تسجيل الدخول إلى TEAMHUB",
    subtitle: "الوصول إلى مساحة العمل الرقمية الخاصة بك",
    fanTab: "مساحة المشجع",
    adminTab: "بوابة إدارة النادي",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholderFan: "fan@teamhub.ma",
    emailPlaceholderAdmin: "admin@teamhub.ma",
    passwordLabel: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    verifying: "جاري التحقق...",
    signInFan: "تسجيل الدخول كمشجع",
    signInAdmin: "تسجيل الدخول كمشرف",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    defaultError: "بيانات الدخول غير صحيحة.",
  },
} as const;

/* ────────────────────────────────────────────────────────────────────
 *  Login Page Component
 * ──────────────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const langKey = (searchParams.get("lang") || "en") as "en" | "fr" | "ar";
  const t = loginTranslations[langKey] || loginTranslations.en;
  const isRTL = langKey === "ar";

  const [role, setRole] = useState<"FAN" | "CLUB_ADMIN">("FAN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    startTransition(async () => {
      const response = await loginAction(formData);
      if (response.success && response.data) {
        router.refresh();
        if (response.data.role === "CLUB_ADMIN") {
          router.push(`/dashboard/club?lang=${langKey}`);
        } else {
          router.push(`/dashboard/fan?lang=${langKey}`);
        }
      } else {
        setError(response.error || t.defaultError);
      }
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-neutral-bg-alt p-4 dark:bg-slate-950 sm:p-6">

      {/* Subtle Stripe-style Radial Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-200/50 via-neutral-bg-alt to-neutral-bg-alt dark:from-slate-800/40 dark:via-slate-950 dark:to-slate-950" />

      {/* Center Authentication Panel */}
      <div className="relative w-full max-w-[420px] rounded-2xl border border-border-custom bg-white p-8 shadow-2xl dark:bg-slate-900">

        {/* Return to Home Link */}
        <div className="mb-5 flex">
          <Link
            href={`/?lang=${langKey}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-emerald-500 transition-colors duration-200"
          >
            {t.returnHome}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-dark dark:text-white">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {t.subtitle}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Dual-Segmented Role Controller */}
          <div className="flex w-full rounded-xl bg-neutral-bg-alt p-1 dark:bg-slate-950">
            <button
              type="button"
              onClick={() => { setRole("FAN"); setError(null); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                role === "FAN"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                  : "text-text-muted hover:text-text-dark dark:hover:text-slate-300"
              }`}
            >
              <Users className="h-4 w-4" />
              {t.fanTab}
            </button>
            <button
              type="button"
              onClick={() => { setRole("CLUB_ADMIN"); setError(null); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                role === "CLUB_ADMIN"
                  ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400"
                  : "text-text-muted hover:text-text-dark dark:hover:text-slate-300"
              }`}
            >
              <Building2 className="h-4 w-4" />
              {t.adminTab}
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                {t.emailLabel}
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
                  placeholder={role === "CLUB_ADMIN" ? t.emailPlaceholderAdmin : t.emailPlaceholderFan}
                  className={`w-full rounded-xl border border-border-custom bg-white py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder-text-muted transition-colors focus:outline-none focus:ring-1 dark:bg-slate-900 dark:text-white ${
                    role === "CLUB_ADMIN"
                      ? "focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                      : "focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                  {t.passwordLabel}
                </label>
                <Link
                  href="#"
                  className={`text-xs font-semibold hover:underline ${
                    role === "CLUB_ADMIN"
                      ? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      : "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  }`}
                >
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <Lock className="h-4 w-4 text-text-muted" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border border-border-custom bg-white py-2.5 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-text-dark placeholder-text-muted transition-colors focus:outline-none focus:ring-1 dark:bg-slate-900 dark:text-white ${
                    role === "CLUB_ADMIN"
                      ? "focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                      : "focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className={`w-full gap-2 font-bold text-white shadow-md transition-colors ${
              role === "CLUB_ADMIN"
                ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            }`}
          >
            {isPending ? t.verifying : (role === "CLUB_ADMIN" ? t.signInAdmin : t.signInFan)}
            <ArrowRight className="h-4 w-4" />
          </Button>

        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
          {t.noAccount}{" "}
          <Link href="#" className={`font-semibold transition-colors hover:underline ${
            role === "CLUB_ADMIN"
              ? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              : "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          }`}>
            {t.signUp}
          </Link>
        </div>

      </div>
    </div>
  );
}
