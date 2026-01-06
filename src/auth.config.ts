import type { NextAuthConfig } from 'next-auth';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/admin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }
      
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.role = token.role as 'admin';
      }
      return session;
    },
  },
  providers: [], // Providers are defined in auth.ts for Node.js runtime
} satisfies NextAuthConfig;