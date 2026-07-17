import type { NextConfig } from "next";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Bootstrap Prisma Client before compilation to prevent import resolution failures
try {
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

  console.log("🔄 Generating Prisma client synchronously from next.config.ts...");
  const stdout = execSync("npx prisma db push --accept-data-loss", { env: customEnv });
  console.log("✅ Prisma sync stdout:", stdout.toString());
} catch (e: any) {
  console.error("❌ Prisma sync failed during next.config.ts load:", e.message);
  if (e.stdout) console.log("Prisma sync stdout:", e.stdout.toString());
  if (e.stderr) console.error("Prisma sync stderr:", e.stderr.toString());
}

const nextConfig: any = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/portal/:slug*',
        destination: '/clubs/:slug*',
        permanent: true,
      },
      {
        source: '/club/:slug*',
        destination: '/clubs/:slug*',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;