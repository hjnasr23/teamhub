"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const lang = (langParam === 'ar' || langParam === 'fr') ? langParam : 'en';

  return <LoginForm lang={lang} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#060b13]" />}>
      <LoginPageContent />
    </Suspense>
  );
}