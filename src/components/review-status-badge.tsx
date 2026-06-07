import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const config: Record<
  ReviewStatus,
  { label: string; className: string; icon?: React.ElementType; spin?: boolean }
> = {
  completed: {
    label: "Completed",
    className: "bg-green-500/15 text-green-400 border-green-500/20",
    icon: IconCheck,
  },
  running: {
    label: "Running",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    icon: IconLoader2,
    spin: true,
  },
  pending: {
    label: "Pending",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/15 text-red-400 border-red-500/20",
    icon: IconX,
  },
};

export function ReviewStatusBadge({
  status,
  className,
}: ReviewStatusBadgeProps) {
  const { label, className: statusClass, icon: Icon, spin } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs",
        statusClass,
        className,
      )}
    >
      {Icon && <Icon size={12} className={cn(spin && "animate-spin")} />}
      {label}
    </span>
  );
}
