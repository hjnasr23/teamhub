import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Starting DB Push and Prisma client regeneration...");
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss");
    console.log("DB Push stdout:", stdout);
    console.log("DB Push stderr:", stderr);

    return NextResponse.json({
      success: true,
      stdout,
      stderr,
    });
  } catch (err: any) {
    console.error("Migration/generate failed:", err);
    return NextResponse.json({
      success: false,
      error: err.message,
      stdout: err.stdout,
      stderr: err.stderr,
    });
  }
}
