import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import SubscribeClient from "./SubscribeClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ planId?: string }>;
}

export default async function SubscribePage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  // 1. Authenticate Fan Session
  const session = await getSession();
  if (!session) {
    redirect(`/login?callbackUrl=/clubs/${slug}/subscribe`);
  }

  const resolvedSearchParams = await searchParams;
  const { planId } = resolvedSearchParams;

  // 2. Fetch real club details from PostgreSQL via Prisma
  const club = await prisma.club.findUnique({
    where: { slug }
  });

  if (!club) {
    notFound();
  }

  // 3. Dynamic Context Parsing (Determine what the Fan is buying)
  let planName = "Standard Member Subscription";
  let price = 50; // Default requested by user: 50 DH/Month
  let billingCycle = "Month";

  if (planId === "vip") {
    planName = "Gold VIP Access";
    price = 150;
  } else if (planId === "annual") {
    planName = "Annual Supporter Subscription";
    price = 500;
    billingCycle = "Year";
  }

  const clubLogoInitials = club.name.substring(0, 2).toUpperCase();

  return (
    <SubscribeClient 
      clubName={club.name}
      clubLogoInitials={clubLogoInitials}
      planName={planName}
      price={price}
      billingCycle={billingCycle}
      clubSlug={slug}
    />
  );
}
