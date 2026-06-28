'use client';

import { useRouter } from 'next/navigation';
import { useReviewUpdates } from '@/hooks/use-review-updates';

export function DashboardLiveUpdater() {
  const router = useRouter();

  useReviewUpdates(['review:completed', 'review:failed'], () =>
    router.refresh(),
  );

  return null;
}
