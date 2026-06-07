"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentBadge } from "@/components/agent-badge";
import { FindingsTable } from "@/components/findings-table";

const AGENT_TABS: { value: AgentType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bug", label: "Bug" },
  { value: "security", label: "Security" },
  { value: "performance", label: "Performance" },
  { value: "style", label: "Style" },
];

export function FindingsTabs({ findings }: { findings: Finding[] }) {
  const tabs = AGENT_TABS.map((t) => ({
    ...t,
    findings: t.value === "all" ? findings : findings.filter((f) => f.agent === t.value),
  }));

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
            {t.value !== "all" && <AgentBadge agent={t.value as AgentType} showLabel={false} />}
            {t.label}
            <span className="ml-1 font-mono text-xs opacity-60">({t.findings.length})</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          <FindingsTable findings={t.findings} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
