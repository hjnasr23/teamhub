"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
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
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
 *  Navigation link data
 * ──────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: "/clubs", label: "Discover", icon: Home },
  { href: "/real-madrid/subscribe", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/real-madrid", label: "Dashboard", icon: Trophy },
  { href: "/admin/real-madrid/settings", label: "Settings", icon: Settings },
];

/* ────────────────────────────────────────────────────────────────────
 *  DashboardLayout — Vercel / Stripe–style top navigation bar
 * ──────────────────────────────────────────────────────────────────── */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-neutral-bg-alt text-text-dark transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  TOP NAVIGATION BAR                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-border-custom bg-neutral-bg/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Left: Logo ───────────────────────────────────────── */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
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
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      active
                        ? "text-text-dark"
                        : "text-text-muted hover:text-text-dark"
                    }`}
                  >
                    {link.label}
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
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Notification bell */}
            <button
              className="relative rounded-xl p-2 text-text-muted transition-colors hover:bg-neutral-bg-alt hover:text-text-dark active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-neutral-bg" />
            </button>

            {/* Separator */}
            <div className="hidden h-7 w-px bg-border-custom sm:block" />

            {/* User avatar */}
            <Link
              href="/admin/real-madrid/settings"
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border-custom bg-neutral-bg-alt transition-all group-hover:border-emerald-500">
                <User className="h-4 w-4 text-text-muted transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
              </div>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-semibold leading-none text-text-dark transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Alex Morgan
                </span>
                <span className="mt-0.5 block text-[10px] leading-none text-text-muted">
                  Fan Member
                </span>
              </div>
            </Link>

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
          <span className="text-sm font-semibold text-text-dark">Menu</span>
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
            return (
              <Link
                key={link.href}
                href={link.href}
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
                {link.label}
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
          <Link
            href="/login"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign Out
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/*  PAGE CONTENT — full width, no side offsets               */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
