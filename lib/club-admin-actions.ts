"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/actions";
import { revalidatePath } from "next/cache";

// Helper to verify that the logged in user is actually an admin of the specified club
async function verifyClubAdmin(clubId: string) {
  const session = await getSession();
  if (!session || session.role !== "CLUB_ADMIN" || session.clubId !== clubId) {
    throw new Error("Unauthorized — Club Admin authorization required.");
  }
  return session;
}

export async function createClubPostAction(
  clubId: string,
  data: {
    title: string;
    content: string;
    visibility: "PUBLIC" | "PREMIUM";
    mediaType?: string;
    mediaUrl?: string;
  }
) {
  try {
    const session = await verifyClubAdmin(clubId);

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        visibility: data.visibility,
        mediaType: data.mediaType || "text",
        mediaUrl: data.mediaUrl || null,
        clubId: session.clubId!,
      },
    });

    // Revalidate club admin dashboard & public fan clubhouse portal
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (club) {
      revalidatePath(`/admin/${club.slug}`);
      revalidatePath(`/${club.slug}`);
    }

    return { success: true, data: post };
  } catch (err: any) {
    console.error("Create post error:", err);
    return { success: false, error: err.message || "Failed to publish post" };
  }
}

export async function updateClubBrandingAction(
  clubId: string,
  data: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    bannerUrl?: string;
    description?: string;
  }
) {
  try {
    const session = await verifyClubAdmin(clubId);

    const club = await prisma.club.update({
      where: { id: session.clubId! },
      data: {
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
        ...(data.bannerUrl && { bannerUrl: data.bannerUrl }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    revalidatePath(`/admin/${club.slug}`);
    revalidatePath(`/admin/${club.slug}/settings`);
    revalidatePath(`/${club.slug}`);

    return { success: true, data: club };
  } catch (err: any) {
    console.error("Update branding error:", err);
    return { success: false, error: err.message || "Failed to update visual branding settings" };
  }
}

export async function requestPayoutAction(clubId: string, amount: number) {
  try {
    const session = await verifyClubAdmin(clubId);

    if (amount <= 0) {
      return { success: false, error: "Withdrawal amount must be greater than 0 MAD." };
    }

    // Double check active subscription balance to ensure available funds
    const activeSubscribers = await prisma.subscription.findMany({
      where: { clubId: session.clubId!, status: "ACTIVE" }
    });
    
    const grossRevenue = activeSubscribers.reduce((sum, s) => sum + s.amount, 0);
    const platformCut = grossRevenue * 0.10;
    const availableBalance = grossRevenue - platformCut;

    // Get aggregate of approved payout requests
    const payouts = await prisma.payoutRequest.findMany({
      where: { clubId: session.clubId! }
    });
    
    const withdrawnAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = availableBalance - withdrawnAmount;

    if (amount > remainingBalance) {
      return { 
        success: false, 
        error: `Insufficient balance. Available remaining withdrawal amount is ${remainingBalance.toLocaleString()} MAD.` 
      };
    }

    const payoutRequest = await prisma.payoutRequest.create({
      data: {
        amount,
        status: "PENDING",
        clubId: session.clubId!
      }
    });

    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (club) {
      revalidatePath(`/admin/${club.slug}`);
    }

    return { success: true, data: payoutRequest };
  } catch (err: any) {
    console.error("Request payout error:", err);
    return { success: false, error: err.message || "Failed to register payout request" };
  }
}
