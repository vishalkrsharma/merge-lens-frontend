import { type NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const parts = host.split('.');
  const isLocalhostSubdomain =
    parts.length >= 2 && !parts[0].startsWith('localhost') && host.includes('localhost');

  if (!isLocalhostSubdomain) return NextResponse.next();

  const slug = parts[0];
  if (slug === 'www') return NextResponse.next();

  const headers = new Headers(request.headers);
  headers.set('x-tenant-slug', slug);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
