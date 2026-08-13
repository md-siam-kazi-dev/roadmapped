import type { ApiResponse } from "@/types/api";

/**
 * The single fetch wrapper for the Express backend — ARCHITECTURE.md §4 step 3.
 *
 * Server-side (Server Components / Route Handlers): reads the Better Auth JWT
 * via `lib/auth/server-session.ts` and attaches `Authorization: Bearer <token>`.
 * The backend independently verifies the JWT; there is no shared session store.
 *
 * Every response is normalized through the `{ success, message, data }` envelope
 * (ARCHITECTURE.md §1 / PRD §6.7 FR-20).
 */

export class ApiError extends Error {
  readonly status: number;
  readonly success = false;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  headers: HeadersInit = {},
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new ApiError(
      500,
      "NEXT_PUBLIC_API_BASE_URL is not configured — check .env.local (ARCHITECTURE.md §8).",
    );
  }

  const authToken = await import("./get-token").then((m) => m.getServerTokenSync());

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    cache: init.cache ?? "no-store",
  });

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body?.success) {
    throw new ApiError(
      response.status,
      body?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return body.data as T;
}