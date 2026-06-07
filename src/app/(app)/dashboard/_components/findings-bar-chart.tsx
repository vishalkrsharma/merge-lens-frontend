"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AgentType } from "@/lib/types";

interface DataPoint {
  agent: AgentType;
  count: number;
}

const agentLabels: Record<AgentType, string> = {
  bug: "Bug",
  security: "Security",
  performance: "Perf",
  style: "Style",
};

const agentColors: Record<AgentType, string> = {
  bug: "var(--color-chart-1)",
  security: "var(--color-chart-2)",
  performance: "var(--color-chart-3)",
  style: "var(--color-chart-4)",
};

export function FindingsBarChart({ data }: { data: DataPoint[] }) {
  const displayData = data.map((d) => ({ ...d, label: agentLabels[d.agent] }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={displayData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
          }}
          labelStyle={{ color: "var(--color-foreground)" }}
          cursor={{ fill: "var(--color-muted)", opacity: 0.3 }}
        />
        <Bar dataKey="count" name="Findings" radius={[4, 4, 0, 0]}>
          {displayData.map((entry) => (
            <Cell key={entry.agent} fill={agentColors[entry.agent]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
