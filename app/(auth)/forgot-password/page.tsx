"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Reset password
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          We will send you a recovery link to your inbox
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="coach@club.com"
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
            required
          />
        </div>

        <Button type="button" className="w-full font-semibold">
          Send Recovery Link
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-8">
        Remember your password?{" "}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
