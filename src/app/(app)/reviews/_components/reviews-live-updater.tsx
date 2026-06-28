'use client';

import { useRouter } from 'next/navigation';
import { useReviewUpdates } from '@/hooks/use-review-updates';

export function ReviewsLiveUpdater() {
  const router = useRouter();

  useReviewUpdates(
    ['review:started', 'review:completed', 'review:failed'],
    () => router.refresh(),
  );

  return null;
}
