"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Gem } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Gem balance counter — FR-13, DESIGN.md §2.1 (gem token, deliberately teal
 * not gold), §2.2 (IBM Plex Mono tabular figures), §3 (animated number counter).
 *
 * DESIGN.md §3 reserves Magic UI for the number-ticker flourish; the registry is
 * unreachable in this environment so the ticker is implemented with Framer Motion
 * (the project's micro-interaction stack). Respects `prefers-reduced-motion`.
 */
export function GemCounter({
  gems,
  className,
}: {
  gems: number;
  className?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const prevRef = React.useRef(0);

  React.useEffect(() => {
    const from = prevRef.current;
    prevRef.current = gems;
    count.set(from);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(count, gems, {
      duration: reduce ? 0 : 0.9,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [gems, count]);

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-gem/30 bg-gem/10 px-2.5 py-1 font-mono text-xs font-medium text-gem",
        className
      )}
      aria-label={`${gems} gems`}
    >
      <Gem className="size-3.5" data-icon="inline-start" />
      <motion.span>{rounded}</motion.span>
    </Badge>
  );
}