import { NextResponse } from 'next/server';
import dbConnect from '@/data/db';
import Project from '@/data/models/Project';

export async function GET() {
  try {
    await dbConnect();

    const categories = await Project.distinct('category');
    const technologies = await Project.distinct('technologies');

    return NextResponse.json({
      success: true,
      categories,
      technologies,
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
