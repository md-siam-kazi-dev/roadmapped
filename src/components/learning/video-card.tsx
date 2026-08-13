import { CheckCircle2, Lock, Play } from "lucide-react";

import { cn } from "@/lib/utils";

export function VideoCard({
  title,
  orderIndex,
  moduleTitle,
  locked = false,
  completed = false,
}: {
  title: string;
  orderIndex: number;
  moduleTitle: string;
  locked?: boolean;
  completed?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-surface p-3",
        locked && "opacity-60"
      )}
    >
      <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
        <Play className={cn("size-5", locked ? "text-muted-foreground/50" : "text-primary")} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {moduleTitle} · Video {orderIndex}
        </p>
      </div>
      {completed && <CheckCircle2 className="ml-auto size-4 shrink-0 text-success" />}
      {locked && <Lock className="ml-auto size-4 shrink-0 text-muted-foreground/60" />}
    </div>
  );
}