import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const authConfig = {
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
};