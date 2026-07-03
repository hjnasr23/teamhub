"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight">
          Create an account
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Start your multi-tenant sports subscription portal
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <button
            type="button"
            className="py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white shadow-sm transition-all cursor-pointer"
          >
            Club Admin
          </button>
          <button
            type="button"
            className="py-2.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          >
            Club Fan
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Coach Carter"
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
            required
          />
        </div>

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

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Club Name
          </label>
          <input
            type="text"
            placeholder="e.g. Real Madrid FC"
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-600"
            required
          />
        </div>

        <div className="flex items-start my-2">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 bg-slate-900 border border-slate-800 accent-emerald-500 text-emerald-600 rounded mt-0.5"
            required
          />
          <label htmlFor="terms" className="ml-2 text-xs text-slate-400 leading-normal">
            I agree to the{" "}
            <Link href="#" className="text-emerald-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-emerald-400 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button type="button" className="w-full font-semibold mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
