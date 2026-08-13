import type { Metadata } from "next";

import { CourseCatalog } from "@/components/courses/course-catalog";
import { CourseGridSkeleton } from "@/components/courses/course-grid-skeleton";
import { getCourses } from "@/lib/api/courses";

export const metadata: Metadata = { title: "Courses — Roadmapped" };

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses;
  let error: string | null = null;

  try {
    courses = await getCourses();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load courses";
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Courses
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Free YouTube content, reorganized into ordered daily roadmaps.
        </p>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            Couldn't load courses
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
        </div>
      ) : courses ? (
        <CourseCatalog courses={courses} />
      ) : (
        <CourseGridSkeleton />
      )}
    </main>
  );
}