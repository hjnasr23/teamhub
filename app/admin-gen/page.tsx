"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "@/lib/actions";
import ProvisionForm from "./ProvisionForm";

function SuperAdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const langParam = searchParams.get("lang");
  const lang = (langParam === 'ar' || langParam === 'fr') ? langParam : 'en';

  useEffect(() => {
    async function checkAuth() {
      const session = await getSession();
      if (!session || session.role !== "SUPER_ADMIN") {
        router.push(`/login?lang=${lang}`);
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    }
    checkAuth();
  }, [router, lang]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060b13] text-gray-500">
        Loading...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <ProvisionForm lang={lang} />;
}

export default function SuperAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#060b13]" />}>
      <SuperAdminPageContent />
    </Suspense>
  );
}
