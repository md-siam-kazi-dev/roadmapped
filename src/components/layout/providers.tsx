"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import * as React from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { makeQueryClient } from "@/lib/query/query-client";

/**
 * Global providers — ARCHITECTURE.md §3 (§6 state table).
 *
 * - Theme: `next-themes` with `attribute="data-theme"` (DESIGN.md §4: the
 *   theme is driven by a single `data-theme="light" | "dark"` attribute).
 * - Server state: TanStack Query cache (no Redux/Zustand).
 *
 * The QueryClient is created lazily once per mount so it stays stable across
 * re-renders (React 19 pattern).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => makeQueryClient());

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={0}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}