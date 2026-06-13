import { headers } from 'next/headers';

const BACKEND_URL =
  process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getSession() {
  const headersList = await headers();
  const cookie = headersList.get('cookie') ?? '';

  console.log('[getSession] cookies present:', cookie ? cookie.split(';').map((c) => c.trim().split('=')[0]) : []);

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: { cookie },
      cache: 'no-store',
    });

    const text = await response.text();
    console.log('[getSession] backend status:', response.status, 'body:', text.slice(0, 200));

    if (!response.ok) return null;

    const data = JSON.parse(text);
    return data?.user ? data : null;
  } catch (err) {
    console.log('[getSession] error:', err);
    return null;
  }
}
