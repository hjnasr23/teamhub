import { Search, Trophy, Edit, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuperAdminClubsPage() {
  const clubsList = [
    { name: "Real Madrid FC", logo: "R", category: "Football", owner: "Florentino Perez", revenue: "$245,000", commission: "10%", commissionPaid: "$24,500", status: "Active" },
    { name: "Manchester United FC", logo: "M", category: "Football", owner: "Richard Arnold", revenue: "$198,000", commission: "10%", commissionPaid: "$19,800", status: "Active" },
    { name: "Los Angeles Lakers", logo: "L", category: "Basketball", owner: "Jeanie Buss", revenue: "$150,000", commission: "10%", commissionPaid: "$15,000", status: "Active" },
    { name: "Golden State Warriors", logo: "W", category: "Basketball", owner: "Joe Lacob", revenue: "$128,000", commission: "10%", commissionPaid: "$12,800", status: "Pending Setup" },
    { name: "Boston Celtics", logo: "C", category: "Basketball", owner: "Wyc Grousbeck", revenue: "$95,000", commission: "12%", commissionPaid: "$11,400", status: "Active" },
    { name: "Paris Saint-Germain", logo: "P", category: "Football", owner: "Nasser Al-Khelaifi", revenue: "$87,000", commission: "10%", commissionPaid: "$8,700", status: "Suspended" },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Manage Sports Clubs
          </h1>
          <p className="text-sm text-slate-400">
            Control billing models, view statements, and audit tenant clubs.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 font-semibold gap-2">
          <Trophy className="h-4.5 w-4.5" />
          Onboard New Club
        </Button>
      </div>

      {/* Main Panel table */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-lg font-bold text-white">Registered Multi-Tenants</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by club name or owner..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Club Brand</th>
                <th className="pb-3 font-semibold">Sport Category</th>
                <th className="pb-3 font-semibold">Club Owner</th>
                <th className="pb-3 font-semibold">Total Revenue</th>
                <th className="pb-3 font-semibold">Rate</th>
                <th className="pb-3 font-semibold">Platform Fee</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {clubsList.map((club, idx) => (
                <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                  <td className="py-3.5 font-semibold text-white flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-indigo-400">
                      {club.logo}
                    </div>
                    {club.name}
                  </td>
                  <td className="py-3.5 text-slate-400">{club.category}</td>
                  <td className="py-3.5 text-slate-400">{club.owner}</td>
                  <td className="py-3.5 text-slate-200">{club.revenue}</td>
                  <td className="py-3.5 text-indigo-400 font-semibold">{club.commission}</td>
                  <td className="py-3.5 text-emerald-400 font-semibold">{club.commissionPaid}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      club.status === "Active"
                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                        : club.status === "Pending Setup"
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/10"
                        : "bg-rose-500/5 text-rose-400 border-rose-500/10"
                    }`}>
                      <div className={`h-1 w-1 rounded-full ${
                        club.status === "Active" 
                          ? "bg-emerald-400" 
                          : club.status === "Pending Setup"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`} />
                      {club.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
