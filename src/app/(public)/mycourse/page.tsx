"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  Pencil,
  PlayCircle,
  Send,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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

type CourseStatus = "pending" | "inspection" | "approved" | "rejected";

const statusMeta: Record<
  CourseStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
    icon: Clock,
  },
  inspection: {
    label: "In inspection",
    className: "bg-ember/10 text-ember",
    icon: Loader2,
  },
  approved: {
    label: "Approved",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "bg-danger/10 text-danger",
    icon: XCircle,
  },
};

const toStatus = (status: string | undefined): CourseStatus =>
  status === "inspection"
    ? "inspection"
    : status === "approved"
      ? "approved"
      : status === "rejected"
        ? "rejected"
        : "pending";

/**
 * Skeleton card that mirrors the redesigned MyCourse card 1:1 —
 * photo placeholder with a status-badge stub, title/description lines,
 * a mono meta row, and the sage footer button. Shimmer per DESIGN.md §3.
 */
function MyCourseCardSkeleton() {
  return (
    <div className="animate-shimmer flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      {/* Photo placeholder + status badge stub */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="absolute top-2.5 right-2.5">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>

      {/* Text placeholders */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-3.5 w-14 rounded-md" />
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </div>
        <Skeleton className="mt-3 h-5 w-4/5 rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-full rounded-md" />
        <Skeleton className="mt-1.5 h-3.5 w-2/3 rounded-md" />
        <Skeleton className="mt-3 h-3.5 w-32 rounded-md" />
      </div>

      {/* Footer button placeholder */}
      <div className="mt-auto p-4 pt-0">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function MyCoursePage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const creatorId = session?.user?.id;

  useEffect(() => {
    let cancelled = false;

    async function loadMyCourses() {
      if (!creatorId) {
        if (!isSessionPending) {
          setIsLoading(false);
          if (!cancelled) setError("Sign in to view your courses.");
        }
        return;
      }

      try {
        const data = await apiFetch<MyCourse[]>(
          `/user/getmycourse?creatorId=${encodeURIComponent(creatorId)}`,
        );
        if (!cancelled) {
          setCourses(data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load your courses.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadMyCourses();

    return () => {
      cancelled = true;
    };
  }, [creatorId, isSessionPending]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          My Courses
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Courses you have created and submitted to the platform.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <MyCourseCardSkeleton />
            </motion.div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface px-6 py-12 text-center">
          <XCircle className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {"You haven't added any courses yet."}
          </p>
          <Link
            href="/addcourse"
            className="mt-4 inline-flex items-center gap-1 text-sm text-action hover:underline"
          >
            <PlayCircle className="size-4" />
            Add your first course
          </Link>
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {courses.map((course) => {
            const status = toStatus(course.status);
            const badge = statusMeta[status];
            const BadgeIcon = badge.icon;
            const isPendingDraft = status === "pending";

            return (
              <motion.div
                key={course.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] },
                  },
                }}
              >
                <Card className="group flex h-full flex-col overflow-hidden">
                  {/* ── Thumbnail ── */}
                  <Link href={`/mycourse/${course.id}`} className="block">
                    <div className="relative aspect-video w-full overflow-hidden bg-surface">
                      {course.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/50">
                          <BookOpen className="size-10 text-action" />
                        </div>
                      )}
                      {/* Status badge overlaid on the thumbnail */}
                      <span
                        className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {status === "inspection" ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <BadgeIcon className="size-3" />
                        )}
                        {badge.label}
                      </span>
                    </div>
                  </Link>

                  {/* ── Body ── */}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider">
                        <Layers className="size-3.5" />
                        {course.level}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Clock className="size-3.5" />
                        {course.duration} days
                      </span>
                    </div>
                    <CardTitle className="mt-1.5 line-clamp-2 font-display text-base leading-snug">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {course.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5 font-mono uppercase tracking-wider">
                        {course.totalModule} modules
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>

                  {/* ── Footer ── */}
                  <CardFooter className="mt-auto">
                    {isPendingDraft ? (
                      <div className="flex w-full flex-col gap-2">
                        <Button asChild className="w-full bg-action text-white hover:bg-action-hover">
                          <Link href={`/mycourse/${course.id}`}>
                            <Send className="size-4" />
                            Submit for Approval
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-action/40 text-action hover:bg-action/5 hover:text-action">
                          <Link href={`/mycourse/${course.id}`}>
                            <Pencil className="size-4" />
                            Edit Course
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        asChild
                        variant={status === "approved" ? "default" : "outline"}
                        className={
                          status === "approved"
                            ? "w-full bg-action text-white hover:bg-action-hover"
                            : "w-full border-action/40 text-action hover:bg-action/5 hover:text-action"
                        }
                      >
                        <Link href={`/mycourse/${course.id}`}>
                          <Pencil className="size-4" />
                          View Course
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-action hover:underline"
        >
          <PlayCircle className="size-4" />
          Browse more courses
        </Link>
      </div>
    </div>
  );
}