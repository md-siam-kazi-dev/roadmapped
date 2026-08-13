"use client";

import { cn } from "@/lib/utils";

const LEVELS = ["all", "beginner", "intermediate", "advanced"];

/**
 * Course level filter — a quiet segmented control. `onChange` returns the
 * active level; the parent filters the grid.
 */
export function CourseFilters({
  active,
  onChange,
}: {
  active: string;
  onChange: (level: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={cn(
            "h-8 rounded-lg border px-3 text-sm font-medium transition-colors",
            active === level
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-muted"
          )}
        >
          {level === "all" ? "All levels" : level.charAt(0).toUpperCase() + level.slice(1)}
        </button>
      ))}
    </div>
  );
}