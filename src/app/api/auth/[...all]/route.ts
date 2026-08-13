import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/**
 * Better Auth route handler — ARCHITECTURE.md §3 (`app/api/auth/[...all]/route.ts`).
 * All Better Auth endpoints (session, sign-in, sign-up, token, etc.) are served
 * from this catch-all route.
 */
export const { GET, POST } = toNextJsHandler(auth);
