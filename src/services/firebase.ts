import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Проверка наличия валидных credentials
const hasValidCredentials = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || projectId === "your-project-id") return false;
  if (!clientEmail || clientEmail.includes("your-project-id")) return false;
  if (!privateKey || privateKey.includes("Your-Private-Key-Here")) return false;

  return true;
};

let firestoreInstance: Firestore | null = null;

// Инициализация Firebase Admin SDK только если есть валидные credentials
if (!getApps().length && hasValidCredentials()) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";

    // Очистка приватного ключа от лишних кавычек и обработка переносов строк
    // Это критически важно для корректной работы на Vercel
    privateKey = privateKey.replace(/^['"]|['"]$/g, "").trim();

    // Если ключ содержит буквальные '\n' (две буквы), заменяем на реальный перенос строки
    privateKey = privateKey.replace(/\\n/g, "\n");

    // Гарантируем, что заголовки на своих местах и нет лишних пробелов внутри
    if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
      privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}`;
    }
    if (!privateKey.includes("-----END PRIVATE KEY-----")) {
      privateKey = `${privateKey}\n-----END PRIVATE KEY-----`;
    }

    console.log("[Firebase Admin] Инициализация для проекта:", projectId);
    console.log("[Firebase Admin] Длина ключа:", privateKey.length);
    console.log(
      "[Firebase Admin] Формат корректен (headers):",
      privateKey.startsWith("-----BEGIN PRIVATE KEY-----") &&
        privateKey.trim().endsWith("-----END PRIVATE KEY-----"),
    );

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    firestoreInstance = getFirestore();
    console.log("[Firebase Admin] Успешно инициализировано");
  } catch (error) {
    console.error("[Firebase Admin] Критическая ошибка инициализации:", error);
    if (error instanceof Error) {
      console.error("[Firebase Admin] Сообщение:", error.message);
      console.error("[Firebase Admin] Stack:", error.stack);
    }
  }
} else if (!hasValidCredentials()) {
  console.warn(
    "[Firebase Admin] Credentials не настроены или содержат placeholder-значения.",
  );
}

export const db = firestoreInstance as Firestore;

// Названия коллекций
export const COLLECTIONS = {
  PROJECTS: "projects",
  CONFIG: "config",
  WORK_INFO: "workInfo",
  SOCIAL_LINKS: "socialLinks",
  ADMIN_SETTINGS: "admin_settings",
  TECHNOLOGIES: "technologies",
} as const;
