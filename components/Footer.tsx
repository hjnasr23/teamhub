"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

const footerTranslations = {
  en: {
    description: "The premium multitenant infrastructure for Moroccan sports associations and loyal supporters.",
    platform: "PLATFORM",
    discoverClubs: "Clubs",
    loginPortal: "Login Portal",
    legal: "LEGAL",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    followUs: "FOLLOW US",
    rightsReserved: "TEAMHUB. All rights reserved."
  },
  fr: {
    description: "L'infrastructure multitenant premium pour les associations sportives marocaines et les supporters fidèles.",
    platform: "PLATEFORME",
    discoverClubs: "Clubs",
    loginPortal: "Portail de Connexion",
    legal: "LÉGAL",
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    followUs: "SUIVEZ-NOUS",
    rightsReserved: "TEAMHUB. Tous droits réservés."
  },
  ar: {
    description: "البنية التحتية الممتازة متعددة المستأجرين للجمعيات الرياضية المغربية والمشجعين الأوفياء.",
    platform: "المنصة",
    discoverClubs: "الأندية",
    loginPortal: "بوابة تسجيل الدخول",
    legal: "قانوني",
    privacyPolicy: "سياسة الخصوصية",
    termsOfService: "شروط الخدمة",
    followUs: "تابعنا",
    rightsReserved: "TEAMHUB. جميع الحقوق محفوظة."
  }
} as const;

function FooterContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams?.get("lang");
  const lang = (langParam === "ar" || langParam === "fr" || langParam === "en") ? langParam : "en";
  const t = footerTranslations[lang];
  const isRTL = lang === "ar";
  const pathname = usePathname();
  const isClubPortal = pathname.startsWith("/clubs/");

  const textClass = isClubPortal 
    ? "text-slate-800 dark:text-slate-200 font-medium" 
    : "text-text-muted";
  const headingClass = isClubPortal 
    ? "text-slate-900 dark:text-white font-bold" 
    : "text-text-dark font-semibold";
  const linkHoverClass = isClubPortal
    ? "hover:text-slate-950 dark:hover:text-white"
    : "hover:text-emerald-500";

  return (
    <div className="mx-auto w-full max-w-7xl px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className={`flex items-center space-x-2 font-bold text-xl ${headingClass}`}>
            <span className={isClubPortal ? "text-slate-900 dark:text-white" : "text-emerald-500"}>TEAM</span>HUB
          </div>
          <p className={`text-sm leading-relaxed ${textClass}`}>
            {t.description}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className={`mb-4 text-sm uppercase tracking-wider ${headingClass}`}>{t.platform}</h3>
          <ul className={`space-y-2 text-sm ${textClass}`}>
            <li>
              <Link href={`/clubs?lang=${lang}`} className={`transition-colors inline-block ${linkHoverClass}`}>
                {t.discoverClubs}
              </Link>
            </li>
            <li>
              <Link href={`/login?lang=${lang}`} className={`transition-colors inline-block ${linkHoverClass}`}>
                {t.loginPortal}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className={`mb-4 text-sm uppercase tracking-wider ${headingClass}`}>{t.legal}</h3>
          <ul className={`space-y-2 text-sm ${textClass}`}>
            <li>
              <Link href="#" className={`transition-colors inline-block ${linkHoverClass}`}>
                {t.privacyPolicy}
              </Link>
            </li>
            <li>
              <Link href="#" className={`transition-colors inline-block ${linkHoverClass}`}>
                {t.termsOfService}
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media - Dynamic SVGs */}
        <div>
          <h3 className={`mb-4 text-sm uppercase tracking-wider ${headingClass}`}>{t.followUs}</h3>
          <div className="flex space-x-4">
            {/* Twitter / X */}
            <a href="#" className={`transition-colors ${isClubPortal ? "text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white" : "text-text-muted hover:text-emerald-500"}`} aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className={`transition-colors ${isClubPortal ? "text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white" : "text-text-muted hover:text-emerald-500"}`} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* Youtube */}
            <a href="#" className={`transition-colors ${isClubPortal ? "text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white" : "text-text-muted hover:text-emerald-500"}`} aria-label="Youtube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                <polygon points="10 15 15 12 10 9 10 15" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={`mt-8 border-t border-border-custom/25 pt-8 text-center text-xs ${textClass}`}>
        <p>&copy; {new Date().getFullYear()} {t.rightsReserved}</p>
      </div>
    </div>
  );
}

export default function Footer({ forceShow = false }: { forceShow?: boolean }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/clubs/") && !forceShow) return null;

  const isClubPortal = pathname.startsWith("/clubs/");

  return (
    <footer className={`py-12 text-text-muted transition-colors duration-200 ${isClubPortal ? "bg-transparent border-transparent" : "border-t border-border-custom/30 bg-neutral-bg-alt"}`}>
      <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 min-h-[200px]" />}>
        <FooterContent />
      </Suspense>
    </footer>
  );
}