import Link from "next/link";
import { IconAlertOctagon, IconAlertTriangle, IconClock, IconGitPullRequest } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AgentBadge } from "@/components/agent-badge";
import { FindingsBarChart } from "@/components/charts/findings-bar-chart";
import { ReviewsAreaChart } from "@/components/charts/reviews-area-chart";
import { PageHeader } from "@/components/page-header";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import { StatCard } from "@/components/stat-card";
import { getStats, listReviews } from "@/lib/api";
import type { AgentType } from "@/lib/types";

function formatDuration(ms: number) {
  if (ms === 0) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const [stats, { data: recentReviews }] = await Promise.all([
    getStats(),
    listReviews({ limit: "5" }),
  ]);

  const agentChartData = (["bug", "security", "performance", "style"] as AgentType[]).map((agent) => ({
    agent,
    count: stats.findingsByAgent[agent] ?? 0,
  }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your MergeLens PR reviews"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<IconGitPullRequest size={16} />}
          delta={`${stats.thisMonthReviews} this month`}
          deltaPositive
        />
        <StatCard
          title="Total Findings"
          value={stats.totalFindings}
          icon={<IconAlertTriangle size={16} />}
          delta={`${stats.findingsBySeverity.low ?? 0} low · ${stats.findingsBySeverity.medium ?? 0} med · ${stats.findingsBySeverity.high ?? 0} high`}
        />
        <StatCard
          title="High Severity"
          value={stats.findingsBySeverity.high ?? 0}
          icon={<IconAlertOctagon size={16} />}
          className="border-red-500/20"
        />
        <StatCard
          title="Avg Duration"
          value={formatDuration(stats.avgDurationMs)}
          icon={<IconClock size={16} />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reviews over time</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewsAreaChart data={stats.reviewsOverTime} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Findings by agent</CardTitle>
          </CardHeader>
          <CardContent>
            <FindingsBarChart data={agentChartData} />
          </CardContent>
        </Card>
      </div>

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
              {recentReviews.map((r) => (
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

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(["bug", "security", "performance", "style"] as AgentType[]).map((agent) => (
          <Card key={agent} className="flex flex-row items-center gap-3 p-4">
            <AgentBadge agent={agent} showLabel={false} className="text-lg" />
            <div>
              <p className="text-xs text-muted-foreground capitalize">{agent}</p>
              <p className="font-mono text-lg font-bold">{stats.findingsByAgent[agent] ?? 0}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
