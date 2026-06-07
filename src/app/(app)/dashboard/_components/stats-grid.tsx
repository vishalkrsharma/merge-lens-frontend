import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconClock,
  IconGitPullRequest,
} from "@tabler/icons-react";
import { StatCard } from "@/components/stat-card";

function formatDuration(ms: number) {
  if (ms === 0) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

export function StatsGrid({ stats }: { stats: Stats }) {
  return (
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
  );
}
