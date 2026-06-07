export type ReviewStatus = "pending" | "running" | "completed" | "failed";
export type AgentType = "bug" | "security" | "performance" | "style";
export type Severity = "low" | "medium" | "high";

export interface FindingCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface Review {
  id: string;
  owner: string;
  repo: string;
  pullNumber: number;
  prTitle: string;
  commitId: string;
  status: ReviewStatus;
  durationMs: number;
  createdAt: string;
  completedAt: string | null;
  findingCounts: FindingCounts;
}

export interface Finding {
  id: string;
  reviewId: string;
  agent: AgentType;
  file: string;
  line: number;
  severity: Severity;
  issue: string;
  suggestion: string;
  review?: { id: string; owner: string; repo: string };
}

export interface ReviewSummary {
  id: string;
  reviewId: string;
  bugSummary: string;
  securitySummary: string;
  performanceSummary: string;
  styleSummary: string;
  overallSummary: string;
}

export interface ReviewDetail extends Review {
  findings: Finding[];
  summary: ReviewSummary | null;
}

export interface Repository {
  id: string;
  owner: string;
  repo: string;
  installationId: number;
  enabledAgents: AgentType[];
  severityThreshold: Severity;
  installedAt: string;
}

export interface Stats {
  totalReviews: number;
  totalFindings: number;
  findingsByAgent: Record<AgentType, number>;
  findingsBySeverity: Record<Severity, number>;
  reviewsOverTime: { date: string; count: number }[];
  avgDurationMs: number;
  thisMonthReviews: number;
}

export interface ApiUsageItem {
  provider: "anthropic" | "google" | "voyage";
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
}

export interface UsageStats {
  thisMonthReviews: number;
  monthlyLimit: number;
  apiUsage: ApiUsageItem[];
}

export interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  description: string | null;
}

export interface SyncResult {
  synced: true;
  removed: string[];
  accessible: number;
  repositorySelection?: 'all' | 'selected';
}
