"use client";

import { CheckCircle2, Clock, Eye, Pencil, XCircle } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: "1",
    title: "Frontend Mastery",
    category: "Web Development",
    modules: 12,
    enrolled: 412,
    status: "PUBLISHED",
    createdAt: "2025-12-10",
  },
  {
    id: "2",
    title: "React Advanced Patterns",
    category: "Frontend",
    modules: 8,
    enrolled: 287,
    status: "PUBLISHED",
    createdAt: "2026-01-15",
  },
  {
    id: "3",
    title: "Node.js Backend Dev",
    category: "Backend",
    modules: 10,
    enrolled: 198,
    status: "PUBLISHED",
    createdAt: "2026-02-20",
  },
  {
    id: "4",
    title: "TypeScript Deep Dive",
    category: "Languages",
    modules: 6,
    enrolled: 165,
    status: "DRAFT",
    createdAt: "2026-03-01",
  },
  {
    id: "5",
    title: "CSS Architecture",
    category: "Web Development",
    modules: 9,
    enrolled: 95,
    status: "PUBLISHED",
    createdAt: "2026-03-10",
  },
  {
    id: "6",
    title: "GraphQL Complete Guide",
    category: "Backend",
    modules: 0,
    enrolled: 0,
    status: "DRAFT",
    createdAt: "2026-04-05",
  },
];

const statusBadge: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  PUBLISHED: { label: "Published", className: "bg-success/10 text-success", icon: CheckCircle2 },
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground", icon: Clock },
  REJECTED: { label: "Rejected", className: "bg-danger/10 text-danger", icon: XCircle },
};

export default function AdminCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Manage Courses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve, reject, edit, or create new courses.
          </p>
        </div>
        <button className="rounded-md bg-action px-4 py-2 text-sm font-medium text-action-fg transition-colors hover:bg-action-hover">
          + New Course
        </button>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2">
        {["All", "Published", "Draft", "Rejected"].map((tab) => (
          <button
            key={tab}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "All"
                ? "bg-action/10 text-action"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Course table ── */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 font-medium text-muted-foreground">Course</th>
                <th className="hidden p-3 font-medium text-muted-foreground sm:table-cell">Category</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Modules</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Enrolled</th>
                <th className="p-3 font-medium text-muted-foreground">Status</th>
                <th className="p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const badge = statusBadge[course.status] ?? statusBadge.DRAFT;
                const BadgeIcon = badge.icon;
                return (
                  <tr key={course.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.createdAt}</p>
                    </td>
                    <td className="hidden p-3 text-muted-foreground sm:table-cell">{course.category}</td>
                    <td className="hidden p-3 font-mono text-foreground md:table-cell">{course.modules}</td>
                    <td className="hidden p-3 font-mono text-foreground md:table-cell">{course.enrolled}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                        <BadgeIcon className="size-3" />
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/dashboard/courses/${course.id}`}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <Pencil className="size-4" />
                        </button>
                        {course.status === "DRAFT" && (
                          <>
                            <button className="rounded p-1 text-success transition-colors hover:bg-success/10" title="Approve">
                              <CheckCircle2 className="size-4" />
                            </button>
                            <button className="rounded p-1 text-danger transition-colors hover:bg-danger/10" title="Reject">
                              <XCircle className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}