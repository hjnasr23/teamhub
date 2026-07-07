"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./db";

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
 *  Login — Queries live Prisma `User` table
 * ════════════════════════════════════════════════════════════════════ */

export async function loginAction(
  formData: FormData
): Promise<ActionResponse<{ role: string }>> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const selectedRole = formData.get("role") as string | null;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "No account found with that email address." };
    }

    // Password verification (plaintext comparison for demo — replace with bcrypt in production)
    if (user.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    // Role verification (only if selectedRole is passed)
    if (selectedRole && user.role !== selectedRole) {
      return {
        success: false,
        error: `This account is registered as a ${user.role === "CLUB_ADMIN" ? "Club Admin" : "Supporter"}, not a ${selectedRole === "CLUB_ADMIN" ? "Club Admin" : "Supporter"}.`,
      };
    }

    // Set secure session cookie
    const cookieStore = await cookies();
    cookieStore.set(
      "auth_session",
      JSON.stringify({
        userId: user.id,
        role: user.role,
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      }
    );

    return { success: true, data: { role: user.role } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Logout — Destroys session cookie
 * ════════════════════════════════════════════════════════════════════ */

export async function logoutAction(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  redirect("/");
}

/* ════════════════════════════════════════════════════════════════════
 *  Update Profile — Persists changes to Prisma `User` table
 * ════════════════════════════════════════════════════════════════════ */

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResponse<{ firstName: string; lastName: string; email: string }>> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized — please log in again." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { firstName, lastName, email },
    });

    // Refresh session cookie with updated details
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
 *  Get Fan Dashboard Data — Queries live Prisma models
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
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized session." };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return { success: false, error: "User not found in database." };
    }

    // Query live Subscription table with Club relation join
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

    // Dynamic activity log based on actual Prisma subscriptions (fallback until a dedicated ActivityLog table is added)
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
 *  Super-Admin Workspace — Create a brand new tenant (Club + Admin User)
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

    // Atomic transaction to generate the new Club and seed its root CLUB_ADMIN user
    const result = await prisma.$transaction(async (tx) => {
      const club = await tx.club.create({
        data: {
          name: clubName,
          slug: clubSlug,
          city: clubCity,
          logoUrl: "", // Optional, to be customized via Dashboard
        }
      });

      await tx.user.create({
        data: {
          email: adminEmail,
          password: adminPassword, // Plaintext for demo, hash in production
          firstName: adminFirstName,
          lastName: adminLastName,
          role: "CLUB_ADMIN",
          clubId: club.id, // Explicitly link Admin to the newly provisioned Club
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
 *  Registration — Handles both FAN and CLUB_ADMIN signup
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

    if (role === "CLUB_ADMIN") {
      if (!clubName) return { success: false, error: "Club Name is required for Club Admins." };
      
      const slug = clubName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || Date.now().toString();
      const existingClub = await prisma.club.findUnique({ where: { slug } });
      if (existingClub) {
        return { success: false, error: "A club with a similar name already exists." };
      }

      await prisma.$transaction(async (tx) => {
        await tx.club.create({
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
            password,
            firstName,
            lastName,
            role: "CLUB_ADMIN",
          }
        });
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          password,
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

