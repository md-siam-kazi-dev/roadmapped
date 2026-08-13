"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance — ARCHITECTURE.md §3 (`lib/auth/auth-client.ts`).
 * Used by client components for signup/login forms and `useSession`, matching
 * the server instance in `lib/auth/auth.ts`.
 *
 * Imported from `better-auth/react` so `useSession` is a proper React hook
 * (the `better-auth/client` entry exposes a vanilla Jotai atom instead).
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;