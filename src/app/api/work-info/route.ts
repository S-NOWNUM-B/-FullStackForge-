import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/services/firebase';
import type { WorkInfo as WorkInfoType } from '@/types/api';

// GET - Получить информацию о работе
export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен' },
        { status: 503 }
      );
    }
    
    const snapshot = await db.collection(COLLECTIONS.WORK_INFO).limit(1).get();
    
    let data: WorkInfoType;
    
    if (snapshot.empty) {
      // Создаем с дефолтными значениями
      const defaultData = {
        headline: 'Работаю над проектами, которые меняют мир',
        subheadline: 'Создаю современные веб-приложения с фокусом на UX и производительность',
        description: 'Разрабатываю полнофункциональные веб-приложения используя современные технологии.',
        email: 'contact@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const docRef = await db.collection(COLLECTIONS.WORK_INFO).add(defaultData);
      data = { _id: docRef.id, ...defaultData } as WorkInfoType;
    } else {
      const doc = snapshot.docs[0];
      data = { _id: doc.id, ...doc.data() } as WorkInfoType;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Ошибка при получении WorkInfo:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить информацию' },
      { status: 500 }
    );
  }
}

// PUT - Обновить информацию о работе (защищено middleware)
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
    
    const snapshot = await db.collection(COLLECTIONS.WORK_INFO).limit(1).get();
    
    let docId: string;
    
    if (snapshot.empty) {
      // Создаем новый документ
      updateData.createdAt = new Date().toISOString();
      const docRef = await db.collection(COLLECTIONS.WORK_INFO).add(updateData);
      docId = docRef.id;
    } else {
      // Обновляем существующий
      docId = snapshot.docs[0].id;
      await db.collection(COLLECTIONS.WORK_INFO).doc(docId).update(updateData);
    }
    
    const updatedDoc = await db.collection(COLLECTIONS.WORK_INFO).doc(docId).get();
    const docData = updatedDoc.data();

    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...docData },
      message: 'Информация успешно обновлена',
    });
  } catch (error) {
    console.error('Ошибка при обновлении WorkInfo:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось обновить информацию' },
      { status: 500 }
    );
  }
}
