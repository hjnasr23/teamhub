import { prisma } from "@/lib/db";
import SubscribersClient from "@/components/admin/SubscribersClient";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'FAN' },
    include: {
      subscriptions: {
        include: { club: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const formattedSubscribers = users.flatMap(user => {
    return user.subscriptions.map(sub => ({
      id: sub.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Fan',
      email: user.email,
      club: sub.club.name,
      tier: sub.amount >= 100 ? "Gold" : sub.amount >= 75 ? "Silver" : "Standard",
      fee: sub.amount,
      status: sub.status,
      joinDate: sub.createdAt.toISOString().split('T')[0],
    }));
  });

  const clubsList = Array.from(new Set(formattedSubscribers.map(sub => sub.club)));

  return <SubscribersClient initialSubscribers={formattedSubscribers} clubsList={clubsList} />;
}
