import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/services/firebase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен. Добавьте валидные credentials в .env.local' },
        { status: 503 }
      );
    }

    const { id } = await params;
    
    const docRef = db.collection(COLLECTIONS.PROJECTS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Проект не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: { _id: doc.id, ...doc.data() },
      data: { _id: doc.id, ...doc.data() }, // Для обратной совместимости
    });
  } catch (error) {
    console.error('Ошибка при получении проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен. Добавьте валидные credentials в .env.local' },
        { status: 503 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Убираем _id из body, чтобы не перезаписывать его
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = body;
    
    const docRef = db.collection(COLLECTIONS.PROJECTS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Проект не найден' },
        { status: 404 }
      );
    }

    // Добавляем timestamp обновления
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(dataToUpdate);
    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Ошибка обновления: ${message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен. Добавьте валидные credentials в .env.local' },
        { status: 503 }
      );
    }

    const { id } = await params;
    
    const docRef = db.collection(COLLECTIONS.PROJECTS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: 'Проект не найден' },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Проект успешно удален',
    });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
