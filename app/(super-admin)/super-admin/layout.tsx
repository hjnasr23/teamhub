import React from "react";
import Link from "next/link";
import { Trophy, LayoutDashboard, ShieldAlert, Settings, LogOut, Search, User } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Super Admin Left Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-white block">
                TEAM<span className="text-emerald-500">HUB</span>
              </span>
              <span className="text-[10px] text-rose-500 font-semibold tracking-wider uppercase">
                Super Admin
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            <Link
              href="/super-admin"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-100 bg-slate-900/60 border border-slate-800 transition-all"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-indigo-400" />
              Overview
            </Link>
            <Link
              href="/super-admin/clubs"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              Manage Clubs
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
            >
              <Settings className="h-4.5 w-4.5" />
              SaaS Settings
            </Link>
          </nav>
        </div>

        {/* User profile / Log out */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <User className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Root Admin</span>
              <span className="text-[10px] text-slate-500 block">root@teamhub.com</span>
            </div>
          </div>
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/10 transition-all cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Upper Header bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/20 px-8 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search clubs, admins, SaaS users..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-full">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            SaaS Platform Running Stable
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
