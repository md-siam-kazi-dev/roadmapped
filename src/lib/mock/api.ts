import { demoCourses, demoModules, demoUnlocks } from "@/lib/mock/catalog";
import { mockClasses, mockQuiz, mockSubmissions, mockVideoProgress } from "@/lib/mock/extra";
import type { AssignmentSubmission, Course, Module, ModuleClass, ModuleUnlock, Quiz, VideoProgress } from "@/types/api";

export interface CourseWithModules {
  course: Course;
  modules: Module[];
  unlockStates: ModuleUnlock[];
  classes: ModuleClass[];
  quiz: Quiz | null;
  submissions: AssignmentSubmission[];
}

export async function getMockDashboardData(): Promise<{
  course: Course;
  modules: Module[];
  unlockStates: ModuleUnlock[];
  videoProgress: VideoProgress[];
  quiz: Quiz;
  classes: ModuleClass[];
  progressPercent: number;
  streak: number;
  gems: number;
}> {
  const course = demoCourses[0];
  return {
    course,
    modules: demoModules[course.id] ?? [],
    unlockStates: demoUnlocks[course.id] ?? [],
    videoProgress: mockVideoProgress,
    quiz: mockQuiz,
    classes: mockClasses,
    progressPercent: 23,
    streak: 4,
    gems: 120,
  };
}

export async function getMockCourseWithModules(courseId: string): Promise<CourseWithModules | null> {
  const course = demoCourses.find((c) => c.id === courseId);
  if (!course) return null;
  return {
    course,
    modules: demoModules[courseId] ?? [],
    unlockStates: demoUnlocks[courseId] ?? [],
    classes: mockClasses,
    quiz: mockQuiz,
    submissions: mockSubmissions,
  };
}

export async function getMockCatalog(): Promise<Course[]> {
  return demoCourses;
}

export async function getMockSubmissions(): Promise<AssignmentSubmission[]> {
  return [...mockSubmissions].sort(
    (a, b) => (a.status === "PENDING" ? -1 : 1) - (b.status === "PENDING" ? -1 : 1)
  );
}