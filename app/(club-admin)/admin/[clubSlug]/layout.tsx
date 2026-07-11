import React from "react";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ClubAdminSidebar from "@/components/ClubAdminSidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ clubSlug: string }>;
}

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      <ClubAdminSidebar
        clubSlug={club.slug}
        clubName={club.name}
        clubPrimaryColor={club.primaryColor}
        clubLogoUrl={club.logoUrl}
      />

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic children component view */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
