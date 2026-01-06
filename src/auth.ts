import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';

// Получаем secret или генерируем временный с предупреждением
const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  
  if (!secret) {
    console.warn('⚠️  WARNING: AUTH_SECRET is not set!');
    console.warn('⚠️  Please set AUTH_SECRET environment variable on Render.com');
    console.warn('⚠️  Generate one with: openssl rand -base64 32');
    
    // Возвращаем фиксированный fallback (НЕ безопасно для production, но позволит работать)
    return 'CHANGE-THIS-TO-RANDOM-SECRET-IN-PRODUCTION-' + (process.env.MONGODB_URI?.slice(0, 20) || 'fallback');
  }
  
  return secret;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getSecret(),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          return null;
        }

        // Получаем хешированный пароль из переменных окружения
        const hashedPassword = process.env.ADMIN_PASSWORD_HASH;
        
        if (!hashedPassword) {
          console.error('❌ ADMIN_PASSWORD_HASH не установлен в .env');
          return null;
        }

        try {
          // Сравниваем введенный пароль с хешем
          const isValid = await bcrypt.compare(
            credentials.password as string,
            hashedPassword
          );

          if (isValid) {
            return {
              id: 'admin',
              role: 'admin',
            };
          }
          
          return null;
        } catch (error) {
          console.error('Ошибка при проверке пароля:', error);
          return null;
        }
      },
    }),
  ],
});
