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

  // Build response headers manually so each Set-Cookie header is preserved as a
  // separate entry. `new Headers(response.headers)` collapses multiple Set-Cookie
  // values into one comma-joined string, which browsers reject — the session cookie
  // is silently dropped and getSession() always returns null.
  const responseHeaders = new Headers();
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') continue; // appended individually below
    if (key.toLowerCase() === 'transfer-encoding') continue;
    responseHeaders.set(key, value);
  }
  const setCookies = response.headers.getSetCookie?.() ?? [];
  for (const c of setCookies) {
    responseHeaders.append('set-cookie', c);
  }

  // OAuth callback: better-auth returns 302 to wherever it wants (often the backend
  // domain). Ignore that Location, copy the session cookies, and send the browser
  // to /connect-github ourselves so it always lands on the frontend.
  if (
    pathname.startsWith('/api/auth/callback/') &&
    request.method === 'GET' &&
    response.status >= 300 &&
    response.status < 400
  ) {
    const backendLocation = response.headers.get('location') ?? '';
    const hasError = backendLocation.includes('error=');
    const sessionCookies = setCookies.filter(
      (c) => !c.startsWith('__Secure-better-auth.state='),
    );
    console.log('[auth-callback]', {
      backendStatus: response.status,
      backendLocation,
      hasError,
      allCookies: setCookies,
      sessionCookies,
    });
    const dest =
      !hasError && sessionCookies.length > 0 ? '/connect-github' : '/';
    const redirect = NextResponse.redirect(new URL(dest, request.url));
    for (const c of setCookies) {
      redirect.headers.append('set-cookie', c);
    }
    return redirect;
  }

  // For non-GET redirects (e.g. POST /sign-in/social → 302 to GitHub OAuth),
  // return JSON so the better-auth client does window.location.href instead of
  // fetch() following the 302 to GitHub, which is CORS-blocked and returns empty.
  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    response.status >= 300 &&
    response.status < 400
  ) {
    let body: { url?: string; redirect?: boolean };
    try {
      body = await response.json();
    } catch {
      body = { url: response.headers.get('location') ?? '', redirect: true };
    }
    const jsonRes = NextResponse.json(body, { status: 200 });
    for (const c of setCookies) {
      jsonRes.headers.append('set-cookie', c);
    }
    return jsonRes;
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
