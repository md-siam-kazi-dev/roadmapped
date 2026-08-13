"use client";

import { Check, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MarkCompleteButton({
  completed,
  onComplete,
}: {
  completed: boolean;
  onComplete?: () => void;
}) {
  if (completed) {
    return (
      <Button variant="outline" disabled className="text-success">
        <Check data-icon="inline-start" />
        Completed
      </Button>
    );
  }
  return (
    <Button onClick={onComplete}>
      <CheckCircle2 data-icon="inline-start" />
      Mark as Complete
    </Button>
  );
}