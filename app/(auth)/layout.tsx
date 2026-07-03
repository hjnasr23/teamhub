import React from "react";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg bg-grid-pattern flex flex-col md:grid md:grid-cols-2">
      {/* Left side banner for branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 to-brand-card border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              TEAM<span className="text-emerald-500">HUB</span>
            </span>
          </Link>
        </div>

        {/* Motivational sports quote / copy */}
        <div className="relative z-10 my-auto max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white mb-6">
            Fuel the game, <br />
            <span className="text-gradient-emerald">monetize the passion.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Join the platform built for modern sports teams. Launch subscription plans, deliver exclusive content, and interact with fans like never before.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500">
          © 2026 TEAMHUB. Professional Sports Club Network.
        </div>
      </div>

      {/* Right side form container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 bg-brand-bg relative">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center">
            <Trophy className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            TEAM<span className="text-emerald-500">HUB</span>
          </span>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
