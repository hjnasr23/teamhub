import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { managedClub: true }
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
          role: user.role,
          clubSlug: user.managedClub?.slug ?? null,
          clubId: user.managedClub?.id ?? null,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // When logging in with Google, the Prisma Adapter will have created/linked the user.
        // We ensure firstName, lastName, and default role "FAN" are synchronized in the database.
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });
        
        if (dbUser) {
          const nameParts = user.name?.split(" ") || [];
          const derivedFirstName = nameParts[0] || "";
          const derivedLastName = nameParts.slice(1).join(" ") || "";
          
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              firstName: dbUser.firstName || derivedFirstName,
              lastName: dbUser.lastName || derivedLastName,
              role: dbUser.role || "FAN", // Explicitly assign default role FAN
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      const email = token.email || user?.email;
      if (email) {
        // Always fetch fresh details (with relations) from DB to keep token updated
        const dbUser = await prisma.user.findUnique({
          where: { email },
          include: { managedClub: true }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.userId = dbUser.id;
          token.role = dbUser.role || "FAN";
          token.clubSlug = dbUser.managedClub?.slug || null;
          token.clubId = dbUser.managedClub?.id || null;
          token.firstName = dbUser.firstName || dbUser.name?.split(" ")[0] || "";
          token.lastName = dbUser.lastName || dbUser.name?.split(" ").slice(1).join(" ") || "";
        } else if (user) {
          // Fallback for brand new user registrations via Google
          token.id = user.id;
          token.userId = user.id;
          token.role = (user as any).role || "FAN";
          token.clubSlug = (user as any).clubSlug || null;
          token.clubId = (user as any).clubId || null;
          token.firstName = (user as any).firstName || user.name?.split(" ")[0] || "";
          token.lastName = (user as any).lastName || user.name?.split(" ").slice(1).join(" ") || "";
        }
      }

      // Synchronize the custom cookie during JWT callback (runs on redirect & every validation)
      if (token.email) {
        const cookieStore = await cookies();
        const isFan = token.role === "FAN";
        cookieStore.set(
          "auth_session",
          JSON.stringify({
            userId: token.userId,
            role: token.role,
            email: token.email,
            firstName: token.firstName,
            lastName: token.lastName,
            clubSlug: token.clubSlug,
            clubId: token.clubId,
          }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: isFan ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year for fans, 1 day for admins
            path: "/",
          }
        );
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id || token.userId;
        session.user.role = token.role;
        session.user.clubId = token.clubId;
        session.user.clubSlug = token.clubSlug;
        session.user.userId = token.id || token.userId;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;

        // Write to the custom cookie so server actions/middleware remain perfectly synchronized
        const cookieStore = await cookies();
        const isFan = token.role === "FAN";
        cookieStore.set(
          "auth_session",
          JSON.stringify({
            userId: token.userId,
            role: token.role,
            email: session.user.email,
            firstName: token.firstName,
            lastName: token.lastName,
            clubSlug: token.clubSlug,
            clubId: token.clubId,
          }),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: isFan ? 60 * 60 * 24 * 365 : 60 * 60 * 24, // 1 year for fans, 1 day for admins
            path: "/",
          }
        );
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/` || url.startsWith(`${baseUrl}/?`)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    }
  },
  events: {
    async signOut() {
      // Clear the custom cookie on sign-out
      const cookieStore = await cookies();
      cookieStore.delete("auth_session");
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
