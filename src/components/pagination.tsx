'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
}

export function Pagination({ total, limit, page }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const go = (target: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (target === 1) params.delete('page');
    else params.set('page', String(target));
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className='mt-4 flex items-center justify-center gap-4 text-sm'>
      <Button
        variant='outline'
        size='sm'
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ← Previous
      </Button>
      <span className='text-muted-foreground'>
        Page {page} of {totalPages}
      </span>
      <Button
        variant='outline'
        size='sm'
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
      >
        Next →
      </Button>
    </div>
  );
}
