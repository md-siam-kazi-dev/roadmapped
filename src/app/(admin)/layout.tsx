import type { ReactNode } from "react";

/**
 * Role-guarded admin console shell — ARCHITECTURE.md §3 `(admin)/layout.tsx`.
 *
 * - Route protection (ADMIN / INSTRUCTOR) is enforced in `proxy.ts` (Phase 3).
 * - `users/` and the full cross-course `submissions/` queue are ADMIN-only —
 *   `use-role-guard.ts` (Phase 4) redirects INSTRUCTOR sessions away from them.
 * - The console sidebar (Categories/Courses/Users/Submissions) lands in Phase 5.
 * - The shared navbar (Header) is rendered in the root layout.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
