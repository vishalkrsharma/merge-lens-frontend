import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentBadge } from "@/components/agent-badge";
import { FindingsTable } from "@/components/findings-table";
import { PageHeader } from "@/components/page-header";
import { ReviewStatusBadge } from "@/components/review-status-badge";
import { getReview } from "@/lib/api";
import type { AgentType } from "@/lib/types";

function formatDuration(ms: number) {
  if (ms === 0) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const agentSummaryKeys = [
  { agent: "bug" as AgentType, key: "bugSummary" as const, label: "Bug" },
  { agent: "security" as AgentType, key: "securitySummary" as const, label: "Security" },
  { agent: "performance" as AgentType, key: "performanceSummary" as const, label: "Performance" },
  { agent: "style" as AgentType, key: "styleSummary" as const, label: "Style" },
];

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  let review;
  try {
    review = await getReview(id);
  } catch {
    notFound();
  }

  const { findings, summary } = review;

  const tabs = [
    { value: "all", label: "All", findings },
    { value: "bug", label: "Bug", findings: findings.filter((f) => f.agent === "bug") },
    { value: "security", label: "Security", findings: findings.filter((f) => f.agent === "security") },
    { value: "performance", label: "Performance", findings: findings.filter((f) => f.agent === "performance") },
    { value: "style", label: "Style", findings: findings.filter((f) => f.agent === "style") },
  ];

  return (
    <>
      <div className="mb-4">
        <Link href="/reviews" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <IconArrowLeft size={14} />
          Back to reviews
        </Link>
      </div>

      <PageHeader
        title={review.prTitle}
        description={`${review.owner}/${review.repo} · PR #${review.pullNumber} · commit ${review.commitId}`}
        action={<ReviewStatusBadge status={review.status} />}
      />

      <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>Started: {formatDate(review.createdAt)}</span>
        {review.completedAt && <span>Completed: {formatDate(review.completedAt)}</span>}
        <span>Duration: {formatDuration(review.durationMs)}</span>
        <span className="font-mono text-xs">
          <span className="text-red-400">{review.findingCounts.high}H</span>
          {" · "}
          <span className="text-amber-400">{review.findingCounts.medium}M</span>
          {" · "}
          <span className="text-green-400">{review.findingCounts.low}L</span>
        </span>
      </div>

      {summary && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{summary.overallSummary}</p>
            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {agentSummaryKeys.map(({ agent, key, label }) => (
                <div key={agent}>
                  <AgentBadge agent={agent} showLabel className="mb-1" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{summary[key]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
    </>
  );
}
