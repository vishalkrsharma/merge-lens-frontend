import { type NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080';

export async function proxy(request: NextRequest) {
  const cookie = request.headers.get('cookie') ?? '';

  const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
    headers: { cookie },
  });

  const data = await response.json().catch(() => null);

  if (!data?.user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/findings/:path*', '/repositories/:path*', '/reviews/:path*', '/settings/:path*'],
};
