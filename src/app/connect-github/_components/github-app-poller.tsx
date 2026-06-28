'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReviewUpdates } from '@/hooks/use-review-updates';

export function GithubAppPoller() {
  const router = useRouter();

  useReviewUpdates(['github-app:installed'], () => router.refresh());

  // Fallback: if socket doesn't connect within 30s, poll once
  useEffect(() => {
    const timeout = setTimeout(() => router.refresh(), 30_000);
    return () => clearTimeout(timeout);
  }, [router]);

  return null;
}
