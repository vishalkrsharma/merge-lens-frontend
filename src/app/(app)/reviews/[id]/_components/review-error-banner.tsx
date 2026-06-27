'use client';

import { useState } from 'react';
import { IconAlertTriangle, IconLoader2, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { retryReview } from '@/lib/actions';

export function ReviewErrorBanner({ reviewId }: { reviewId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRetry() {
    setPending(true);
    setError(null);
    const result = await retryReview(reviewId);
    if (!result.success) {
      setError(result.message);
      setPending(false);
    }
  }

  return (
    <div className='mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-5'>
      <div className='flex items-start gap-3'>
        <IconAlertTriangle size={18} className='mt-0.5 shrink-0 text-red-400' />
        <div className='flex-1 space-y-1'>
          <p className='text-sm font-medium text-red-400'>Review failed</p>
          <p className='text-sm text-muted-foreground'>
            The AI review could not be completed. This is usually caused by a missing or invalid
            API key.{' '}
            <Link
              href='/settings/models'
              className='text-foreground underline underline-offset-4 hover:text-primary'
            >
              Check your AI provider settings
            </Link>
            , then retry.
          </p>
          {error && <p className='mt-1 text-xs text-red-400'>{error}</p>}
        </div>
        <Button
          size='sm'
          variant='outline'
          onClick={handleRetry}
          disabled={pending}
          className='shrink-0 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300'
        >
          {pending ? (
            <IconLoader2 size={14} className='animate-spin' />
          ) : (
            <IconRefresh size={14} />
          )}
          {pending ? 'Retrying…' : 'Retry'}
        </Button>
      </div>
    </div>
  );
}
