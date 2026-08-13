"use client";

import * as React from "react";

import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters } from "@/components/courses/course-filters";
import type { CourseRecord } from "@/types/api";

/**
 * Client-side course catalog — fetches nothing itself; receives the server-
 * fetched course list and handles the level filter locally (PRD.md §6.2 FR-5).
 */
export function CourseCatalog({ courses }: { courses: CourseRecord[] }) {
  const [level, setLevel] = React.useState("all");

  const filtered =
    level === "all" ? courses : courses.filter((c) => c.level === level);

  return (
    <div className="flex flex-col gap-6">
      <CourseFilters active={level} onChange={setLevel} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            No courses found
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            There are no {level !== "all" ? `${level} ` : ""}courses published yet.
            Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}