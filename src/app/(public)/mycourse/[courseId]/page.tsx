"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Layers, Loader2, Pencil, Search, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api/api-fetch";

interface MyCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: string;
  totalModule: string;
  duration: number;
  createdAt: string;
  status: string;
}

/**
 * Skeleton card that mirrors the loaded Module card 1:1 —
 * icon + title row, status pill, description lines, and footer button.
 * Shimmer per DESIGN.md §3.
 */
function ModuleCardSkeleton() {
  return (
    <div className="animate-shimmer flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-3 h-3.5 w-full rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-4/5 rounded-md" />
      </div>
      <div className="flex-1 px-4">
        <Skeleton className="h-3.5 w-3/5 rounded-md" />
      </div>
      <div className="mt-auto p-4">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function EditCoursePage() {
  const params = useParams<{ courseId: string }>();
  const { data: session, isPending: isSessionPending } = useSession();
  const [course, setCourse] = useState<MyCourse | null>(null);
  const [alreadyEdit, setAlreadyEdit] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creatorId = session?.user?.id;
  const courseId = params.courseId;

  useEffect(() => {
    let cancelled = false;

    async function loadCourse() {
      if (!creatorId) {
        if (!isSessionPending) {
          setIsLoading(false);
          if (!cancelled) setError("Sign in to edit your course.");
        }
        return;
      }

      try {
        // Load course metadata
        const data = await apiFetch<MyCourse[]>(
          `/user/getmycourse?creatorId=${encodeURIComponent(creatorId)}`,
        );
        const found = (data ?? []).find((c) => c.id === courseId);

        // Load already-edited module state — just the array of moduleNumbers.
        let editedArray: number[] = [];
        try {
          const moduleData = await apiFetch<{
            courseId: string;
            alreadyEdit: number[];
          }>(`/user/getcoursemodules?courseId=${encodeURIComponent(courseId ?? "")}`);
          editedArray = moduleData?.alreadyEdit ?? [];
        } catch {
          // If the module-state fetch fails, leave alreadyEdit empty — module cards
          // still render with the default Edit button.
        }

        if (!cancelled) {
          if (found) {
            setCourse(found);
            setAlreadyEdit(editedArray);
            setError(null);
          } else {
            setError("Course not found.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load the course.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadCourse();

    return () => {
      cancelled = true;
    };
  }, [creatorId, courseId, isSessionPending]);

  const handleSubmitForApproval = async () => {
    if (!courseId) return;

    setIsSubmitting(true);
    try {
      await apiFetch("/user/courseverify", { courseId });
      toast.success("Course submitted for admin inspection.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalModules = Number(course?.totalModule ?? 0);
  const moduleNumbers = Array.from({ length: totalModules }, (_, i) => i + 1);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const queryNumber = Number(normalizedQuery);
  const hasExactNumber = normalizedQuery !== "" && Number.isFinite(queryNumber);
  const filteredModuleNumbers = normalizedQuery
    ? moduleNumbers.filter(
        (n) =>
          (hasExactNumber && n === queryNumber) ||
          `module ${n}` === normalizedQuery ||
          `module${n}` === normalizedQuery,
      )
    : moduleNumbers;

  if (error && !course) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 text-center sm:px-6">
        <p className="text-sm text-danger">{error}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/mycourse">Back to My Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground">
        <Link href="/mycourse">
          <ArrowLeft className="size-4" />
          Back to My Courses
        </Link>
      </Button>

      {/* ── Static header ── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Edit Course
          </h1>
          {isLoading ? (
            <Skeleton className="mt-2 h-4 w-56 rounded-md" />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{course?.title}</p>
          )}
          {!isLoading && course?.description ? (
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {course.description}
            </p>
          ) : null}
        </div>
        {isLoading ? (
          <div className="flex flex-col items-end gap-3">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-9 w-56 rounded-lg" />
          </div>
        ) : course ? (
          <div className="flex flex-col items-end gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono uppercase tracking-wider">
                {course.level}
              </span>
              <span>{course.totalModule} modules</span>
              <span>{course.duration} days</span>
            </div>
            {course.status === "inspection" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ember/10 px-3 py-1.5 text-xs font-medium text-ember">
                <Clock className="size-3.5" />
                In inspection
              </span>
            ) : course.status === "approved" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                <CheckCircle2 className="size-3.5" />
                Approved
              </span>
            ) : course.status === "rejected" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger">
                <XCircle className="size-3.5" />
                Rejected
              </span>
            ) : (
              <Button
                onClick={() => void handleSubmitForApproval()}
                disabled={isSubmitting}
                className="bg-action text-white hover:bg-action-hover"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Send className="mr-2 size-4" />
                )}
                Submit Course for Admin Approval
              </Button>
            )}
          </div>
        ) : null}
      </div>

      {/* ── Static search ── */}
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search modules to edit…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
          aria-label="Search modules"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ModuleCardSkeleton key={i} />
          ))}
        </div>
      ) : !course ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">Course not found.</p>
        </div>
      ) : filteredModuleNumbers.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <Search className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No modules match {"\u201C"}
            {searchQuery}
            {"\u201D"}.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setSearchQuery("")}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredModuleNumbers.map((n) => {
            const edited = alreadyEdit.includes(n);

            return (
              <Card key={n} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Layers className="size-5 text-action" />
                      <CardTitle className="text-base">Module {n}</CardTitle>
                    </div>
                    {edited ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        <CheckCircle2 className="size-3.5" />
                        Edited
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Not edited yet
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {edited
                      ? "This module's content is already saved to the platform."
                      : "Manage classes, quizzes, and order for this module."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground">
                  {edited
                    ? "You can re-edit its videos, quiz, or deadline anytime."
                    : `Add or edit videos (classes) for module ${n}.`}
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant={edited ? "default" : "outline"}
                    className={
                      edited
                        ? "w-full bg-action text-white hover:bg-action-hover"
                        : "w-full border-action/40 text-action hover:bg-action/5 hover:text-action"
                    }
                  >
                    <Link href={`/mycourse/${course.id}/editmodule/${n}`}>
                      <Pencil className="size-4" />
                      {edited ? `Re-Edit Module ${n}` : `Edit Module ${n}`}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/mycourse">Back to My Courses</Link>
        </Button>
      </div>
    </div>
  );
}