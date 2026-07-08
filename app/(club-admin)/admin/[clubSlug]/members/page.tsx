import { Search, ShieldAlert, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export const generateStaticParams = () => {
  return [{ clubSlug: 'default' }];
};

export default async function ClubMembersPage({ params }: PageProps) {
  const { clubSlug } = await params;

  const subscribers = [
    { name: "Alex Morgan", email: "alex@example.com", tier: "Gold VIP", mrr: "$24.99", status: "Active", date: "June 14, 2026" },
    { name: "James Rodriguez", email: "james@example.com", tier: "Silver Star", mrr: "$14.99", status: "Active", date: "June 12, 2026" },
    { name: "Cristiano Jr", email: "cr7jr@example.com", tier: "Bronze Fan", mrr: "$4.99", status: "Active", date: "June 10, 2026" },
    { name: "Luka Modric", email: "luka@example.com", tier: "Gold VIP", mrr: "$24.99", status: "Active", date: "May 28, 2026" },
    { name: "Karim Benzema", email: "karim@example.com", tier: "Silver Star", mrr: "$14.99", status: "Active", date: "May 25, 2026" },
    { name: "Sergio Ramos", email: "sergio@example.com", tier: "Gold VIP", mrr: "$24.99", status: "Canceled", date: "May 20, 2026" },
    { name: "Gareth Bale", email: "gareth@example.com", tier: "Bronze Fan", mrr: "$4.99", status: "Active", date: "May 15, 2026" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Manage Fan Subscribers
          </h1>
          <p className="text-sm text-slate-400">
            View active subscription tiers, member billing states, and lifetime contributions.
          </p>
        </div>
      </div>

      {/* Metric counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Active Members
          </span>
          <div className="text-2xl font-bold text-emerald-400">14,245</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Trialing / Pending
          </span>
          <div className="text-2xl font-bold text-indigo-400">45</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Canceled (Month-to-date)
          </span>
          <div className="text-2xl font-bold text-rose-500">12</div>
        </div>
      </div>

      {/* Table container */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-lg font-bold text-white">Member Directories</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search fans by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Fan Name</th>
                <th className="pb-3 font-semibold">Subscription Tier</th>
                <th className="pb-3 font-semibold">MRR Contribution</th>
                <th className="pb-3 font-semibold">Joined Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {subscribers.map((fan, idx) => (
                <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                  <td className="py-3.5 font-semibold text-white flex flex-col">
                    <span>{fan.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal mt-0.5">{fan.email}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      fan.tier === "Gold VIP"
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/10"
                        : fan.tier === "Silver Star"
                        ? "bg-slate-300/5 text-slate-300 border-slate-300/10"
                        : "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                    }`}>
                      {fan.tier}
                    </span>
                  </td>
                  <td className="py-3.5 text-emerald-400 font-semibold">{fan.mrr}</td>
                  <td className="py-3.5 text-slate-400">{fan.date}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      fan.status === "Active"
                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                        : "bg-rose-500/5 text-rose-400 border-rose-500/10"
                    }`}>
                      <div className={`h-1 w-1 rounded-full ${fan.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                      {fan.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">
                      Refund/Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
