"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegisterForm from "./RegisterForm";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const lang = (langParam === 'ar' || langParam === 'fr') ? langParam : 'en';

  return <RegisterForm lang={lang} />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#060b13]" />}>
      <RegisterPageContent />
    </Suspense>
  );
}