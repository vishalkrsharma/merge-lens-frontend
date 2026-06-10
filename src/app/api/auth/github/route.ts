import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/api/auth/sign-in/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'github',
      callbackURL: `${BASE_URL}/connect-github`,
    }),
    redirect: 'manual',
  });

  let oauthUrl: string | null = null;

  if (res.status >= 300 && res.status < 400) {
    oauthUrl = res.headers.get('location');
  }

  if (!oauthUrl) {
    try {
      const data = await res.json();
      oauthUrl = data?.url ?? null;
    } catch {}
  }

  if (!oauthUrl) {
    return new NextResponse('Failed to initiate GitHub OAuth', { status: 502 });
  }

  return NextResponse.redirect(oauthUrl);
}
