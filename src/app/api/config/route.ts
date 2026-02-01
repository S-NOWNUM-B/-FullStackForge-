import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/services/firebase';
import { ConfigKey } from '@/types/api';

/**
 * GET /api/config?key=home|about|contact
 * Получить конфигурацию страницы по ключу
 * Или получить все конфигурации, если ключ не указан
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') as ConfigKey | null;

    if (key) {
      const snapshot = await db.collection(COLLECTIONS.CONFIG)
        .where('key', '==', key)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return NextResponse.json(
          {
            success: false,
            error: `Конфигурация для ключа "${key}" не найдена`,
          },
          { status: 404 }
        );
      }

      const doc = snapshot.docs[0];
      return NextResponse.json({
        success: true,
        data: { _id: doc.id, ...doc.data() },
      });
    } else {
      // Получить все конфигурации
      const snapshot = await db.collection(COLLECTIONS.CONFIG).get();
      const configs = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
      }));
      
      return NextResponse.json({
        success: true,
        data: configs,
        count: configs.length,
      });
    }
  } catch (error: unknown) {
    console.error('Ошибка при получении конфигурации:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка сервера при получении конфигурации',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/config
 * Создать или обновить конфигурацию страницы
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, title, subtitle, content } = body;

    // Валидация
    if (!key || !title || !subtitle || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Все поля (key, title, subtitle, content) обязательны',
        },
        { status: 400 }
      );
    }

    if (!['home', 'about', 'contact'].includes(key)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ключ должен быть одним из: home, about, contact',
        },
        { status: 400 }
      );
    }

    // Проверяем, существует ли конфигурация с таким ключом
    const snapshot = await db.collection(COLLECTIONS.CONFIG)
      .where('key', '==', key)
      .limit(1)
      .get();

    const configData = {
      key,
      title,
      subtitle,
      content,
      updatedAt: new Date().toISOString(),
    };

    let docRef;
    if (snapshot.empty) {
      // Создаём новую конфигурацию
      docRef = await db.collection(COLLECTIONS.CONFIG).add(configData);
    } else {
      // Обновляем существующую
      const doc = snapshot.docs[0];
      await doc.ref.update(configData);
      docRef = doc.ref;
    }

    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...updatedDoc.data() },
      message: 'Конфигурация успешно обновлена',
    });
  } catch (error: unknown) {
    console.error('Ошибка при обновлении конфигурации:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка сервера при обновлении конфигурации',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/config
 * Обновить существующую конфигурацию
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, title, subtitle, content } = body;

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ключ конфигурации обязателен',
        },
        { status: 400 }
      );
    }

    const snapshot = await db.collection(COLLECTIONS.CONFIG)
      .where('key', '==', key)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          error: 'Конфигурация не найдена',
        },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (content !== undefined) updateData.content = content;

    const docRef = snapshot.docs[0].ref;
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...updatedDoc.data() },
      message: 'Конфигурация успешно обновлена',
    });
  } catch (error: unknown) {
    console.error('Ошибка при обновлении конфигурации:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Ошибка сервера при обновлении конфигурации',
      },
      { status: 500 }
    );
  }
}
