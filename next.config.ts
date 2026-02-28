// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next",
  output: "standalone",
  // Для Firebase hosting with Cloud Functions поддерживаем динамические routes
};

export default nextConfig;
