import { fromNow } from "@/lib/utils/time";

import type { Course, Module, ModuleUnlock } from "@/types/api";

const now = fromNow;

export const demoCourses: Course[] = [
  {
    id: "course-fw",
    title: "Frontend Web Dev",
    description: "A guided path from HTML to a real portfolio.",
    categoryId: "cat-dev",
    status: "PUBLISHED",
    instructorId: "user-instructor",
    createdAt: now(-30 * 24 * 3_600_000),
    updatedAt: now(-2 * 24 * 3_600_000),
  },
  {
    id: "course-be",
    title: "Backend with Node",
    description: "APIs, databases, and authentication from scratch.",
    categoryId: "cat-dev",
    status: "PUBLISHED",
    instructorId: "user-instructor",
    createdAt: now(-20 * 24 * 3_600_000),
    updatedAt: now(-1 * 24 * 3_600_000),
  },
  {
    id: "course-ds",
    title: "Python Data Science",
    description: "Pandas, numpy, and visualization for real datasets.",
    categoryId: "cat-data",
    status: "PUBLISHED",
    instructorId: "user-instructor",
    createdAt: now(-15 * 24 * 3_600_000),
    updatedAt: now(-3 * 24 * 3_600_000),
  },
  {
    id: "course-ux",
    title: "UI/UX Design Basics",
    description: "Design systems, wireframes, and Figma fundamentals.",
    categoryId: "cat-design",
    status: "PUBLISHED",
    instructorId: "user-instructor",
    createdAt: now(-25 * 24 * 3_600_000),
    updatedAt: now(-5 * 24 * 3_600_000),
  },
];

const base = (courseId: string) => ({ courseId, createdAt: "", updatedAt: "" });

export const demoModules: Record<string, Module[]> = {
  "course-fw": [
    { id: "mod-1", ...base("course-fw"), title: "HTML & CSS Foundations", orderIndex: 1, isFinalModule: false },
    { id: "mod-2", ...base("course-fw"), title: "JavaScript Core", orderIndex: 2, isFinalModule: false },
    { id: "mod-3", ...base("course-fw"), title: "DOM & Events", orderIndex: 3, isFinalModule: false },
    { id: "mod-4", ...base("course-fw"), title: "React Fundamentals", orderIndex: 4, isFinalModule: false },
    { id: "mod-5", ...base("course-fw"), title: "Portfolio Assignment", orderIndex: 5, isFinalModule: true },
  ],
  "course-be": [
    { id: "be-1", ...base("course-be"), title: "Node & npm", orderIndex: 1, isFinalModule: false },
    { id: "be-2", ...base("course-be"), title: "Express & REST", orderIndex: 2, isFinalModule: false },
    { id: "be-3", ...base("course-be"), title: "Databases & SQL", orderIndex: 3, isFinalModule: false },
    { id: "be-4", ...base("course-be"), title: "Auth & Security", orderIndex: 4, isFinalModule: true },
  ],
  "course-ds": [
    { id: "ds-1", ...base("course-ds"), title: "Python Basics", orderIndex: 1, isFinalModule: false },
    { id: "ds-2", ...base("course-ds"), title: "NumPy Arrays", orderIndex: 2, isFinalModule: false },
    { id: "ds-3", ...base("course-ds"), title: "Pandas DataFrames", orderIndex: 3, isFinalModule: false },
    { id: "ds-4", ...base("course-ds"), title: "Visualization", orderIndex: 4, isFinalModule: true },
  ],
  "course-ux": [
    { id: "ux-1", ...base("course-ux"), title: "Design Principles", orderIndex: 1, isFinalModule: false },
    { id: "ux-2", ...base("course-ux"), title: "Wireframing", orderIndex: 2, isFinalModule: false },
    { id: "ux-3", ...base("course-ux"), title: "Figma Prototyping", orderIndex: 3, isFinalModule: false },
    { id: "ux-4", ...base("course-ux"), title: "Portfolio Case Study", orderIndex: 4, isFinalModule: true },
  ],
};

export const demoUnlocks: Record<string, ModuleUnlock[]> = {
  "course-fw": [
    { state: "completed", moduleId: "mod-1" },
    { state: "unlocked", moduleId: "mod-2", deadlineAt: now(6 * 3_600_000) },
    { state: "scheduled", moduleId: "mod-3", scheduledAt: now(18 * 3_600_000) },
    { state: "scheduled", moduleId: "mod-4", scheduledAt: now(42 * 3_600_000) },
    { state: "scheduled", moduleId: "mod-5", scheduledAt: now(66 * 3_600_000) },
  ],
  "course-be": [
    { state: "completed", moduleId: "be-1" },
    { state: "completed", moduleId: "be-2" },
    { state: "unlocked", moduleId: "be-3", deadlineAt: now(9 * 3_600_000) },
    { state: "scheduled", moduleId: "be-4", scheduledAt: now(33 * 3_600_000) },
  ],
  "course-ds": [
    { state: "completed", moduleId: "ds-1" },
    { state: "unlocked", moduleId: "ds-2", deadlineAt: now(3 * 3_600_000) },
    { state: "scheduled", moduleId: "ds-3", scheduledAt: now(27 * 3_600_000) },
    { state: "scheduled", moduleId: "ds-4", scheduledAt: now(51 * 3_600_000) },
  ],
  "course-ux": [
    { state: "unlocked", moduleId: "ux-1", deadlineAt: now(12 * 3_600_000) },
    { state: "scheduled", moduleId: "ux-2", scheduledAt: now(36 * 3_600_000) },
    { state: "scheduled", moduleId: "ux-3", scheduledAt: now(60 * 3_600_000) },
    { state: "scheduled", moduleId: "ux-4", scheduledAt: now(84 * 3_600_000) },
  ],
};