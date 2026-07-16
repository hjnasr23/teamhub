import type { NextConfig } from "next";
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