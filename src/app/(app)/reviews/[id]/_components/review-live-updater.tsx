'use client';

import { useRouter } from 'next/navigation';
import { useReviewUpdates } from '@/hooks/use-review-updates';

export function ReviewLiveUpdater({ reviewId }: { reviewId: string }) {
  const router = useRouter();

  useReviewUpdates(['review:completed', 'review:failed'], (_, data) => {
    const payload = data as { reviewId: string };
    if (payload.reviewId === reviewId) router.refresh();
  });

  return null;
}
