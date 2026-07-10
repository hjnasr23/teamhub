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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Clubs Management</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Review, approve, and manage all sports clubs on TEAMHUB.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Add New Club</span>
        </button>
      </div>
      
      {/* Clubs Directory Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full relative">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Registered Clubs</h2>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium">Club Name</th>
                <th className="px-4 md:px-6 py-3 font-medium">Status</th>
                <th className="px-4 md:px-6 py-3 font-medium">Members</th>
                <th className="px-4 md:px-6 py-3 font-medium">Total Revenue</th>
                <th className="px-4 md:px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clubs.map((club) => {
                const activeSubs = club._count?.subscriptions || 0;
                const estimatedRev = activeSubs * 50;

                return (
                  <tr key={club.id} className="hover:bg-gray-50 transition-colors">
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
                          <span className="font-medium text-gray-900 block">{club.name}</span>
                          <span className="text-xs text-gray-500">/{club.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(club.id, club.status)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          club.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {club.status}
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-500">
                      {activeSubs.toLocaleString()} fans
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-900 font-medium">
                      {estimatedRev.toLocaleString()} MAD
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right relative group">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg rounded-md py-1 hidden group-hover:block z-20 min-w-[120px] text-left">
                        <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">Edit</button>
                        <button className="w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 text-left transition-colors" onClick={() => handleToggleStatus(club.id, club.status)}>
                          {club.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors font-medium" onClick={() => handleDeleteClub(club.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8 text-center text-gray-500">
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
          <div className="relative w-full max-w-md transform transition-transform bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">Register New Club</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateClub} className="flex-1 flex flex-col p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                <input required name="name" type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Raja CA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Admin Email</label>
                <input required name="email" type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. admin@raja.ma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club Admin Password</label>
                <input required name="password" type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px] text-sm shadow-sm">
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
