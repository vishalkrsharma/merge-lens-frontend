"use client";

import { useState } from "react";
import Link from "next/link";
import { IconArrowsSort, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SeverityBadge } from "@/components/severity-badge";
import { AgentBadge } from "@/components/agent-badge";
import type { Finding, Severity } from "@/data/mock";

interface FindingsTableProps {
  findings: Finding[];
  showReviewLink?: boolean;
}

const severityOrder: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

export function FindingsTable({ findings, showReviewLink = false }: FindingsTableProps) {
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);

  const sorted = [...findings].sort((a, b) => {
    if (!sortDir) return 0;
    const diff = severityOrder[a.severity] - severityOrder[b.severity];
    return sortDir === "asc" ? diff : -diff;
  });

  const SortIcon = sortDir === "asc" ? IconSortAscending : sortDir === "desc" ? IconSortDescending : IconArrowsSort;

  function toggleSort() {
    setSortDir((prev) => (prev === null ? "asc" : prev === "asc" ? "desc" : null));
  }

  if (findings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        No findings
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button
                onClick={toggleSort}
                className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                type="button"
              >
                Severity <SortIcon size={14} />
              </button>
            </TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="w-16">Line</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Suggestion</TableHead>
            {showReviewLink && <TableHead>Review</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((f) => (
            <TableRow key={f.id}>
              <TableCell><SeverityBadge severity={f.severity} /></TableCell>
              <TableCell><AgentBadge agent={f.agent} /></TableCell>
              <TableCell>
                <span className="font-mono text-xs text-muted-foreground">{f.file}</span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">{f.line}</span>
              </TableCell>
              <TableCell className="max-w-xs text-sm">{f.issue}</TableCell>
              <TableCell className="max-w-xs text-sm text-muted-foreground">{f.suggestion}</TableCell>
              {showReviewLink && (
                <TableCell>
                  <Link
                    href={`/reviews/${f.reviewId}`}
                    className="text-xs text-primary underline-offset-4 hover:underline"
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
