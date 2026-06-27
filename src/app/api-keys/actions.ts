'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function completeOnboarding() {
  const jar = await cookies();
  jar.set('ml_onboarding_done', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 10,
  });
  redirect('/dashboard');
}
