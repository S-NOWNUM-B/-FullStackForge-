import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/data/db';
import Config, { ConfigKey } from '@/data/models/Config';

/**
 * GET /api/config?key=home|about|contact
 * Получить конфигурацию страницы по ключу
 * Или получить все конфигурации, если ключ не указан
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key') as ConfigKey | null;

    if (key) {
      const config = await Config.findOne({ key }).lean();
      
      if (!config) {
        return NextResponse.json(
          {
            success: false,
            error: `Конфигурация для ключа "${key}" не найдена`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: config,
      });
    } else {
      // Получить все конфигурации
      const configs = await Config.find({}).lean();
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
    await dbConnect();
    
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

    // Обновить существующую или создать новую конфигурацию
    const config = await Config.findOneAndUpdate(
      { key },
      { title, subtitle, content },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: config,
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
    await dbConnect();
    
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

    const updateData: Partial<{ title: string; subtitle: string; content: string }> = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (content !== undefined) updateData.content = content;

    const config = await Config.findOneAndUpdate(
      { key },
      updateData,
      { new: true, runValidators: true }
    );

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          error: 'Конфигурация не найдена',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: config,
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
