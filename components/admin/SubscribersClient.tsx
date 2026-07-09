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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Subscribers Directory</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Monitor and manage platform-wide user accounts and fan subscriptions.
          </p>
        </div>
      </div>
      
      {/* Filters and Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full relative">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-400 shrink-0" />
            <select 
              value={filterClub}
              onChange={(e) => setFilterClub(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-4 md:px-6 py-3 font-medium">Fan Name</th>
                <th className="px-4 md:px-6 py-3 font-medium">Email</th>
                <th className="px-4 md:px-6 py-3 font-medium">Registered Club</th>
                <th className="px-4 md:px-6 py-3 font-medium">Tier</th>
                <th className="px-4 md:px-6 py-3 font-medium">Monthly Fee</th>
                <th className="px-4 md:px-6 py-3 font-medium">Status</th>
                <th className="px-4 md:px-6 py-3 font-medium">Join Date</th>
                <th className="px-4 md:px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 md:px-6 py-8 text-center text-gray-500">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900">
                      {sub.name}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-500">
                      {sub.email}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-700">
                      {sub.club}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        sub.tier === "Gold" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        sub.tier === "Silver" ? "bg-slate-100 text-slate-700 border-slate-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {sub.tier}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-900 font-medium">
                      {sub.fee} MAD
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" :
                        sub.status === "PENDING" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-500">
                      {sub.joinDate}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-gray-100">
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
