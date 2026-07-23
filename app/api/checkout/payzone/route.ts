import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/actions";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session
    const session = await getSession();
    if (!session || session.role !== "FAN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. You must be logged in as a Fan to subscribe." },
        { status: 401 }
      );
    }

    // 2. Parse body parameters
    const body = await request.json();
    const { clubSlug, planId, price } = body;

    if (!clubSlug || !planId || typeof price !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required fields (clubSlug, planId, price)." },
        { status: 400 }
      );
    }

    // 3. Verify club exists
    const club = await prisma.club.findUnique({
      where: { slug: clubSlug },
    });

    if (!club) {
      return NextResponse.json(
        { success: false, error: "Club not found." },
        { status: 404 }
      );
    }

    // 4. Generate transaction redirection URL (Simulated PayZone Moroccan gateway)
    // We pass the parameters in the query string so the simulator page knows the context.
    const redirectUrl = `/clubs/${clubSlug}/checkout/payzone-simulator?planId=${planId}&price=${price}`;

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (err: any) {
    console.error("PayZone checkout error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "An error occurred during checkout initialization." },
      { status: 500 }
    );
  }
}
