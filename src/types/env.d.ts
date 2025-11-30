// TypeScript типы для environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    ADMIN_PASSWORD?: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Application URLs
    NEXT_PUBLIC_BASE_URL?: string;
    
    // Cron Jobs
    CRON_SECRET?: string;
    
    // SMTP Configuration (опционально, если не используется Resend)
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
    
    // Resend API (рекомендуется для production на Render)
    RESEND_API_KEY?: string;
  }
}
