"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Check, Clock, Lock, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Landing hero — first-view orchestration per DESIGN.md §3 motion discipline.
 *
 * - GSAP: one orchestrated page-load sequence (items stagger, path card rise,
 *   trail connectors draw-on, nodes pop in). Reduced-motion → skip to end state.
 * - Framer Motion: micro-interactions (active-waypoint pulse ring); the whole
 *   hero is wrapped in `MotionConfig reducedMotion="user"` so the pulse falls
 *   back to a plain opacity fade per DESIGN.md §3.
 * - The signature Waypoint Trail (DESIGN.md §2.4) is the hero's visual anchor:
 *   completed (filled sage check) · active (pulsing sage ring) · locked
 *   (hollow + clock label) · scheduled (dashed, "coming next").
 */

const TRAIL = [
  { state: "completed", label: "Done" },
  { state: "active", label: "Today" },
  { state: "locked", label: "Unlocks in 12h" },
  { state: "scheduled", label: "Coming" },
] as const;

function TrailNode({ state }: { state: (typeof TRAIL)[number]["state"] }) {
  if (state === "completed") {
    return (
      <span
        data-trail-node
        className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="size-4" />
      </span>
    );
  }

  if (state === "active") {
    return (
      <span
        data-trail-node
        className="relative flex size-8 items-center justify-center rounded-full border-2 border-primary text-primary"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full ring-2 ring-primary"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.22, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <Play className="size-3.5 fill-current" />
      </span>
    );
  }

  if (state === "locked") {
    return (
      <span
        data-trail-node
        className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground"
      >
        <Lock className="size-3.5" />
      </span>
    );
  }

  return (
    <span
      data-trail-node
      className="flex size-8 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground/50"
    >
      <span className="size-1.5 rounded-full bg-muted-foreground/40" />
    </span>
  );
}

function PathPreview() {
  return (
    <div
      data-path-card
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Today&apos;s path
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-foreground">
            Frontend Web Dev
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ember/10 px-2.5 py-1 font-mono text-xs font-medium text-ember">
          <Clock className="size-3" />
          6h 12m left
        </span>
      </div>

      <div className="mt-8 flex items-center">
        {TRAIL.map((node, i) => (
          <React.Fragment key={node.state}>
            {i > 0 && (
              <div
                data-trail-line
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  i === 1 ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <TrailNode state={node.state} />
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 flex items-center">
        {TRAIL.map((node, i) => (
          <React.Fragment key={node.state}>
            {i > 0 && <div className="flex-1" />}
            <span
              className={cn(
                "w-14 text-center font-mono text-[10px] leading-tight",
                node.state === "active" ? "text-primary" : "text-muted-foreground"
              )}
            >
              {node.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Play className="size-4 fill-current" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            HTML & CSS Foundations
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Module 1 · Video 3 of 5
          </p>
        </div>
        <Button size="sm" className="ml-auto shrink-0">
          Resume
        </Button>
      </div>
    </div>
  );
}

export function Hero() {
  const scope = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        // DESIGN.md §3: reduced-motion → jump to end state, no orchestration.
        gsap.set("[data-hero-item]", { opacity: 1, y: 0 });
        gsap.set("[data-path-card]", { opacity: 1, y: 0 });
        gsap.set("[data-trail-line]", { scaleX: 1 });
        gsap.set("[data-trail-node]", { scale: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-item]", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
      })
        .from(
          "[data-path-card]",
          { opacity: 0, y: 40, duration: 1, ease: "power2.out" },
          "-=0.7"
        )
        .from(
          "[data-trail-line]",
          { scaleX: 0, duration: 1.1, transformOrigin: "left center", ease: "power2.inOut" },
          "-=0.55"
        )
        .from(
          "[data-trail-node]",
          { scale: 0, duration: 0.45, stagger: 0.12, ease: "back.out(2.2)" },
          "-=0.85"
        );
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={scope} className="relative overflow-hidden">
        {/* Subtle grid + sage glow, token-driven (no hardcoded hex). */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
          <div className="absolute -top-44 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col gap-6">
            <span
              data-hero-item
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              <Sparkles className="size-3.5 text-primary" />
              Free YouTube · structured into roadmaps
            </span>

            <h1
              data-hero-item
              className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
            >
              Learn one <span className="text-primary">waypoint</span> at a time.
            </h1>

            <p
              data-hero-item
              className="max-w-md text-base leading-relaxed text-muted-foreground"
            >
              Roadmapped turns scattered YouTube tutorials into a guided, daily
              curriculum — with locks, streaks, and deadlines that make you
              actually finish.
            </p>

            <div data-hero-item className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Start your path
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard/courses">Browse courses</Link>
              </Button>
            </div>

            <div
              data-hero-item
              className="flex items-center gap-6 pt-2 font-mono text-xs text-muted-foreground"
            >
              <span>
                <strong className="font-semibold text-foreground">25+</strong>{" "}
                courses
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                <strong className="font-semibold text-foreground">7-day</strong>{" "}
                streak path
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                <strong className="font-semibold text-foreground">100%</strong>{" "}
                free
              </span>
            </div>
          </div>

          <div className="relative">
            <PathPreview />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}