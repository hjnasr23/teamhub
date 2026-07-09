import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const password = "P@ssw0rd";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email: "superadmin@teamhub.com" },
      update: {
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
      create: {
        email: "superadmin@teamhub.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        firstName: "Super",
        lastName: "Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Super admin created/updated successfully",
      email: user.email,
      role: user.role,
    });
  } catch (err: any) {
    console.error("Error in create-admin API route:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to create super admin",
      },
      { status: 500 }
    );
  }
}
