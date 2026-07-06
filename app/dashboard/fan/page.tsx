"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  CreditCard,
  Calendar,
  Heart,
  MessageCircle,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFanData, updateProfileAction } from "@/lib/actions";

/* ════════════════════════════════════════════════════════════════════
 *  Type definitions matching live Prisma query response shapes
 * ════════════════════════════════════════════════════════════════════ */

interface SubscriptionCard {
  id: string;
  status: string;
  clubName: string;
  clubColor: string;
  createdAt: Date;
}

interface ActivityItem {
  id: number;
  action: string;
  time: string;
  iconType: "heart" | "message" | "shield";
  iconColor: string;
  bg: string;
}

/* ════════════════════════════════════════════════════════════════════
 *  Fan Dashboard Page Component
 * ════════════════════════════════════════════════════════════════════ */

export default function FanDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Live database state
  const [subscriptions, setSubscriptions] = useState<SubscriptionCard[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  /* ── Fetch live fan data on mount ─────────────────────────────── */
  useEffect(() => {
    async function loadData() {
      const response = await getFanData();
      if (response.success && response.data) {
        const { user, subscriptions, activities } = response.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setSubscriptions(subscriptions);
        setActivities(activities);
      } else {
        router.push("/login");
      }
      setLoading(false);
    }
    loadData();
  }, [router]);

  /* ── Profile update handler ───────────────────────────────────── */
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);

    startTransition(async () => {
      const response = await updateProfileAction(formData);
      if (response.success) {
        setMessage({
          type: "success",
          text: "Profile updated successfully in the database!",
        });
        setPassword("");
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: response.error || "Failed to update profile.",
        });
      }
    });
  };

  /* ── Loading State ────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-text-muted">
          Loading your profile from the database...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-dark dark:text-white">
          Supporter Profile
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your personal details, active memberships, and interactions.
        </p>
      </div>

      {/* Feedback Banner */}
      {message && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-950/30 dark:bg-emerald-950/10 dark:text-emerald-400"
              : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  LEFT COLUMN                                               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Component A: Account Details Card ──────────────────── */}
          <section className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-dark dark:text-white">
                Personal Information
              </h2>
              <p className="text-sm text-text-muted">
                Update your profile identity and security settings.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-text-muted" />
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-4 w-4 text-text-muted" />
                    </div>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-text-muted" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-dark dark:text-slate-200">
                  New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-text-muted" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full rounded-xl border border-border-custom bg-neutral-bg-alt py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder-text-muted transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-colors"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </section>

          {/* ── Component C: Historical Activities Log ─────────────── */}
          <section className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-text-dark dark:text-white">
                Recent Activity Log
              </h2>
              <p className="text-sm text-text-muted">
                A history of your interactions with your clubs.
              </p>
            </div>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-text-muted">
                  No interactions logged yet.
                </p>
              ) : (
                activities.map((activity) => {
                  const Icon =
                    activity.iconType === "heart"
                      ? Heart
                      : activity.iconType === "message"
                        ? MessageCircle
                        : ShieldCheck;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 rounded-xl border border-border-custom bg-neutral-bg-alt p-4 transition-colors hover:border-text-muted/30 dark:bg-slate-950"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.bg}`}
                      >
                        <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-dark dark:text-slate-200">
                          {activity.action}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/*  RIGHT COLUMN                                              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* ── Component B: Active Subscriptions Monitor ──────────── */}
          <section className="rounded-2xl border border-border-custom bg-neutral-bg p-6 shadow-sm dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-dark dark:text-white">
                  My Memberships
                </h2>
                <p className="mt-1 text-xs text-text-muted">
                  Your active club subscriptions.
                </p>
              </div>
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="space-y-4">
              {subscriptions.length === 0 ? (
                <p className="text-sm text-text-muted">
                  No active memberships found.
                </p>
              ) : (
                subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="group relative overflow-hidden rounded-xl border border-border-custom bg-neutral-bg-alt p-5 transition-all hover:shadow-md dark:bg-slate-950"
                  >
                    <div
                      className="absolute inset-y-0 left-0 w-1.5"
                      style={{ backgroundColor: sub.clubColor }}
                    />

                    <div className="pl-3">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-display font-bold text-text-dark dark:text-white">
                          {sub.clubName}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                            sub.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-text-muted dark:text-slate-300">
                        Active Tier
                      </p>

                      <div className="mt-4 flex items-center gap-2 border-t border-border-custom pt-4 text-xs text-text-muted">
                        <Calendar className="h-3.5 w-3.5" />
                        Member since:{" "}
                        <span className="font-medium text-text-dark dark:text-slate-300">
                          {new Date(sub.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full gap-2 border-dashed"
            >
              <CreditCard className="h-4 w-4 text-text-muted" />
              Manage Billing
            </Button>
          </section>

          {/* Quick Find Card */}
          <section className="rounded-2xl border border-border-custom bg-emerald-50 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/10">
            <h3 className="font-display font-bold text-emerald-900 dark:text-emerald-400">
              Discover More Clubs
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-emerald-700 dark:text-emerald-500/80">
              Find exclusive digital locker rooms, insider content, and connect
              with supporters across the league.
            </p>
            <Button
              className="mt-4 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-sm"
              onClick={() => router.push("/clubs")}
            >
              Explore Directory
              <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
