"use client";

import React, { useState, useTransition } from "react";
import { 
  Shield, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MoreVertical, 
  Trash2, 
  EyeOff, 
  Eye, 
  Power,
  AlertTriangle,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  deleteClubAction, 
  toggleClubStatus, 
  toggleClubVisibility,
  updatePlatformSettings 
} from "@/lib/super-admin-actions";

interface Club {
  id: string;
  name: string;
  fans: number;
  totalPaid: number;
  monthlyPlatformNet: number;
  status: "Public" | "Private";
  active: boolean;
}

interface DashboardClientProps {
  initialClubs: Club[];
  initialTotalClubs: number;
  initialTotalFans: number;
  initialTotalGMV: number;
  initialCommission: number;
}

export default function DashboardClient({
  initialClubs,
  initialTotalClubs,
  initialTotalFans,
  initialTotalGMV,
  initialCommission
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Club | null>(null);
  const [commission, setCommission] = useState(initialCommission);

  // Handlers
  const handleToggleStatus = (id: string, currentStatus: "Public" | "Private") => {
    setActiveDropdown(null);
    const dbVisibility = currentStatus === "Public" ? "PUBLIC" : "PRIVATE";
    
    startTransition(async () => {
      const res = await toggleClubVisibility(id, dbVisibility);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to toggle visibility status");
      }
    });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    setActiveDropdown(null);
    const dbStatus = currentActive ? "ACTIVE" : "SUSPENDED";
    
    startTransition(async () => {
      const res = await toggleClubStatus(id, dbStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Failed to toggle access status");
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      const target = deleteTarget;
      setDeleteTarget(null);
      
      startTransition(async () => {
        const res = await deleteClubAction(target.id);
        if (res.success) {
          router.refresh();
        } else {
          alert(res.error || "Failed to delete club");
        }
      });
    }
  };

  const handleCommissionChange = (newVal: number) => {
    setCommission(newVal);
    // Save to settings db
    startTransition(async () => {
      await updatePlatformSettings({
        commissionRate: newVal / 100,
        stripeLiveMode: false,
        cmiLiveMode: false
      });
      router.refresh();
    });
  };

  // Stats Calculations
  const totalClubs = initialTotalClubs;
  const totalFans = initialTotalFans;
  const totalGMV = initialTotalGMV;
  const platformNetRevenue = totalGMV * (commission / 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 sm:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Area without Generate Report */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-805/40 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Super Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage clubs, dynamic statistics, and platform revenues.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm text-slate-500 dark:text-slate-400">Platform Commission:</span>
            <input 
              type="number" 
              value={commission} 
              onChange={(e) => handleCommissionChange(Number(e.target.value))}
              disabled={isPending}
              className="w-12 bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-bold text-center border border-slate-250 dark:border-slate-700 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
            />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">%</span>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Clubs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Clubs</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalClubs}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 dark:text-blue-400">
              <Shield className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Total Registered Fans */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Registered Fans</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalFans.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-lg text-violet-500 dark:text-violet-400">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: GMV */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Gross Volume (GMV)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalGMV.toLocaleString()} MAD</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 dark:text-amber-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          {/* Card 4: Platform Net Revenue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Platform Net Revenue ({commission}%)</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{platformNetRevenue.toLocaleString()} MAD</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Clubs Management Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Clubs List</h3>
          </div>
          <div className="overflow-x-auto min-h-[280px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Club Name</th>
                  <th className="px-6 py-4">Registered Fans</th>
                  <th className="px-6 py-4">Gross Collected</th>
                  <th className="px-6 py-4">Platform Net Share (This Month)</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4">Access Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {initialClubs.map((club) => (
                  <tr key={club.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{club.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{club.fans} fans</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{club.totalPaid.toLocaleString()} MAD</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-semibold">{club.monthlyPlatformNet.toLocaleString()} MAD</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        club.status === "Public" 
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                      }`}>
                        {club.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        club.active 
                          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" 
                          : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20"
                      }`}>
                        {club.active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === club.id ? null : club.id)}
                        className="text-slate-450 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Actions Dropdown */}
                      {activeDropdown === club.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                          <div className="absolute right-6 top-12 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-100">
                            <button 
                              onClick={() => handleToggleStatus(club.id, club.status)}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 text-xs cursor-pointer"
                            >
                              {club.status === "Public" ? <EyeOff className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-emerald-500" />}
                              Make {club.status === "Public" ? "Private" : "Public"}
                            </button>
                            <button 
                              onClick={() => handleToggleActive(club.id, club.active)}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <Power className={`h-4 w-4 ${club.active ? "text-rose-500" : "text-emerald-500"}`} />
                              {club.active ? "Suspend Access" : "Activate Access"}
                            </button>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                            <button 
                              onClick={() => { setDeleteTarget(club); setActiveDropdown(null); }}
                              className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Club
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {initialClubs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No clubs registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="h-6 w-6" />
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Deletion</h4>
                  </div>
                  <button onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                  Are you sure you want to permanently delete <span className="font-semibold text-slate-900 dark:text-white">{deleteTarget.name}</span>? 
                  This will instantly remove all user subscriptions and database associations. This action cannot be undone.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white bg-transparent border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-805 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={isPending}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
