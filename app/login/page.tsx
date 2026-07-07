import React from "react";
import LoginForm from "./LoginForm";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const lang = (resolvedParams.lang === 'ar' || resolvedParams.lang === 'fr') ? resolvedParams.lang : 'en';

  return <LoginForm lang={lang} />;
}