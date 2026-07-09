import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = "superadmin@teamhub.ma";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "SUPER_ADMIN"
    },
    create: {
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      firstName: "Super",
      lastName: "Admin"
    }
  });

  return NextResponse.json({ success: true, admin });
}
