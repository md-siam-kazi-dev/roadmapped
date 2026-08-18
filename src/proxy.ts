import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Route protection — ARCHITECTURE.md §4 steps 5–6. Next.js 16 renamed
 * `middleware.ts` to `proxy.ts`, so route-group guards live here.
 *
 * - `(learner)` routes require an authenticated session presence (cookie).
 * - `(admin)` routes require an authenticated session presence.
 * - Authoritative role checks (ADMIN / INSTRUCTOR for the console; ADMIN-only
 *   for `users/` and `submissions/`) run in server components via
 *   `getServerSession` — the role lives in the user record, so it cannot be
 *   trusted from a cookie-only edge check. The proxy gates presence; layouts
 *   gate role and redirect accordingly (see `(admin)/layout.tsx`, Phase 5).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    // Manual access to admin routes is nudged to the homepage — no hint where
    // the console lives. Other protected routes go to login with a return path.
    url.pathname = isAdminPath ? "/" : "/login";
    if (!isAdminPath) url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Route groups are URL-invisible: (learner)/dashboard → /dashboard,
  // (admin)/console/... → /console/..., (admin)/admin/dashboard/... → /admin/... .
  // Match those concrete paths.
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/console/:path*",
    "/mycourse/:path*",
    "/admin/:path*",
  ],
};
