import { NextRequest, NextResponse } from 'next/server';
import { db, COLLECTIONS } from '@/services/firebase';
import type { Project } from '@/types/api';

// Кэширование на 60 секунд - мгновенная загрузка!
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    // Проверка инициализации Firebase
    if (!db) {
      console.warn('[API/Projects GET] Firebase не инициализирован, возвращаем пустой массив');
      return NextResponse.json(
        { 
          success: true,
          projects: [],
          total: 0,
          currentPage: 1,
          totalPages: 0
        },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tech = searchParams.get('tech') || '';
    const sort = searchParams.get('sort') || 'newest';
    
    console.log('[API/Projects GET] Параметры:', { page, limit, search, category, tech, sort });
    
    // Получаем коллекцию проектов
    const projectsRef = db.collection(COLLECTIONS.PROJECTS);
    let query = projectsRef.where('status', '==', 'published');

    // Фильтр по категории
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    // Фильтр по технологии
    if (tech && tech !== 'all') {
      query = query.where('technologies', 'array-contains', tech);
    }

    // Получаем все документы с фильтрами
    const snapshot = await query.get();
    console.log(`[API/Projects GET] Получено документов: ${snapshot.docs.length}`);
    
    let projects = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data(),
    })) as Project[];

    // Фильтрация по поиску (клиентская)
    if (search && search.trim().length >= 2) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.shortDescription.toLowerCase().includes(searchLower) ||
        p.technologies.some(t => t.toLowerCase().includes(searchLower))
      );

      // Сортировка по релевантности
      projects.sort((a, b) => {
        const aTitle = a.title.toLowerCase().startsWith(searchLower) ? 1 : 
                      a.title.toLowerCase().includes(searchLower) ? 2 : 
                      a.technologies.some(t => t.toLowerCase().includes(searchLower)) ? 3 : 4;
        const bTitle = b.title.toLowerCase().startsWith(searchLower) ? 1 : 
                      b.title.toLowerCase().includes(searchLower) ? 2 : 
                      b.technologies.some(t => t.toLowerCase().includes(searchLower)) ? 3 : 4;
        return aTitle - bTitle;
      });
    }

    // Сортировка по дате
    projects.sort((a, b) => {
      const dateA = new Date(a.startedAt || a.createdAt).getTime();
      const dateB = new Date(b.startedAt || b.createdAt).getTime();
      return sort === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    // Пагинация
    const total = projects.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      projects: paginatedProjects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('[API/Projects GET] Ошибка при получении проектов:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    console.error('[API/Projects GET] Stack:', stack);
    return NextResponse.json({ 
      success: false, 
      error: message,
      details: process.env.NODE_ENV === 'development' ? stack : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API/Projects POST] Начало создания проекта');
    
    if (!db) {
      console.error('[API/Projects POST] Firebase не настроен');
      return NextResponse.json(
        { error: 'Firebase не настроен. Добавьте валидные credentials в переменные окружения' },
        { status: 503 }
      );
    }

    const body = await request.json();
    console.log('[API/Projects POST] Получены данные:', JSON.stringify(body, null, 2));
    
    // Добавляем timestamps
    const projectData = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('[API/Projects POST] Добавление в Firestore...');
    const docRef = await db.collection(COLLECTIONS.PROJECTS).add(projectData);
    const doc = await docRef.get();
    
    console.log('[API/Projects POST] Проект создан с ID:', doc.id);
    
    return NextResponse.json({
      success: true,
      data: { _id: doc.id, ...doc.data() },
      message: 'Проект создан успешно',
    }, { status: 201 });
  } catch (error) {
    console.error('[API/Projects POST] Ошибка при создании проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    console.error('[API/Projects POST] Stack:', stack);
    return NextResponse.json({ 
      success: false, 
      error: message,
      details: process.env.NODE_ENV === 'development' ? stack : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен. Добавьте валидные credentials в .env.local' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: 'ID не указан' }, { status: 400 });
    }

    // Добавляем timestamp обновления
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const docRef = db.collection(COLLECTIONS.PROJECTS).doc(_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Проект не найден' }, { status: 404 });
    }

    await docRef.update(dataToUpdate);
    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...updatedDoc.data() },
      message: 'Проект обновлен успешно',
    });
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase не настроен. Добавьте валидные credentials в .env.local' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const id = body._id || body.id;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID не указан' }, { status: 400 });
    }

    const docRef = db.collection(COLLECTIONS.PROJECTS).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'Проект не найден' }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Проект удален успешно',
    });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
