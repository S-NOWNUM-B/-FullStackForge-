import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/data/db';
import Project from '@/data/models/Project';
import mongoose from 'mongoose';

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

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (tech && tech !== 'all') {
      query.technologies = { $in: [tech] };
    }

    // Определяем порядок сортировки
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: sortOrder })
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
