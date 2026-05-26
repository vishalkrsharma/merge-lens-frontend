import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FindingsFilterBar } from "@/components/findings-filter-bar";
import { FindingsTable } from "@/components/findings-table";
import { PageHeader } from "@/components/page-header";
import { SeverityBadge } from "@/components/severity-badge";
import { MOCK_FINDINGS, MOCK_REVIEWS, getHotspotFiles, type AgentType, type Severity } from "@/data/mock";

interface PageProps {
  searchParams: Promise<{ agent?: string; severity?: string; repo?: string; file?: string }>;
}

export default async function FindingsPage({ searchParams }: PageProps) {
  const { agent, severity, repo, file } = await searchParams;

  const filtered = MOCK_FINDINGS.filter((f) => {
    if (agent && agent !== "all" && f.agent !== (agent as AgentType)) return false;
    if (severity && severity !== "all" && f.severity !== (severity as Severity)) return false;
    if (file && !f.file.toLowerCase().includes(file.toLowerCase())) return false;
    if (repo && repo !== "all") {
      const review = MOCK_REVIEWS.find((r) => r.id === f.reviewId);
      if (!review || `${review.owner}/${review.repo}` !== repo) return false;
    }
    return true;
  });

  const hotspots = getHotspotFiles(5);
  const maxCount = hotspots[0]?.count ?? 1;

  return (
    <>
      <PageHeader
        title="Findings"
        description={`${filtered.length} finding${filtered.length !== 1 ? "s" : ""} across all repos`}
      />

      <Suspense>
        <FindingsFilterBar />
      </Suspense>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FindingsTable findings={filtered} showReviewLink />
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
              {(["high", "medium", "low"] as Severity[]).map((s) => {
                const count = filtered.filter((f) => f.severity === s).length;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <SeverityBadge severity={s} />
                    <span className="font-mono text-sm">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
