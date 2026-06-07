import { IconBrandGoogle, IconRobot, IconUser } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiUsageItem, UsageStats } from "@/lib/types";

const providerMeta: Record<ApiUsageItem["provider"], { label: string; Icon: React.ElementType }> = {
  anthropic: { label: "Anthropic Claude", Icon: IconRobot },
  google: { label: "Google Gemini", Icon: IconBrandGoogle },
  voyage: { label: "Voyage AI", Icon: IconUser },
};

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function formatCost(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getMonthLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function UsageCard({ usage }: { usage: UsageStats }) {
  const usagePct = Math.min(100, Math.round((usage.thisMonthReviews / usage.monthlyLimit) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Usage this month</CardTitle>
        <CardDescription>{getMonthLabel()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">PR reviews</span>
            <span className="font-mono">
              <span className="font-semibold">{usage.thisMonthReviews}</span>
              <span className="text-muted-foreground"> / {usage.monthlyLimit}</span>
            </span>
          </div>
          <Progress value={usagePct} className="h-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {usage.monthlyLimit - usage.thisMonthReviews} reviews remaining this month
          </p>
        </div>

        <Separator />

        <div>
          <p className="mb-3 text-xs font-medium text-muted-foreground">API usage by provider</p>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Est. cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usage.apiUsage.map((row) => {
                  const meta = providerMeta[row.provider];
                  return (
                    <TableRow key={row.provider}>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <meta.Icon size={14} className="text-muted-foreground" />
                          {meta.label}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{row.calls}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatTokens(row.inputTokens + row.outputTokens)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{formatCost(row.costCents)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
