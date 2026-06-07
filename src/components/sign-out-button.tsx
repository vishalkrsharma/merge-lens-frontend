'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type='button'
      className='w-full rounded border border-destructive/20 bg-destructive/10 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20'
      onClick={() => signOut({ fetchOptions: { onSuccess: () => router.push('/') } })}
    >
      Sign out
    </button>
  );
}
