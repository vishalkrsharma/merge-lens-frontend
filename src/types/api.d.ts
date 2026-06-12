declare type ReviewStatus = 'pending' | 'running' | 'completed' | 'failed';
declare type AgentType = 'bug' | 'security' | 'performance' | 'style';
declare type Severity = 'low' | 'medium' | 'high';
declare type ApiProvider = 'google' | 'openai' | 'anthropic' | 'voyage';
declare type ReviewProvider = 'google' | 'openai' | 'anthropic';

declare interface FindingCounts {
  high: number;
  medium: number;
  low: number;
  total: number;
}

declare interface Review {
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

declare interface Finding {
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

declare interface ReviewSummary {
  id: string;
  reviewId: string;
  bugSummary: string;
  securitySummary: string;
  performanceSummary: string;
  styleSummary: string;
  overallSummary: string;
}

declare interface ReviewDetail extends Review {
  findings: Finding[];
  summary: ReviewSummary | null;
}

declare interface Repository {
  id: string;
  owner: string;
  repo: string;
  installationId: number;
  isActive: boolean;
  enabledAgents: AgentType[];
  severityThreshold: Severity;
  installedAt: string;
}

declare interface Stats {
  totalReviews: number;
  totalFindings: number;
  findingsByAgent: Record<AgentType, number>;
  findingsBySeverity: Record<Severity, number>;
  reviewsOverTime: { date: string; count: number }[];
  avgDurationMs: number;
  thisMonthReviews: number;
}

declare interface ApiUsageItem {
  provider: 'anthropic' | 'google' | 'voyage';
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
}

declare interface UsageStats {
  thisMonthReviews: number;
  monthlyLimit: number;
  apiUsage: ApiUsageItem[];
}

declare interface GithubRepo {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  description: string | null;
}

declare interface SyncResult {
  synced: true;
  removed: string[];
  accessible: number;
  repositorySelection?: 'all' | 'selected';
}
