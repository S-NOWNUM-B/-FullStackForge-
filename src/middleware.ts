import NextAuth from 'next-auth';
import { authConfig } from '@/config/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ['/admin/:path*', '/api/projects/:path*', '/api/config/:path*', '/api/work-info/:path*', '/api/social-links/:path*'],
};
