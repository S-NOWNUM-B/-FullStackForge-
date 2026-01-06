import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/data/db';
import SocialLinks from '@/data/models/SocialLinks';
import type { SocialLinks as SocialLinksType } from '@/types/api';

// GET - Получить соц-сети
export async function GET() {
  try {
    await connectDB();
    
    let socialLinks = await SocialLinks.findOne();
    
    // Если данных нет, создаем с дефолтными значениями
    if (!socialLinks) {
      socialLinks = await SocialLinks.create({});
    }

    const data: SocialLinksType = {
      _id: socialLinks._id.toString(),
      links: socialLinks.links,
      showOnHeader: socialLinks.showOnHeader,
      showOnFooter: socialLinks.showOnFooter,
      showOnWorkPage: socialLinks.showOnWorkPage,
      createdAt: socialLinks.createdAt.toISOString(),
      updatedAt: socialLinks.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Ошибка при получении SocialLinks:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить соц-сети' },
      { status: 500 }
    );
  }
}

// PUT - Обновить соц-сети (защищено middleware)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    let socialLinks = await SocialLinks.findOne();
    
    if (!socialLinks) {
      socialLinks = await SocialLinks.create(body);
    } else {
      Object.assign(socialLinks, body);
      await socialLinks.save();
    }

    const data: SocialLinksType = {
      _id: socialLinks._id.toString(),
      links: socialLinks.links,
      showOnHeader: socialLinks.showOnHeader,
      showOnFooter: socialLinks.showOnFooter,
      showOnWorkPage: socialLinks.showOnWorkPage,
      createdAt: socialLinks.createdAt.toISOString(),
      updatedAt: socialLinks.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data,
      message: 'Соц-сети успешно обновлены',
    });
  } catch (error) {
    console.error('Ошибка при обновлении SocialLinks:', error);
    return NextResponse.json(
      { success: false, error: 'Не удалось обновить соц-сети' },
      { status: 500 }
    );
  }
}
