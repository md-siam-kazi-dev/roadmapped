import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/api";

/**
 * Server-side session/JWT helpers — ARCHITECTURE.md §3 (`lib/auth/server-session.ts`).
 *
 * Used in Server Components / Route Handlers (and `lib/api/get-token.ts`) to read
 * the current Better Auth session and mint/supply the short-lived JWT the Express
 * backend verifies independently (ARCHITECTURE.md §4 step 3).
 */

export interface ServerSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role: UserRole;
  } | null;
  session: {
    id: string;
    expiresAt: Date;
    token: string;
  } | null;
}

/** Returns the current session + user (with role claim) from cookies. */
export async function getServerSession(
  headers: Headers = new Headers(),
): Promise<ServerSession> {
  const result = await auth.api.getSession({
    headers,
  });

  if (!result?.session || !result.user) {
    return { user: null, session: null };
  }

  const { session, user } = result;

  // Normalize to the canonical uppercase role so server-side guards can compare
  // against "ADMIN" / "INSTRUCTOR" regardless of how the role is stored in the
  // DB (Better Auth's default is lowercase `"user"`; the console may set
  // `"admin"` / `"instructor"`).
  const rawRole = (user as { role?: string }).role;
  const role = (rawRole ? rawRole.toUpperCase() : "LEARNER") as UserRole;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: (user as { image?: string | null }).image ?? null,
      role,
    },
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
      token: session.token,
    },
  };
}

/**
 * Returns the JWT issued by the JWT plugin for the current session, or `null`.
 * This is the token the API client attaches as `Authorization: Bearer <token>`
 * so the Express backend can verify identity without a shared session store.
 */
export async function getServerToken(
  headers: Headers = new Headers(),
): Promise<string | null> {
  const session = await getServerSession(headers);

  if (!session.session) {
    return null;
  }

  try {
    const result = await auth.api.getToken({
      headers,
    });
    return result?.token || null;
  } catch {
    // JWT plugin unavailable or token mint failed — treat as unauthenticated.
    return null;
  }
}
