import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function UsageLoading() {
  return (
    <div className='border bg-card p-5'>
      <Skeleton className='mb-1 h-4 w-36' />
      <Skeleton className='mb-5 h-3.5 w-28' />

      <div className='mb-1.5 flex justify-between'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-4 w-16' />
      </div>
      <Skeleton className='h-2 w-full' />
      <Skeleton className='mt-1.5 h-3 w-48' />

      <Separator className='my-4' />

      <Skeleton className='mb-3 h-3.5 w-32' />
      <div className='overflow-hidden border'>
        <div className='flex gap-6 border-b px-4 py-3'>
          {[96, 48, 72, 72].map((w, i) => (
            <Skeleton key={i} className='h-3.5 shrink-0' style={{ width: w }} />
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='flex gap-6 border-b px-4 py-3.5 last:border-0'
          >
            <Skeleton className='h-3.5 w-36 shrink-0' />
            <Skeleton className='h-3.5 w-10 shrink-0' />
            <Skeleton className='h-3.5 w-16 shrink-0' />
            <Skeleton className='h-3.5 w-14 shrink-0' />
          </div>
        ))}
      </div>
    </div>
  );
}
