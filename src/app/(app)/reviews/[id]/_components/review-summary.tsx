import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AgentBadge } from "@/components/agent-badge";

const AGENT_SUMMARY_KEYS: { agent: AgentType; key: keyof ReviewSummary }[] = [
  { agent: "bug", key: "bugSummary" },
  { agent: "security", key: "securitySummary" },
  { agent: "performance", key: "performanceSummary" },
  { agent: "style", key: "styleSummary" },
];

export function ReviewSummaryCard({ summary }: { summary: ReviewSummary }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{summary.overallSummary}</p>
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AGENT_SUMMARY_KEYS.map(({ agent, key }) => (
            <div key={agent}>
              <AgentBadge agent={agent} showLabel className="mb-1" />
              <p className="text-xs text-muted-foreground leading-relaxed">{summary[key] as string}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
