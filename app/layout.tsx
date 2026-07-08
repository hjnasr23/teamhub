import { Suspense } from "react";
import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

import { getSession } from "@/lib/actions";
 
import Footer from "@/components/Footer";

 const outfit = Outfit({
   subsets: ["latin"],
   variable: "--font-outfit",
   display: "swap",
 });
 
 const plusJakartaSans = Plus_Jakarta_Sans({
   subsets: ["latin"],
   variable: "--font-jakarta",
   display: "swap",
 });
 
 export const metadata: Metadata = {
   title: "TEAMHUB | Multi-Tenant Sports SaaS Platform",
   description:
     "Empower your sports club to monetize its fanbase via subscriptions, exclusive content, and premium fan engagement portals.",
 };
 
 export default async function RootLayout({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) {
   const session = await getSession();
   const isLoggedIn = !!session;
   const isAdmin = session?.role === "CLUB_ADMIN";
   let adminClubSlug = null;

   if (isAdmin) {
     const { prisma } = await import("@/lib/db");
     const user = await prisma.user.findUnique({
       where: { id: session.userId },
       include: { managedClub: true },
     });
     adminClubSlug = user?.managedClub?.slug || null;
   }

   return (
     <html
       lang="en"
       className={`${outfit.variable} ${plusJakartaSans.variable} h-full antialiased`}
       suppressHydrationWarning
     >
       <body className="min-h-full flex flex-col bg-neutral-bg-alt text-text-dark antialiased selection:bg-primary/20 selection:text-primary">
         <ThemeProvider
           attribute="class"
           defaultTheme="light"
           enableSystem={false}
           disableTransitionOnChange
         >
           <Suspense fallback={<div className="min-h-screen bg-neutral-bg-alt" />}>
             <DashboardLayout isAdmin={isAdmin} isLoggedIn={isLoggedIn} adminClubSlug={adminClubSlug}>
               {children}
               <Footer />
             </DashboardLayout>
           </Suspense>
         </ThemeProvider>
       </body>
     </html>
   );
 }
