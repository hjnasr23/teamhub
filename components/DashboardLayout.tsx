"use client";

import React, { useState } from "react";
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
  Search, 
  Menu, 
  X, 
  User, 
  LogOut,
  ChevronRight
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarLink({ href, icon: Icon, label, isActive, onClick }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-250 group ${
        isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${
        isActive ? "text-white" : "text-slate-450 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400"
      }`} />
      <span>{label}</span>
      {isActive && (
        <ChevronRight className="h-4 w-4 ml-auto text-white/80 animate-fade-in" />
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home / Discover", icon: Home },
    { href: "/real-madrid/subscribe", label: "My Subscriptions", icon: CreditCard },
    { href: "/admin/real-madrid", label: "Club Dashboard", icon: Trophy },
    { href: "/admin/real-madrid/settings", label: "Profile Settings", icon: Settings },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed top-0 bottom-0 left-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-30 transition-colors duration-300">
        {/* Brand Header with Image Logo */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-start">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="TEAMHUB Logo" 
              width={140} 
              height={40} 
              className="object-contain max-h-[40px] w-auto" 
              unoptimized
              priority 
            />
          </Link>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isActive={isLinkActive(link.href)}
            />
          ))}
        </nav>

        {/* Desktop Profile / Footer Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-350 dark:border-slate-700">
              <User className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">Alex Morgan</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">alex@teamhub.com</span>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 md:hidden flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div>
          {/* Logo + Close button */}
          <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="TEAMHUB Logo" 
                width={120} 
                height={34} 
                className="object-contain max-h-[34px] w-auto" 
                unoptimized
                priority 
              />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="px-4 py-6 space-y-1.5">
            {navLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={isLinkActive(link.href)}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* Mobile profile panel */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 px-2 py-1.5 mb-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-350 dark:border-slate-700">
              <User className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Alex Morgan</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">alex@teamhub.com</span>
            </div>
          </div>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* 2. Main Page Content Layout */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
        {/* Top Header bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
          {/* Left part: burger button on mobile, search bar on desktop */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Premium Search Bar */}
            <div className="relative hidden md:block max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clubs, news, scores..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all duration-250"
              />
            </div>

            {/* Mobile Header Brand Logo (when drawer is closed) */}
            <div className="md:hidden flex items-center justify-start">
              <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                <Image 
                  src="/logo.png" 
                  alt="TEAMHUB Logo" 
                  width={110} 
                  height={32} 
                  className="object-contain max-h-[32px] w-auto" 
                  unoptimized
                  priority 
                />
              </Link>
            </div>
          </div>

          {/* Right part: notifications and quick actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer active:scale-95">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            </button>

            <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />

            {/* User Profile dropdown panel anchor */}
            <Link href="/admin/real-madrid/settings" className="flex items-center gap-2 group cursor-pointer">
              <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:border-blue-600 transition-all overflow-hidden">
                <User className="h-4.5 w-4.5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block group-hover:text-blue-600 transition-colors leading-none">
                  Alex Morgan
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-455 block mt-0.5 leading-none">
                  Fan Member
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Children View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>

        {/* 3. Sleek Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 z-30 flex items-center justify-around px-4 md:hidden">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                  isActive ? "text-blue-600" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[8px] font-semibold mt-1 tracking-tight truncate max-w-full">
                  {link.label.split(" / ")[0].split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
