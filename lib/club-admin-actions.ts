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

export async function uploadClubLogoAction(slug: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "CLUB_ADMIN") {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const club = await prisma.club.findUnique({
      where: { slug }
    });

    if (!club || session.clubId !== club.id) {
      return { success: false, error: "Unauthorized club access." };
    }

    const primaryColor = formData.get("primaryColor") as string | null;
    const secondaryColor = formData.get("secondaryColor") as string | null;
    const description = formData.get("description") as string | null;
    const city = formData.get("city") as string | null;
    const country = formData.get("country") as string | null;
    const visibility = formData.get("visibility") as string | null;
    
    // Hosted URLs from frontend
    const textLogoUrl = formData.get("logoUrl") as string | null;
    const textBannerUrl = formData.get("bannerUrl") as string | null;

    let logoUrl = textLogoUrl || club.logoUrl;
    let bannerUrl = textBannerUrl || club.bannerUrl;

    const updateData: any = {};
    if (logoUrl !== null && logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (bannerUrl !== null && bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (primaryColor !== null && primaryColor !== undefined) updateData.primaryColor = primaryColor;
    if (secondaryColor !== null && secondaryColor !== undefined) updateData.secondaryColor = secondaryColor;
    if (description !== null && description !== undefined) updateData.description = description;
    if (city !== null && city !== undefined) updateData.city = city;
    if (country !== null && country !== undefined) updateData.country = country;
    if (visibility !== null && visibility !== undefined) updateData.visibility = visibility;

    const updated = await prisma.club.update({
      where: { slug },
      data: updateData,
    });

    revalidatePath(`/admin/${slug}`);
    revalidatePath(`/admin/${slug}/settings`);
    revalidatePath(`/clubs/${slug}`);
    revalidatePath("/", "layout");

    return { 
      success: true, 
      logoUrl: updated.logoUrl, 
      bannerUrl: updated.bannerUrl 
    };
  } catch (err: any) {
    console.error("uploadClubLogoAction error:", err);
    return { success: false, error: err.message || "Failed to update branding settings." };
  }
}

export async function cancelSubscriptionAction(subId: string) {
  try {
    const sub = await prisma.subscription.update({
      where: { id: subId },
      data: { status: "CANCELLED" },
      include: { club: true }
    });

    revalidatePath(`/admin/${sub.club.slug}/members`);
    revalidatePath(`/clubs/${sub.club.slug}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to cancel subscription" };
  }
}

export async function suspendFanAction(subId: string) {
  try {
    const sub = await prisma.subscription.update({
      where: { id: subId },
      data: { status: "SUSPENDED" },
      include: { club: true }
    });

    revalidatePath(`/admin/${sub.club.slug}/members`);
    revalidatePath(`/clubs/${sub.club.slug}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to suspend fan" };
  }
}

export async function updateClubPostAction(
  clubId: string,
  postId: string,
  data: {
    title: string;
    content: string;
    visibility: "PUBLIC" | "PREMIUM";
  }
) {
  try {
    const session = await verifyClubAdmin(clubId);

    const post = await prisma.post.update({
      where: { id: postId, clubId: session.clubId! },
      data: {
        title: data.title,
        content: data.content,
        visibility: data.visibility,
      },
    });

    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (club) {
      revalidatePath(`/admin/${club.slug}`);
      revalidatePath(`/${club.slug}`);
      revalidatePath(`/clubs/${club.slug}`);
    }

    return { success: true, data: post };
  } catch (err: any) {
    console.error("Update post error:", err);
    return { success: false, error: err.message || "Failed to update post" };
  }
}

export async function deleteClubPostAction(clubId: string, postId: string) {
  try {
    const session = await verifyClubAdmin(clubId);

    await prisma.post.delete({
      where: { id: postId, clubId: session.clubId! },
    });

    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (club) {
      revalidatePath(`/admin/${club.slug}`);
      revalidatePath(`/${club.slug}`);
      revalidatePath(`/clubs/${club.slug}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Delete post error:", err);
    return { success: false, error: err.message || "Failed to delete post" };
  }
}
