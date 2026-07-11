import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { CircleDollarSign, Building2, Users, MoreVertical, Shield } from "lucide-react";

const isValidUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
};

// Force dynamic rendering to always check session and get fresh data
export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  // 1. Check Authentication & Authorization
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // 2. Fetch Dashboard Data
  const [clubsCount, totalSubscribers, activeSubsCount, recentClubs, aggregateRevenue, clubRevenueMap] = await Promise.all([
    prisma.club.count(),
    prisma.user.count({ where: { role: 'FAN' } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.club.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { subscriptions: { where: { status: "ACTIVE" } } },
        },
      },
    }),
    prisma.subscription.aggregate({
      where: { status: "ACTIVE" },
      _sum: { amount: true }
    }),
    prisma.subscription.groupBy({
      by: ['clubId'],
      where: { status: 'ACTIVE' },
      _sum: { amount: true },
    })
  ]);

  const totalRevenue = aggregateRevenue._sum.amount || 0;

  // Create a map from clubId to total revenue (sum of active subscription amounts)
  const clubRevenue = new Map<string, number>();
  clubRevenueMap.forEach((item) => {
    clubRevenue.set(item.clubId, item._sum.amount || 0);
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">
            Monitor the high-level performance of TEAMHUB.
          </p>
        </div>
        <button className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
          <span>Generate Report</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">Total Revenue</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <CircleDollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{totalRevenue} MAD</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">Active Clubs</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{clubsCount}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">Total Subscribers</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{totalSubscribers}</p>
        </div>
      </div>

      {/* Clubs Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden w-full transition-colors">
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">Clubs Directory</h2>
          <button className="text-blue-600 dark:text-blue-400 hover:underline text-xs md:text-sm font-semibold cursor-pointer">
            View All
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">Club Name</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">Status</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">Active Subscribers</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold">Monthly Revenue</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {recentClubs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No clubs registered yet.
                  </td>
                </tr>
              ) : (
                recentClubs.map((club) => {
                  const activeSubs = club._count.subscriptions;
                  const monthlyRevenue = clubRevenue.get(club.id) || 0;

                  return (
                    <tr key={club.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden bg-slate-200"
                            style={{ backgroundColor: club.primaryColor }}
                          >
                            {isValidUrl(club.logoUrl) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={club.logoUrl!} alt={club.name} className="h-full w-full object-cover" />
                            ) : (
                              <Shield className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {club.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          club.status === "ACTIVE" 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" 
                            : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                        }`}>
                          {club.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-slate-500 dark:text-slate-400">
                        {activeSubs.toLocaleString()} fans
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-slate-900 dark:text-white font-bold">
                        {monthlyRevenue.toLocaleString()} MAD/mo
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1">
                          <MoreVertical className="h-5 w-5" />
                          <span className="sr-only">Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
