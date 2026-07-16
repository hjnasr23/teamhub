"use server";

import fs from "fs/promises";
import path from "path";
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

    const logoFile = formData.get("logoFile") as File | null;
    const coverFile = formData.get("coverFile") as File | null;
    const primaryColor = formData.get("primaryColor") as string | null;
    const secondaryColor = formData.get("secondaryColor") as string | null;
    const description = formData.get("description") as string | null;
    const city = formData.get("city") as string | null;
    const textLogoUrl = formData.get("logoUrl") as string | null;

    let logoUrl = textLogoUrl || club.logoUrl;
    let bannerUrl = club.bannerUrl;

    if (logoFile && logoFile.size > 0 && logoFile.name !== "undefined") {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = logoFile.name || "";
      const fileExtension = fileName.split(".").pop() || "png";
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      
      logoUrl = `/uploads/logos/${filename}`;
    }

    if (coverFile && coverFile.size > 0 && coverFile.name !== "undefined") {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads", "covers");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = coverFile.name || "";
      const fileExtension = fileName.split(".").pop() || "png";
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      
      bannerUrl = `/uploads/covers/${filename}`;
    }

    const updated = await prisma.club.update({
      where: { slug },
      data: {
        logoUrl: logoUrl !== null && logoUrl !== undefined ? logoUrl : undefined,
        bannerUrl: bannerUrl !== null && bannerUrl !== undefined ? bannerUrl : undefined,
        primaryColor: primaryColor !== null && primaryColor !== undefined ? primaryColor : undefined,
        secondaryColor: secondaryColor !== null && secondaryColor !== undefined ? secondaryColor : undefined,
        description: description !== null && description !== undefined ? description : undefined,
        city: city !== null && city !== undefined ? city : undefined,
      },
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
