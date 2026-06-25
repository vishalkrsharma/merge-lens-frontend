import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ModelsLoading() {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <div className='rounded-xl border bg-card p-5'>
        <Skeleton className='mb-1 h-4 w-20' />
        <Skeleton className='mb-5 h-3.5 w-48' />
        <div className='space-y-3'>
          {[0, 1, 2].map((i) => (
            <div key={i} className='flex items-center justify-between rounded-lg border p-3'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded-sm' />
                <Skeleton className='h-4 w-28' />
              </div>
              <Skeleton className='h-7 w-20 rounded-md' />
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-xl border bg-card p-5'>
        <Skeleton className='mb-1 h-4 w-32' />
        <Skeleton className='mb-5 h-3.5 w-40' />

        <Separator className='mb-4' />

        <div className='space-y-2'>
          {[0, 1, 2].map((i) => (
            <div key={i} className='flex items-center gap-3 rounded-lg border p-3'>
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-36' />
            </div>
          ))}
        </div>
        <Skeleton className='mt-4 h-9 w-24 rounded-md' />
      </div>
    </div>
  );
}
