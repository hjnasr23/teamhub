import { prisma } from "@/lib/db";
import ClubsDirectoryClient from "./ClubsDirectoryClient";

export const dynamic = "force-dynamic";

/* ════════════════════════════════════════════════════════════════════
 *  PAGE COMPONENT
 * ════════════════════════════════════════════════════════════════════ */

export default async function ClubsDirectoryPage() {
  // Query all clubs from the database at build time
  const clubs = await prisma.club.findMany({
    orderBy: { subscribersCount: "desc" }
  });

  // Map to raw fields to avoid Prisma Decimal type serialization issues in server-to-client boundaries
  const sanitizedClubs = clubs.map((club) => ({
    id: club.id,
    name: club.name,
    slug: club.slug,
    city: club.city,
    subscribersCount: club.subscribersCount,
    primaryColor: club.primaryColor,
    secondaryColor: club.secondaryColor,
    logoInitials: (club as any).logoInitials || club.name.substring(0, 3).toUpperCase(),
  }));

  return <ClubsDirectoryClient clubs={sanitizedClubs} />;
}
