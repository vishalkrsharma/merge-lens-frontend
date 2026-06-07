'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function GithubAppPoller() {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      router.refresh();
      if (attempts >= 10) clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
