import React from "react";
import Link from "next/link";
import { Trophy, LayoutDashboard, Users, Settings, ExternalLink, LogOut, HeartHandshake, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}

export default async function ClubAdminLayout({ children, params }: LayoutProps) {
  const { clubSlug } = await params;
  
  // Format the slug for display
  const clubDisplayName = clubSlug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Club Admin Left Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo / Club identity */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xs tracking-tight text-white block">
                {clubDisplayName}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold tracking-wider uppercase">
                Club Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href={`/admin/${clubSlug}`}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-100 bg-slate-900/60 border border-slate-800 transition-all"
            >
              <LayoutDashboard className="h-4.5 w-4.5 text-emerald-400" />
              Dashboard
            </Link>
            <Link
              href={`/admin/${clubSlug}/members`}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
            >
              <Users className="h-4.5 w-4.5" />
              Subscribers
            </Link>
            <Link
              href={`/admin/${clubSlug}/settings`}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
            >
              <Settings className="h-4.5 w-4.5" />
              Settings
            </Link>
            
            <div className="pt-4 mt-4 border-t border-slate-850">
              <Link
                href={`/${clubSlug}`}
                target="_blank"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/20 transition-all border border-transparent hover:border-indigo-500/10"
              >
                <ExternalLink className="h-4.5 w-4.5" />
                View Fan Portal
              </Link>
            </div>
          </nav>
        </div>

        {/* User profile / Log out */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <User className="h-4.5 w-4.5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Manager Perez</span>
              <span className="text-[10px] text-slate-500 block">owner@{clubSlug}.com</span>
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

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Upper Header bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>SaaS Connection:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Connected to Stripe Payouts
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <HeartHandshake className="h-4 w-4 text-emerald-500" />
            Active Plan: <span className="text-emerald-400 font-bold">Pro Platform</span>
          </div>
        </header>

        {/* Dynamic children component view */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
