import { PageHeader } from "@/components/page-header";
import { getStats, listReviews } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { AgentBreakdown } from "./_components/agent-breakdown";
import { ChartsRow } from "./_components/charts-row";
import { RecentReviewsTable } from "./_components/recent-reviews-table";
import { StatsGrid } from "./_components/stats-grid";

export default async function DashboardPage() {
  const _session = await getSession();

  const [stats, { data: recentReviews }] = await Promise.all([
    getStats(),
    listReviews({ limit: "5" }),
  ]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your MergeLens PR reviews"
      />
      <StatsGrid stats={stats} />
      <ChartsRow stats={stats} />
      <RecentReviewsTable reviews={recentReviews} />
      <AgentBreakdown stats={stats} />
    </>
  );
}
