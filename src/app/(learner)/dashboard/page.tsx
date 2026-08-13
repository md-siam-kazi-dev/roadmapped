import Link from "next/link";

import { DeadlineTimer } from "@/components/learning/deadline-timer";
import { StreakBadge } from "@/components/gamification/streak-badge";
import { WaypointTrail, type TrailModule } from "@/components/trail/waypoint-trail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getMockDashboardData } from "@/lib/mock/api";

const stateToTrail = (s: string): TrailModule["state"] =>
  s === "completed" ? "completed" : s === "unlocked" ? "active" : "scheduled";

export default async function DashboardPage() {
  const data = await getMockDashboardData();

  const trailModules: TrailModule[] = data.modules.map((m) => {
    const u = data.unlockStates.find((x) => x.moduleId === m.id);
    return {
      id: m.id,
      title: m.title,
      state: u ? stateToTrail(u.state) : "scheduled",
      unlockAt: u && u.state === "unlocked" ? u.deadlineAt : undefined,
    };
  });

  const active = data.unlockStates.find((x) => x.state === "unlocked");
  const activeModule = data.modules.find((m) => m.id === active?.moduleId);

  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <StreakBadge streak={data.streak} />
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
            Continue your path
          </h1>
          {activeModule && (
            <>
              <p className="mt-1 text-base text-muted-foreground">{activeModule.title}</p>
              {active && active.state === "unlocked" && (
                <DeadlineTimer deadlineAt={active.deadlineAt} className="mt-3" />
              )}
            </>
          )}
        </div>
        <div className="w-full md:w-48">
          <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{data.progressPercent}%</span>
          </div>
          <Progress value={data.progressPercent} className="mt-2" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Your roadmap</h2>
        <div className="mt-6">
          <WaypointTrail modules={trailModules} orientation="vertical" />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">Your courses</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/courses">Browse courses</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">{data.course.title}</CardTitle>
              <Badge variant="outline" className="w-fit">{data.progressPercent}% complete</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{data.course.description}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}