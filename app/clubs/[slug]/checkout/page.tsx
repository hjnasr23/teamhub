import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CheckoutClient from "./CheckoutClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ planId?: string; postId?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const { planId } = resolvedSearchParams;

  // 1. Fetch real club details from PostgreSQL via Prisma
  const club = await prisma.club.findUnique({
    where: { slug }
  });

  if (!club) {
    notFound();
  }

  // 2. Dynamic Context Parsing (Determine what the Fan is buying)
  let planName = "Supporter Membership";
  let price = 10;
  let billingCycle = "Month";

  if (planId === "premium") {
    planName = "Pro Supporter Membership";
    price = 50;
  } else if (planId === "vip") {
    planName = "Gold VIP Access";
    price = 150;
  }

  const clubLogoInitials = club.name.substring(0, 2).toUpperCase();

  return (
    <CheckoutClient 
      clubName={club.name}
      clubLogoInitials={clubLogoInitials}
      planName={planName}
      price={price}
      billingCycle={billingCycle}
    />
  );
}
