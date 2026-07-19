"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { logoutAction } from "@/lib/actions";

export default function SignOutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    await logoutAction();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
