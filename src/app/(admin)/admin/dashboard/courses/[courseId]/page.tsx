"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  ListVideo,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api/api-fetch";

interface InspectionModule {
  id: string;
  moduleNumber: number;
  title: string | null;
  text: string | null;
  totalVideo: number;
  deadlineTime: number | null;
  videos: { id: string; order: number; videoLink: string | null; videoTitle: string | null }[];
  quizzes: { id: string; question: unknown }[];
}

interface CourseInspection {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: string;
  status: string;
  totalModule: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  creator: { id: string; name: string; email: string };
  modules: InspectionModule[];
}

/**
 * Admin course inspection detail — the "Details" destination from the admin
 * Courses (inspection queue) page. Loads the full course via
 * `/user/getcourseinspection` (metadata + all modules with videos & quizzes),
 * lets the admin review everything, then Decide: Approve → status "approved"
 * + isPublished true; Reject → status "rejected".
 */
export default function AdminCourseInspectionPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params.courseId;

  const [data, setData] = useState<CourseInspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await apiFetch<CourseInspection>(
          `/user/getcourseinspection?courseId=${encodeURIComponent(courseId ?? "")}`,
        );
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load course.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const decide = async (action: "approve" | "reject") => {
    if (!courseId) return;
    setIsUpdating(true);
    try {
      await apiFetch("/user/verifycourse", { courseId, action });
      toast.success(
        action === "approve"
          ? "Course approved and published."
          : "Course rejected.",
      );
      router.push("/admin/dashboard/courses");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update course.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto w-full max-w-2xl py-8 text-center">
        <p className="text-sm text-danger">{error ?? "Course not found."}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/dashboard/courses">Back to Inspections</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      {/* ── Top bar: back + review status ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
          <Link href="/admin/dashboard/courses">
            <ArrowLeft className="size-4" />
            Back to Inspections
          </Link>
        </Button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-3 py-1 font-mono text-xs font-medium text-ember">
          <Clock className="size-3.5" />
          Awaiting review
        </span>
      </div>

      {/* ── Course overview ── */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {data.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono uppercase tracking-wider">
                {data.level}
              </span>
              <span>{data.totalModule} modules</span>
              <span>
                {data.duration} hour{data.duration === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                Submitted {new Date(data.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-3 text-sm">
          <p className="text-xs font-medium text-muted-foreground">
            Creator: <span className="text-foreground">{data.creator.name}</span>{" "}
            <span className="text-muted-foreground">({data.creator.email})</span>
          </p>
        </div>
      </div>

      {/* ── Modules (full review data) ── */}
      {data.modules.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <Layers className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No modules have been added to this course yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="size-5 text-action" />
                  <CardTitle className="text-base">
                    Module {module.moduleNumber}
                    {module.title ? ` — ${module.title}` : ""}
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {module.deadlineTime ?? 1} day deadline · {module.totalVideo} videos ·{" "}
                  {module.quizzes.length} quiz question
                  {module.quizzes.length === 1 ? "" : "s"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {module.text ? (
                  <div
                    className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: module.text }}
                  />
                ) : null}

                {/* Videos */}
                <div>
                  <p className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <ListVideo className="size-3.5" />
                    Videos
                  </p>
                  {module.videos.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No videos.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {module.videos.map((v) => (
                        <li
                          key={v.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-foreground">
                            {v.order}. {v.videoTitle ?? "Untitled"}
                          </span>
                          <a
                            href={v.videoLink ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-action hover:underline"
                          >
                            {v.videoLink}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Quizzes */}
                <div>
                  <p className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <HelpCircle className="size-3.5" />
                    Quiz ({module.quizzes.length})
                  </p>
                  {module.quizzes.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No quiz questions.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {module.quizzes.map((q, idx) => {
                        const qq = (q.question ?? {}) as Record<string, string>;
                        return (
                          <li
                            key={q.id}
                            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                          >
                            <p className="font-medium text-foreground">
                              Q{idx + 1}: {qq.question ?? "Untitled question"}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {[qq.option1, qq.option2, qq.option3, qq.option4]
                                .filter((o) => typeof o === "string" && o.trim())
                                .map((opt, oi) => (
                                  <span
                                    key={oi}
                                    className={`rounded-full px-2 py-0.5 ${
                                      qq.answer === opt
                                        ? "bg-success/10 text-success"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {opt}
                                    {qq.answer === opt ? " ✓" : ""}
                                  </span>
                                ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Decision bar (sticky within the content inset) ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-3">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/courses">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-danger/40 text-danger hover:bg-danger/5 hover:text-danger"
            onClick={() => void decide("reject")}
            disabled={isUpdating}
          >
            <XCircle className="size-4" />
            Reject
          </Button>
          <Button
            className="bg-action text-white hover:bg-action-hover"
            onClick={() => void decide("approve")}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}