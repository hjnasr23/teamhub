import { redirect } from "next/navigation";

/* ════════════════════════════════════════════════════════════════════
 *  Shared Types
 * ════════════════════════════════════════════════════════════════════ */

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to dynamically load server-only modules at runtime/build-time
const getPrisma = async () => {
  if (typeof window === "undefined") {
    const { prisma } = await import("./db");
    return prisma;
  }
  return null;
};

const getCookies = async () => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    return await cookies();
  }
  return null;
};

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
  if (typeof window !== "undefined") {
    // Client-side dynamic fallback using localStorage
    const session = localStorage.getItem("auth_session");
    return session ? JSON.parse(session) : null;
  }

  // Server-side / Build-time: Always return null for static export compatibility.
  // The layout will render the guest state statically, and then hydrate the user session dynamically on the client.
  return null;
}

/* ════════════════════════════════════════════════════════════════════
 *  Login — Supports client-side mock & server-side DB query
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

  if (typeof window !== "undefined") {
    // Client-side authentication mockup for Static HTML Export
    let role = selectedRole || "FAN";
    if (email.includes("admin")) role = "CLUB_ADMIN";
    if (email.includes("super")) role = "SUPER_ADMIN";

    const mockUser = {
      userId: "mock-user-id",
      role,
      email,
      firstName: email.split("@")[0],
      lastName: "Member",
    };

    localStorage.setItem("auth_session", JSON.stringify(mockUser));
    
    // Also set a mock cookie for middleware/analytics if needed
    document.cookie = `auth_session=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=86400`;

    return { success: true, data: { role } };
  }

  // Server-side / Build-time
  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "No account found with that email address." };
    }

    if (user.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    if (selectedRole && user.role !== selectedRole) {
      return {
        success: false,
        error: `This account is registered as a ${user.role === "CLUB_ADMIN" ? "Club Admin" : "Supporter"}, not a ${selectedRole === "CLUB_ADMIN" ? "Club Admin" : "Supporter"}.`,
      };
    }

    const cookieStore = await getCookies();
    if (cookieStore) {
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
          maxAge: 60 * 60 * 24,
          path: "/",
        }
      );
    }

    return { success: true, data: { role: user.role } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/* ════════════════════════════════════════════════════════════════════
 *  Logout — Destroys session
 * ════════════════════════════════════════════════════════════════════ */

export async function logoutAction(): Promise<never> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session");
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
    // Next.js redirect needs to return never, so we loop/wait or throw dummy error
    throw new Error("Redirecting...");
  }

  const cookieStore = await getCookies();
  if (cookieStore) {
    cookieStore.delete("auth_session");
  }
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

  if (typeof window !== "undefined") {
    const updatedSession = {
      ...session,
      firstName,
      lastName,
      email,
    };
    localStorage.setItem("auth_session", JSON.stringify(updatedSession));
    document.cookie = `auth_session=${encodeURIComponent(JSON.stringify(updatedSession))}; path=/; max-age=86400`;
    return { success: true, data: { firstName, lastName, email } };
  }

  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { firstName, lastName, email },
    });

    const cookieStore = await getCookies();
    if (cookieStore) {
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
    }

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

  if (typeof window !== "undefined") {
    // Client-side mock data for Static Export Mode
    return {
      success: true,
      data: {
        user: {
          firstName: session.firstName || "Supporter",
          lastName: session.lastName || "Fan",
          email: session.email,
        },
        subscriptions: [
          {
            id: "sub-1",
            status: "ACTIVE",
            clubName: "Real Madrid",
            clubColor: "#3b82f6",
            createdAt: new Date(),
          },
          {
            id: "sub-2",
            status: "ACTIVE",
            clubName: "Raja Casablanca",
            clubColor: "#10b981",
            createdAt: new Date(Date.now() - 86400000 * 30),
          }
        ],
        activities: [
          {
            id: 1,
            action: "Renewed Real Madrid VIP membership",
            time: new Date().toLocaleDateString(),
            iconType: "shield",
            iconColor: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
          }
        ]
      }
    };
  }

  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

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

  if (typeof window !== "undefined") {
    return { success: true, data: { clubId: "mock-new-club-id" } };
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
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

    const existingClub = await prisma.club.findUnique({ where: { slug: clubSlug } });
    if (existingClub) {
      return { success: false, error: "A club with this URL slug already exists." };
    }

    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return { success: false, error: "A user with this admin email already exists." };
    }

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
          password: adminPassword,
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

  if (typeof window !== "undefined") {
    // Client-side mock register
    const mockUser = {
      userId: "mock-user-id",
      role,
      email,
      firstName: fullName.split(" ")[0],
      lastName: fullName.split(" ").slice(1).join(" ") || "Member",
    };
    localStorage.setItem("auth_session", JSON.stringify(mockUser));
    document.cookie = `auth_session=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=86400`;
    return { success: true, data: { role } };
  }

  const [firstName, ...lastNames] = fullName.split(" ");
  const lastName = lastNames.join(" ") || " ";

  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

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

  if (typeof window !== "undefined") {
    // Client-side dynamic mock fallback
    return {
      success: true,
      data: {
        club: {
          id: "mock-club-id",
          name: "Real Madrid Casablanca",
          primaryColor: "#1e3a8a",
          secondaryColor: "#10b981",
          logoInitials: "RMC",
          description: "Official dynamic fan portal for the Moroccan branch of Real Madrid supporters.",
          logoUrl: null,
          bannerUrl: null,
        },
        activeMembers: 14245,
        allFansCount: 15000,
        recentPosts: [
          {
            id: "post-1",
            title: "Behind the Scenes: Pre-season Training in Ifrane",
            createdAt: new Date(),
            mediaUrl: null,
            mediaType: null,
          },
          {
            id: "post-2",
            title: "Tactical Analysis: Raja Match Highlights",
            createdAt: new Date(Date.now() - 86400000),
            mediaUrl: null,
            mediaType: null,
          }
        ]
      }
    };
  }

  try {
    const prisma = await getPrisma();
    if (!prisma) return { success: false, error: "Database not available." };

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
          logoInitials: club.logoInitials,
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
