import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { authConfig } from './auth.config';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
