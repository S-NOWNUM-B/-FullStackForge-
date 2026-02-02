import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Проверка наличия валидных credentials
const hasValidCredentials = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Проверяем что credentials не являются placeholder-значениями
  if (!projectId || projectId === 'your-project-id') return false;
  if (!clientEmail || clientEmail.includes('your-project-id')) return false;
  if (!privateKey || privateKey.includes('Your-Private-Key-Here')) return false;

  return true;
};

let firestoreInstance: Firestore | null = null;

// Инициализация Firebase Admin SDK только если есть валидные credentials
if (!getApps().length && hasValidCredentials()) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  try {
    initializeApp({
      credential: cert({
        projectId: projectId!,
        clientEmail: clientEmail!,
        privateKey: privateKey!,
      }),
    });
    firestoreInstance = getFirestore();
    console.log('Firebase Admin инициализирован');
  } catch (error) {
    console.error('Ошибка инициализации Firebase Admin:', error);
    // Не выбрасываем ошибку, чтобы не крашить сервер
    firestoreInstance = null;
  }
} else if (!hasValidCredentials()) {
  console.warn('Firebase credentials не настроены. API routes будут возвращать заглушки.');
  console.warn('Добавьте валидные credentials в переменные окружения для работы с Firestore.');
}

export const db = firestoreInstance as Firestore;

// Названия коллекций
export const COLLECTIONS = {
  PROJECTS: 'projects',
  CONFIG: 'config',
  WORK_INFO: 'workInfo',
  SOCIAL_LINKS: 'socialLinks',
} as const;
