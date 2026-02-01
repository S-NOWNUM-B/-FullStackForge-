// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Убрали output: 'export' так как используем API routes
    // Firebase Hosting будет работать с серверным Next.js через Cloud Functions
};

export default nextConfig;