"use client";

import { authClient } from "@/lib/auth-client";
import type { ApiResponse } from "@/types/api";

// const ds = {
//   moduleTitle:String,
//   text:String,
//   module:{
//     1:{
//       videoTopic:String,
//       videoLink:String,
//     },
//     2:{
//       videoTopic:String,
//       videoLink:String,
//     }
//     // and so on ..............how many content added 
//   },
//   quiz:{
//     1:{
//       question:String,
//       option1:String,
//       option2:String,
//       option3:String,
//       Option4:String,
//       answer:String // ex:answer === option4
//     }
//     // .............and so one how many added by the user

//   }
 

// Please avoid this object when you develop
// }

/**
 * Client-side API fetch template — usable directly as a TanStack Query
 * `mutationFn`. Takes the API route and a payload; POSTs JSON by default and
 * returns the parsed `data` from the backend's `{ success, message, data }`
 * envelope (ARCHITECTURE.md §1 / PRD §6.7 FR-20).
 *
 * Example:
 *   const mutation = useMutation({
 *     mutationFn: (payload) => apiFetch("/user/addcourse", payload),
 *   });
 *
 * The Better Auth JWT is attached as `Authorization: Bearer <token>` (retrieved
 * client-side via `authClient.token()`) so the Express backend can verify identity.
 */
export async function apiFetch<TData = unknown, TBody = unknown>(
  path: string,
  data?: TBody,
): Promise<TData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured — check .env.local (ARCHITECTURE.md §8).",
    );
  }

  // Attach the client-side JWT when a session exists.
  let authToken: string | null = null;
  try {
    const clientWithToken = authClient as unknown as {
      token: () => Promise<{ token?: string | null } | null>;
    };
    const tokenResult = await clientWithToken.token();
    authToken = tokenResult?.token ?? null;
  } catch {
    authToken = null;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: data !== undefined ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });

  const body = (await response
    .json()
    .catch(() => null)) as ApiResponse<TData> | null;

  if (!response.ok || !body?.success) {
    throw new Error(
      body?.message ?? `Request failed with status ${response.status}`,
    );
  }

  return body.data as TData;
}
