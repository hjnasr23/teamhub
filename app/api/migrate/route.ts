import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Starting DB Push and Prisma client regeneration...");
    
    // Read and parse .env from disk to override cached parent process.env values
    const envPath = path.join(process.cwd(), ".env");
    const customEnv: any = { ...process.env };
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach((line) => {
        const cleanLine = line.trim();
        if (!cleanLine || cleanLine.startsWith("#")) return;
        const match = cleanLine.match(/^([\w.-]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1];
          let value = match[2];
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          customEnv[key] = value.trim();
        }
      });
    }

    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss", {
      env: customEnv,
    });
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
