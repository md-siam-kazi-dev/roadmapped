import {
  BookOpen,
  FileText,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,248", change: "+12%", icon: Users, color: "text-action" },
  { label: "Active Courses", value: "34", change: "+3", icon: BookOpen, color: "text-gem" },
  { label: "Enrollments", value: "3,891", change: "+156", icon: GraduationCap, color: "text-ember" },
  { label: "Submissions", value: "87", change: "12 pending", icon: FileText, color: "text-success" },
];

const recentActivity = [
  { user: "Sarah Khan", action: "Completed Module 5", course: "Frontend Mastery", time: "12 min ago" },
  { user: "James Lee", action: "Submitted assignment", course: "React Advanced Patterns", time: "28 min ago" },
  { user: "Amina Rahman", action: "Enrolled", course: "Node.js Backend Dev", time: "1 hr ago" },
  { user: "David Chen", action: "Passed quiz (85%)", course: "TypeScript Deep Dive", time: "2 hr ago" },
  { user: "Fatima Ali", action: "Missed deadline", course: "CSS Architecture", time: "3 hr ago" },
  { user: "Omar Hassan", action: "Completed course", course: "Git & GitHub Pro", time: "5 hr ago" },
];

const topCourses = [
  { name: "Frontend Mastery", enrolled: 412, completion: 68 },
  { name: "React Advanced Patterns", enrolled: 287, completion: 54 },
  { name: "Node.js Backend Dev", enrolled: 198, completion: 71 },
  { name: "TypeScript Deep Dive", enrolled: 165, completion: 45 },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide stats and recent activity at a glance.
        </p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
            <span className="mt-1 inline-block text-xs text-success">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Recent activity ── */}
        <div className="rounded-lg border border-border bg-surface p-4 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-foreground">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 rounded-md border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{item.user}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.course}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top courses ── */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-4 font-display text-base font-semibold text-foreground">
            Top Courses
          </h2>
          <div className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{course.name}</span>
                  <span className="text-xs text-muted-foreground">{course.enrolled} enrolled</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-action"
                    style={{ width: `${course.completion}%` }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[10px] text-muted-foreground">
                  {course.completion}% completion
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick stats bar ── */}
      <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-success" />
          <span className="text-sm text-muted-foreground">Avg. completion rate:</span>
          <span className="font-mono text-sm font-medium text-foreground">62%</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="size-4 text-action" />
          <span className="text-sm text-muted-foreground">Active today:</span>
          <span className="font-mono text-sm font-medium text-foreground">314</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-gem" />
          <span className="text-sm text-muted-foreground">Avg. streak:</span>
          <span className="font-mono text-sm font-medium text-foreground">4.2 days</span>
        </div>
      </div>
    </div>
  );
}