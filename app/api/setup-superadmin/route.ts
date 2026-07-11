import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const email = "superadmin@teamhub.ma";
    const password = "P@ssw0rd";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: "Super Admin",
        lastName: "TEAMHUB",
        password: hashedPassword,
        role: "SUPER_ADMIN"
      },
      create: {
        email,
        firstName: "Super Admin",
        lastName: "TEAMHUB",
        password: hashedPassword,
        role: "SUPER_ADMIN"
      }
    });

    console.log("\n==================================================");
    console.log(`✅ SUCCESS: Super Admin user successfully written!`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Name: ${admin.firstName} ${admin.lastName}`);
    console.log(`🛡️  Role: ${admin.role}`);
    console.log(`🆔 ID: ${admin.id}`);
    console.log("==================================================\n");

    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    console.error("❌ Database insertion error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
