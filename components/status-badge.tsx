import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/lib/types";

const statusConfig: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-success": status === "completed",
          "bg-warning": status === "pending",
          "bg-destructive": status === "failed",
        })}
      />
      {config.label}
    </span>
  );
}
