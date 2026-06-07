/// <reference types="react" />

declare interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: string;
  deltaPositive?: boolean;
  className?: string;
}

declare interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

declare interface AgentBadgeProps {
  agent: AgentType;
  showLabel?: boolean;
  className?: string;
}

declare interface FindingsTableProps {
  findings: Finding[];
  showReviewLink?: boolean;
}

declare interface ReviewStatusBadgeProps {
  status: ReviewStatus;
  className?: string;
}

declare interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

declare interface AccountCardProps {
  user: { name: string; email: string; image?: string | null };
  repoCount: number;
}

declare interface GitHubSignInButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  children?: React.ReactNode;
  iconSize?: number;
}
