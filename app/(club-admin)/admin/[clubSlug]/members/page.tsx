import React from "react";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ClubMembersPage({ params }: PageProps) {
  const { clubSlug } = await params;

  // 1. Authenticate & Authorize
  const session = await getSession();
  if (!session || session.role !== "CLUB_ADMIN") {
    redirect("/login");
  }

  const club = await prisma.club.findUnique({
    where: { slug: clubSlug }
  });

  if (!club || session.clubId !== club.id) {
    redirect("/login");
  }

  // 2. Fetch Live Subscribers & Stats Scoped Strictly to this Club ID
  const [activeCount, freeCount, canceledCount, subscriptions] = await Promise.all([
    prisma.subscription.count({ where: { clubId: club.id, status: "ACTIVE" } }),
    prisma.subscription.count({ where: { clubId: club.id, status: "ACTIVE", amount: 0 } }),
    prisma.subscription.count({ where: { clubId: club.id, status: "CANCELLED" } }),
    prisma.subscription.findMany({
      where: { clubId: club.id },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const subscribers = subscriptions.map((sub) => ({
    name: sub.user.firstName && sub.user.lastName ? `${sub.user.firstName} ${sub.user.lastName}` : "Anonymous Fan",
    email: sub.user.email,
    tier: sub.amount > 0 ? "Premium Fan" : "Standard Fan",
    mrr: `${sub.amount} MAD`,
    status: sub.status === "ACTIVE" ? "Active" : "Canceled",
    date: new Date(sub.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Manage Fan Subscribers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            View active subscription tiers, member billing states, and lifetime contributions.
          </p>
        </div>
      </div>

      {/* Metric counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Active Members
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-450">{activeCount.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Standard (Free) Members
          </span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{freeCount.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Canceled (All-time)
          </span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-455">{canceledCount.toLocaleString()}</div>
        </div>
      </div>

      {/* Table container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Member Directories</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search clubs..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-650 focus:outline-none"
              disabled
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {subscribers.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Fan Name</th>
                  <th className="pb-3 font-semibold">Subscription Tier</th>
                  <th className="pb-3 font-semibold">MRR Contribution</th>
                  <th className="pb-3 font-semibold">Joined Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {subscribers.map((fan, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 font-semibold text-slate-900 dark:text-white flex flex-col">
                      <span>{fan.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal mt-0.5">{fan.email}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        fan.tier === "Premium Fan"
                          ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
                          : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                      }`}>
                        {fan.tier}
                      </span>
                    </td>
                    <td className="py-3.5 text-emerald-600 dark:text-emerald-450 font-semibold">{fan.mrr}</td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">{fan.date}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        fan.status === "Active"
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                          : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-200 dark:border-rose-900/50"
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${fan.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {fan.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-default">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-sm text-slate-550 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No subscription members registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
