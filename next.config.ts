import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Soft-defer Wisp + Moonmarket from launch path (assets kept for re-enable).
  async redirects() {
    return [
      { source: "/wisp", destination: "/", permanent: false },
      { source: "/shop", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
