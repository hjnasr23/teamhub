import { prisma } from "@/lib/db";
import ClubsClient from "@/components/admin/ClubsClient";
import { getPlatformSettings } from "@/lib/super-admin-actions";

export const dynamic = "force-dynamic";

export default async function ClubsManagementPage() {
  const [clubs, settings] = await Promise.all([
    prisma.club.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { subscriptions: { where: { status: "ACTIVE" } } },
        },
      },
    }),
    getPlatformSettings()
  ]);

  return <ClubsClient initialClubs={clubs} commissionRate={settings?.commissionRate ?? 0.10} />;
}
