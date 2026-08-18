"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api/api-fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
type Level = (typeof LEVELS)[number];

interface FormState {
  title: string;
  description: string;
  totalModules: string;
  durationDays: string;
  level: Level | "";
  thumbnailFile: File | null;
}

const initialForm: FormState = {
  title: "",
  description: "",
  totalModules: "",
  durationDays: "",
  level: "",
  thumbnailFile: null,
};

/** Upload thumbnail to the backend's imgbb route, return the URL. */
async function uploadThumbnail(file: File): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fd = new FormData();
  fd.append("file", file);
  const uploadRes = await fetch(`${baseUrl}/user/uplaodimg`, { method: "POST", body: fd });
  const uploadData = await uploadRes.json();
  if (!uploadData.success) {
    throw new Error(uploadData.message || "Thumbnail upload failed.");
  }
  return uploadData.data.url as string;
}

interface AddCoursePayload {
  title: string;
  description: string;
  totalModules: number;
  durationDays: number;
  level: string;
  thumbnailUrl: string;
  creatorId: string;
}

export default function AddCoursePage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [form, setForm] = useState<FormState>(initialForm);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (payload: AddCoursePayload) => apiFetch("/user/addcourse", payload),
  });

  /* ---- helpers ---- */
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Basic validation
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5 MB.");
        return;
      }

      setError(null);
      update("thumbnailFile", file);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [],
  );

  const removeThumbnail = useCallback(() => {
    setForm((prev) => ({ ...prev, thumbnailFile: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  /* ---- form submit ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // creatorId is REQUIRED — never send empty. Session comes from Better Auth.
    const creatorId = session?.user?.id;
    if (!creatorId) {
      return setError(
        isSessionPending
          ? "Sign in is loading — please wait a moment and try again."
          : "You must be signed in to create a course.",
      );
    }

    // Validate required fields
    if (!form.title.trim()) return setError("Course title is required.");
    if (!form.description.trim()) return setError("Course description is required.");
    if (!form.totalModules || Number(form.totalModules) < 1)
      return setError("Total modules must be at least 1.");
    if (!form.durationDays || Number(form.durationDays) < 1)
      return setError("Duration must be at least 1 day.");
    if (!form.level) return setError("Please select a level.");

    let thumbnailUrl = "";

    // Upload thumbnail to the backend's imgbb route (if provided)
    if (form.thumbnailFile) {
      try {
        thumbnailUrl = await uploadThumbnail(form.thumbnailFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Thumbnail upload failed. Please try again.");
        return;
      }
    }
    // Submit course data via TanStack Query mutation
    mutation.mutate(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        totalModules: Number(form.totalModules),
        durationDays: Number(form.durationDays),
        level: form.level,
        thumbnailUrl,
        creatorId,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (err) => {
          setError(err.message || "Failed to submit course. Please try again.");
        },
      },
    );
  };

  /* ---- success state ---- */
  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-action/10">
          <span className="text-3xl">🎉</span>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Course Submitted!
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Your course suggestion has been received. Our team will review it and
          get back to you soon.
        </p>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/mycourse">View My Courses</Link>
          </Button>
          <Button
            className="bg-action text-action-fg hover:bg-action-hover"
            onClick={() => {
              setSubmitted(false);
              setForm(initialForm);
              setPreviewUrl(null);
            }}
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  /* ---- form ---- */
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/mycourse"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to My Courses
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Suggest a Course
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Want to learn something specific? Suggest a course and{" "}
          {"we'll consider adding it to the platform."}
        </p>
        {!session && !isSessionPending && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-md border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs text-danger">
            You must be signed in to submit a course.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">
              Course Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">
                Course Title <span className="text-danger">*</span>
              </Label>
              <Input
                id="course-title"
                placeholder="e.g. Advanced Tailwind CSS"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-desc">
                Description <span className="text-danger">*</span>
              </Label>
              <textarea
                id="course-desc"
                rows={4}
                placeholder="What will learners gain from this course?"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className={cn(
                  "flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground",
                  "placeholder:text-muted-foreground focus:border-action focus:outline-none focus:ring-1 focus:ring-action",
                  "resize-none",
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Structure & Level */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">
              Structure & Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-modules">
                  Total Modules <span className="text-danger">*</span>
                </Label>
                <Input
                  id="total-modules"
                  type="number"
                  min={1}
                  placeholder="e.g. 12"
                  value={form.totalModules}
                  onChange={(e) => update("totalModules", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration-days">
                  Duration (Days) <span className="text-danger">*</span>
                </Label>
                <Input
                  id="duration-days"
                  type="number"
                  min={1}
                  placeholder="e.g. 30"
                  value={form.durationDays}
                  onChange={(e) => update("durationDays", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Level <span className="text-danger">*</span>
              </Label>
              <div className="flex gap-3">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => update("level", lvl)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                      form.level === lvl
                        ? "border-action bg-action/10 text-action"
                        : "border-border bg-surface text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">
              Thumbnail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Course Thumbnail</Label>

            {previewUrl ? (
              <div className="relative overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  className="h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-foreground/80 text-background transition-colors hover:bg-foreground"
                >
                  <X className="size-4" />
                </button>
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  {form.thumbnailFile?.name} &middot;{" "}
                  {((form.thumbnailFile?.size ?? 0) / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ) : (
              <label
                htmlFor="thumbnail-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-10 text-center transition-colors hover:border-action/50 hover:bg-action/5"
              >
                <Upload className="size-8 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">
                    Click to browse
                  </span>{" "}
                  <span className="text-sm text-muted-foreground">
                    or drag and drop
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to 5 MB
                </p>
                <input
                  ref={fileInputRef}
                  id="thumbnail-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-action text-action-fg hover:bg-action-hover"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting course...
            </>
          ) : (
            "Submit Course Suggestion"
          )}
        </Button>
      </form>
    </div>
  );
}