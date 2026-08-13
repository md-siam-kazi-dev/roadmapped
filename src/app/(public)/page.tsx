import { Hero } from "@/components/marketing/hero";

/**
 * Landing page — ARCHITECTURE.md §3 `(public)/page.tsx`.
 * First-view hero with GSAP orchestration + Framer Motion micro-interactions
 * and the signature waypoint trail (DESIGN.md §2.4). Additional sections
 * (how it works, course preview, footer) land in later passes.
 */
export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
    </main>
  );
}