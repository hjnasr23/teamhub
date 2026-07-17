import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // If CLUB_ADMIN, redirect to their specific club settings page
  if (session.role === "CLUB_ADMIN") {
    if (session.clubSlug) {
      redirect(`/admin/${session.clubSlug}/settings`);
    } else {
      redirect("/");
    }
  }

  // If SUPER_ADMIN, redirect to the general admin settings
  if (session.role === "SUPER_ADMIN") {
    redirect("/admin-gen/settings");
  }

  // If FAN, render the Fan Settings Page (children)
  return <>{children}</>;
}
