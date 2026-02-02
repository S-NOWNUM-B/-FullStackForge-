import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Упрощенная версия без авторизации для совместимости с бесплатными cron сервисами
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Логирование для диагностики
  console.log('🔍 Cron ping получен:', {
    timestamp: new Date().toISOString(),
    hasAuthHeader: !!authHeader,
    hasCronSecret: !!cronSecret,
  });
  
  // Проверяем авторизацию только если секрет установлен И заголовок передан
  // Это позволяет работать без авторизации на бесплатных сервисах
  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    console.log('❌ Авторизация не прошла - неверный токен');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Пингуем основную страницу
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/health`);
    
    console.log('✅ Cron ping выполнен успешно:', new Date().toISOString());
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ping successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Ошибка cron ping:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Ping failed' 
    }, { status: 500 });
  }
}
