import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/types";

function formatDuration(ms: number) {
  if (ms === 0) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">Recent reviews</h2>
        <Link href="/reviews" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          View all
        </Link>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>PR</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Findings</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.owner}/{r.repo}</TableCell>
                <TableCell className="font-mono text-xs">#{r.pullNumber}</TableCell>
                <TableCell className="max-w-56 truncate text-sm">
                  <Link href={`/reviews/${r.id}`} className="hover:underline">{r.prTitle}</Link>
                </TableCell>
                <TableCell><ReviewStatusBadge status={r.status} /></TableCell>
                <TableCell>
                  <span className="font-mono text-xs">
                    <span className="text-red-400">{r.findingCounts.high}H</span>
                    {" · "}
                    <span className="text-amber-400">{r.findingCounts.medium}M</span>
                    {" · "}
                    <span className="text-green-400">{r.findingCounts.low}L</span>
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">{formatDuration(r.durationMs)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
