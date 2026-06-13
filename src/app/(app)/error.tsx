'use client';

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconRefresh,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-1 flex-col items-center justify-center px-6 py-24 text-center'>
      <div className='mb-6 flex items-center justify-center rounded-full border border-border bg-muted/50 p-6'>
        <IconAlertTriangle size={48} className='text-muted-foreground' />
      </div>

      <p className='font-mono text-sm text-destructive'>500</p>
      <h1 className='mt-2 text-3xl font-bold tracking-tight'>
        Something went wrong
      </h1>
      <p className='mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed'>
        An unexpected error occurred while processing your request. You can try
        again or head back to the dashboard.
      </p>

      {error.message && (
        <div className='mt-6 w-full max-w-sm'>
          <Separator className='mb-4' />
          <p className='mb-2 text-left text-xs font-medium text-muted-foreground'>
            Error details
          </p>
          <pre className='rounded-lg border border-border bg-muted/50 px-4 py-3 text-left font-mono text-xs text-muted-foreground break-all whitespace-pre-wrap'>
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        </div>
      )}

      <div className='mt-8 flex items-center gap-3'>
        <Button onClick={reset} className='gap-2'>
          <IconRefresh size={14} />
          Try again
        </Button>
        <Button
          variant='outline'
          render={<Link href='/dashboard' />}
          className='gap-2'
        >
          <IconArrowLeft size={14} />
          Dashboard
        </Button>
      </div>
    </div>
  );
}
