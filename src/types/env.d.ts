// TypeScript типы для environment variables

declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    ADMIN_PASSWORD?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
