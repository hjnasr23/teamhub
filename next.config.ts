import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Hna khalli ghir l-config l-asliya dyalk (b7al images unoptimized ila kanti dayrha) */
  images: {
    unoptimized: true,
  }
};

export default nextConfig;