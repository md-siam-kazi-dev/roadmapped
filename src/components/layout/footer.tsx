import Link from "next/link";
import { BookOpen, CodeXml, Gem, Rss } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Site footer — DESIGN.md §2.1 token-driven (no hardcoded hex).
 * Quiet by design: hairline top border, muted copy, sage action links.
 * Rendered on public-facing pages via `(public)/layout.tsx`.
 *
 * Brand icons (Github/Twitter) were removed from lucide-react, so the social
 * links use generic equivalents: CodeXml (code hosting) and Rss (feed).
 */
const LINK_GROUPS = [
  {
    title: "Learn",
    links: [
      { label: "Browse courses", href: "/dashboard/courses" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Start free", href: "/signup" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Streaks & gems", href: "/#gamification" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
] as const;

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-surface text-sm text-muted-foreground",
        className
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-14">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-4" />
            </span>
            Roadmapped
          </Link>
          <p className="max-w-xs text-sm leading-relaxed">
            Free YouTube content, structured into daily roadmaps you actually
            finish — one waypoint at a time.
          </p>
          <div className="mt-1 flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <CodeXml className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Twitter / X"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Rss className="size-4" />
            </a>
          </div>
        </div>

        {LINK_GROUPS.map((group) => (
          <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {group.title}
            </p>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs sm:flex-row">
          <p className="flex items-center gap-1.5">
            <Gem className="size-3.5 text-gem" />
            <span>100% free · Built for finishers</span>
          </p>
          <p>© {new Date().getFullYear()} Roadmapped. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}