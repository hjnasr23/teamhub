import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import { getPlatformSettings } from "@/lib/super-admin-actions";
import SubscribeClient from "./SubscribeClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function SubscribePage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Authenticate Fan Session
  const session = await getSession();
  if (!session) {
    redirect(`/login?callbackUrl=/clubs/${slug}/subscribe`);
  }

  // 2. Fetch club details
  const club = await prisma.club.findUnique({
    where: { slug },
  });

  if (!club) {
    notFound();
  }

  // 3. Check existing paid subscription
  let hasActiveSubscription = false;
  const activeSub = await prisma.subscription.findFirst({
    where: {
      fanId: session.userId,
      clubId: club.id,
      status: "ACTIVE",
      amount: { gt: 0 },
    },
  });
  if (activeSub) {
    hasActiveSubscription = true;
  }

  // 4. Fetch global platform settings (commission / discount)
  const platformSettings = await getPlatformSettings();
  const commissionRate = platformSettings.commissionRate ?? 0.10;

  // 5. Compute pricing
  const monthlyBasePrice = 50;
  const annualBasePrice = 600; // 12 × 50
  const annualDiscountPercent = Math.round(commissionRate * 100); // e.g. 0.10 → 10%
  const annualDiscountedPrice = Math.round(annualBasePrice * (1 - commissionRate));

  return (
    <SubscribeClient
      clubName={club.name}
      clubSlug={slug}
      clubLogoUrl={club.logoUrl}
      clubLogoInitials={club.name.substring(0, 2).toUpperCase()}
      primaryColor={club.primaryColor}
      secondaryColor={club.secondaryColor}
      monthlyPrice={monthlyBasePrice}
      annualOriginalPrice={annualBasePrice}
      annualDiscountedPrice={annualDiscountedPrice}
      annualDiscountPercent={annualDiscountPercent}
      hasActiveSubscription={hasActiveSubscription}
    />
  );
}
