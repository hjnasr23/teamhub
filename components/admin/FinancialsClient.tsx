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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Track platform revenue, club payouts, and commission tracking.
          </p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors w-fit">
          Download Full Report
        </button>
      </div>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Gross Platform Revenue</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CircleDollarSign className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{grossRevenue.toLocaleString()} MAD</p>
          <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
            <span>Active Subscriptions</span>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Club Payouts Distributed</h3>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Wallet className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{clubPayouts.toLocaleString()} MAD</p>
          <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-orange-600 font-medium">
            <ArrowDownRight className="h-3 w-3 md:h-4 md:w-4" />
            <span>To be claimed</span>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50" />
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Net Platform Commission</h3>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CircleDollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{netCommission.toLocaleString()} MAD</p>
          <div className="mt-2 flex items-center gap-1 text-xs md:text-sm text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
            <span>{platformCommissionRate * 100}% flat cut</span>
          </div>
        </div>
      </div>

      {/* Payout Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full relative">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Payout Requests</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium">Club Name</th>
                <th className="px-4 md:px-6 py-3 font-medium">Requested Amount</th>
                <th className="px-4 md:px-6 py-3 font-medium">Date</th>
                <th className="px-4 md:px-6 py-3 font-medium">Status</th>
                <th className="px-4 md:px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payoutRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8 text-center text-gray-500">
                    No recent payout requests.
                  </td>
                </tr>
              )}
              {payoutRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-medium text-gray-900">
                    {req.club}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-900 font-semibold">
                    {req.amount.toLocaleString()} MAD
                  </td>
                  <td className="px-4 md:px-6 py-4 text-gray-500">
                    {req.date}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      req.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" :
                      req.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
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
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                      >
                        Release Payout
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No action needed</span>
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
