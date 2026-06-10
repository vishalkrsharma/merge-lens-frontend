import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div>
      <div className='mb-6'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='mt-2 h-4 w-64' />
        <Separator className='mt-4' />
      </div>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {['a', 'b', 'c', 'd'].map((k) => (
          <Skeleton key={k} className='h-48 w-full rounded-xl' />
        ))}
      </div>
    </div>
  );
}
