"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Theme switch — DESIGN.md §4.
 * Toggles the `data-theme="light" | "dark"` attribute on <html> via next-themes.
 */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}
    </Button>
  );
}