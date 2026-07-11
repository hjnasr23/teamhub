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
      where: { email: "superadmin@teamhub.ma" },
      update: {
        password: hashedPassword,
        role: "SUPER_ADMIN",
        firstName: "Super Admin",
        lastName: "TEAMHUB",
      },
      create: {
        email: "superadmin@teamhub.ma",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        firstName: "Super Admin",
        lastName: "TEAMHUB",
      },
    });

    console.log("\n==================================================");
    console.log(`✅ SUCCESS: Super Admin user successfully written!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.firstName} ${user.lastName}`);
    console.log(`🛡️  Role: ${user.role}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log("==================================================\n");

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
