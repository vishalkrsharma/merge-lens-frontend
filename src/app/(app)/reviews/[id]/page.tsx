import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { ReviewStatusBadge } from '@/components/review-status-badge';
import { getReview } from '@/lib/api';
import { FindingsTabs } from './_components/findings-tabs';
import { ReviewErrorBanner } from './_components/review-error-banner';
import { ReviewSummaryCard } from './_components/review-summary';

function formatDuration(ms: number) {
  if (ms === 0) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  let review: ReviewDetail;
  try {
    review = await getReview(id);
  } catch {
    notFound();
  }

  const { findings, summary } = review;

  const findingCounts = findings.reduce(
    (acc, f) => { acc[f.severity]++; return acc; },
    { high: 0, medium: 0, low: 0 },
  );

  return (
    <>
      <div className='mb-4'>
        <Link
          href='/reviews'
          className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
        >
          <IconArrowLeft size={14} />
          Back to reviews
        </Link>
      </div>

      <PageHeader
        title={review.prTitle}
        description={`${review.owner}/${review.repo} · PR #${review.pullNumber} · commit ${review.commitId}`}
        action={<ReviewStatusBadge status={review.status} />}
      />

      <div className='mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground'>
        <span>Started: {formatDate(review.createdAt)}</span>
        {review.completedAt && (
          <span>Completed: {formatDate(review.completedAt)}</span>
        )}
        <span>Duration: {formatDuration(review.durationMs)}</span>
        <span className='font-mono text-xs'>
          <span className='text-red-400'>{findingCounts.high}H</span>
          {' · '}
          <span className='text-amber-400'>{findingCounts.medium}M</span>
          {' · '}
          <span className='text-green-400'>{findingCounts.low}L</span>
        </span>
      </div>

      {review.status === 'failed' && <ReviewErrorBanner reviewId={review.id} />}

      {summary && <ReviewSummaryCard summary={summary} />}

      <FindingsTabs findings={findings} />
    </>
  );
}
