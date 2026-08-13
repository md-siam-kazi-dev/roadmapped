/**
 * Course API client — ARCHITECTURE.md §3 (`lib/api/courses.ts`).
 *
 * Typed endpoint functions over the shared `{ success, message, data }`
 * envelope. The backend's `Course` table is intentionally small this pass
 * (id, title, slug, description, level, createdAt), so these functions are
 * typed against that real record shape rather than the richer DTOs used by
 * the mock layers.
 */
import { apiFetch } from "@/lib/api/client";

import type { CourseRecord } from "@/types/api";

/** GET /api/course — published course catalog (ordered newest first). */
export async function getCourses(): Promise<CourseRecord[]> {
  return apiFetch<CourseRecord[]>("/course");
}

/** GET /api/course/:courseId — single course record. */
export async function getCourse(courseId: string): Promise<CourseRecord> {
  return apiFetch<CourseRecord>(`/course/${courseId}`);
}