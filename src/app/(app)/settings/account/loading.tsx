import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountLoading() {
  return (
    <div className='rounded-xl border bg-card p-5'>
      <Skeleton className='mb-1 h-4 w-20' />
      <Skeleton className='mb-5 h-3.5 w-32' />

      <div className='flex items-center gap-3'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='mt-1.5 h-3.5 w-44' />
        </div>
      </div>

      <Separator className='my-4' />

      <div className='space-y-3'>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-36' />
          <Skeleton className='h-4 w-16' />
        </div>
        <div className='flex justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-8' />
        </div>
      </div>

      <Separator className='my-4' />

      <Skeleton className='h-9 w-24 rounded-md' />
    </div>
  );
}
