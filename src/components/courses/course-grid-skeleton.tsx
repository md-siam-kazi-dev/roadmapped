import { Skeleton } from "@/components/ui/skeleton";

/**
 * Course catalog loading state (DESIGN.md §3 — skeletons, never spinners).
 * Renders a grid of six card-shaped skeletons.
 */
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <div className="flex aspect-video items-center justify-center bg-surface">
            <Skeleton className="aspect-video w-full rounded-none" />
          </div>
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}