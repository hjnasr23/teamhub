"use client";

import React, { useState } from "react";
import { Save, Shield, CreditCard, Percent, AlertCircle } from "lucide-react";
import { updatePlatformSettings } from "@/lib/super-admin-actions";
import { useRouter } from "next/navigation";

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [commissionRate, setCommissionRate] = useState(initialSettings.commissionRate * 100);
  const [stripeLiveMode, setStripeLiveMode] = useState(initialSettings.stripeLiveMode);
  const [cmiLiveMode, setCmiLiveMode] = useState(initialSettings.cmiLiveMode);
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Configure global platform parameters and integration keys.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Controls */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Percent className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Platform Controls</h2>
            </div>
            <div className="p-6">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Global Commission Rate (%)</label>
                <p className="text-xs text-gray-500 mb-3">This flat percentage is deducted from all club subscription revenues before payouts are distributed.</p>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                    min="1" max="100"
                  />
                  <span className="text-gray-500 font-medium">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Security & Credentials</h2>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-orange-800">Super Admin Access</h4>
                  <p className="text-xs text-orange-600 mt-1">Changing these credentials will instantly log you out and require re-authentication.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Super Admin Email</label>
                  <input 
                    type="email" 
                    defaultValue="superadmin@teamhub.ma"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Gateway Toggles */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Payment Gateways</h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Stripe Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Stripe Integration</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Global credit card processing</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setStripeLiveMode(!stripeLiveMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${stripeLiveMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${stripeLiveMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="pl-2 border-l-2 border-gray-100">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stripeLiveMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {stripeLiveMode ? 'Live Mode' : 'Test Mode'}
                </span>
              </div>

              <div className="border-t border-gray-100 my-4" />

              {/* CMI Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">CMI Integration</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Local Moroccan processing</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setCmiLiveMode(!cmiLiveMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${cmiLiveMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${cmiLiveMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="pl-2 border-l-2 border-gray-100">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cmiLiveMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {cmiLiveMode ? 'Live Mode' : 'Test Mode'}
                </span>
              </div>

            </div>
          </div>
          
          {/* Action Area */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-xs text-gray-500 mb-4 text-center">Unsaved changes will be lost if you leave this page.</p>
            <button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-70"
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
