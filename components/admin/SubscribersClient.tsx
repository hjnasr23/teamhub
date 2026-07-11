"use client";

import React, { useState } from "react";
import { Search, Filter, MoreVertical } from "lucide-react";

export default function SubscribersClient({ initialSubscribers, clubsList }: { initialSubscribers: any[], clubsList: string[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClub, setFilterClub] = useState("All");
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  React.useEffect(() => {
    setSubscribers(initialSubscribers);
  }, [initialSubscribers]);

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClub = filterClub === "All" || sub.club === filterClub;
    return matchesSearch && matchesClub;
  });

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Subscribers Directory</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            Monitor and manage platform-wide user accounts and fan subscriptions.
          </p>
        </div>
      </div>
      
      {/* Filters and Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full relative transition-colors">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-450 dark:text-slate-500 shrink-0" />
            <select 
              value={filterClub}
              onChange={(e) => setFilterClub(e.target.value)}
              className="w-full sm:w-auto border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="All">All Clubs</option>
              {clubsList.map(club => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 md:px-6 py-3 font-semibold">Fan Name</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Email</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Registered Club</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Tier</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Monthly Fee</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Status</th>
                <th className="px-4 md:px-6 py-3 font-semibold">Join Date</th>
                <th className="px-4 md:px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                    <td className="px-4 md:px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {sub.name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-500 dark:text-slate-400">
                      {sub.email}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-700 dark:text-slate-300">
                      {sub.club}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        sub.tier === "Gold" ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50" :
                        sub.tier === "Silver" ? "bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800" :
                        "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
                      }`}>
                        {sub.tier}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-900 dark:text-white font-bold">
                      {sub.fee} MAD
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        sub.status === "ACTIVE" 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" :
                        sub.status === "PENDING" 
                          ? "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50" :
                          "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-slate-500 dark:text-slate-450">
                      {sub.joinDate}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
