"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  date: string;
  count: number;
}

export function ReviewsAreaChart({ data }: { data: DataPoint[] }) {
  const displayData = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  const tickFormatter = (_: string, index: number) =>
    index % 5 === 0 ? (displayData[index]?.label ?? "") : "";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={displayData}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-chart-1)"
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor="var(--color-chart-1)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{
            fontSize: 11,
            fill: "var(--color-muted-foreground)",
            fontFamily: "var(--font-mono)",
          }}
          tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{
            fontSize: 11,
            fill: "var(--color-muted-foreground)",
            fontFamily: "var(--font-mono)",
          }}
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
          itemStyle={{ color: "var(--color-chart-1)" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          name="Reviews"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="url(#reviewsGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--color-chart-1)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
