import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import { getPlatformSettings } from "@/lib/super-admin-actions";
import ClubDashboardClient from "./ClubDashboardClient";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ClubAdminDashboard({ params }: PageProps) {
  const { clubSlug } = await params;

  // 1. Authenticate & Authorize
  const session = await getSession();
  if (!session || session.role !== "CLUB_ADMIN") {
    redirect("/login");
  }

  const club = await prisma.club.findUnique({
    where: { slug: clubSlug }
  });

  if (!club || session.clubId !== club.id) {
    redirect("/login");
  }

  // 2. Fetch Live Dashboard Metrics Scoped Strictly to this Club ID
  const [
    totalMembers,
    premiumMembers,
    grossRevenueAggregate,
    recentSubscribers,
    recentPosts,
    payoutRequests,
    platformSettings,
  ] = await Promise.all([
    // Active Members
    prisma.subscription.count({
      where: { clubId: club.id, status: "ACTIVE" }
    }),
    // Active Premium Members (amount > 0)
    prisma.subscription.count({
      where: { clubId: club.id, status: "ACTIVE", amount: { gt: 0 } }
    }),
    // Gross Revenue Aggregate
    prisma.subscription.aggregate({
      where: { clubId: club.id, status: "ACTIVE" },
      _sum: { amount: true }
    }),
    // Recent Subscribers
    prisma.subscription.findMany({
      where: { clubId: club.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    // Recent Posts
    prisma.post.findMany({
      where: { clubId: club.id },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    // Payout Requests
    prisma.payoutRequest.findMany({
      where: { clubId: club.id },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    // Commission settings
    getPlatformSettings()
  ]);

  const grossRevenue = grossRevenueAggregate._sum.amount || 0;
  const commissionRate = platformSettings?.commissionRate !== undefined ? platformSettings.commissionRate : 0.10;

  return (
    <ClubDashboardClient
      clubId={club.id}
      clubSlug={club.slug}
      clubName={club.name}
      clubPrimaryColor={club.primaryColor}
      metrics={{
        totalMembers,
        premiumMembers,
        grossRevenue,
      }}
      recentSubscribers={recentSubscribers}
      recentPosts={recentPosts}
      payoutRequests={payoutRequests}
      commissionRate={commissionRate}
    />
  );
}
