import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const dirPath = path.join(process.cwd(), "app/admin");
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      return NextResponse.json({ success: true, message: "Directory deleted" });
    }
    return NextResponse.json({ success: true, message: "Directory not found" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
