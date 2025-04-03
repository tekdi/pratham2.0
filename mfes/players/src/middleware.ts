import { NextResponse } from 'next/server';

export function middleware(request: { nextUrl: { clone: () => any } }) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/assets')) {
    url.hostname = 'localhost';
    url.pathname = '/sbplayer' + url.pathname;
    url.port = '4106';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
