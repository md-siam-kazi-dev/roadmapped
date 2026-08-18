"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, Loader2, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api/api-fetch";

interface InspectionCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: string;
  totalModule: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  creatorName: string;
  creatorEmail: string;
  moduleCount: number;
}

export default function InspectionCoursesPage() {
  const [courses, setCourses] = useState<InspectionCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiFetch<InspectionCourse[]>("/user/getinspectioncourses");
        if (!cancelled) {
          setCourses(data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load inspection courses.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const verify = async (courseId: string, action: "approve" | "reject") => {
    setVerifyingId(courseId);
    try {
      await apiFetch("/user/verifycourse", { courseId, action });
      toast.success(action === "approve" ? "Course approved." : "Course rejected.");
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update course.");
    } finally {
      setVerifyingId(null);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = normalizedQuery
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(normalizedQuery) ||
          c.creatorName.toLowerCase().includes(normalizedQuery) ||
          c.creatorEmail.toLowerCase().includes(normalizedQuery) ||
          c.level.toLowerCase().includes(normalizedQuery),
      )
    : courses;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Course Inspections
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Courses submitted by creators, waiting for your approval.
        </p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by title or creator…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action"
          aria-label="Search inspection courses"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <Search className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {normalizedQuery
              ? "No courses match your search."
              : "No courses awaiting inspection."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 font-medium text-muted-foreground">Course</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Creator</th>
                <th className="hidden p-3 font-medium text-muted-foreground sm:table-cell">Level</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Modules</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Submitted</th>
                <th className="p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course.id} className="border-b border-border last:border-0">
                  <td className="max-w-xs p-3">
                    <p className="truncate font-medium text-foreground">{course.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {course.description ?? "No description"}
                    </p>
                  </td>
                  <td className="hidden p-3 md:table-cell">
                    <p className="text-foreground">{course.creatorName}</p>
                    <p className="text-xs text-muted-foreground">{course.creatorEmail}</p>
                  </td>
                  <td className="hidden p-3 sm:table-cell">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {course.level}
                    </span>
                  </td>
                  <td className="hidden p-3 font-mono text-foreground md:table-cell">
                    {course.moduleCount ?? course.totalModule}
                  </td>
                  <td className="hidden p-3 text-xs text-muted-foreground md:table-cell">
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/course/${course.id}`}>
                          <Eye className="size-3.5" />
                          Details
                        </Link>
                      </Button>
                      {verifyingId === course.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-success/40 text-success hover:bg-success/5 hover:text-success"
                            onClick={() => void verify(course.id, "approve")}
                          >
                            <CheckCircle2 className="size-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-danger/40 text-danger hover:bg-danger/5 hover:text-danger"
                            onClick={() => void verify(course.id, "reject")}
                          >
                            <XCircle className="size-3.5" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}