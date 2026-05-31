import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FindingsFilterBar } from "@/components/findings-filter-bar";
import { FindingsTable } from "@/components/findings-table";
import { PageHeader } from "@/components/page-header";
import { SeverityBadge } from "@/components/severity-badge";
import { getHotspots, listFindings, listRepositories } from "@/lib/api";
import type { Severity } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ agent?: string; severity?: string; repo?: string; file?: string }>;
}

export default async function FindingsPage({ searchParams }: PageProps) {
  const { agent, severity, repo, file } = await searchParams;

  const [{ data: findings, total }, hotspots, repos] = await Promise.all([
    listFindings({ agent, severity, repo, file, limit: "200" }),
    getHotspots(5),
    listRepositories(),
  ]);

  const maxCount = hotspots[0]?.count ?? 1;

  const bySeverity: Record<Severity, number> = {
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };

  return (
    <>
      <PageHeader
        title="Findings"
        description={`${total} finding${total !== 1 ? "s" : ""} across all repos`}
      />

      <Suspense>
        <FindingsFilterBar repos={repos} />
      </Suspense>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FindingsTable findings={findings} showReviewLink />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Hotspot files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hotspots.map(({ file: f, count }) => (
                <div key={f}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs text-muted-foreground">{f.split("/").slice(-1)[0]}</span>
                    <span className="font-mono text-xs font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground/60">{f}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">By severity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["high", "medium", "low"] as Severity[]).map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <SeverityBadge severity={s} />
                  <span className="font-mono text-sm">{bySeverity[s]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
