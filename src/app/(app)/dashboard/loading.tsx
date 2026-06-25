import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function PageHeaderSkeleton() {
  return (
    <div className='mb-6'>
      <Skeleton className='h-6 w-28' />
      <Skeleton className='mt-1.5 h-4 w-64' />
      <Separator className='mt-4' />
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className='rounded-xl border bg-card p-5'>
          <div className='mb-3 flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-4 rounded-sm' />
          </div>
          <Skeleton className='h-7 w-16' />
          <Skeleton className='mt-1.5 h-3 w-32' />
        </div>
      ))}
    </div>
  );
}

function ChartsRowSkeleton() {
  return (
    <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {[0, 1].map((i) => (
        <div key={i} className='rounded-xl border bg-card p-5'>
          <Skeleton className='mb-4 h-4 w-36' />
          <Skeleton className='h-48 w-full rounded-lg' />
        </div>
      ))}
    </div>
  );
}

function RecentReviewsSkeleton() {
  return (
    <div className='mt-6'>
      <div className='mb-3 flex items-center justify-between'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-7 w-16 rounded-md' />
      </div>
      <div className='overflow-hidden rounded-lg border'>
        <div className='grid grid-cols-7 gap-4 border-b px-4 py-3'>
          {[80, 48, 160, 64, 72, 56, 56].map((w, i) => (
            <Skeleton key={i} className='h-3.5' style={{ width: w }} />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='grid grid-cols-7 gap-4 border-b px-4 py-3.5 last:border-0'
          >
            {[96, 40, 140, 56, 80, 44, 44].map((w, j) => (
              <Skeleton key={j} className='h-3.5' style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentBreakdownSkeleton() {
  return (
    <div className='mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className='flex flex-row items-center gap-3 rounded-xl border bg-card p-4'>
          <Skeleton className='h-8 w-8 rounded-md' />
          <div>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='mt-1.5 h-6 w-10' />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <StatsGridSkeleton />
      <ChartsRowSkeleton />
      <RecentReviewsSkeleton />
      <AgentBreakdownSkeleton />
    </div>
  );
}
