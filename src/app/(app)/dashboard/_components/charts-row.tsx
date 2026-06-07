import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FindingsBarChart } from "./findings-bar-chart";
import { ReviewsAreaChart } from "./reviews-area-chart";

export function ChartsRow({ stats }: { stats: Stats }) {
  const agentChartData = (["bug", "security", "performance", "style"] as AgentType[]).map((agent) => ({
    agent,
    count: stats.findingsByAgent[agent] ?? 0,
  }));

  return (
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
  );
}
