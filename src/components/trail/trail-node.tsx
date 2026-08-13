"use client";

import { Check, Lock, Play } from "lucide-react";

import { formatUnlocksIn } from "@/lib/utils/time";

export type TrailState = "completed" | "active" | "locked" | "scheduled";

export function TrailNode({ state, unlockAt }: { state: TrailState; unlockAt?: string }) {
  if (state === "completed") {
    return (
      <span data-trail-node className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-4" />
      </span>
    );
  }
  if (state === "active") {
    return (
      <span data-trail-node className="flex size-8 items-center justify-center rounded-full border-2 border-primary text-primary">
        <Play className="size-3.5 fill-current" />
      </span>
    );
  }
  if (state === "locked") {
    return (
      <span data-trail-node title={unlockAt ? formatUnlocksIn(unlockAt) : undefined} className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground">
        <Lock className="size-3.5" />
      </span>
    );
  }
  return (
    <span data-trail-node className="flex size-8 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground/50">
      <span className="size-1.5 rounded-full bg-muted-foreground/40" />
    </span>
  );
}