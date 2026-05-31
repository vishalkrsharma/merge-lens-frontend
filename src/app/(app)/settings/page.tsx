import { IconBrandGoogle, IconRobot, IconUser } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { PageHeader } from "@/components/page-header";
import { SignOutButton } from "@/components/sign-out-button";
import { getSession } from "@/lib/auth";
import { getUsage, listRepositories } from "@/lib/api";
import type { ApiUsageItem } from "@/lib/types";

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

export default async function SettingsPage() {
  const [session, usage, repos] = await Promise.all([
    getSession(),
    getUsage(),
    listRepositories(),
  ]);

  const user = session!.user;
  const usagePct = Math.min(100, Math.round((usage.thisMonthReviews / usage.monthlyLimit) * 100));

  return (
    <>
      <PageHeader title="Settings" description="Usage tracking and account information" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Account</CardTitle>
            <CardDescription>Your GitHub identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback>{user.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected account</span>
                <span className="font-mono">GitHub</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repositories</span>
                <span className="font-mono">{repos.length}</span>
              </div>
            </div>

            <Separator />

            <SignOutButton />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
