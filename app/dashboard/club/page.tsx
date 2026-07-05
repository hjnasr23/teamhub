"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Activity,
  Send,
  Lock,
  Globe,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

// MOCK DATA for posts
const RECENT_POSTS = [
  { id: 1, title: "Matchday updates against FAR Rabat", date: "Jul 10, 2026", visibility: "Public", interactions: "1.2K" },
  { id: 2, title: "Exclusive Tactical Breakdown: 3-5-2 Formation", date: "Jul 8, 2026", visibility: "Premium", interactions: "450" },
  { id: 3, title: "New Training Kits Revealed", date: "Jul 5, 2026", visibility: "Public", interactions: "3.4K" },
];

export default function ClubAdminDashboard() {
  const [visibility, setVisibility] = useState<"Public" | "Premium">("Public");

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-dark dark:text-white">
          Club Overview
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your club&apos;s analytics, content, and supporters.
        </p>
      </div>

      {/* 1. Analytics Overview Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Revenue */}
        <div className="flex flex-col rounded-xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-sm font-medium">Total Revenue</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-dark dark:text-white">45,200 MAD</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            +12% this month
          </div>
        </div>

        {/* Active Members */}
        <div className="flex flex-col rounded-xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-sm font-medium">Active Members</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-dark dark:text-white">904</span>
            <span className="text-sm text-text-muted">Supporters</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="flex flex-col rounded-xl border border-border-custom bg-neutral-bg p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-sm font-medium">Conversion Rate</span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-dark dark:text-white">4.8%</span>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Publisher Engine */}
      <div className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-lg font-bold text-text-dark dark:text-white">Create New Post</h2>
        <p className="mt-1 text-sm text-text-muted">Draft announcements or premium updates to your supporters.</p>
        
        <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium text-text-dark dark:text-slate-300">
              Post Title
            </label>
            <input 
              id="title"
              type="text" 
              placeholder="Matchday updates..." 
              className="w-full rounded-lg border border-border-custom bg-neutral-bg-alt px-4 py-2.5 text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="content" className="text-sm font-medium text-text-dark dark:text-slate-300">
              Content
            </label>
            <textarea 
              id="content"
              rows={4}
              placeholder="Write your update here..." 
              className="w-full resize-none rounded-lg border border-border-custom bg-neutral-bg-alt px-4 py-3 text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-dark dark:text-slate-300">Visibility</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label 
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  visibility === "Public" 
                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:bg-emerald-950/20" 
                    : "border-border-custom bg-neutral-bg-alt hover:bg-neutral-bg-hover dark:bg-slate-950"
                }`}
                onClick={() => setVisibility("Public")}
              >
                <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${visibility === "Public" ? "border-emerald-500" : "border-text-muted"}`}>
                  {visibility === "Public" && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-text-dark dark:text-white">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    Public
                  </div>
                  <div className="mt-1 text-xs text-text-muted">Free for everyone</div>
                </div>
              </label>
              
              <label 
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                  visibility === "Premium" 
                    ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500 dark:bg-amber-950/20" 
                    : "border-border-custom bg-neutral-bg-alt hover:bg-neutral-bg-hover dark:bg-slate-950"
                }`}
                onClick={() => setVisibility("Premium")}
              >
                <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${visibility === "Premium" ? "border-amber-500" : "border-text-muted"}`}>
                  {visibility === "Premium" && <div className="h-2 w-2 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-text-dark dark:text-white">
                    <Lock className="h-4 w-4 text-amber-500" />
                    Premium Only
                  </div>
                  <div className="mt-1 text-xs text-text-muted">Locked behind the 50 MAD/month tier</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="gap-2 bg-emerald-500 text-white shadow-sm transition-colors hover:bg-emerald-600">
              <Send className="h-4 w-4" />
              Publish Post
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Posts Monitoring Log Table */}
      <div className="overflow-hidden rounded-2xl border border-border-custom bg-neutral-bg shadow-sm dark:bg-slate-900">
        <div className="border-b border-border-custom px-6 py-5">
          <h2 className="text-base font-bold text-text-dark dark:text-white">Recent Posts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-muted">
            <thead className="bg-neutral-bg-alt text-xs uppercase text-text-muted dark:bg-slate-950/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Post Title</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Visibility</th>
                <th className="px-6 py-4 text-right font-semibold">Interactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              {RECENT_POSTS.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-neutral-bg-alt/50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-text-dark dark:text-slate-200">
                    {post.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.date}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        post.visibility === "Public"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                      }`}
                    >
                      {post.visibility === "Public" ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      {post.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-text-dark dark:text-slate-300">
                    {post.interactions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
