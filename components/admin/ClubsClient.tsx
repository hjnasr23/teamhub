"use client";

import React, { useState } from "react";
import { 
  Plus, 
  MoreVertical, 
  X, 
  Shield, 
  Trash2, 
  EyeOff, 
  Eye, 
  Power, 
  AlertTriangle 
} from "lucide-react";
import { 
  createSuperAdminClub, 
  toggleClubStatus, 
  toggleClubVisibility, 
  deleteClubAction 
} from "@/lib/super-admin-actions";
import { useRouter } from "next/navigation";

const isValidUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

export default function ClubsClient({ 
  initialClubs, 
  commissionRate = 0.10 
}: { 
  initialClubs: any[]; 
  commissionRate?: number; 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clubs, setClubs] = useState(initialClubs);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

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

  const handleToggleVisibility = async (id: string, currentVisibility: string) => {
    const res = await toggleClubVisibility(id, currentVisibility);
    if (res.success) {
      router.refresh();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      const id = deleteTarget.id;
      const name = deleteTarget.name;
      setDeleteTarget(null);
      setIsSubmittingDelete(true);
      try {
        const res = await deleteClubAction(id);
        if (res.success) {
          router.refresh();
        } else {
          alert(res.error || `Failed to delete ${name}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmittingDelete(false);
      }
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
        <div className="overflow-x-auto w-full min-h-[280px]">
          <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 md:px-6 py-3 font-semibold">Club Name</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Status</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Visibility</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Members</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Platform Share</th>
                <th className="px-4 md:px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {clubs.map((club) => {
                const activeSubs = club._count?.subscriptions || 0;
                const grossRev = activeSubs * 50;
                const platformShare = grossRev * commissionRate;

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
                          <span className="text-xs text-slate-400">/{club.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        club.status === "ACTIVE" 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" 
                          : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                      }`}>
                        {club.status === "ACTIVE" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        club.visibility === "PUBLIC" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse-once" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                      }`}>
                        {club.visibility || "PRIVATE"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-500 dark:text-slate-400">
                      {activeSubs.toLocaleString()} fans
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-900 dark:text-white font-bold">
                      {platformShare.toLocaleString()} MAD/mo
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === club.id ? null : club.id)}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {activeDropdown === club.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg py-1.5 z-20 min-w-[155px] text-left transition-colors">
                            <button 
                              onClick={() => { setActiveDropdown(null); handleToggleVisibility(club.id, club.visibility || "PRIVATE"); }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 text-xs cursor-pointer"
                            >
                              {club.visibility === "PUBLIC" ? <EyeOff className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4 text-emerald-500" />}
                              Make {club.visibility === "PUBLIC" ? "Private" : "Public"}
                            </button>
                            <button 
                              onClick={() => { setActiveDropdown(null); handleToggleStatus(club.id, club.status); }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <Power className="h-4 w-4 text-amber-500" />
                              {club.status === "ACTIVE" ? "Suspend Access" : "Activate Access"}
                            </button>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                            <button 
                              onClick={() => { setActiveDropdown(null); setDeleteTarget({ id: club.id, name: club.name }); }}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/25 text-red-650 dark:text-red-400 flex items-center gap-2 text-xs font-semibold cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Club
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Deletion</h4>
                </div>
                <button onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                Are you sure you want to permanently delete <span className="font-semibold text-slate-900 dark:text-white">{deleteTarget.name}</span>? 
                This will instantly remove all user subscriptions and database associations. This action cannot be undone.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-805">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmittingDelete}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-650 hover:bg-red-600 text-white shadow-sm transition-colors cursor-pointer"
              >
                {isSubmittingDelete ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
