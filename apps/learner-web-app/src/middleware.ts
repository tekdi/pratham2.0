import { NextResponse } from 'next/server';

export function middleware(request: { nextUrl: { clone: () => any } }) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/mfe_content')) {
    url.hostname = 'localhost';
    url.port = '4113';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
