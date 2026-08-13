import { Clock, Layers, PlayCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CourseRecord } from "@/types/api";

/**
 * Course card — PRD.md §6.2 (catalog), DESIGN.md §2.3.
 * Quiet card: thumbnail, level badge, Fraunces title, clamped description,
 * and mono data (modules + duration). Sage CTA reserved for the primary action.
 */
export function CourseCard({ course }: { course: CourseRecord }) {
  const level = course.level.charAt(0).toUpperCase() + course.level.slice(1);

  return (
    <Card className="flex flex-col overflow-hidden">
      {course.thumbnailUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={course.thumbnailUrl} alt="" className="aspect-video w-full object-cover" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-surface">
          <PlayCircle className="size-10 text-muted-foreground/40" />
        </div>
      )}

      <CardHeader>
        <Badge variant="outline" className="w-fit capitalize">{level}</Badge>
        <CardTitle className="font-display text-lg">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description ?? "No description yet."}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" data-icon="inline-start" />
          {course.totalModule} {course.totalModule === 1 ? "module" : "modules"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" data-icon="inline-start" />
          {course.duration > 0 ? `${course.duration}h` : "Self-paced"}
        </span>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild size="sm" className="w-full">
          <Link href={`/courses/${course.id}`}>View roadmap</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}