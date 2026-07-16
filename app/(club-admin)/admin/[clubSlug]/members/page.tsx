import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import MembersClient from "./MembersClient";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ClubMembersPage({ params }: PageProps) {
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

  // 2. Fetch Live Subscribers & Stats Scoped Strictly to this Club ID
  const [activeCount, freeCount, canceledCount, subscriptions] = await Promise.all([
    prisma.subscription.count({ where: { clubId: club.id, status: "ACTIVE" } }),
    prisma.subscription.count({ where: { clubId: club.id, status: "ACTIVE", amount: 0 } }),
    prisma.subscription.count({ where: { clubId: club.id, status: "CANCELLED" } }),
    prisma.subscription.findMany({
      where: { clubId: club.id },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const sanitizedSubscribers = subscriptions.map((sub) => {
    const firstName = sub.user.firstName || "";
    const lastName = sub.user.lastName || "";
    const name = `${firstName} ${lastName}`.trim() || "Anonymous Fan";

    return {
      id: sub.id,
      name,
      email: sub.user.email,
      status: sub.status as "ACTIVE" | "CANCELLED" | "SUSPENDED",
      amount: sub.amount,
      date: sub.createdAt ? sub.createdAt.toISOString().split("T")[0] : "",
    };
  });

  return (
    <MembersClient
      initialSubscribers={sanitizedSubscribers}
      clubSlug={clubSlug}
      activeCount={activeCount}
      freeCount={freeCount}
      canceledCount={canceledCount}
    />
  );
}
