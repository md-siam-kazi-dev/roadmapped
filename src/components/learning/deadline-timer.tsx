"use client";

import { Clock } from "lucide-react";

import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";
import { formatCountdown } from "@/lib/utils/time";

export function DeadlineTimer({ deadlineAt, className }: { deadlineAt: string; className?: string }) {
  const cd = useCountdown(deadlineAt);

  const atRisk = !cd.expired && cd.hours < 1;
  const label = cd.expired ? "Deadline passed" : formatCountdown(cd);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs",
        cd.expired && "border-danger/40 bg-danger/10 text-danger",
        atRisk && "border-ember/40 bg-ember/10 text-ember",
        !atRisk && !cd.expired && "border-border bg-surface text-muted-foreground",
        className
      )}
    >
      <Clock className="size-3" />
      {label}
    </span>
  );
}