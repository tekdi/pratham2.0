import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('token')?.value; // ✅ Correct way in middleware
  const isAuth = Boolean(token);
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');
  console.log('token', token);

  if (isAuth && isAuthPage) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuth && !isAuthPage) {
    // Redirect unauthenticated users away from protected pages
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (url.pathname.startsWith('/sbplayer')) {
    url.hostname = 'localhost';
    url.port = '4108';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Limit middleware to only certain paths
export const config = {
  matcher: [],
};
