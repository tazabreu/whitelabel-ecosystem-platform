import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: "standalone",

  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_WEB_BFF_URL: process.env.NEXT_PUBLIC_WEB_BFF_URL || "http://localhost:8080",
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;

