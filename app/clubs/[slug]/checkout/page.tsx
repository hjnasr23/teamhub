import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import CheckoutClient from "./CheckoutClient";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ planId?: string; postId?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  // 1. Authenticate Fan Session
  const session = await getSession();
  if (!session) {
    redirect(`/login?callbackUrl=/clubs/${slug}/checkout`);
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

  const clubLogoInitials = club.name.substring(0, 2).toUpperCase();

  return (
    <CheckoutClient 
      clubName={club.name}
      clubLogoInitials={clubLogoInitials}
      clubSlug={slug}
      initialPlanId={planId || "basic"}
    />
  );
}
