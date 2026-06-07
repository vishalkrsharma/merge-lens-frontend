import { IconBolt, IconBug, IconLock, IconSparkles } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const config: Record<AgentType, { label: string; icon: React.ElementType; color: string }> = {
  bug: { label: "Bug", icon: IconBug, color: "text-red-400" },
  security: { label: "Security", icon: IconLock, color: "text-orange-400" },
  performance: { label: "Performance", icon: IconBolt, color: "text-yellow-400" },
  style: { label: "Style", icon: IconSparkles, color: "text-purple-400" },
};

export function AgentBadge({ agent, showLabel = true, className }: AgentBadgeProps) {
  const { label, icon: Icon, color } = config[agent];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-mono", color, className)}>
      <Icon size={14} />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
