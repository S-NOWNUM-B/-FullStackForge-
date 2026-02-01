import { NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/services/firebase';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { 
          error: 'Firebase не настроен. Добавьте валидные credentials в .env.local',
          categories: [],
          technologies: []
        },
        { status: 503 }
      );
    }

    const snapshot = await db.collection(COLLECTIONS.PROJECTS).get();
    
    const categories = new Set<string>();
    const technologies = new Set<string>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
      if (data.technologies && Array.isArray(data.technologies)) {
        data.technologies.forEach((tech: string) => technologies.add(tech));
      }
    });

    return NextResponse.json({
      success: true,
      categories: Array.from(categories).sort(),
      technologies: Array.from(technologies).sort(),
    });
  } catch (error) {
    console.error('Ошибка при получении фильтров:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
