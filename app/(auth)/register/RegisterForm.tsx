"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { registerAction } from "@/lib/actions";

// 1. Local Text Dictionary supporting Arabic, French, and English
const dict = {
  en: {
    title: "Create an Account",
    subtitle: "Start your sports fan subscription portal",
    fullName: "Full Name",
    fullNamePlaceholder: "Coach Carter",
    email: "Email Address",
    emailPlaceholder: "fan@teamhub.ma",
    password: "Password",
    passwordPlaceholder: "••••••••",
    submitBtn: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    tagline: "Fuel the game,\nmonetize the passion.",
    marketingText: "Join the platform built for modern sports teams. Launch subscription plans, deliver exclusive content, and interact with fans like never before.",
    continueWithGoogle: "Continue with Google",
    or: "or"
  },
  fr: {
    title: "Créer un Compte",
    subtitle: "Démarrez votre portail d'abonnement de fans",
    fullName: "Nom Complet",
    fullNamePlaceholder: "Coach Carter",
    email: "Adresse Email",
    emailPlaceholder: "fan@teamhub.ma",
    password: "Mot de passe",
    passwordPlaceholder: "••••••••",
    submitBtn: "Créer le Compte",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    signIn: "Se connecter",
    tagline: "Propulsez le jeu,\nmonétisez la passion.",
    marketingText: "Rejoignez la plateforme conçue pour les équipes sportives modernes. Lancez des abonnements, proposez du contenu exclusif et interagissez avec vos supporters.",
    continueWithGoogle: "Continuer avec Google",
    or: "ou"
  },
  ar: {
    title: "إنشاء حساب",
    subtitle: "ابدأ بوابة الاشتراك الرياضي الخاصة بالمعجبين",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "الكابتن كارتر",
    email: "البريد الإلكتروني",
    emailPlaceholder: "fan@teamhub.ma",
    password: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    submitBtn: "إنشاء الحساب",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
    tagline: "أشعل اللعبة،\nواستثمر الشغف.",
    marketingText: "انضم إلى المنصة المصممة للفرق الرياضية الحديثة. أطلق خطط الاشتراك، وقدم محتوى حصريًا، وتفاعل مع المعجبين بشكل لم يسبق له مثيل.",
    continueWithGoogle: "متابعة باستخدام Google",
    or: "أو"
  }
};

interface RegisterFormProps {
  lang: "en" | "fr" | "ar";
}

export default function RegisterForm({ lang }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const t = dict[lang];
  const isRTL = lang === 'ar';

  const callbackUrl = searchParams.get("callbackUrl");
  const planId = searchParams.get("planId");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);
    
    // We enforce FAN role registration on signup as instructed earlier
    formData.append("role", "FAN");

    startTransition(async () => {
      const response = await registerAction(formData);

      if (response.success) {
        setSuccessMsg(lang === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري تحويلك...' : lang === 'fr' ? 'Compte créé avec succès! Redirection...' : 'Account created successfully! Redirecting...');
        
        let loginUrl = `/login?lang=${lang}`;
        if (callbackUrl) {
          let finalCallback = callbackUrl;
          if (planId && !callbackUrl.includes("planId=")) {
            finalCallback += `${callbackUrl.includes("?") ? "&" : "?"}planId=${planId}`;
          }
          loginUrl += `&callbackUrl=${encodeURIComponent(finalCallback)}`;
        }
        
        setTimeout(() => {
          router.push(loginUrl);
        }, 1500);
      } else {
        setError(response.error || "Registration failed.");
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

            {successMsg && (
              <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-950/30 dark:bg-emerald-950/10 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                  {t.fullName}
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder={t.fullNamePlaceholder}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111a2e] border border-gray-300 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors autofill:bg-gray-50 dark:autofill:bg-[#111a2e]"
                  required
                />
              </div>

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
                {isPending ? "Creating Account..." : t.submitBtn}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#0c1420] px-2 text-gray-500 dark:text-gray-400">
                  {t.or}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: callbackUrl || undefined })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-[#111a2e] hover:bg-gray-50 dark:hover:bg-[#152038] active:scale-[0.99] text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-300 dark:border-gray-800 text-sm transition-all shadow-sm cursor-pointer"
            >
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>{t.continueWithGoogle}</span>
            </button>

            {/* Bottom Link Redirect */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {t.alreadyHaveAccount}{' '}
              <Link 
                href={`/login?lang=${lang}`} 
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                {t.signIn}
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
