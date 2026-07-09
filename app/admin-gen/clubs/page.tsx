import { prisma } from "@/lib/db";
import ClubsClient from "@/components/admin/ClubsClient";

export const dynamic = "force-dynamic";

export default async function ClubsManagementPage() {
  const clubs = await prisma.club.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { subscriptions: { where: { status: "ACTIVE" } } },
      },
    },
  });

  return <ClubsClient initialClubs={clubs} />;
}
