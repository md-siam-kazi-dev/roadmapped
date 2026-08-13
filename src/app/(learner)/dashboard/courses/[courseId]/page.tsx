import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourse } from "@/lib/api/courses";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  try {
    const course = await getCourse(courseId);
    return { title: `${course.title} — Roadmapped` };
  } catch {
    return { title: "Course — Roadmapped" };
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  let course;
  try {
    course = await getCourse(courseId);
  } catch {
    notFound();
  }

  const level = course.level.charAt(0).toUpperCase() + course.level.slice(1);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit capitalize">
          {level}
        </Badge>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
          {course.title}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          {course.description ?? "No description yet."}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href="/signup">Enroll & start Module 1</a>
          </Button>
          <span className="font-mono text-xs text-muted-foreground">
            {course.totalModule} modules · {course.duration > 0 ? `${course.duration}h` : "Self-paced"}
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Roadmap preview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One module unlocks per day. Complete the active module to advance.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {Array.from({ length: Math.max(course.totalModule, 1) }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">
                {i === 0 ? "Module 1 — starts immediately" : `Module ${i + 1} — unlocks daily`}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}