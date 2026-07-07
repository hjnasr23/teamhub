"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Building2, UserCircle2, Mail, Lock, Flag } from "lucide-react";
import { createTenantAction } from "@/lib/actions";

export default function SuperAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createTenantAction(formData);

    if (result.success) {
      setMessage({ type: 'success', text: `Tenant provisioned successfully! Club ID: ${result.data?.clubId}` });
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage({ type: 'error', text: result.error || "An unexpected error occurred." });
    }
    
    setLoading(false);
  };

  return (
    <div className="pt-36 pb-16 min-h-screen bg-[#060b13] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Intro Card */}
        <div className="col-span-1 md:col-span-5 flex flex-col space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="h-7 w-7 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Super-Admin <br/> <span className="text-indigo-400">Workspace</span></h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Use this secure internal gateway to provision brand new Club tenants. This action automatically spins up the database architecture and seeds a Root Administrator assigned directly to the new club instance.
          </p>
        </div>

        {/* Right Form Card */}
        <div className="col-span-1 md:col-span-7 bg-[#0c1420] rounded-2xl shadow-2xl border border-gray-800/60 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {message && (
              <div className={`p-4 rounded-xl text-sm font-semibold flex items-start gap-3 ${message.type === 'error' ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50' : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50'}`}>
                {message.type === 'success' ? <ShieldCheck className="h-5 w-5 shrink-0" /> : <Lock className="h-5 w-5 shrink-0" />}
                {message.text}
              </div>
            )}

            {/* Club Details Segment */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <Building2 className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white tracking-wide">Club Entity</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Official Name</label>
                  <input required type="text" name="clubName" className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="e.g. Manchester City" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">URL Slug</label>
                  <input required type="text" name="clubSlug" className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="e.g. man-city" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Operating City</label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input required type="text" name="clubCity" className="w-full pl-10 pr-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="e.g. Manchester, UK" />
                  </div>
                </div>
              </div>
            </div>

            {/* Root Administrator Segment */}
            <div className="space-y-5 pt-4">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                <UserCircle2 className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white tracking-wide">Root Administrator</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">First Name</label>
                  <input required type="text" name="adminFirstName" className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Last Name</label>
                  <input required type="text" name="adminLastName" className="w-full px-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input required type="email" name="adminEmail" className="w-full pl-10 pr-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="admin@club.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Temp Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                    <input required type="password" name="adminPassword" className="w-full pl-10 pr-4 py-3 bg-[#111a2e] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 text-sm transition-colors" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-2 bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Provisioning Architecture..." : "Provision New Tenant"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
