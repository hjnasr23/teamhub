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
  const selectedRole = formData.get("role") as string;

  if (!email || !password || !selectedRole) {
    return { success: false, error: "All fields are required." };
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

    // Role verification
    if (user.role !== selectedRole) {
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
      where: { userId: user.id },
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

    // Simulated activity log (until a dedicated ActivityLog table is added)
    const activities = [
      {
        id: 1,
        action: `Liked ${subscriptions[0]?.club.name ?? "a club"}'s Locker room post`,
        time: "2 hours ago",
        iconType: "heart" as const,
        iconColor: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-950/20",
      },
      {
        id: 2,
        action: "Commented on Wydad Athletic Club's announcement",
        time: "Yesterday",
        iconType: "message" as const,
        iconColor: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/20",
      },
      {
        id: 3,
        action: `Renewed ${subscriptions[0]?.club.name ?? "a club"} membership`,
        time: "Last week",
        iconType: "shield" as const,
        iconColor: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
      },
    ];

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
