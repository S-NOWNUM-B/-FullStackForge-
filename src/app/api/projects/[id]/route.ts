import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/data/db';
import Project from '@/data/models/Project';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Проверяем, является ли ID валидным ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат ID проекта' },
        { status: 400 }
      );
    }
    
    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Проект не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
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
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат ID проекта' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Проект не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    console.error('Ошибка при обновлении проекта:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат ID проекта' },
        { status: 400 }
      );
    }
    
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, error: 'Проект не найден' },
        { status: 404 }
      );
    }

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
