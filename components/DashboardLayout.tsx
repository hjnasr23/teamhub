"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { logoutAction } from "@/lib/actions";
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
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
 *  Navigation link data
 * ──────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "/clubs", label: "Clubs", icon: Home },
];

/* ────────────────────────────────────────────────────────────────────
 *  DashboardLayout — Vercel / Stripe–style top navigation bar
 * ──────────────────────────────────────────────────────────────────── */

export default function DashboardLayout({
  children,
  isAdmin = false,
  isLoggedIn = false,
  adminClubSlug = null,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  adminClubSlug?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
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
      menu: "Menu"
    },
    fr: {
      discover: "Clubs",
      login: "Connexion",
      signUp: "S'inscrire",
      signOut: "Se déconnecter",
      signingOut: "Déconnexion...",
      adminDashboard: "Tableau de Bord Admin",
      menu: "Menu"
    },
    ar: {
      discover: "الأندية",
      login: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      signingOut: "جاري تسجيل الخروج...",
      adminDashboard: "لوحة التحكم للمشرف",
      menu: "القائمة"
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
      await logoutAction();
      router.refresh();
      router.push("/");
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
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-neutral-bg-alt text-text-dark transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  TOP NAVIGATION BAR                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "w-[85%] max-w-5xl px-4 py-2 bg-neutral-bg/80 backdrop-blur-md border border-border-custom rounded-2xl shadow-lg"
            : "w-[95%] max-w-7xl px-6 py-4 bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full items-center justify-between">
          {/* ── Left: Logo ───────────────────────────────────────── */}
          <div className="flex items-center gap-8">
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
                return (
                  <Link
                    key={link.href}
                    href={`${link.href}?lang=${langKey}`}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "text-text-dark"
                        : "text-text-muted hover:text-text-dark"
                    }`}
                  >
                    {label}
                    {/* Active indicator — thin bottom bar */}
                    {active && (
                      <span className="absolute inset-x-1 -bottom-[17px] h-[2px] rounded-full bg-emerald-600 dark:bg-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ── Right: Actions ───────────────────────────────────── */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {isAdmin && adminClubSlug && (
              <Link
                href={`/admin/${adminClubSlug}?lang=${langKey}`}
                className="hidden items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50 md:flex"
              >
                <Trophy className="h-4 w-4" />
                {t.adminDashboard}
              </Link>
            )}

            <div className="hidden md:flex items-center gap-1 text-xs font-semibold select-none">
              {LANGS.map((lang, i) => {
                const switcherParams = new URLSearchParams(searchParams.toString());
                switcherParams.set("lang", lang.toLowerCase());
                return (
                  <React.Fragment key={lang}>
                    {i > 0 && <span className="opacity-30 text-text-muted">|</span>}
                    <Link
                      href={`${pathname}?${switcherParams.toString()}`}
                      className={`transition-colors duration-200 ${
                        currentLang === lang
                          ? "text-emerald-500 font-bold"
                          : "text-text-muted hover:text-emerald-500"
                      }`}
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
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="hidden rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 shadow-sm transition-colors hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50 md:block"
              >
                {isPending ? t.signingOut : t.signOut}
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={`/login?lang=${langKey}`}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-text-muted hover:text-text-dark transition-colors"
                >
                  {t.login}
                </Link>
                <Link
                  href={`/register?lang=${langKey}`}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-600"
                >
                  {t.signUp}
                </Link>
              </div>
            )}

            {/* Mobile burger — only visible < md */}
            <button
              onClick={() => setMobileOpen(true)}
              className="ml-1 rounded-lg p-2 text-text-muted transition-colors hover:bg-neutral-bg-alt hover:text-text-dark md:hidden"
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

        {/* Drawer footer — profile */}
        <div className="border-t border-border-custom p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border-custom bg-neutral-bg-alt">
              <User className="h-4 w-4 text-text-muted" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-bold text-text-dark">
                Alex Morgan
              </span>
              <span className="block truncate text-[10px] text-text-muted">
                alex@teamhub.com
              </span>
            </div>
          </div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {isPending ? t.signingOut : t.signOut}
            </button>
          ) : (
            <Link
              href={`/login?lang=${langKey}`}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
            >
              <User className="h-4 w-4 flex-shrink-0" />
              {t.login}
            </Link>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PAGE CONTENT — full width, no side offsets               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="w-full">
        {pathname.includes("/login") || pathname.includes("/register") || pathname.includes("/admin-gen") || pathname === "/" || pathname === "/ar" || pathname === "/fr" ? (
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
