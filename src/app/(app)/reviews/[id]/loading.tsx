import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewDetailLoading() {
  return (
    <div>
      <Skeleton className='mb-4 h-4 w-28' />

      <div className='mb-6'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <Skeleton className='h-6 w-3/4 max-w-lg' />
            <Skeleton className='mt-1.5 h-4 w-80' />
          </div>
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>
        <Separator className='mt-4' />
      </div>

      <div className='mb-6 flex flex-wrap gap-4'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-4 w-20' />
      </div>

      <div className='mb-6 rounded-xl border bg-card p-5'>
        <Skeleton className='mb-4 h-4 w-32' />
        <div className='space-y-2'>
          <Skeleton className='h-3.5 w-full' />
          <Skeleton className='h-3.5 w-5/6' />
          <Skeleton className='h-3.5 w-4/5' />
        </div>
        <Separator className='my-4' />
        <div className='grid grid-cols-2 gap-4'>
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className='mb-2 h-3.5 w-24' />
              <Skeleton className='h-3 w-full' />
              <Skeleton className='mt-1 h-3 w-3/4' />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className='mb-3 flex gap-1 border-b'>
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-8 w-20 rounded-t-md' />
          ))}
        </div>
        <div className='space-y-3'>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className='rounded-xl border bg-card p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <Skeleton className='h-5 w-16 rounded-full' />
                <Skeleton className='h-4 w-32 font-mono' />
                <Skeleton className='h-4 w-10' />
              </div>
              <Skeleton className='h-3.5 w-full' />
              <Skeleton className='mt-1 h-3.5 w-5/6' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
