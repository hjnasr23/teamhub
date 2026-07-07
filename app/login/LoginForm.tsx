"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/actions";

// 1. Local Text Dictionary supporting Arabic, French, and English
const dict = {
  en: {
    title: "Sign In to TEAMHUB",
    subtitle: "Access your personalized sports subscription dashboard",
    email: "Email Address",
    emailPlaceholder: "fan@teamhub.ma",
    password: "Password",
    passwordPlaceholder: "••••••••",
    submitBtn: "Sign In",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign Up",
    tagline: "Fuel the game,\nmonetize the passion.",
    marketingText: "Welcome back to the portal built for modern sports teams. Manage your active club memberships, view premium content, and follow your favorite team's journey."
  },
  fr: {
    title: "Connexion à TEAMHUB",
    subtitle: "Accédez à votre tableau de bord d'abonnement sportif personnalisé",
    email: "Adresse Email",
    emailPlaceholder: "fan@teamhub.ma",
    password: "Mot de passe",
    passwordPlaceholder: "••••••••",
    submitBtn: "Se connecter",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    tagline: "Propulsez le jeu,\nmonétisez la passion.",
    marketingText: "Bon retour sur la plateforme conçue pour les équipes sportives modernes. Gérez vos abonnements, accédez au contenu exclusif et suivez le parcours de votre club préféré."
  },
  ar: {
    title: "تسجيل الدخول",
    subtitle: "الولوج إلى لوحة التحكم الرياضية المخصصة لك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "fan@teamhub.ma",
    password: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    submitBtn: "تسجيل الدخول",
    dontHaveAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    tagline: "أشعل اللعبة،\nواستثمر الشغف.",
    marketingText: "مرحبًا بك مجددًا في المنصة المصممة للفرق الرياضية الحديثة. أدر اشتراكاتك النشطة، واطلع على المحتوى الحصري، وتابع مسيرة فريقك المفضل."
  }
};

interface LoginFormProps {
  lang: "en" | "fr" | "ar";
}

export default function LoginForm({ lang }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const t = dict[lang];
  const isRTL = lang === 'ar';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await loginAction(formData);

      if (response.success && response.data) {
        const role = response.data.role;
        let redirectPath = `/dashboard/fan?lang=${lang}`;

        if (role === "SUPER_ADMIN") {
          redirectPath = `/admin-gen?lang=${lang}`;
        } else if (role === "CLUB_ADMIN") {
          redirectPath = `/dashboard/club?lang=${lang}`;
        }

        router.refresh();
        router.push(redirectPath);
      } else {
        setError(response.error || "Invalid credentials.");
      }
    });
  };

  return (
    <main
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-slate-50 dark:bg-[#060b13] text-gray-900 dark:text-white pt-44 pb-16 px-4 sm:px-6 md:px-12 flex items-center justify-center transition-all duration-200"
    >
      {/* Structural Fluid Grid Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

        {/* Left Side: Fully Flexible Form (Columns 1 to 6) */}
        <div className="col-span-1 md:col-span-6 w-full flex flex-col justify-center">
          <div className="bg-white dark:bg-[#0c1420] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl w-full">

            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                {t.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.subtitle}
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Address */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                  {t.password}
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder={t.passwordPlaceholder}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-bold rounded-xl text-center text-sm transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPending ? "Signing In..." : t.submitBtn}
              </button>
            </form>

            {/* Bottom Link Redirect */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {t.dontHaveAccount}{' '}
              <Link
                href={`/register?lang=${lang}`}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                {t.signUp}
              </Link>
            </div>

          </div>
        </div>

        {/* Right Side: Localized Marketing Tagline (Columns 7 to 12) */}
        <div className={`hidden md:flex col-span-1 md:col-span-6 flex-col justify-center text-start px-8 ${isRTL ? 'border-r border-gray-200 dark:border-gray-800/60' : 'border-l border-gray-200 dark:border-gray-800/60'}`}>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight whitespace-pre-line mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500">
              {t.tagline}
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-lg">
            {t.marketingText}
          </p>
        </div>

      </div>
    </main>
  );
}
