import Link from 'next/link';
import { ReviewStatusBadge } from '@/components/review-status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDuration(ms: number) {
  if (ms === 0) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className='mt-4 rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>PR</TableHead>
            <TableHead>Repository</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Findings</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className='py-12 text-center text-sm text-muted-foreground'
              >
                No reviews match the current filters.
              </TableCell>
            </TableRow>
          )}
          {reviews.map((r) => (
            <TableRow key={r.id}>
              <TableCell className='max-w-72 truncate text-sm'>
                <Link
                  href={`/reviews/${r.id}`}
                  className='hover:underline underline-offset-4'
                >
                  {r.prTitle}
                </Link>
              </TableCell>
              <TableCell className='font-mono text-xs'>
                #{r.pullNumber}
              </TableCell>
              <TableCell className='font-mono text-xs'>
                {r.owner}/{r.repo}
              </TableCell>

              <TableCell>
                <ReviewStatusBadge status={r.status} />
              </TableCell>
              <TableCell>
                <span className='font-mono text-xs'>
                  <span className='text-red-400'>{r.findingCounts.high}H</span>
                  {' · '}
                  <span className='text-amber-400'>
                    {r.findingCounts.medium}M
                  </span>
                  {' · '}
                  <span className='text-green-400'>{r.findingCounts.low}L</span>
                </span>
              </TableCell>
              <TableCell className='font-mono text-xs'>
                {formatDuration(r.durationMs)}
              </TableCell>
              <TableCell className='text-xs text-muted-foreground'>
                {formatDate(r.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
