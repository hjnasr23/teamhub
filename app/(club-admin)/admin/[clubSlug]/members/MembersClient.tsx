"use client";

import React, { useState, useTransition } from "react";
import { Search, MoreVertical, Ban, XSquare, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { cancelSubscriptionAction, suspendFanAction } from "@/lib/club-admin-actions";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "CANCELLED" | "SUSPENDED";
  amount: number;
  date: string;
}

interface MembersClientProps {
  initialSubscribers: Subscriber[];
  clubSlug: string;
  activeCount: number;
  freeCount: number;
  canceledCount: number;
}

export default function MembersClient({
  initialSubscribers,
  clubSlug,
  activeCount,
  freeCount,
  canceledCount
}: MembersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCancelSub = (subId: string) => {
    setActiveDropdown(null);
    if (!confirm("Are you sure you want to cancel this fan's subscription?")) return;

    startTransition(async () => {
      const res = await cancelSubscriptionAction(subId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to cancel subscription");
      }
    });
  };

  const handleSuspendFan = (subId: string) => {
    setActiveDropdown(null);
    if (!confirm("Are you sure you want to suspend/ban this fan from premium spaces?")) return;

    startTransition(async () => {
      const res = await suspendFanAction(subId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to suspend fan");
      }
    });
  };

  const handleViewHistory = (subName: string) => {
    setActiveDropdown(null);
    console.log(`Viewing history for member: ${subName}`);
    alert(`Member History for ${subName} has been logged to console.`);
  };

  // Filter subscribers based on search query
  const filteredSubscribers = initialSubscribers.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount.toLocaleString()}</div>
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
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{canceledCount.toLocaleString()}</div>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fans..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[280px]">
          {filteredSubscribers.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Fan Name</th>
                  <th className="pb-3 font-semibold">Status/Type</th>
                  <th className="pb-3 font-semibold">Amount Paid</th>
                  <th className="pb-3 font-semibold">Joined Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredSubscribers.map((fan) => {
                  const initials = fan.name.substring(0, 2).toUpperCase() || "FN";
                  const isPaid = fan.amount > 0 && fan.status === "ACTIVE";
                  const isCancelled = fan.status === "CANCELLED";
                  const isSuspended = fan.status === "SUSPENDED";

                  return (
                    <tr key={fan.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-white truncate">{fan.name}</span>
                          <span className="text-[10px] text-slate-500 truncate">{fan.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        {isSuspended ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50">
                            Suspended
                          </span>
                        ) : isCancelled ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50">
                            Cancelled
                          </span>
                        ) : isPaid ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50">
                            Paid Subscriber
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 border-slate-200 dark:border-slate-700/50">
                            Free Follower
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-semibold">
                        {isPaid ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">${fan.amount} MAD/mo</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">{fan.date}</td>
                      <td className="py-3.5 text-right relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === fan.id ? null : fan.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {activeDropdown === fan.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-20 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                              <button
                                onClick={() => handleViewHistory(fan.name)}
                                className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer text-xs"
                              >
                                <Eye className="h-3.5 w-3.5 text-blue-500" />
                                View Member History
                              </button>
                              <button
                                onClick={() => handleCancelSub(fan.id)}
                                disabled={!isPaid}
                                className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                              >
                                <XSquare className="h-3.5 w-3.5 text-amber-500" />
                                Cancel Subscription
                              </button>
                              <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                              <button
                                onClick={() => handleSuspendFan(fan.id)}
                                disabled={isSuspended}
                                className="w-full px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-semibold text-xs"
                              >
                                <Ban className="h-3.5 w-3.5 text-red-500" />
                                Suspend/Ban Fan
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No fans matched your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
