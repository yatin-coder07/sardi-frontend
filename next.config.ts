import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
    ignoreBuildErrors: true, // ⚠️ ignores TS errors during build
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // ✅ IMPORTANT
          },
        ],
      },
    ];
  },
};

export default nextConfig;
