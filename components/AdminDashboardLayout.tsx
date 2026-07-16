"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Users,
  Building2,
  CircleDollarSign,
  Settings,
  LogOut,
  Search,
  Bell,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

export default function AdminDashboardLayout({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        {/* Brand/Logo */}
        <div className="h-16 flex shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              TEAM<span className="text-blue-600 dark:text-blue-400">HUB</span>
            </span>
          </div>
          <button
            className="md:hidden p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            onClick={closeMenu}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link
            href="/admin-gen"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/admin-gen"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            Dashboard
          </Link>
          <Link
            href="/admin-gen/clubs"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/clubs")
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            Clubs Management
          </Link>
          <Link
            href="/admin-gen/subscribers"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/subscribers")
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <Users className="h-5 w-5 shrink-0" />
            Subscribers
          </Link>
          <Link
            href="/admin-gen/financials"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/financials")
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <CircleDollarSign className="h-5 w-5 shrink-0" />
            Financials
          </Link>
          <Link
            href="/admin-gen/settings"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/settings")
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            Settings
          </Link>
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
