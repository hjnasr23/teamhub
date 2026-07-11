import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const clubCount = await prisma.club.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        managedClub: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    return NextResponse.json({
      success: true,
      userCount,
      clubCount,
      users
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
