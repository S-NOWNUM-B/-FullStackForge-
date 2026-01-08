import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/data/db';
import Project from '@/data/models/Project';
import mongoose from 'mongoose';

// Кэширование на 60 секунд - мгновенная загрузка!
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tech = searchParams.get('tech') || '';
    const sort = searchParams.get('sort') || 'newest';
    
    // Умный поиск с приоритетами
    if (search && search.trim().length >= 2) {
      // Создаем aggregation pipeline для поиска с весами
      const searchRegex = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Экранируем спецсимволы
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pipeline: any[] = [
        {
          $match: {
            ...(category && category !== 'all' ? { category } : {}),
            ...(tech && tech !== 'all' ? { technologies: { $in: [tech] } } : {}),
            $or: [
              { title: { $regex: searchRegex, $options: 'i' } },
              { shortDescription: { $regex: searchRegex, $options: 'i' } },
              { technologies: { $regex: searchRegex, $options: 'i' } },
            ]
          }
        },
        {
          $addFields: {
            // Вычисляем релевантность (чем меньше число, тем выше приоритет)
            relevance: {
              $cond: [
                { $regexMatch: { input: '$title', regex: `^${searchRegex}`, options: 'i' } },
                1, // Начинается с поискового запроса - высший приоритет
                {
                  $cond: [
                    { $regexMatch: { input: '$title', regex: searchRegex, options: 'i' } },
                    2, // Содержится в названии - высокий приоритет
                    {
                      $cond: [
                        {
                          $gt: [
                            {
                              $size: {
                                $filter: {
                                  input: '$technologies',
                                  cond: { $regexMatch: { input: '$$this', regex: searchRegex, options: 'i' } }
                                }
                              }
                            },
                            0
                          ]
                        },
                        3, // Найдено в технологиях - средний приоритет
                        4  // Найдено в описании - низкий приоритет
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        { $sort: { relevance: 1, startedAt: sort === 'oldest' ? 1 : -1, createdAt: sort === 'oldest' ? 1 : -1 } },
        { $project: { title: 1, shortDescription: 1, category: 1, technologies: 1, createdAt: 1, startedAt: 1, thumbnail: 1 } }
      ];

      const total = await Project.countDocuments({
        ...(category && category !== 'all' ? { category } : {}),
        ...(tech && tech !== 'all' ? { technologies: { $in: [tech] } } : {}),
        $or: [
          { title: { $regex: searchRegex, $options: 'i' } },
          { shortDescription: { $regex: searchRegex, $options: 'i' } },
          { technologies: { $regex: searchRegex, $options: 'i' } },
        ]
      });

      const projects = await Project.aggregate([
        ...pipeline,
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);

      return NextResponse.json({
        success: true,
        projects,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    }

    // Обычный поиск без текстового запроса
    const query: Record<string, unknown> = {
      ...(category && category !== 'all' ? { category } : {}),
      ...(tech && tech !== 'all' ? { technologies: { $in: [tech] } } : {}),
    };

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .select('title shortDescription category technologies createdAt startedAt thumbnail')
      .sort({ startedAt: sortOrder, createdAt: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return NextResponse.json({
      success: true,
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Ошибка при получении проектов:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const project = await Project.create(body);
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Проект создан успешно',
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, error: 'ID не указан' }, { status: 400 });
    }
    
    // Проверяем, является ли ID валидным ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат ID проекта' },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
    
    if (!project) {
      return NextResponse.json({ success: false, error: 'Проект не найден' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: project,
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
    await dbConnect();
    const body = await request.json();
    const id = body._id || body.id;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID не указан' }, { status: 400 });
    }
    
    // Проверяем, является ли ID валидным ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат ID проекта' },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json({ success: false, error: 'Проект не найден' }, { status: 404 });
    }

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
