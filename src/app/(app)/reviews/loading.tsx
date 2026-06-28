import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const COL_WIDTHS = [96, 40, 180, 64, 80, 52, 52];

export default function ReviewsLoading() {
  return (
    <div>
      <div className='mb-6'>
        <Skeleton className='h-6 w-20' />
        <Skeleton className='mt-1.5 h-4 w-24' />
        <Separator className='mt-4' />
      </div>

      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <Skeleton className='h-9 w-48' />
        <Skeleton className='h-9 w-36' />
        <Skeleton className='h-9 w-32' />
      </div>

      <div className='overflow-hidden border'>
        <div className='flex gap-4 border-b px-4 py-3'>
          {COL_WIDTHS.map((w, i) => (
            <Skeleton key={i} className='h-3.5 shrink-0' style={{ width: w }} />
          ))}
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className='flex gap-4 border-b px-4 py-3.5 last:border-0'
          >
            {COL_WIDTHS.map((w, j) => (
              <Skeleton
                key={j}
                className='h-3.5 shrink-0'
                style={{ width: w }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
