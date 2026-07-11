"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, X, Shield } from "lucide-react";
import { createSuperAdminClub, toggleClubStatus, deleteClubAction } from "@/lib/super-admin-actions";
import { useRouter } from "next/navigation";

const isValidUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

export default function ClubsClient({ initialClubs }: { initialClubs: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clubs, setClubs] = useState(initialClubs);
  const router = useRouter();

  // Keep state synced with props when it revalidates
  React.useEffect(() => {
    setClubs(initialClubs);
  }, [initialClubs]);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
      const email = (form.elements.namedItem("email") as HTMLInputElement).value;
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;

      const res = await createSuperAdminClub({
        name,
        email,
        password
      });

      if (res.success) {
        setIsModalOpen(false);
        form.reset();
        router.refresh();
      } else {
        alert(res.error || "Failed to create club");
      }
    } catch (err: any) {
      console.error(err);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const res = await toggleClubStatus(id, currentStatus);
    if (res.success) {
      router.refresh();
    }
  };

  const handleDeleteClub = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this club and all its associated admin accounts?")) {
      return;
    }
    const res = await deleteClubAction(id);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Failed to delete club");
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Clubs Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            Review, approve, and manage all sports clubs on TEAMHUB.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add New Club</span>
        </button>
      </div>
      
      {/* Clubs Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full relative transition-colors">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">Registered Clubs</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 md:px-6 py-3 font-semibold">Club Name</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Status</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Members</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Total Revenue</th>
                <th className="px-4 md:px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
              {clubs.map((club) => {
                const activeSubs = club._count?.subscriptions || 0;
                const estimatedRev = activeSubs * 50;

                return (
                  <tr key={club.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-gray-200 overflow-hidden"
                          style={{ backgroundColor: club.primaryColor }}
                        >
                          {isValidUrl(club.logoUrl) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={club.logoUrl} alt={club.name} className="h-full w-full object-cover" />
                          ) : (
                            <Shield className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">{club.name}</span>
                          <span className="text-xs text-slate-450">/{club.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(club.id, club.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          club.status === "ACTIVE" 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-950/40" 
                            : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950/40"
                        }`}
                      >
                        {club.status}
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-500 dark:text-slate-400">
                      {activeSubs.toLocaleString()} fans
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-900 dark:text-white font-bold">
                      {estimatedRev.toLocaleString()} MAD
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right relative group">
                      <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg py-1 hidden group-hover:block z-20 min-w-[120px] text-left transition-colors">
                        <button className="w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors">Edit</button>
                        <button className="w-full px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/25 text-left transition-colors" onClick={() => handleToggleStatus(club.id, club.status)}>
                          {club.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/25 text-left transition-colors font-semibold" onClick={() => handleDeleteClub(club.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No clubs registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md transform transition-transform bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-right overflow-y-auto border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Register New Club</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateClub} className="flex-1 flex flex-col p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Club Name</label>
                <input required name="name" type="text" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. Raja CA" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Club Admin Email</label>
                <input required name="email" type="email" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="e.g. admin@raja.ma" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Club Admin Password</label>
                <input required name="password" type="password" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="••••••••" />
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px] text-xs shadow-sm cursor-pointer">
                    {isSubmitting ? "Creating..." : "Create Club"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
