// TypeScript типы для environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_PASSWORD_HASH: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // NextAuth
    AUTH_SECRET: string;
    NEXTAUTH_URL?: string;
    
    // Application URLs
    NEXT_PUBLIC_BASE_URL?: string;
    
    // Cron Jobs
    CRON_SECRET?: string;
    
    // UploadThing
    UPLOADTHING_SECRET?: string;
    UPLOADTHING_APP_ID?: string;
  }
}
