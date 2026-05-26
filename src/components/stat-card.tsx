import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  delta?: string;
  deltaPositive?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, delta, deltaPositive, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-2xl font-bold">{value}</div>
        {delta && (
          <p className={cn("mt-1 text-xs", deltaPositive ? "text-green-400" : "text-muted-foreground")}>
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
