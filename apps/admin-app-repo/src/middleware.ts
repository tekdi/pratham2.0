import { NextResponse } from 'next/server';

export function middleware(request: { nextUrl: { clone: () => any } }) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/mfe_workspace')) {
    url.hostname = 'localhost';
    url.port = '4104';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
