import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/data/db';
import WorkInfo from '@/data/models/WorkInfo';
import type { WorkInfo as WorkInfoType } from '@/types/api';

// GET - Получить информацию о работе
export async function GET() {
  try {
    await connectDB();
    
    let workInfo = await WorkInfo.findOne();
    
    // Если данных нет, создаем с дефолтными значениями
    if (!workInfo) {
      workInfo = await WorkInfo.create({
        headline: 'Работаю над проектами, которые меняют мир',
        subheadline: 'Создаю современные веб-приложения с фокусом на UX и производительность',
        description: 'Разрабатываю полнофункциональные веб-приложения используя современные технологии.',
        email: 'contact@example.com',
      });
    }

    const data: WorkInfoType = {
      _id: workInfo._id.toString(),
      headline: workInfo.headline,
      subheadline: workInfo.subheadline,
      description: workInfo.description,
      availability: workInfo.availability,
      minBudget: workInfo.minBudget,
      workingHours: workInfo.workingHours,
      responseTime: workInfo.responseTime,
      pricingPlans: workInfo.pricingPlans,
      workProcess: workInfo.workProcess,
      benefits: workInfo.benefits,
      faqs: workInfo.faqs,
      email: workInfo.email,
      phone: workInfo.phone,
      location: workInfo.location,
      timezone: workInfo.timezone,
      createdAt: workInfo.createdAt.toISOString(),
      updatedAt: workInfo.updatedAt.toISOString(),
    };

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
    await connectDB();
    
    const body = await request.json();
    
    let workInfo = await WorkInfo.findOne();
    
    if (!workInfo) {
      workInfo = await WorkInfo.create(body);
    } else {
      Object.assign(workInfo, body);
      await workInfo.save();
    }

    const data: WorkInfoType = {
      _id: workInfo._id.toString(),
      headline: workInfo.headline,
      subheadline: workInfo.subheadline,
      description: workInfo.description,
      availability: workInfo.availability,
      minBudget: workInfo.minBudget,
      workingHours: workInfo.workingHours,
      responseTime: workInfo.responseTime,
      pricingPlans: workInfo.pricingPlans,
      workProcess: workInfo.workProcess,
      benefits: workInfo.benefits,
      faqs: workInfo.faqs,
      email: workInfo.email,
      phone: workInfo.phone,
      location: workInfo.location,
      timezone: workInfo.timezone,
      createdAt: workInfo.createdAt.toISOString(),
      updatedAt: workInfo.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data,
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
