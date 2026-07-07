"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { createTenantAction } from "@/lib/actions";

export default function SuperAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await createTenantAction(formData);

    if (result.success) {
      setMessage("Tenant created successfully! ID: " + result.data?.clubId);
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage("Error: " + result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6">
          <h1 className="text-2xl font-bold text-white">Super-Admin Workspace</h1>
          <p className="text-slate-400 mt-1">Provision a new Club Tenant and Root Administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${message.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">1. Club Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Club Official Name</label>
                <input required type="text" name="clubName" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Manchester City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">URL Slug</label>
                <input required type="text" name="clubSlug" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. man-city" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">City</label>
                <input required type="text" name="clubCity" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="e.g. Manchester" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">2. Root Administrator Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">First Name</label>
                <input required type="text" name="adminFirstName" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
                <input required type="text" name="adminLastName" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Admin Email</label>
                <input required type="email" name="adminEmail" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="admin@club.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Temporary Password</label>
                <input required type="password" name="adminPassword" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="••••••••" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800">
              {loading ? "Provisioning..." : "Provision New Tenant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
