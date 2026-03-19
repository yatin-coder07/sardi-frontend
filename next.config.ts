import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    ignoreBuildErrors: true, // ⚠️ ignores TS errors during build
  },
};

export default nextConfig;
