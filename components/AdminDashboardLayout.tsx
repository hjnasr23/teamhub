"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
    <div className="flex h-screen bg-slate-50 text-gray-900 font-sans overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        {/* Brand/Logo */}
        <div className="h-16 flex shrink-0 items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-blue-600">
            <ShieldCheck className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">TEAMHUB</span>
          </div>
          <button
            className="md:hidden p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
              pathname === "/admin-gen" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            Dashboard
          </Link>
          <Link
            href="/admin-gen/clubs"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/clubs") ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            Clubs Management
          </Link>
          <Link
            href="/admin-gen/subscribers"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/subscribers") ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Users className="h-5 w-5 shrink-0" />
            Subscribers
          </Link>
          <Link
            href="/admin-gen/financials"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/financials") ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <CircleDollarSign className="h-5 w-5 shrink-0" />
            Financials
          </Link>
          <Link
            href="/admin-gen/settings"
            onClick={closeMenu}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname.includes("/admin-gen/settings") ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            Settings
          </Link>
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center w-48 md:w-64 lg:w-96 relative">
              <Search className="h-5 w-5 absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search clubs, users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
            <button className="sm:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Bell className="h-5 w-5 md:h-6 md:w-6" />
              <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 h-2 w-2 md:h-2.5 md:w-2.5 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3 md:pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {session.firstName} {session.lastName}
                </p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
              <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">
                {session.firstName?.charAt(0) || "S"}
                {session.lastName?.charAt(0) || "A"}
              </div>
            </div>
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
