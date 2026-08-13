"use client";

import * as React from "react";
import gsap from "gsap";

import { TrailConnector } from "@/components/trail/trail-connector";
import { TrailNode, type TrailState } from "@/components/trail/trail-node";
import { cn } from "@/lib/utils";

export interface TrailModule {
  id: string;
  title: string;
  state: TrailState;
  unlockAt?: string;
}

export function WaypointTrail({
  modules,
  orientation = "vertical",
  animate = true,
}: {
  modules: TrailModule[];
  orientation?: "horizontal" | "vertical";
  animate?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!animate || reduced) {
        gsap.set("[data-trail-node]", { scale: 1 });
        gsap.set("[data-trail-connector]", { scaleX: 1, scaleY: 1 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-trail-node]", { scale: 0, duration: 0.45, stagger: 0.08, ease: "back.out(2)" })
        .from("[data-trail-connector]", {
          scaleX: orientation === "horizontal" ? 0 : 1,
          scaleY: orientation === "vertical" ? 0 : 1,
          duration: 0.6,
          stagger: 0.1,
          transformOrigin: orientation === "horizontal" ? "left center" : "top center",
        }, "-=0.4");
    }, ref);
    return () => ctx.revert();
  }, [animate, orientation]);

  return (
    <div ref={ref} className={cn("flex gap-2", orientation === "vertical" ? "flex-col" : "flex-row items-center")}>
      {modules.map((m, i) => {
        const prev = modules[i - 1];
        const connectorFilled = prev ? (prev.state === "completed" && m.state !== "completed") || m.state === "active" : false;
        return (
          <React.Fragment key={m.id}>
            {i > 0 && (
              <TrailConnector orientation={orientation} filled={connectorFilled} />
            )}
            <div className={cn(orientation === "vertical" ? "flex items-center gap-3" : "flex flex-col items-center gap-2")}>
              <TrailNode state={m.state} unlockAt={m.unlockAt} />
              <span className={cn("text-xs font-mono", m.state === "active" ? "text-primary" : "text-muted-foreground")}>
                {m.title}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}