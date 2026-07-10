import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function DashboardClubPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  if (session.role === "CLUB_ADMIN" && session.clubSlug) {
    redirect(`/admin/${session.clubSlug}`);
  }

  // Fallback if session is invalid
  redirect("/login");
}
