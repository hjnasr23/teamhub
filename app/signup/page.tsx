"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RegisterForm from "../(auth)/register/RegisterForm";

function SignupPageContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const lang = (langParam === 'ar' || langParam === 'fr') ? langParam : 'en';

  return <RegisterForm lang={lang} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#060b13]" />}>
      <SignupPageContent />
    </Suspense>
  );
}
