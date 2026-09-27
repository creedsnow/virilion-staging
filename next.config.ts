import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Soft-defer Wisp + Moonmarket from launch path (assets kept for re-enable).
  // Site Map aliases: old app paths → canonical site routes.
  async redirects() {
    return [
      { source: "/wisp", destination: "/", permanent: false },
      { source: "/shop", destination: "/", permanent: false },
      { source: "/enter", destination: "/login", permanent: false },
      { source: "/rite", destination: "/join", permanent: false },
      { source: "/rite/:path*", destination: "/join", permanent: false },
      { source: "/calendar", destination: "/events", permanent: false },
      { source: "/self", destination: "/profile", permanent: false },
      { source: "/inbox", destination: "/whispers", permanent: false },
      { source: "/weave", destination: "/bonds", permanent: false },
      { source: "/safety", destination: "/settings", permanent: false },
    ];
  },
};

export default nextConfig;
