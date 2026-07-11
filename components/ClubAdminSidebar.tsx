"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, LayoutDashboard, Users, Settings, ExternalLink } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import ThemeToggle from "@/components/ThemeToggle";

interface ClubAdminSidebarProps {
  clubSlug: string;
  clubName: string;
  clubPrimaryColor: string;
  clubLogoUrl: string | null;
}

export default function ClubAdminSidebar({
  clubSlug,
  clubName,
  clubPrimaryColor,
  clubLogoUrl,
}: ClubAdminSidebarProps) {
  const pathname = usePathname();

  const isDashboardActive = pathname === `/admin/${clubSlug}`;
  const isMembersActive = pathname.startsWith(`/admin/${clubSlug}/members`);
  const isSettingsActive = pathname.startsWith(`/admin/${clubSlug}/settings`);

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 shrink-0 transition-colors duration-300">
      <div className="space-y-8">
        {/* Logo / Platform Branding */}
        <div className="flex items-center gap-2.5">
          <div className="h-8.5 w-8.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-md">
            <span className="text-emerald-500 font-extrabold text-sm tracking-tighter">TH</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            TEAM<span className="text-emerald-500">HUB</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <Link
            href={`/admin/${clubSlug}`}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isDashboardActive
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            Dashboard
          </Link>
          <Link
            href={`/admin/${clubSlug}/members`}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isMembersActive
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <Users className="h-4.5 w-4.5 shrink-0" />
            Subscribers
          </Link>
          <Link
            href={`/admin/${clubSlug}/settings`}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isSettingsActive
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200"
            }`}
          >
            <Settings className="h-4.5 w-4.5 shrink-0" />
            Settings
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              href={`/clubs/${clubSlug}`}
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all"
            >
              <ExternalLink className="h-4.5 w-4.5 shrink-0" />
              View Fan Portal
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer controls & Context Footprint */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        {/* Club Context Footprint */}
        <div className="flex items-center gap-2.5 px-1">
          <div 
            className="h-6 w-6 rounded-md flex items-center justify-center overflow-hidden shrink-0 bg-slate-100"
            style={{ backgroundColor: clubPrimaryColor }}
          >
            {clubLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={clubLogoUrl} alt={clubName} className="h-full w-full object-cover" />
            ) : (
              <Trophy className="h-3.5 w-3.5 text-white" />
            )}
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
            {clubName}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <SignOutButton />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
