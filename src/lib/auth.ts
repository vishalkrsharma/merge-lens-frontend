import { headers } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getSession() {
  const headersList = await headers();
  const cookie = headersList.get('cookie') ?? '';

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: { cookie },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.user ? data : null;
  } catch {
    return null;
  }
}
