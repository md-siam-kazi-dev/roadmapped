/**
 * Shared API types — ARCHITECTURE.md §3 (`types/api.ts`).
 *
 * The Express backend responds with a consistent envelope:
 *   { success: boolean, message?: string, data?: T }
 * Every `lib/api/*` function is typed against these so a backend contract
 * change surfaces as a compile error, not a runtime bug (ARCHITECTURE.md §9).
 */

/** Response envelope returned by every backend endpoint. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/** Paginated envelope used by list endpoints. */
export interface ApiPaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** Roles — FR-3 role-aware UI. */
export type UserRole = "LEARNER" | "INSTRUCTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  currentStreak: number;
  longestStreak: number;
  gems: number;
  createdAt: string;
  updatedAt: string;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Raw course record as returned by the backend's `/api/course` endpoints.
 * Mirrors the `Course` table (id, title, slug, description, thumbnailUrl,
 * level, isPublished, totalModule, duration, createdAt, updatedAt).
 */
export interface CourseRecord {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  level: string;
  isPublished: boolean;
  totalModule: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category?: Category;
  coverImageUrl?: string | null;
  status: CourseStatus;
  instructorId: string;
  /** Ordered modules. Present on detail responses. */
  modules?: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  /** 1-based position within the course — the "waypoint" order. */
  orderIndex: number;
  /** Minimum number of classes (videos) required before the module can have a quiz. */
  minRequiredClasses?: number;
  /** Whether this module is the final module (ends with an assignment, not a quiz). */
  isFinalModule: boolean;
  classes?: ModuleClass[];
  quiz?: Quiz | null;
  createdAt: string;
  updatedAt: string;
}

/** A single video lesson within a module. */
export interface ModuleClass {
  id: string;
  moduleId: string;
  title: string;
  youtubeUrl: string;
  /** 1-based position within the module. */
  orderIndex: number;
  durationSeconds?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestionOption {
  id: string;
  text: string;
  /** Hidden from learner-facing payloads — the backend flags the correct option. */
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizQuestionOption[];
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  /** Pass threshold as a fraction (e.g. 0.6 = 60%). */
  passThreshold?: number;
  /** Number of attempts allowed; `null` = unlimited (Open Question in PRD §10). */
  maxAttempts?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  prompt: string;
  submissionInstructions?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AssignmentSubmission {
  id: string;
  courseId: string;
  moduleId: string;
  learnerId: string;
  content: string;
  contentLink?: string | null;
  status: SubmissionStatus;
  feedback?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewerId?: string | null;
  learner?: User;
  course?: Course;
}

/**
 * Server-enforced unlock sequencing (PRD.md §6.3 / FR-8, ARCHITECTURE.md §5).
 * Progress/unlock state is NEVER trusted client-side — it is always derived
 * from this payload returned by the backend.
 */
export type ModuleUnlock =
  | {
      state: "unlocked";
      moduleId: string;
      /** ISO timestamp of the current module's deadline (FR-9). */
      deadlineAt: string;
    }
  | {
      state: "scheduled";
      moduleId: string;
      /** ISO timestamp when this module becomes eligible to unlock. */
      scheduledAt: string;
    }
  | {
      state: "completed";
      moduleId: string;
    };

export type VideoProgressState =
  | "incomplete"
  | "complete"
  | "skippable";

export interface VideoProgress {
  moduleClassId: string;
  state: VideoProgressState;
  completedAt?: string | null;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  /** ISO timestamp of the next UTC-midnight boundary that would reset the streak. */
  resetsAt: string;
}

export interface GemBalance {
  balance: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  learnerId: string;
  /** Server-authored ISO deadline for the currently active module. */
  deadlineAt?: string | null;
  progressPercent: number;
  completed: boolean;
  course?: Course;
  enrolledAt: string;
}