import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, Tailwind-aware.
 * ARCHITECTURE.md §3 — lib/utils/cn.ts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}