// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Убрали output: 'standalone' для Render
    // Standalone нужен только для Docker
};

export default nextConfig;