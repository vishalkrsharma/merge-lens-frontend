import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { listRepositories, listReviews } from '@/lib/api';
import { ReviewsFilterBar } from './_components/reviews-filter-bar';
import { ReviewsTable } from './_components/reviews-table';
import { ReviewsLiveUpdater } from './_components/reviews-live-updater';

const LIMIT = 20;

interface PageProps {
  searchParams: Promise<{
    repo?: string;
    status?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const { repo, status, q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1') || 1);

  const [{ data: reviews, total }, repos] = await Promise.all([
    listReviews({ q, repo, status, page: String(page), limit: String(LIMIT) }),
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
      <Suspense>
        <Pagination total={total} limit={LIMIT} page={page} />
      </Suspense>
    </>
  );
}
