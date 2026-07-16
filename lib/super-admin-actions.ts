"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createSuperAdminClub(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    let slug = data.name.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug exists, append random suffix if needed
    const existing = await prisma.club.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const club = await prisma.$transaction(async (tx) => {
      // 1. Create the associated CLUB_ADMIN user first
      const createdUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: "CLUB_ADMIN",
        }
      });

      // 2. Create the club linked to this user
      const createdClub = await tx.club.create({
        data: {
          name: data.name,
          slug,
          city: "Unknown", // Default city
          status: "ACTIVE",
          adminId: createdUser.id,
        } as any
      });

      return createdClub;
    });

    revalidatePath('/admin-gen/clubs');
    revalidatePath('/admin-gen');
    
    return { success: true, data: club };
  } catch (err: any) {
    console.error("Create club error:", err);
    return { success: false, error: err.message || "Failed to create club" };
  }
}

export async function deleteClubAction(clubId: string) {
  try {
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { adminId: true } as any
    }) as any;

    if (club?.adminId) {
      await prisma.user.delete({
        where: { id: club.adminId }
      });
    } else {
      await prisma.club.delete({
        where: { id: clubId }
      });
    }

    revalidatePath('/admin-gen/clubs');
    revalidatePath('/admin-gen');
    return { success: true };
  } catch (err: any) {
    console.error("Delete club error:", err);
    return { success: false, error: err.message || "Failed to delete club" };
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

export async function toggleClubVisibility(clubId: string, currentVisibility: string) {
  try {
    const newVisibility = currentVisibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    const club = await prisma.club.update({
      where: { id: clubId },
      data: { visibility: newVisibility },
    });
    
    revalidatePath('/admin-gen/clubs');
    revalidatePath('/admin-gen');
    return { success: true, data: club };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle visibility" };
  }
}

export async function getPlatformSettings() {
  try {
    const settings = await prisma.platformSetting.upsert({
      where: { id: "global" },
      update: {},
      create: {
        id: "global",
        commissionRate: 0.10,
        stripeLiveMode: false,
        cmiLiveMode: false
      }
    });
    
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
