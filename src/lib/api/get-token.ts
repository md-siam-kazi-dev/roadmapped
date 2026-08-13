import { headers } from "next/headers";

import { getServerToken } from "@/lib/auth/server-session";

/**
 * Reads the current Better Auth JWT for the active request.
 *
 * ARCHITECTURE.md §4 step 3: `lib/api/client.ts` attaches this as
 * `Authorization: Bearer <token>` on every Express API call. This module lives
 * in `lib/api/` and is consumed server-side only (it is dynamically imported by
 * the `"use server"` fetch wrapper).
 */
export async function getServerTokenSync(): Promise<string | null> {
  try {
    const headerStore = await headers();
    return await getServerToken(headerStore);
  } catch {
    // No request context (e.g. background job) — no authenticated token available.
    return null;
  }
}