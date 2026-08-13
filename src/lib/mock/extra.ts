import { fromNow } from "@/lib/utils/time";

import type { AssignmentSubmission, ModuleClass, Quiz, VideoProgress } from "@/types/api";

const now = fromNow;

export const mockClasses: ModuleClass[] = [
  { id: "cls-1", moduleId: "mod-1", title: "Semantic HTML", youtubeUrl: "https://youtube.com/watch?v=1", orderIndex: 1, createdAt: "", updatedAt: "" },
  { id: "cls-2", moduleId: "mod-1", title: "CSS Selectors", youtubeUrl: "https://youtube.com/watch?v=2", orderIndex: 2, createdAt: "", updatedAt: "" },
  { id: "cls-3", moduleId: "mod-1", title: "Box Model", youtubeUrl: "https://youtube.com/watch?v=3", orderIndex: 3, createdAt: "", updatedAt: "" },
];

export const mockQuiz: Quiz = {
  id: "quiz-1",
  moduleId: "mod-1",
  title: "HTML & CSS Foundations",
  passThreshold: 0.6,
  createdAt: "",
  updatedAt: "",
  questions: [
    { id: "q1", text: "Which element is semantic?", options: [] },
    { id: "q2", text: "What does CSS stand for?", options: [] },
  ],
};

export const mockVideoProgress: VideoProgress[] = [
  { moduleClassId: "cls-1", state: "complete", completedAt: now(-48 * 3_600_000) },
  { moduleClassId: "cls-2", state: "complete", completedAt: now(-24 * 3_600_000) },
  { moduleClassId: "cls-3", state: "incomplete" },
];

const learner = (id: string, name: string, email: string, streak: number, gems: number) => ({
  id, name, email, role: "LEARNER" as const, currentStreak: streak, longestStreak: streak, gems, createdAt: "", updatedAt: "",
});

export const mockSubmissions: AssignmentSubmission[] = [
  { id: "sub-1", courseId: "course-fw", moduleId: "mod-5", learnerId: "u1", content: "https://github.com/ada/portfolio", status: "PENDING", submittedAt: now(-2 * 3_600_000), learner: learner("u1", "Ada Lovelace", "ada@example.com", 4, 120) },
  { id: "sub-2", courseId: "course-fw", moduleId: "mod-5", learnerId: "u2", content: "https://github.com/grace/portfolio", status: "APPROVED", submittedAt: now(-30 * 3_600_000), learner: learner("u2", "Grace Hopper", "grace@example.com", 7, 210) },
  { id: "sub-3", courseId: "course-fw", moduleId: "mod-5", learnerId: "u3", content: "https://github.com/alan/portfolio", status: "REJECTED", submittedAt: now(-54 * 3_600_000), learner: learner("u3", "Alan Turing", "alan@example.com", 2, 80) },
  { id: "sub-4", courseId: "course-fw", moduleId: "mod-5", learnerId: "u4", content: "https://github.com/katherine/portfolio", status: "PENDING", submittedAt: now(-1 * 3_600_000), learner: learner("u4", "Katherine Johnson", "katherine@example.com", 9, 300) },
];