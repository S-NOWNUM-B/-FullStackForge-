import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { AdminAuthService } from "@/services/admin-auth.service";

// Получаем secret или генерируем временный с предупреждением
const getSecret = () => {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.warn("⚠️  WARNING: AUTH_SECRET is not set!");
    console.warn(
      "⚠️  Please set AUTH_SECRET environment variable on Render.com",
    );
    console.warn("⚠️  Generate one with: openssl rand -base64 32");

    // Возвращаем фиксированный fallback (НЕ безопасно для production, но позволит работать)
    return (
      "CHANGE-THIS-TO-RANDOM-SECRET-IN-PRODUCTION-" +
      (process.env.NEXTAUTH_SECRET || "fallback-secret-key")
    );
  }

  return secret;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getSecret(),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          console.log("[auth] Пароль не предоставлен");
          return null;
        }

        try {
          // Диагностика (длина пароля)
          console.log(
            `[auth] Проверка пароля. Длина: ${(credentials.password as string)?.length}`,
          );

          // Сравниваем введенный пароль (через сервис, который смотрит в БД или ENV)
          const isValid = await AdminAuthService.verifyPassword(
            credentials.password as string,
          );

          if (isValid) {
            console.log("✅ Аутентификация успешна");
            return {
              id: "admin",
              role: "admin",
            };
          }

          console.log("[auth] Неверный пароль. Сравнение вернуло false.");
          return null;
        } catch (error) {
          console.error("❌ Ошибка при проверке пароля:", error);
          if (error instanceof Error) {
            console.error("❌ Детали ошибки:", error.message);
          }
          return null;
        }
      },
    }),
  ],
});
