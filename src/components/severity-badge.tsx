import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<Severity, string> = {
  high: "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/20",
  medium:
    "bg-amber-500/15 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  low: "bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/20",
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge
      className={cn(
        "border font-mono text-xs uppercase",
        styles[severity],
        className,
      )}
    >
      {severity}
    </Badge>
  );
}
