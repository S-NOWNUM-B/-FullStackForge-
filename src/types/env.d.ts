// TypeScript типы для environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    ADMIN_PASSWORD_HASH: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // NextAuth
    AUTH_SECRET: string;
    NEXTAUTH_URL?: string;
    
    // Application URLs
    NEXT_PUBLIC_BASE_URL?: string;
    
    // Cron Jobs
    CRON_SECRET?: string;
    
    // Email (Resend рекомендуется)
    RESEND_API_KEY?: string;
    
    // SMTP Configuration (fallback, если нет Resend)
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
    
    // UploadThing
    UPLOADTHING_SECRET?: string;
    UPLOADTHING_APP_ID?: string;
  }
}
