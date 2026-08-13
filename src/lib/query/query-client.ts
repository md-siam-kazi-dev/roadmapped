import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query provider config — ARCHITECTURE.md §3 (`lib/query/query-client.ts`).
 *
 * Server state (courses, progress, streak, gems) lives in the query cache,
 * keyed by resource. There is intentionally NO global client store
 * (Redux/Zustand) — see ARCHITECTURE.md §6.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Server Components own the initial read; the client cache fills in
        // behind it and keeps mutations optimistic-safe (ARCHITECTURE.md §5).
        staleTime: 30_000,
        gcTime: 10 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}