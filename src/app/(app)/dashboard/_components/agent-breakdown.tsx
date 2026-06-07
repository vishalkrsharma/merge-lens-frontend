import { Card } from "@/components/ui/card";
import { AgentBadge } from "@/components/agent-badge";
import type { AgentType, Stats } from "@/lib/types";

const AGENTS: AgentType[] = ["bug", "security", "performance", "style"];

export function AgentBreakdown({ stats }: { stats: Stats }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {AGENTS.map((agent) => (
        <Card key={agent} className="flex flex-row items-center gap-3 p-4">
          <AgentBadge agent={agent} showLabel={false} className="text-lg" />
          <div>
            <p className="text-xs text-muted-foreground capitalize">{agent}</p>
            <p className="font-mono text-lg font-bold">{stats.findingsByAgent[agent] ?? 0}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
