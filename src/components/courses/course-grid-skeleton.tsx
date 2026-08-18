import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";

/**
 * Course catalog loading state (DESIGN.md §3 — skeletons, never spinners).
 * Renders a grid of card-shaped skeletons mirroring CourseCard 1:1.
 */
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
