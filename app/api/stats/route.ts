import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Total registered clubs
    const clubsCount = await prisma.club.count();

    // 2. Total active fans/users (role = 'FAN')
    const supportersCount = await prisma.user.count({
      where: { role: "FAN" },
    });

    // 3. Total posts (publications)
    const postsCount = await prisma.post.count();

    // 4. Total active subscriptions
    const activeSubsCount = await prisma.subscription.count({
      where: { status: "ACTIVE" },
    });

    // 5. Fetch actual clubs list
    const clubsList = await prisma.club.findMany({
      orderBy: { subscribersCount: "desc" }
    });

    const sanitizedClubs = clubsList.map((club) => ({
      id: club.id,
      name: club.name,
      slug: club.slug,
      city: club.city,
      subscribersCount: club.subscribersCount,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
      logoInitials: club.name
        ? club.name.split(" ").map((w) => w[0]).join("").substring(0, 3).toUpperCase()
        : "",
    }));

    // Average club revenue calculation: (activeSubscriptions * 50 MAD) / clubsCount
    const totalRevenue = activeSubsCount * 50;
    const avgRevenue = clubsCount > 0 ? Math.round(totalRevenue / clubsCount) : 0;

    return NextResponse.json({
      success: true,
      data: {
        clubs: clubsCount,
        supporters: supportersCount,
        posts: postsCount,
        revenue: avgRevenue,
        clubsList: sanitizedClubs,
      },
    });
  } catch (err: any) {
    console.error("Error fetching database stats:", err);
    // Graceful error response containing fallback values (original mockup data)
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Database connection error",
        fallback: {
          clubs: 3,
          supporters: 14290,
          posts: 42,
          revenue: 237417,
          clubsList: [],
        },
      },
      { status: 200 }
    );
  }
}
