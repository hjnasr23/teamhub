import React from "react";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ClubAdminLayoutClient from "@/components/ClubAdminLayoutClient";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ClubAdminLayout({ children, params }: LayoutProps) {
  const { clubSlug } = await params;
  
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

  return (
    <ClubAdminLayoutClient
      clubSlug={club.slug}
      clubName={club.name}
      clubPrimaryColor={club.primaryColor}
      clubLogoUrl={club.logoUrl}
    >
      {children}
    </ClubAdminLayoutClient>
  );
}
