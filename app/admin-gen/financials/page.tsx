import { prisma } from "@/lib/db";
import FinancialsClient from "@/components/admin/FinancialsClient";
import { getPlatformSettings } from "@/lib/super-admin-actions";

export const dynamic = "force-dynamic";

export default async function FinancialsPage() {
  const [aggregateRevenue, settings, payoutRequestsData] = await Promise.all([
    prisma.subscription.aggregate({
      where: { status: "ACTIVE" },
      _sum: { amount: true }
    }),
    getPlatformSettings(),
    prisma.payoutRequest.findMany({
      include: { club: true },
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  const grossRevenue = aggregateRevenue._sum.amount || 0;
  
  const formattedRequests = payoutRequestsData.map(req => ({
    id: req.id,
    club: req.club.name,
    amount: req.amount,
    status: req.status,
    date: req.createdAt.toISOString().split('T')[0],
  }));

  return (
    <FinancialsClient 
      grossRevenue={grossRevenue} 
      platformCommissionRate={settings.commissionRate} 
      initialPayoutRequests={formattedRequests} 
    />
  );
}
