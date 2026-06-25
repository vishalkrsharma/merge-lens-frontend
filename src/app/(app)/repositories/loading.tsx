import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function RepoRowSkeleton() {
  return (
    <div className='flex items-center gap-4 px-4 py-4'>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-3.5 w-3.5 rounded-sm' />
          <Skeleton className='h-4 w-36' />
          <Skeleton className='h-5 w-14 rounded-full' />
        </div>
        <div className='ml-5 flex items-center gap-3'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>
      <Skeleton className='h-5 w-9 rounded-full' />
      <Skeleton className='h-8 w-8 rounded-md' />
    </div>
  );
}

function OwnerGroupSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2 px-0.5'>
        <Skeleton className='h-5 w-5 rounded-full' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-3 w-20' />
      </div>
      <div className='overflow-hidden rounded-xl border'>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={i < rows - 1 ? 'border-b' : ''}>
            <RepoRowSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RepositoriesLoading() {
  return (
    <div>
      <div className='mb-6'>
        <Skeleton className='h-6 w-44' />
        <Skeleton className='mt-1.5 h-4 w-72' />
        <Separator className='mt-4' />
      </div>

      <div className='mb-6 flex items-center gap-2'>
        <Skeleton className='h-9 w-64 max-w-sm flex-1 rounded-md' />
        <Skeleton className='h-9 w-32 shrink-0 rounded-md' />
        <Skeleton className='h-9 w-36 shrink-0 rounded-md' />
      </div>

      <div className='space-y-6'>
        <OwnerGroupSkeleton rows={3} />
        <OwnerGroupSkeleton rows={2} />
      </div>
    </div>
  );
}
