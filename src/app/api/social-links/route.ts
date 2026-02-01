import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/lib/firebase';
import type { SocialLinks as SocialLinksType } from '@/types/api';

// GET - Получить соц-сети
export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен' },
        { status: 503 }
      );
    }
    
    const snapshot = await db.collection(COLLECTIONS.SOCIAL_LINKS).limit(1).get();
    
    let data: SocialLinksType;
    
    if (snapshot.empty) {
      // Создаем с дефолтными значениями
      const defaultData = {
        links: [],
        showOnHeader: true,
        showOnFooter: true,
        showOnWorkPage: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const docRef = await db.collection(COLLECTIONS.SOCIAL_LINKS).add(defaultData);
      data = { _id: docRef.id, ...defaultData };
    } else {
      const doc = snapshot.docs[0];
      data = { _id: doc.id, ...doc.data() } as SocialLinksType;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Ошибка при получении SocialLinks:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить соц-сети' },
      { status: 500 }
    );
  }
}

// PUT - Обновить соц-сети (защищено middleware)
export async function PUT(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен' },
        { status: 503 }
      );
    }
    
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    updateData.updatedAt = new Date().toISOString();
    
    const snapshot = await db.collection(COLLECTIONS.SOCIAL_LINKS).limit(1).get();
    
    let docId: string;
    
    if (snapshot.empty) {
      // Создаем новый документ
      updateData.createdAt = new Date().toISOString();
      const docRef = await db.collection(COLLECTIONS.SOCIAL_LINKS).add(updateData);
      docId = docRef.id;
    } else {
      // Обновляем существующий
      docId = snapshot.docs[0].id;
      await db.collection(COLLECTIONS.SOCIAL_LINKS).doc(docId).update(updateData);
    }
    
    const updatedDoc = await db.collection(COLLECTIONS.SOCIAL_LINKS).doc(docId).get();
    const docData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...docData },
      message: 'Соц-сети успешно обновлены',
    });
  } catch (error) {
    console.error('Ошибка при обновлении SocialLinks:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось обновить соц-сети' },
      { status: 500 }
    );
  }
}
