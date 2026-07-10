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
  const [clubsCount, totalSubscribers, activeSubsCount, recentClubs, aggregateRevenue] = await Promise.all([
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
    })
  ]);

  const totalRevenue = aggregateRevenue._sum.amount || 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Monitor the high-level performance of TEAMHUB.
          </p>
        </div>
        <button className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium rounded-md shadow-sm transition-colors flex items-center gap-2">
          <span>Generate Report</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CircleDollarSign className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalRevenue} MAD</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Active Clubs</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{clubsCount}</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Total Subscribers</h3>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalSubscribers}</p>
        </div>
      </div>

      {/* Clubs Directory Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Clubs Directory</h2>
          <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Club Name</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Status</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Active Subscribers</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Estimated Revenue</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentClubs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8 text-center text-gray-500">
                    No clubs registered yet.
                  </td>
                </tr>
              ) : (
                recentClubs.map((club) => {
                  const activeSubs = club._count.subscriptions;
                  const estimatedRev = activeSubs * 50;

                  return (
                    <tr key={club.id} className="hover:bg-gray-50 transition-colors">
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
                          <span className="font-medium text-gray-900">
                            {club.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          club.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>
                          {club.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-gray-500">
                        {activeSubs.toLocaleString()} fans
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-gray-900 font-medium">
                        {estimatedRev.toLocaleString()} MAD/mo
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
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
