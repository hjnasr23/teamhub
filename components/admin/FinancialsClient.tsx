"use client";

import React, { useState } from "react";
import { CircleDollarSign, ArrowUpRight, ArrowDownRight, Wallet, CheckCircle, Clock } from "lucide-react";
import { releasePayoutAction } from "@/lib/super-admin-actions";
import { useRouter } from "next/navigation";

export default function FinancialsClient({ 
  grossRevenue, 
  platformCommissionRate, 
  initialPayoutRequests 
}: { 
  grossRevenue: number; 
  platformCommissionRate: number; 
  initialPayoutRequests: any[] 
}) {
  const router = useRouter();
  const [payoutRequests, setPayoutRequests] = useState(initialPayoutRequests);

  React.useEffect(() => {
    setPayoutRequests(initialPayoutRequests);
  }, [initialPayoutRequests]);

  const netCommission = grossRevenue * platformCommissionRate;
  const clubPayouts = grossRevenue - netCommission;

  const handleReleasePayout = async (id: string) => {
    const res = await releasePayoutAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert("Failed to release payout");
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Financial Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            Track platform revenue, club payouts, and commission tracking.
          </p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition-colors w-fit cursor-pointer">
          Download Full Report
        </button>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">Gross Platform Revenue</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <CircleDollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{grossRevenue.toLocaleString()} MAD</p>
          <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
            <span>Active Subscriptions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">Club Payouts Distributed</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{clubPayouts.toLocaleString()} MAD</p>
          <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-orange-600 dark:text-orange-400 font-semibold">
            <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4" />
            <span>To be claimed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">Net Platform Commission</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <CircleDollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-450" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{netCommission.toLocaleString()} MAD</p>
          <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-emerald-600 dark:text-emerald-450 font-semibold">
            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
            <span>{platformCommissionRate * 100}% flat cut</span>
          </div>
        </div>
      </div>

      {/* Payout Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full relative transition-colors">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">Recent Payout Requests</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 md:px-6 py-3 font-semibold">Club Name</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Requested Amount</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Date</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Status</th>
                <th className="px-4 md:px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {payoutRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No recent payout requests.
                  </td>
                </tr>
              )}
              {payoutRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {req.club}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-900 dark:text-white font-bold">
                    {req.amount.toLocaleString()} MAD
                  </td>
                  <td className="px-4 md:px-6 py-4 text-slate-500 dark:text-slate-450">
                    {req.date}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      req.status === "APPROVED" 
                        ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" :
                      req.status === "PROCESSING" 
                        ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50" :
                        "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
                    }`}>
                      {req.status === "APPROVED" && <CheckCircle className="h-3.5 w-3.5" />}
                      {req.status === "PROCESSING" && <Clock className="h-3.5 w-3.5 animate-pulse" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    {req.status === "PENDING" ? (
                      <button 
                        onClick={() => handleReleasePayout(req.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Release Payout
                      </button>
                    ) : (
                      <span className="text-slate-450 dark:text-slate-500 text-xs italic">No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
