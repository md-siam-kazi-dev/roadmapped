import { Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Streak counter — FR-12, DESIGN.md §2.1 (ember token), §2.2 (IBM Plex Mono).
 * Renders the current streak with the Flame glyph. Driven by server-provided
 * streak data (mock in this pass); the ember color reads as urgency, not
 * decoration — reserved for the streak flame per the design system.
 */
export function StreakBadge({
  streak,
  className,
}: {
  streak: number;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-ember/30 bg-ember/10 px-2.5 py-1 font-mono text-xs font-medium text-ember",
        className
      )}
    >
      <Flame className="size-3.5" data-icon="inline-start" />
      {streak}
    </Badge>
  );
}