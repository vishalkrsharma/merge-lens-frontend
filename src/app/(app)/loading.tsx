import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <div className='mb-6'>
        <Skeleton className='h-6 w-36' />
        <Skeleton className='mt-1.5 h-4 w-56' />
        <Separator className='mt-4' />
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {[0, 1, 2, 3].map((k) => (
          <Skeleton key={k} className='h-40 w-full' />
        ))}
      </div>
    </div>
  );
}
