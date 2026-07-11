"use client";

import React, { useState } from "react";
import { Save, Shield, CreditCard, Percent, AlertCircle } from "lucide-react";
import { updatePlatformSettings } from "@/lib/super-admin-actions";
import { useRouter } from "next/navigation";

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [commissionRate, setCommissionRate] = useState(initialSettings.commissionRate * 100);
  const [stripeLiveMode, setStripeLiveMode] = useState(initialSettings.stripeLiveMode);
  const [cmiLiveMode, setCMILiveMode] = useState(initialSettings.cmiLiveMode);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await updatePlatformSettings({
        commissionRate: commissionRate / 100, // store as decimal
        stripeLiveMode,
        cmiLiveMode
      });

      if (res.success) {
        alert("Settings saved successfully!");
        router.refresh();
      } else {
        alert(res.error || "Failed to save settings");
      }
    } catch (err) {
      alert("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            Configure global platform parameters and integration keys.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Percent className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Platform Controls</h2>
            </div>
            <div className="p-6">
              <div className="max-w-md">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Global Commission Rate (%)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  This flat percentage is deducted from all club subscription revenues before payouts are distributed.
                </p>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-24 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1" max="100"
                  />
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Security & Credentials</h2>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-orange-850 dark:text-orange-355">Super Admin Access</h4>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Changing these credentials will instantly log you out and require re-authentication.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Super Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="superadmin@teamhub.ma"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-500 dark:text-slate-400"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Update Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Gateway Toggles */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Payment Gateways</h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Stripe Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Stripe Integration</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Global credit card processing</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setStripeLiveMode(!stripeLiveMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${stripeLiveMode ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-850'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${stripeLiveMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stripeLiveMode ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'}`}>
                  {stripeLiveMode ? 'Live Mode' : 'Test Mode'}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

              {/* CMI Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">CMI Integration</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Local Moroccan processing</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setCMILiveMode(!cmiLiveMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${cmiLiveMode ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-850'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${cmiLiveMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cmiLiveMode ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'}`}>
                  {cmiLiveMode ? 'Live Mode' : 'Test Mode'}
                </span>
              </div>

            </div>
          </div>
          
          {/* Action Area */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">Unsaved changes will be lost if you leave this page.</p>
            <button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-70 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving Configuration..." : "Save All Settings"}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
