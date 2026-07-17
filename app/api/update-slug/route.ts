import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const clubs = await prisma.club.findMany();
    const targetClub = clubs.find(c => 
      c.name.includes("فاسي") || 
      c.id.startsWith("8582c6ce")
    );

    if (targetClub) {
      const updated = await prisma.club.update({
        where: { id: targetClub.id },
        data: { slug: "mas" }
      });
      return NextResponse.json({ success: true, updated });
    }
    
    return NextResponse.json({ success: false, message: "Club not found", clubs: clubs.map(c => ({id: c.id, name: c.name, slug: c.slug})) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
