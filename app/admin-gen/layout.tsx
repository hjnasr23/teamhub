import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";

export default async function AdminGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return <AdminDashboardLayout session={session}>{children}</AdminDashboardLayout>;
}
