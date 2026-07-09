"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createSuperAdminClub(data: {
  name: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  bannerUrl?: string;
}) {
  try {
    const club = await prisma.club.create({
      data: {
        name: data.name,
        slug: data.slug,
        city: "Unknown", // Default city
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
        ...(data.bannerUrl && { bannerUrl: data.bannerUrl }),
        status: "ACTIVE",
      }
    });

    revalidatePath('/admin-gen/clubs');
    revalidatePath('/admin-gen');
    
    return { success: true, data: club };
  } catch (err: any) {
    console.error("Create club error:", err);
    return { success: false, error: err.message || "Failed to create club" };
  }
}

export async function toggleClubStatus(clubId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const club = await prisma.club.update({
      where: { id: clubId },
      data: { status: newStatus as any },
    });
    
    revalidatePath('/admin-gen/clubs');
    return { success: true, data: club };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle status" };
  }
}

export async function getPlatformSettings() {
  try {
    let settings = await prisma.platformSetting.findUnique({
      where: { id: "global" }
    });
    
    if (!settings) {
      settings = await prisma.platformSetting.create({
        data: {
          id: "global",
          commissionRate: 0.10,
          stripeLiveMode: false,
          cmiLiveMode: false
        }
      });
    }
    
    return settings;
  } catch (err) {
    console.error("Failed to fetch platform settings", err);
    // Return default fallback if schema isn't pushed yet
    return { commissionRate: 0.10, stripeLiveMode: false, cmiLiveMode: false };
  }
}

export async function updatePlatformSettings(data: {
  commissionRate: number;
  stripeLiveMode: boolean;
  cmiLiveMode: boolean;
}) {
  try {
    const updated = await prisma.platformSetting.upsert({
      where: { id: "global" },
      update: {
        commissionRate: data.commissionRate,
        stripeLiveMode: data.stripeLiveMode,
        cmiLiveMode: data.cmiLiveMode,
      },
      create: {
        id: "global",
        commissionRate: data.commissionRate,
        stripeLiveMode: data.stripeLiveMode,
        cmiLiveMode: data.cmiLiveMode,
      }
    });

    revalidatePath('/admin-gen/settings');
    revalidatePath('/admin-gen/financials');
    
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update settings" };
  }
}

export async function releasePayoutAction(payoutId: string) {
  try {
    const payout = await prisma.payoutRequest.update({
      where: { id: payoutId },
      data: { status: "PROCESSING" }
    });
    
    revalidatePath('/admin-gen/financials');
    return { success: true, data: payout };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to release payout" };
  }
}
