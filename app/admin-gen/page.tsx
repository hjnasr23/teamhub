import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { getPlatformSettings } from "@/lib/super-admin-actions";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  // 1. Check Authentication & Authorization
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // 2. Fetch platform stats and clubs
  const [
    clubsCount,
    totalFans,
    aggregateRevenue,
    clubs,
    settings
  ] = await Promise.all([
    prisma.club.count(),
    prisma.user.count({ where: { role: 'FAN' } }),
    prisma.subscription.aggregate({
      where: { status: "ACTIVE" },
      _sum: { amount: true }
    }),
    prisma.club.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { subscriptions: { where: { status: "ACTIVE" } } },
        },
        subscriptions: {
          where: { status: "ACTIVE" },
          select: { amount: true }
        }
      }
    }),
    getPlatformSettings()
  ]);

  const commissionRate = settings?.commissionRate ?? 0.10;
  const totalGMV = aggregateRevenue._sum.amount || 0;

  // Sanitize and format data for the client component
  const initialClubs = clubs.map((club) => {
    const fans = club._count.subscriptions;
    const totalPaid = club.subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const monthlyPlatformNet = totalPaid * commissionRate;

    return {
      id: club.id,
      name: club.name,
      fans,
      totalPaid,
      monthlyPlatformNet,
      status: (club.visibility === "PUBLIC" ? "Public" : "Private") as "Public" | "Private",
      active: club.status === "ACTIVE"
    };
  });

  return (
    <DashboardClient 
      initialClubs={initialClubs}
      initialTotalClubs={clubsCount}
      initialTotalFans={totalFans}
      initialTotalGMV={totalGMV}
      initialCommission={Math.round(commissionRate * 100)}
    />
  );
}
