import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Course card loading state (PRD.md §6.2, DESIGN.md §3 — skeletons, never spinners).
 * Mirrors CourseCard 1:1 so layout doesn't shift when real data streams in.
 * Relies on the Skeleton's built-in `animate-pulse` for the pulsing effect.
 */
export function CourseCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="aspect-video w-full rounded-none" />

      <CardHeader>
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="mt-2 h-6 w-3/4 rounded-md" />
        <Skeleton className="mt-2 h-4 w-full rounded-md" />
        <Skeleton className="mt-1.5 h-4 w-2/3 rounded-md" />
      </CardHeader>

      <CardContent className="flex items-center gap-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </CardContent>

      <CardFooter className="mt-auto">
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
