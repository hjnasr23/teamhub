import React from "react";
import Link from "next/link";
import { Trophy, Compass, Tv, MessageSquare, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}

export default async function FanClubLayout({ children, params }: LayoutProps) {
  const { clubSlug } = await params;

  // Format the slug for display
  const clubDisplayName = clubSlug
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between">
      {/* Top sticky fan header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo / Club identity link */}
          <div className="flex items-center gap-3">
            <Link href={`/${clubSlug}`} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Trophy className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-white">
                {clubDisplayName} <span className="text-emerald-500">Clubhouse</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links for Fan section */}
          <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <Link href={`/${clubSlug}`} className="flex items-center gap-1.5 hover:text-slate-100 transition-colors">
              <Compass className="h-4 w-4 text-emerald-400" />
              Home Feed
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-slate-100 transition-colors">
              <Tv className="h-4 w-4" />
              Premium Media
            </Link>
            <Link href="#" className="flex items-center gap-1.5 hover:text-slate-100 transition-colors">
              <MessageSquare className="h-4 w-4" />
              Fanboard
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-4">
            <Link href={`/${clubSlug}/subscribe`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 font-semibold gap-1.5 shadow-md shadow-emerald-950/20 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                Become Member
              </Button>
            </Link>
            
            <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center cursor-pointer hover:border-slate-700 transition-colors">
              <User className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main children area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">{children}</main>

      {/* Fan Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>Powered by TEAMHUB Sports Network</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-400 transition-colors">Home Page</Link>
            <Link href={`/admin/${clubSlug}`} className="hover:text-slate-400 transition-colors">Club Administration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
