import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');

  // Защищенные API маршруты (только для админа)
  const protectedApiRoutes = [
    '/api/projects',
    '/api/config',
    '/api/work-info',
    '/api/social-links',
  ];

  const isProtectedApi = protectedApiRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Разрешаем GET запросы к проектам, конфигу, work-info и social-links без авторизации
  const isPublicGetRequest = 
    req.method === 'GET' && 
    (req.nextUrl.pathname.startsWith('/api/projects') || 
     req.nextUrl.pathname.startsWith('/api/config') ||
     req.nextUrl.pathname.startsWith('/api/work-info') ||
     req.nextUrl.pathname.startsWith('/api/social-links'));

  // Разрешаем POST к /api/contact без авторизации
  const isContactPost = 
    req.method === 'POST' && 
    req.nextUrl.pathname === '/api/contact';

  // Пропускаем публичные запросы
  if (isPublicGetRequest || isContactPost || req.nextUrl.pathname.startsWith('/api/health')) {
    return NextResponse.next();
  }

  // Защищаем админ панель
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Защищаем API роуты (POST, PUT, DELETE)
  if (isProtectedApi && !isLoggedIn && !isPublicGetRequest) {
    return NextResponse.json(
      { success: false, error: 'Требуется авторизация' },
      { status: 401 }
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
