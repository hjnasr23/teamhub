import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import PayZoneSimulatorClient from "./PayZoneSimulatorClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ planId?: string; price?: string }>;
}

export default async function PayZoneSimulatorPage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  // 1. Authenticate session
  const session = await getSession();
  if (!session) {
    redirect(`/login?callbackUrl=/clubs/${slug}/checkout`);
  }

  // 2. Fetch club details
  const club = await prisma.club.findUnique({
    where: { slug }
  });

  if (!club) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const planId = resolvedSearchParams.planId || "premium";
  const price = parseFloat(resolvedSearchParams.price || "50");

  let planName = "Supporter Membership";
  if (planId === "premium") {
    planName = "Pro Supporter Membership";
  } else if (planId === "vip") {
    planName = "Gold VIP Access";
  }

  return (
    <PayZoneSimulatorClient
      clubName={club.name}
      clubSlug={slug}
      planId={planId}
      planName={planName}
      price={price}
    />
  );
}
