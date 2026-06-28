import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { listRepositories, listReviews } from '@/lib/api';
import { ReviewsFilterBar } from './_components/reviews-filter-bar';
import { ReviewsTable } from './_components/reviews-table';
import { ReviewsLiveUpdater } from './_components/reviews-live-updater';

interface PageProps {
  searchParams: Promise<{ repo?: string; status?: string; q?: string }>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const { repo, status, q } = await searchParams;

  const [{ data: reviews, total }, repos] = await Promise.all([
    listReviews({ q, repo, status, limit: '100' }),
    listRepositories(),
  ]);

  return (
    <>
      <ReviewsLiveUpdater />
      <PageHeader
        title='Reviews'
        description={`${total} review${total !== 1 ? 's' : ''}`}
      />
      <Suspense>
        <ReviewsFilterBar repos={repos} />
      </Suspense>
      <ReviewsTable reviews={reviews} />
    </>
  );
}
