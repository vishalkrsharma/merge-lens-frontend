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
import { MOCK_REVIEWS, getReviewStats } from "@/data/mock";

const MONTHLY_LIMIT = 50;

const apiUsage = [
  { provider: "Anthropic Claude", icon: IconRobot, calls: 18, tokens: "142k", cost: "$1.42" },
  { provider: "Google Gemini", icon: IconBrandGoogle, calls: 72, tokens: "680k", cost: "$0.68" },
  { provider: "Voyage AI", icon: IconUser, calls: 36, tokens: "—", cost: "$0.18" },
];

export default async function SettingsPage() {
  const session = await getSession();
  const user = session!.user;
  const stats = getReviewStats();
  const usagePct = Math.min(100, Math.round((stats.thisMonthReviews / MONTHLY_LIMIT) * 100));

  return (
    <>
      <PageHeader title="Settings" description="Usage tracking and account information" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Usage this month</CardTitle>
            <CardDescription>May 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">PR reviews</span>
                <span className="font-mono">
                  <span className="font-semibold">{stats.thisMonthReviews}</span>
                  <span className="text-muted-foreground"> / {MONTHLY_LIMIT}</span>
                </span>
              </div>
              <Progress value={usagePct} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">{MONTHLY_LIMIT - stats.thisMonthReviews} reviews remaining this month</p>
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
                    {apiUsage.map((row) => (
                      <TableRow key={row.provider}>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <row.icon size={14} className="text-muted-foreground" />
                            {row.provider}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{row.calls}</TableCell>
                        <TableCell className="font-mono text-xs">{row.tokens}</TableCell>
                        <TableCell className="font-mono text-xs">{row.cost}</TableCell>
                      </TableRow>
                    ))}
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
                <span className="font-mono">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total reviews</span>
                <span className="font-mono">{stats.totalReviews}</span>
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
