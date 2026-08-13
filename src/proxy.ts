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
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Route groups are URL-invisible: (learner)/dashboard → /dashboard,
  // (admin)/console/... → /console/... . Match those concrete paths.
  matcher: ["/dashboard/:path*", "/learn/:path*", "/console/:path*"],
};