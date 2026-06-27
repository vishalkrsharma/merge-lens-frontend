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
  const statsCardIds = [
    'stats-card-1',
    'stats-card-2',
    'stats-card-3',
    'stats-card-4',
  ];

  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {statsCardIds.map((cardId) => (
        <div key={cardId} className='border bg-card p-5'>
          <div className='mb-3 flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-4' />
          </div>
          <Skeleton className='h-7 w-16' />
          <Skeleton className='mt-1.5 h-3 w-32' />
        </div>
      ))}
    </div>
  );
}

function ChartsRowSkeleton() {
  const chartCardIds = ['chart-card-1', 'chart-card-2'];

  return (
    <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {chartCardIds.map((cardId) => (
        <div key={cardId} className='border bg-card p-5'>
          <Skeleton className='mb-4 h-4 w-36' />
          <Skeleton className='h-48 w-full' />
        </div>
      ))}
    </div>
  );
}

function RecentReviewsSkeleton() {
  const headerColumns = [
    { id: 'header-name', width: 80 },
    { id: 'header-status', width: 48 },
    { id: 'header-score', width: 160 },
    { id: 'header-date', width: 64 },
    { id: 'header-action', width: 72 },
    { id: 'header-team', width: 56 },
    { id: 'header-location', width: 56 },
  ];

  const rowIds = [
    'review-row-1',
    'review-row-2',
    'review-row-3',
    'review-row-4',
    'review-row-5',
  ];

  const rowColumns = [
    { id: 'cell-name', width: 96 },
    { id: 'cell-status', width: 40 },
    { id: 'cell-score', width: 140 },
    { id: 'cell-date', width: 56 },
    { id: 'cell-action', width: 80 },
    { id: 'cell-team', width: 44 },
    { id: 'cell-location', width: 44 },
  ];

  return (
    <div className='mt-6'>
      <div className='mb-3 flex items-center justify-between'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-7 w-16' />
      </div>
      <div className='overflow-hidden border'>
        <div className='grid grid-cols-7 gap-4 border-b px-4 py-3'>
          {headerColumns.map((column) => (
            <Skeleton
              key={column.id}
              className='h-3.5'
              style={{ width: column.width }}
            />
          ))}
        </div>
        {rowIds.map((rowId) => (
          <div
            key={rowId}
            className='grid grid-cols-7 gap-4 border-b px-4 py-3.5 last:border-0'
          >
            {rowColumns.map((column) => (
              <Skeleton
                key={`${rowId}-${column.id}`}
                className='h-3.5'
                style={{ width: column.width }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentBreakdownSkeleton() {
  const agentIds = [
    'agent-breakdown-1',
    'agent-breakdown-2',
    'agent-breakdown-3',
    'agent-breakdown-4',
  ];

  return (
    <div className='mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {agentIds.map((agentId) => (
        <div
          key={agentId}
          className='flex flex-row items-center gap-3 border bg-card p-4'
        >
          <Skeleton className='h-8 w-8' />
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
