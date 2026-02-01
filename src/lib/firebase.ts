import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Инициализация Firebase Admin SDK
if (!getApps().length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Firebase credentials не настроены');
      console.error('Требуется: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    } else {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('Firebase Admin инициализирован');
    }
  } catch (error) {
    console.error('Ошибка инициализации Firebase Admin:', error);
  }
}

export const db = getFirestore();

// Названия коллекций
export const COLLECTIONS = {
  PROJECTS: 'projects',
  CONTACT_MESSAGES: 'contactMessages',
  CONFIG: 'config',
  WORK_INFO: 'workInfo',
  SOCIAL_LINKS: 'socialLinks',
} as const;
