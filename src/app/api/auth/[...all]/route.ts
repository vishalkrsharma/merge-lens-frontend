import { type NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;

async function handler(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const targetUrl = `${BACKEND_URL}${pathname}${search}`;

  const forwardHeaders = new Headers();
  const cookie = request.headers.get('cookie');
  if (cookie) forwardHeaders.set('cookie', cookie);
  const contentType = request.headers.get('content-type');
  if (contentType) forwardHeaders.set('content-type', contentType);
  // Forward Origin so better-auth CSRF check passes on the NestJS side
  const origin = request.headers.get('origin');
  if (origin) forwardHeaders.set('origin', origin);

  const fetchOptions: RequestInit & { duplex?: string } = {
    method: request.method,
    headers: forwardHeaders,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    fetchOptions.body = request.body;
    fetchOptions.duplex = 'half';
  }

  const response = await fetch(targetUrl, fetchOptions);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('transfer-encoding');

  // For non-GET redirects (e.g. POST /sign-in/social → 302 to GitHub OAuth),
  // return JSON so the better-auth client does window.location.href instead of
  // fetch() following the 302 to GitHub, which is CORS-blocked and returns empty.
  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    response.status >= 300 &&
    response.status < 400
  ) {
    try {
      const body = await response.json();
      return NextResponse.json(body, { status: 200 });
    } catch {
      const location = responseHeaders.get('location');
      return NextResponse.json({ url: location, redirect: true }, { status: 200 });
    }
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
