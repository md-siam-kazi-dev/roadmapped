import { fromNow } from "@/lib/utils/time";

import type { Course, Module, ModuleUnlock } from "@/types/api";

const now = fromNow;

export const mockCourse: Course = {
  id: "course-fw",
  title: "Frontend Web Dev",
  description: "A guided path from HTML to a real portfolio.",
  categoryId: "cat-dev",
  status: "PUBLISHED",
  instructorId: "user-instructor",
  createdAt: now(-30 * 24 * 3_600_000),
  updatedAt: now(-2 * 24 * 3_600_000),
};

const base = { courseId: "course-fw", createdAt: "", updatedAt: "" };

export const mockModules: Module[] = [
  { id: "mod-1", ...base, title: "HTML & CSS Foundations", orderIndex: 1, isFinalModule: false },
  { id: "mod-2", ...base, title: "JavaScript Core", orderIndex: 2, isFinalModule: false },
  { id: "mod-3", ...base, title: "DOM & Events", orderIndex: 3, isFinalModule: false },
  { id: "mod-4", ...base, title: "React Fundamentals", orderIndex: 4, isFinalModule: false },
  { id: "mod-5", ...base, title: "Portfolio Assignment", orderIndex: 5, isFinalModule: true },
];

export const mockUnlockStates: ModuleUnlock[] = [
  { state: "completed", moduleId: "mod-1" },
  { state: "unlocked", moduleId: "mod-2", deadlineAt: now(6 * 3_600_000) },
  { state: "scheduled", moduleId: "mod-3", scheduledAt: now(18 * 3_600_000) },
  { state: "scheduled", moduleId: "mod-4", scheduledAt: now(42 * 3_600_000) },
  { state: "scheduled", moduleId: "mod-5", scheduledAt: now(66 * 3_600_000) },
];