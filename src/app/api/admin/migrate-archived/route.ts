import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/data/db';
import Project from '@/data/models/Project';

/**
 * API endpoint для миграции проектов со статусом 'archived' в 'draft'
 * Использование: GET /api/admin/migrate-archived
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Находим все проекты со статусом 'archived'
    const archivedProjects = await Project.find({ status: 'archived' as any });
    
    console.log(`Найдено проектов со статусом 'archived': ${archivedProjects.length}`);

    if (archivedProjects.length > 0) {
      // Обновляем статус на 'draft'
      const updatePromises = archivedProjects.map(project => {
        project.status = 'draft' as any;
        return project.save();
      });

      await Promise.all(updatePromises);

      const updatedTitles = archivedProjects.map(p => p.title);

      return NextResponse.json({
        success: true,
        message: `Обновлено проектов: ${archivedProjects.length}`,
        projects: updatedTitles,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Проектов со статусом "archived" не найдено',
        projects: [],
      });
    }
  } catch (error) {
    console.error('Ошибка миграции:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 500 });
  }
}
