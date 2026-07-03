import Link from "next/link";
import { Users, Landmark, Percent, TrendingUp, ShieldAlert, Award, ArrowUpRight } from "lucide-react";

export default function SuperAdminDashboard() {
  const stats = [
    { name: "Total SaaS Clubs", value: "148", desc: "+12% vs last month", icon: Award, color: "text-emerald-400" },
    { name: "Global Active Fans", value: "12,450,290", desc: "+8.4% vs last month", icon: Users, color: "text-indigo-400" },
    { name: "Total MRR (All Tenants)", value: "$145,290", desc: "+14.2% vs last month", icon: Landmark, color: "text-purple-400" },
    { name: "Platform Commissions (10%)", value: "$14,529", desc: "+14.2% vs last month", icon: Percent, color: "text-rose-400" },
  ];

  const recentClubs = [
    { name: "Real Madrid FC", slug: "real-madrid", subscribers: "1.2M", mrr: "$24,500", date: "July 01, 2026", status: "Active" },
    { name: "Manchester United FC", slug: "man-united", subscribers: "980K", mrr: "$19,800", date: "June 28, 2026", status: "Active" },
    { name: "Los Angeles Lakers", slug: "lakers", subscribers: "750K", mrr: "$15,000", date: "June 25, 2026", status: "Active" },
    { name: "Golden State Warriors", slug: "warriors", subscribers: "640K", mrr: "$12,800", date: "June 22, 2026", status: "Pending Setup" },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Real-time analytics and server statuses for the TEAMHUB network.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-slate-900/50 rounded-full blur-2xl -z-10" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="font-display text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{stat.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Recent signups & Platforms logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Signups list */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-white">Recent Club Registrations</h2>
              <Link href="/super-admin/clubs" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold">
                Manage Clubs <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Club Name</th>
                    <th className="pb-3 font-semibold">Subscribers</th>
                    <th className="pb-3 font-semibold">Estimated MRR</th>
                    <th className="pb-3 font-semibold">Registered</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300">
                  {recentClubs.map((club, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 font-semibold text-white flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[10px] text-emerald-400">
                          {club.name[0]}
                        </div>
                        {club.name}
                      </td>
                      <td className="py-3.5">{club.subscribers}</td>
                      <td className="py-3.5 text-emerald-400 font-semibold">{club.mrr}</td>
                      <td className="py-3.5 text-slate-400">{club.date}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          club.status === "Active"
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                            : "bg-amber-500/5 text-amber-400 border-amber-500/10"
                        }`}>
                          <div className={`h-1 w-1 rounded-full ${club.status === "Active" ? "bg-emerald-400" : "bg-amber-400"}`} />
                          {club.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Platform Status */}
        <div className="glass-panel rounded-2xl border border-slate-800/80 p-6">
          <h2 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-400" />
            System Health & Logs
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs text-slate-400">Next.js Web Build Status</span>
              <span className="text-xs font-semibold text-emerald-400">Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs text-slate-400">Database Connection</span>
              <span className="text-xs font-semibold text-emerald-400">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs text-slate-400">SaaS Commission Webhook</span>
              <span className="text-xs font-semibold text-emerald-400">Listening</span>
            </div>

            <div className="pt-4 border-t border-slate-850">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-3">
                Live Audit Logs
              </span>
              <div className="space-y-3 font-mono text-[10px] text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">[14:58:32]</span>
                  <span>Club Real Madrid FC activated subscription tier PRO</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0">[14:55:01]</span>
                  <span>Payout of $24,500 transferred to Club Admin</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-500 shrink-0">[14:42:15]</span>
                  <span>Fan subscription check completed globally</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
