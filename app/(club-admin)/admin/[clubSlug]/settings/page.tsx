import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import ClubSettingsClient from "./ClubSettingsClient";

interface PageProps {
  params: Promise<{ clubSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ClubSettingsPage({ params }: PageProps) {
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

  return <ClubSettingsClient club={club} />;
}
