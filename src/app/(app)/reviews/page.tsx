import Link from "next/link";
import { Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import { ReviewsFilterBar } from "@/components/reviews-filter-bar";
import { MOCK_FINDINGS, MOCK_REVIEWS, type ReviewStatus } from "@/data/mock";

function formatDuration(ms: number) {
  if (ms === 0) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface PageProps {
  searchParams: Promise<{ repo?: string; status?: string; q?: string }>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const { repo, status, q } = await searchParams;

  const filtered = MOCK_REVIEWS.filter((r) => {
    if (repo && repo !== "all" && `${r.owner}/${r.repo}` !== repo) return false;
    if (status && status !== "all" && r.status !== (status as ReviewStatus)) return false;
    if (q && !r.prTitle.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Reviews"
        description={`${filtered.length} review${filtered.length !== 1 ? "s" : ""}`}
      />

      <Suspense>
        <ReviewsFilterBar />
      </Suspense>

      <div className="mt-4 rounded-lg border">
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No reviews match the current filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => {
              const findings = MOCK_FINDINGS.filter((f) => f.reviewId === r.id);
              const high = findings.filter((f) => f.severity === "high").length;
              const medium = findings.filter((f) => f.severity === "medium").length;
              const low = findings.filter((f) => f.severity === "low").length;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.owner}/{r.repo}</TableCell>
                  <TableCell className="font-mono text-xs">#{r.pullNumber}</TableCell>
                  <TableCell className="max-w-72 truncate text-sm">
                    <Link href={`/reviews/${r.id}`} className="hover:underline underline-offset-4">
                      {r.prTitle}
                    </Link>
                  </TableCell>
                  <TableCell><ReviewStatusBadge status={r.status} /></TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">
                      <span className="text-red-400">{high}H</span>
                      {" · "}
                      <span className="text-amber-400">{medium}M</span>
                      {" · "}
                      <span className="text-green-400">{low}L</span>
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{formatDuration(r.durationMs)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
