import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const COL_WIDTHS = [64, 52, 120, 200, 140];

export default function FindingsLoading() {
  return (
    <div>
      <div className='mb-6'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='mt-1.5 h-4 w-48' />
        <Separator className='mt-4' />
      </div>

      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <Skeleton className='h-9 w-40 rounded-md' />
        <Skeleton className='h-9 w-32 rounded-md' />
        <Skeleton className='h-9 w-36 rounded-md' />
        <Skeleton className='h-9 w-36 rounded-md' />
      </div>

      <div className='mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <div className='overflow-hidden rounded-lg border'>
            <div className='flex gap-4 border-b px-4 py-3'>
              {COL_WIDTHS.map((w, i) => (
                <Skeleton key={i} className='h-3.5 shrink-0' style={{ width: w }} />
              ))}
            </div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className='flex gap-4 border-b px-4 py-3.5 last:border-0'
              >
                {COL_WIDTHS.map((w, j) => (
                  <Skeleton key={j} className='h-3.5 shrink-0' style={{ width: w }} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <div className='rounded-xl border bg-card p-5'>
            <Skeleton className='mb-1 h-4 w-24' />
            <Skeleton className='mb-4 h-3 w-36' />
            <div className='space-y-2.5'>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className='flex items-center justify-between'>
                  <Skeleton className='h-3.5 w-40' />
                  <Skeleton className='h-5 w-7 rounded-md' />
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-xl border bg-card p-5'>
            <Skeleton className='mb-1 h-4 w-28' />
            <Skeleton className='mb-4 h-3 w-40' />
            <div className='space-y-3'>
              {['high', 'medium', 'low'].map((s) => (
                <div key={s} className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-16 rounded-full' />
                  <Skeleton className='h-2 flex-1 rounded-full' />
                  <Skeleton className='h-4 w-6' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
