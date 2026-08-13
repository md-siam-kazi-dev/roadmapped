import type { ReactNode } from "react";

/**
 * Dashboard sub-layout — groups all learner-facing routes under the dashboard
 * shell (`(learner)/layout.tsx` provides the sidebar + navbar).
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
