"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { logoutAction } from "@/lib/actions";
import { signOut } from "next-auth/react";
import {
  Home,
  CreditCard,
  Trophy,
  Settings,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Users,
  Globe,
  Shield,
  ArrowLeft,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
 *  Navigation link data
 * ──────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "/clubs", label: "Clubs", icon: Shield },
];

/* ────────────────────────────────────────────────────────────────────
 *  DashboardLayout — Vercel / Stripe–style top navigation bar
 * ──────────────────────────────────────────────────────────────────── */

export default function DashboardLayout({
  children,
  isAdmin = false,
  isLoggedIn = false,
  adminClubSlug = null,
  session = null,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  adminClubSlug?: string | null;
  session?: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isClubProfilePage = pathname.startsWith("/clubs/") && pathname !== "/clubs";
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const langKey = (searchParams.get("lang") || "en").toLowerCase() as "en" | "fr" | "ar";
  const currentLang = langKey.toUpperCase();
  const isRTL = langKey === "ar";

  const LANGS = ["EN", "FR", "AR"] as const;

  const navTranslations = {
    en: {
      discover: "Clubs",
      login: "Login",
      signUp: "Sign Up",
      signOut: "Sign Out",
      signingOut: "Signing Out...",
      adminDashboard: "Admin Dashboard",
      menu: "Menu",
      theme: "Theme",
      language: "Language",
      backToDirectory: "Back to Clubs",
      accountSettings: "Account Settings"
    },
    fr: {
      discover: "Clubs",
      login: "Connexion",
      signUp: "S'inscrire",
      signOut: "Se déconnecter",
      signingOut: "Déconnexion...",
      adminDashboard: "Tableau de Bord Admin",
      menu: "Menu",
      theme: "Thème",
      language: "Langue",
      backToDirectory: "Retour aux Clubs",
      accountSettings: "Paramètres du compte"
    },
    ar: {
      discover: "الأندية",
      login: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      signingOut: "جاري تسجيل الخروج...",
      adminDashboard: "لوحة التحكم للمشرف",
      menu: "القائمة",
      theme: "المظهر",
      language: "اللغة",
      backToDirectory: "العودة للأندية",
      accountSettings: "إعدادات الحساب"
    }
  } as const;

  const t = navTranslations[langKey];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({ callbackUrl: "/" });
    });
  };

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Close drawer on outside click */
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname.startsWith("/admin")) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen text-text-dark transition-colors duration-300 ${pathname.startsWith("/clubs/") ? "bg-transparent" : "bg-neutral-bg-alt"}`}>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  TOP NAVIGATION BAR                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header
        className={
          pathname.startsWith("/clubs/")
            ? "w-full sticky top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md shadow-sm px-6 py-2 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300"
            : `fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
                isScrolled
                  ? "w-[85%] max-w-5xl px-4 py-2 bg-neutral-bg/80 backdrop-blur-md border border-border-custom rounded-2xl shadow-lg"
                  : "w-[95%] max-w-7xl px-6 py-4 bg-transparent border-transparent"
              }`
        }
      >
        <div className="mx-auto flex h-16 w-full items-center justify-between">
          {/* ── Left: Logo & Back Button & Desktop nav links ─────── */}
          <div className="flex items-center gap-2 md:gap-8">
            {isClubProfilePage && (
              <>
                {/* Desktop: Sleek Back Button to the left of the logo */}
                <Link
                  href={`/clubs?lang=${langKey}`}
                  className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800/60 active:scale-95 transition-all duration-200"
                >
                  <ArrowLeft className={`h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 ${isRTL ? "rotate-180" : ""}`} />
                  <span>{t.backToDirectory}</span>
                </Link>
                {/* Mobile: Simple back arrow next to the logo */}
                <Link
                  href={`/clubs?lang=${langKey}`}
                  className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 active:scale-95 transition-all duration-200"
                  aria-label="Back to Clubs"
                >
                  <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </>
            )}

            <Link
              href={`/?lang=${langKey}`}
              className="flex flex-shrink-0 items-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo.png"
                alt="TEAMHUB"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                unoptimized
                priority
              />
            </Link>

            {/* ── Center: Desktop nav links ──────────────────────── */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                const label = link.href === "/clubs" ? t.discover : link.label;
                const linkClass = pathname.startsWith("/clubs/")
                  ? `${
                      active
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-900 dark:text-slate-100 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    }`
                  : `${
                      active
                        ? "text-text-dark"
                        : "text-text-muted hover:text-text-dark"
                    }`;

                return (
                  <Link
                    key={link.href}
                    href={`${link.href}?lang=${langKey}`}
                    className={`relative rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${linkClass}`}
                  >
                    {label}
                    {/* Active indicator — thin bottom bar */}
                    {active && (
                      <span className={`absolute inset-x-1 -bottom-[17px] h-[2px] rounded-full ${
                        pathname.startsWith("/clubs/")
                          ? "bg-blue-600 dark:bg-blue-400"
                          : "bg-emerald-600 dark:bg-emerald-400"
                      }`} />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Right: Actions ───────────────────────────────────── */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {isAdmin && (
              <Link
                href={adminClubSlug ? `/admin/${adminClubSlug}?lang=${langKey}` : `/dashboard/admin?lang=${langKey}`}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hidden md:inline-block ${
                  pathname.startsWith("/clubs/")
                    ? "text-slate-900 dark:text-slate-100 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    : pathname.startsWith("/admin")
                    ? "text-text-dark"
                    : "text-text-muted hover:text-text-dark"
                }`}
              >
                {t.adminDashboard}
                {pathname.startsWith("/admin") && (
                  <span className="absolute inset-x-1 -bottom-[17px] h-[2px] rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </Link>
            )}

            <div className="hidden md:flex items-center gap-1 text-xs font-semibold select-none">
              {LANGS.map((lang, i) => {
                const switcherParams = new URLSearchParams(searchParams.toString());
                switcherParams.set("lang", lang.toLowerCase());
                const langClass = pathname.startsWith("/clubs/")
                  ? `${
                      currentLang === lang
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                    }`
                  : `${
                      currentLang === lang
                        ? "text-emerald-500 font-bold"
                        : "text-text-muted hover:text-emerald-500"
                    }`;

                return (
                  <React.Fragment key={lang}>
                    {i > 0 && <span className="opacity-30 text-text-muted">|</span>}
                    <Link
                      href={`${pathname}?${switcherParams.toString()}`}
                      className={`transition-colors duration-200 ${langClass}`}
                    >
                      {lang}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="hidden md:flex">
              <ThemeToggle />
            </div>

            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                {!isAdmin && (
                  <Link
                    href={`/settings?lang=${langKey}`}
                    className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                      pathname.startsWith("/clubs/")
                        ? "text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                        : "text-text-muted hover:text-text-dark"
                    }`}
                  >
                    {t.accountSettings}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 shadow-sm transition-colors hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  {isPending ? t.signingOut : t.signOut}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={`/login?lang=${langKey}`}
                  className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                    pathname.startsWith("/clubs/")
                      ? "text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                      : "text-text-muted hover:text-text-dark"
                  }`}
                >
                  {t.login}
                </Link>
                <Link
                  href={`/register?lang=${langKey}`}
                  className={`rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors ${
                    pathname.startsWith("/clubs/")
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {t.signUp}
                </Link>
              </div>
            )}

            {/* Mobile burger — only visible < md */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`ml-1 rounded-lg p-2 transition-colors md:hidden ${
                pathname.startsWith("/clubs/")
                  ? "text-slate-900 dark:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  : "text-text-muted hover:bg-neutral-bg-alt hover:text-text-dark"
              }`}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  MOBILE DRAWER — slide-in from right                      */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-neutral-bg border-l border-border-custom shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-border-custom px-5">
          <span className="text-sm font-semibold text-text-dark">{t.menu}</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-neutral-bg-alt hover:text-text-dark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            const label = link.href === "/clubs" ? t.discover : link.label;
            return (
              <Link
                key={link.href}
                href={`${link.href}?lang=${langKey}`}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/10"
                    : "text-text-muted hover:bg-neutral-bg-alt hover:text-text-dark"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    active
                      ? "text-white"
                      : "text-text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Theme and Language controls */}
        <div className="border-t border-border-custom px-5 py-4 flex flex-col gap-4 bg-neutral-bg-alt/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">{t.theme}</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted">{t.language}</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold select-none">
              {LANGS.map((lang, i) => {
                const switcherParams = new URLSearchParams(searchParams.toString());
                switcherParams.set("lang", lang.toLowerCase());
                const langClass = pathname.startsWith("/clubs/")
                  ? `${
                      currentLang === lang
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                    }`
                  : `${
                      currentLang === lang
                        ? "text-emerald-500 font-bold"
                        : "text-text-muted hover:text-emerald-500"
                    }`;

                return (
                  <React.Fragment key={lang}>
                    {i > 0 && <span className="opacity-30 text-text-muted">|</span>}
                    <Link
                      href={`${pathname}?${switcherParams.toString()}`}
                      className={`transition-colors duration-200 px-1 py-0.5 ${langClass}`}
                    >
                      {lang}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer footer — profile */}
        <div className="border-t border-border-custom p-4">
          {isLoggedIn && session ? (
            <>
              <div className="mb-3 flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border-custom bg-neutral-bg-alt">
                  <User className="h-4 w-4 text-text-muted" />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-xs font-bold text-text-dark">
                    {session.firstName} {session.lastName}
                  </span>
                  <span className="block truncate text-[10px] text-text-muted">
                    {session.email}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {!isAdmin && (
                  <Link
                    href={`/settings?lang=${langKey}`}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-dark transition-colors hover:bg-neutral-bg-alt"
                  >
                    <Settings className="h-4 w-4 flex-shrink-0" />
                    {t.accountSettings}
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href={adminClubSlug ? `/admin/${adminClubSlug}?lang=${langKey}` : `/dashboard/admin?lang=${langKey}`}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-dark transition-colors hover:bg-neutral-bg-alt"
                  >
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    {t.adminDashboard}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  {isPending ? t.signingOut : t.signOut}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={`/login?lang=${langKey}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-custom px-4 py-2.5 text-sm font-bold text-text-dark transition-colors hover:bg-neutral-bg-alt"
              >
                {t.login}
              </Link>
              <Link
                href={`/register?lang=${langKey}`}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${
                  pathname.startsWith("/clubs/")
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {t.signUp}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PAGE CONTENT — full width, no side offsets               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="w-full">
        {pathname.includes("/login") || pathname.includes("/register") || pathname.includes("/admin-gen") || pathname.startsWith("/clubs/") || pathname === "/" || pathname === "/ar" || pathname === "/fr" ? (
          children
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
