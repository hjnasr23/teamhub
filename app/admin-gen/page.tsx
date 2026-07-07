import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions";
import ProvisionForm from "./ProvisionForm";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function SuperAdminPage({ searchParams }: Props) {
  const session = await getSession();

  // Route Lockout: check for valid SUPER_ADMIN session roles.
  // Redirect to login if unauthenticated or unauthorized.
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const lang = (resolvedParams.lang === 'ar' || resolvedParams.lang === 'fr') ? resolvedParams.lang : 'en';

  return <ProvisionForm lang={lang} />;
}
