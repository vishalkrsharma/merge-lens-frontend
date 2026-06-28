'use client';

import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { AgentBadge } from '@/components/agent-badge';
import { SeverityBadge } from '@/components/severity-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const severityOrder: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

export function FindingsTable({
  findings,
  showReviewLink = false,
}: FindingsTableProps) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

  const sorted = [...findings].sort((a, b) => {
    if (!sortDir) return 0;
    const diff = severityOrder[a.severity] - severityOrder[b.severity];
    return sortDir === 'asc' ? diff : -diff;
  });

  const SortIcon =
    sortDir === 'asc'
      ? IconSortAscending
      : sortDir === 'desc'
        ? IconSortDescending
        : IconArrowsSort;

  function toggleSort() {
    setSortDir((prev) =>
      prev === null ? 'asc' : prev === 'asc' ? 'desc' : null,
    );
  }

  if (findings.length === 0) {
    return (
      <div className='border border-dashed py-12 text-center text-sm text-muted-foreground'>
        No findings
      </div>
    );
  }

  return (
    <div className='border overflow-hidden'>
      <Table className='table-fixed w-full'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-28'>
              <button
                onClick={toggleSort}
                className='inline-flex items-center gap-1 font-medium hover:text-foreground'
                type='button'
              >
                Severity <SortIcon size={14} />
              </button>
            </TableHead>
            <TableHead className='w-24'>Agent</TableHead>
            <TableHead className='w-40'>File</TableHead>
            <TableHead className='w-14'>Line</TableHead>
            <TableHead className='w-[30%]'>Issue</TableHead>
            <TableHead className='w-[30%]'>Suggestion</TableHead>
            {showReviewLink && <TableHead className='w-16'>Review</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((f) => (
            <TableRow key={f.id}>
              <TableCell>
                <SeverityBadge severity={f.severity} />
              </TableCell>
              <TableCell>
                <AgentBadge agent={f.agent} />
              </TableCell>
              <TableCell className='max-w-0 overflow-hidden'>
                <span className='font-mono text-xs text-muted-foreground break-all'>
                  {f.file}
                </span>
              </TableCell>
              <TableCell>
                <span className='font-mono text-xs'>{f.line}</span>
              </TableCell>
              <TableCell className='max-w-0 overflow-hidden align-top text-sm'>
                <div className='break-words whitespace-normal'>{f.issue}</div>
              </TableCell>
              <TableCell className='max-w-0 overflow-hidden align-top text-sm text-muted-foreground'>
                <div className='break-words whitespace-normal'>{f.suggestion}</div>
              </TableCell>
              {showReviewLink && (
                <TableCell>
                  <Link
                    href={`/reviews/${f.reviewId}`}
                    className='text-xs text-primary underline-offset-4 hover:underline'
                  >
                    View
                  </Link>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
