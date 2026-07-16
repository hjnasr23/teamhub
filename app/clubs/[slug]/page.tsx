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

  /* ── Secure Private Clubs ─────────────────────────────────────────── */
  const session = await getSession();
  
  if (club && club.visibility === "PRIVATE") {
    const isSuperAdmin = session?.role === "SUPER_ADMIN";
    const isClubAdmin = session?.role === "CLUB_ADMIN" && session.clubId === club.id;
    
    let hasSub = false;
    if (session) {
      const activeSub = await prisma.subscription.findFirst({
        where: {
          fanId: session.userId,
          clubId: club.id,
          status: "ACTIVE"
        }
      });
      if (activeSub) hasSub = true;
    }

    if (!isSuperAdmin && !isClubAdmin && !hasSub) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full text-slate-450 dark:text-slate-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Private Club</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">This club is currently set to private. You must be an authorized administrator or member to access it.</p>
        </div>
      );
    }
  }

  /* ── Check Fan Subscription State ───────────────────────────────── */
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
