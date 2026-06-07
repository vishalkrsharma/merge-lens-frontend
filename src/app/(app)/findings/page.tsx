import { Suspense } from "react";
import { FindingsTable } from "@/components/findings-table";
import { PageHeader } from "@/components/page-header";
import { getHotspots, listFindings, listRepositories } from "@/lib/api";
import { FindingsFilterBar } from "./_components/findings-filter-bar";
import { HotspotsCard } from "./_components/hotspots-card";
import { SeverityCard } from "./_components/severity-card";

interface PageProps {
  searchParams: Promise<{
    agent?: string;
    severity?: string;
    repo?: string;
    file?: string;
  }>;
}

export default async function FindingsPage({ searchParams }: PageProps) {
  const { agent, severity, repo, file } = await searchParams;

  const [{ data: findings, total }, hotspots, repos] = await Promise.all([
    listFindings({ agent, severity, repo, file, limit: "200" }),
    getHotspots(5),
    listRepositories(),
  ]);

  const bySeverity: Record<Severity, number> = {
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };

  return (
    <>
      <PageHeader
        title="Findings"
        description={`${total} finding${total !== 1 ? "s" : ""} across all repos`}
      />
      <Suspense>
        <FindingsFilterBar repos={repos} />
      </Suspense>
      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FindingsTable findings={findings} showReviewLink />
        </div>
        <div>
          <HotspotsCard hotspots={hotspots} />
          <SeverityCard counts={bySeverity} />
        </div>
      </div>
    </>
  );
}
