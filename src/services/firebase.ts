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
    // Это важно для корректной работы на Vercel
    privateKey = privateKey.replace(/^['"]|['"]$/g, "").trim(); // Удаляем кавычки в начале и конце
    privateKey = privateKey.replace(/\\n/g, "\n"); // Заменяем экранированные переносы строк

    console.log("[Firebase Admin] Инициализация для проекта:", projectId);
    console.log("[Firebase Admin] Длина ключа:", privateKey.length);
    console.log("[Firebase Admin] Email:", clientEmail);
    console.log(
      "[Firebase Admin] Формат корректен:",
      privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
        privateKey.includes("-----END PRIVATE KEY-----"),
    );

    // Проверка на наличие "ядра" ключа (между заголовками)
    const keyBody = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .trim();
    console.log(
      "[Firebase Admin] Тело ключа присутствует и имеет длину:",
      keyBody.length,
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
} as const;
