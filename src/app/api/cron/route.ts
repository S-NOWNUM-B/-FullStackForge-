import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Временно отключаем проверку авторизации для теста
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Логирование для диагностики
  console.log('🔍 Cron ping получен:', {
    hasAuthHeader: !!authHeader,
    hasCronSecret: !!cronSecret,
    authHeaderValue: authHeader || 'отсутствует',
    cronSecretValue: cronSecret || 'не установлен',
    expectedValue: cronSecret ? `Bearer ${cronSecret}` : 'не установлен',
    match: authHeader === `Bearer ${cronSecret}`,
  });
  
  // ВРЕМЕННО ЗАКОММЕНТИРОВАНО ДЛЯ ТЕСТА
   if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
     console.log('❌ Авторизация не прошла');
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
