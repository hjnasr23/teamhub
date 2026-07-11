import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import ClubPageClient from "./ClubPageClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ClubPage({ params }: PageProps) {
  const { slug } = await params;

  /* ── Look up the club from the database ────────────────────── */
  const club = await prisma.club.findUnique({
    where: { slug: slug },
    include: { posts: { orderBy: { createdAt: 'desc' } } }
  });

  /* ── Check Fan Subscription State ───────────────────────────────── */
  const session = await getSession();
  let hasActiveSubscription = false;
  let isFollowing = false;
  let isAdmin = false;
  
  if (session && club) {
    const isSuperAdmin = session.role === "SUPER_ADMIN";
    const isClubAdmin = session.role === "CLUB_ADMIN" && session.clubId === club.id;
    
    if (isSuperAdmin || isClubAdmin) {
      hasActiveSubscription = true;
      isFollowing = true;
      isAdmin = true;
    } else {
      const activeSub = await prisma.subscription.findFirst({
        where: {
          fanId: session.userId,
          clubId: club.id,
          status: "ACTIVE"
        }
      });
      if (activeSub) {
        isFollowing = true;
        if (activeSub.amount > 0) {
          hasActiveSubscription = true;
        }
      }
    }
  }

  // Sanitize the Prisma results to prevent serialization issues
  const sanitizedClub = club ? {
    id: club.id,
    slug: club.slug,
    name: club.name,
    primaryColor: club.primaryColor,
    secondaryColor: club.secondaryColor,
    logoInitials: (club as any).logoInitials || club.name.substring(0, 3).toUpperCase(),
    logoUrl: club.logoUrl,
    bannerUrl: club.bannerUrl,
    subscribersCount: club.subscribersCount,
    posts: club.posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString(),
      mediaUrl: post.mediaUrl,
      mediaType: post.mediaType,
    }))
  } : null;

  return (
    <ClubPageClient 
      club={sanitizedClub as any} 
      hasActiveSubscription={hasActiveSubscription} 
      isFollowing={isFollowing}
      slug={slug} 
      isAdmin={isAdmin}
      isGuest={!session}
    />
  );
}
