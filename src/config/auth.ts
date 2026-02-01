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
          console.log('[auth] Пароль не предоставлен');
          return null;
        }

        // Получаем хешированный пароль из переменных окружения
        const rawHash = process.env.ADMIN_PASSWORD_HASH;
        const hashedPassword = rawHash
          ? rawHash.replace(/\\\$/g, '$').replace(/\$\$/g, '$')
          : undefined;
        
        if (!hashedPassword) {
          console.error('❌ ADMIN_PASSWORD_HASH не установлен в переменных окружения');
          return null;
        }

        // Проверяем формат bcrypt хеша (должен начинаться с $2a$, $2b$ или $2y$)
        const isBcryptHash = /^\$2[aby]\$\d{2}\$.{53}$/.test(hashedPassword);
        
        if (!isBcryptHash) {
          console.error('❌ ADMIN_PASSWORD_HASH не является валидным bcrypt хешем!');
          console.error('❌ Хеш должен начинаться с $2a$, $2b$ или $2y$');
          console.error('❌ Сгенерируйте хеш командой: node -e "const bcrypt = require(\'bcrypt\'); bcrypt.hash(\'ваш_пароль\', 10).then(console.log)"');
          console.error(`❌ Текущее значение начинается с: ${hashedPassword.substring(0, 10)}...`);
          return null;
        }

        try {
          // Сравниваем введенный пароль с хешем
          const isValid = await bcrypt.compare(
            credentials.password as string,
            hashedPassword
          );

          if (isValid) {
            console.log('✅ Аутентификация успешна');
            return {
              id: 'admin',
              role: 'admin',
            };
          }
          
          console.log('[auth] Неверный пароль');
          return null;
        } catch (error) {
          console.error('❌ Ошибка при проверке пароля:', error);
          if (error instanceof Error) {
            console.error('❌ Детали ошибки:', error.message);
          }
          return null;
        }
      },
    }),
  ],
});
