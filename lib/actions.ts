"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

/* ════════════════════════════════════════════════════════════════════
 *  Shared Types
 * ════════════════════════════════════════════════════════════════════ */

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/* ════════════════════════════════════════════════════════════════════
 *  Session Helpers
 * ════════════════════════════════════════════════════════════════════ */

export async function getSession(): Promise<{
  userId: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
} | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session");
  
  if (!sessionCookie) return null;
  
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Login — Secure Backend Authentication
 * ════════════════════════════════════════════════════════════════════ */

export async function loginAction(
  formData: FormData
): Promise<ActionResponse<{ role: string; clubSlug?: string }>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const selectedRole = formData.get("role") as string | null;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    // 1. Query the database using Prisma
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { managedClub: true }
    });

    // 2. Strict generic error if user does not exist
    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    // 3. Use bcryptjs to securely compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password." };
    }

    if (selectedRole && user.role !== selectedRole) {
      return {
        success: false,
        error: `This account is registered as a ${user.role === "CLUB_ADMIN" ? "Club Admin" : "Supporter"}, not a ${selectedRole === "CLUB_ADMIN" ? "Club Admin" : "Supporter"}.`,
      };
    }

    // 4. Issue a secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(
      "auth_session",
      JSON.stringify({
        userId: user.id,
        role: user.role,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        clubSlug: user.managedClub?.slug ?? null,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      }
    );

    return { 
      success: true, 
      data: { 
        role: user.role, 
        clubSlug: user.managedClub?.slug 
      } 
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Logout — Destroys session
 * ════════════════════════════════════════════════════════════════════ */

export async function logoutAction(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/");
}

/* ════════════════════════════════════════════════════════════════════
 *  Update Profile
 * ════════════════════════════════════════════════════════════════════ */

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResponse<{ firstName: string; lastName: string; email: string }>> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized — please log in again." };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { firstName, lastName, email },
    });

    const cookieStore = await cookies();
    cookieStore.set(
      "auth_session",
      JSON.stringify({
        ...session,
        email: updatedUser.email,
        firstName: updatedUser.firstName ?? "",
        lastName: updatedUser.lastName ?? "",
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
      }
    );

    return {
      success: true,
      data: {
        firstName: updatedUser.firstName ?? "",
        lastName: updatedUser.lastName ?? "",
        email: updatedUser.email,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Get Fan Dashboard Data
 * ════════════════════════════════════════════════════════════════════ */

export async function getFanData(): Promise<
  ActionResponse<{
    user: { firstName: string; lastName: string; email: string };
    subscriptions: {
      id: string;
      status: string;
      clubName: string;
      clubColor: string;
      createdAt: Date;
    }[];
    activities: {
      id: number;
      action: string;
      time: string;
      iconType: "heart" | "message" | "shield";
      iconColor: string;
      bg: string;
    }[];
  }>
> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized session." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { fanId: user.id },
      include: { club: true },
      orderBy: { createdAt: "desc" },
    });

    const mappedSubscriptions = subscriptions.map((sub) => ({
      id: sub.id,
      status: sub.status,
      clubName: sub.club.name,
      clubColor: sub.club.primaryColor,
      createdAt: sub.createdAt,
    }));

    const activities = mappedSubscriptions.slice(0, 3).map((sub, idx) => ({
      id: idx + 1,
      action: `Renewed ${sub.clubName} membership tier`,
      time: new Date(sub.createdAt).toLocaleDateString(),
      iconType: "shield" as const,
      iconColor: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    }));

    return {
      success: true,
      data: {
        user: {
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email,
        },
        subscriptions: mappedSubscriptions,
        activities,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch fan data.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Super-Admin Workspace — Create tenant
 * ════════════════════════════════════════════════════════════════════ */

export async function createTenantAction(formData: FormData): Promise<ActionResponse<{ clubId: string }>> {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "403 Forbidden — Super-Admin authorization required." };
  }

  const clubName = formData.get("clubName") as string;
  const clubSlug = formData.get("clubSlug") as string;
  const clubCity = formData.get("clubCity") as string;
  
  const adminEmail = formData.get("adminEmail") as string;
  const adminPassword = formData.get("adminPassword") as string;
  const adminFirstName = formData.get("adminFirstName") as string;
  const adminLastName = formData.get("adminLastName") as string;

  if (!clubName || !clubSlug || !clubCity || !adminEmail || !adminPassword) {
    return { success: false, error: "Missing required fields for tenant creation." };
  }

  try {
    const existingClub = await prisma.club.findUnique({ where: { slug: clubSlug } });
    if (existingClub) {
      return { success: false, error: "A club with this URL slug already exists." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return { success: false, error: "A user with this admin email already exists." };
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      const club = await tx.club.create({
        data: {
          name: clubName,
          slug: clubSlug,
          city: clubCity,
          logoUrl: "",
        }
      });

      await tx.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: adminFirstName,
          lastName: adminLastName,
          role: "CLUB_ADMIN",
          clubId: club.id,
        }
      });

      return { clubId: club.id };
    });

    return { success: true, data: result };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create tenant.";
    return { success: false, error: errorMsg };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Registration
 * ════════════════════════════════════════════════════════════════════ */

export async function registerAction(formData: FormData): Promise<ActionResponse<{ role: string }>> {
  const role = formData.get("role") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const clubName = formData.get("clubName") as string | null;

  if (!fullName || !email || !password || !role) {
    return { success: false, error: "Missing required fields." };
  }

  const [firstName, ...lastNames] = fullName.split(" ");
  const lastName = lastNames.join(" ") || " ";

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email already in use." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "CLUB_ADMIN") {
      if (!clubName) return { success: false, error: "Club Name is required for Club Admins." };
      
      const slug = clubName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || Date.now().toString();
      const existingClub = await prisma.club.findUnique({ where: { slug } });
      if (existingClub) {
        return { success: false, error: "A club with a similar name already exists." };
      }

      await prisma.$transaction(async (tx) => {
        const newClub = await tx.club.create({
          data: {
            name: clubName,
            slug,
            city: "Unknown",
            logoUrl: "",
          }
        });
        await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: "CLUB_ADMIN",
            clubId: newClub.id
          }
        });
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: "FAN",
        }
      });
    }

    return { success: true, data: { role } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Get Club Admin Dashboard Data
 * ════════════════════════════════════════════════════════════════════ */

export async function getClubAdminData(): Promise<
  ActionResponse<{
    club: {
      id: string;
      name: string;
      primaryColor: string;
      secondaryColor: string;
      logoInitials: string;
      description: string | null;
      logoUrl: string | null;
      bannerUrl: string | null;
    };
    activeMembers: number;
    allFansCount: number;
    recentPosts: {
      id: string;
      title: string;
      createdAt: Date;
      mediaUrl: string | null;
      mediaType: string | null;
    }[];
  }>
> {
  const session = await getSession();
  if (!session || session.role !== "CLUB_ADMIN") {
    return { success: false, error: "Unauthorized — Club Admin access required." };
  }

  try {
    const adminUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { managedClub: true }
    });

    if (!adminUser?.managedClub) {
      return { success: false, error: "No club managed by this admin." };
    }

    const club = adminUser.managedClub;

    const [activeMembers, allFansCount, recentPosts] = await Promise.all([
      prisma.subscription.count({ where: { clubId: club.id, status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'FAN' } }),
      prisma.post.findMany({ 
        where: { clubId: club.id }, 
        select: { id: true, title: true, createdAt: true, mediaUrl: true, mediaType: true },
        orderBy: { createdAt: 'desc' }, 
        take: 5 
      })
    ]);

    return {
      success: true,
      data: {
        club: {
          id: club.id,
          name: club.name,
          primaryColor: club.primaryColor,
          secondaryColor: club.secondaryColor,
          logoInitials: club.name.substring(0, 2).toUpperCase(),
          description: club.description,
          logoUrl: club.logoUrl,
          bannerUrl: club.bannerUrl,
        },
        activeMembers,
        allFansCount,
        recentPosts,
      }
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch club admin data.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Cancel Subscription
 * ════════════════════════════════════════════════════════════════════ */

export async function cancelSubscriptionAction(formData: FormData): Promise<ActionResponse<boolean>> {
  const subscriptionId = formData.get("subscriptionId") as string;
  const session = await getSession();

  if (!session || session.role !== "FAN") {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const existing = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existing || existing.fanId !== session.userId) {
      return { success: false, error: "Subscription not found or unauthorized." };
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "CANCELLED" },
    });

    return { success: true, data: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to cancel subscription.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Get Landing Page Statistics (Dynamic Database Counts)
 * ════════════════════════════════════════════════════════════════════ */

export async function getLandingPageStats(): Promise<ActionResponse<{
  clubs: number;
  supporters: number;
  posts: number;
  revenue: number;
}>> {
  try {
    const clubsCount = await prisma.club.count();
    
    // Sum the subscribersCount of all clubs to represent total registered supporters
    const sumAggregate = await prisma.club.aggregate({
      _sum: {
        subscribersCount: true
      }
    });
    const supportersCount = sumAggregate._sum.subscribersCount || 0;
    
    // Total posts in the system
    const postsCount = await prisma.post.count();
    
    // Average Club Revenue: (Active subscriptions * 50 MAD) / clubsCount
    const activeSubsCount = await prisma.subscription.count({
      where: { status: "ACTIVE" }
    });
    const totalRevenue = activeSubsCount * 50;
    const avgRevenue = clubsCount > 0 ? Math.round(totalRevenue / clubsCount) : 0;

    return {
      success: true,
      data: {
        clubs: clubsCount,
        supporters: supportersCount,
        posts: postsCount,
        revenue: avgRevenue
      }
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch landing page stats.";
    return { success: false, error: message };
  }
}

