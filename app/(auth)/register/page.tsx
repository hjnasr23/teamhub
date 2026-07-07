import React from "react";
import RegisterForm from "./RegisterForm";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const lang = (resolvedParams.lang === 'ar' || resolvedParams.lang === 'fr') ? resolvedParams.lang : 'en';

  return <RegisterForm lang={lang} />;
}