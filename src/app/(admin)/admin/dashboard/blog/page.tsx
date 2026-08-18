import { Clock, Edit, Eye, PenSquare, Trash2 } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  { id: "1", title: "Getting Started with Next.js 15", author: "Admin User", status: "PUBLISHED", views: 1243, publishedAt: "2026-04-01" },
  { id: "2", title: "Why Streaks Help You Learn Faster", author: "David Chen", status: "PUBLISHED", views: 876, publishedAt: "2026-03-28" },
  { id: "3", title: "TypeScript Tips for Beginners", author: "Admin User", status: "DRAFT", views: 0, publishedAt: "" },
  { id: "4", title: "Building Better Learning Habits", author: "Sarah Khan", status: "PUBLISHED", views: 2105, publishedAt: "2026-03-15" },
  { id: "5", title: "5 YouTube Channels Every Dev Should Follow", author: "Admin User", status: "DRAFT", views: 0, publishedAt: "" },
];

const statusBadge: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: "Published", className: "bg-success/10 text-success" },
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Blog Posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage platform blog content. {blogPosts.length} total posts.
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog/new"
          className="rounded-md bg-action px-4 py-2 text-sm font-medium text-action-fg transition-colors hover:bg-action-hover"
        >
          + New Post
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 font-medium text-muted-foreground">Title</th>
                <th className="hidden p-3 font-medium text-muted-foreground sm:table-cell">Author</th>
                <th className="p-3 font-medium text-muted-foreground">Status</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Views</th>
                <th className="hidden p-3 font-medium text-muted-foreground lg:table-cell">Date</th>
                <th className="p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post) => {
                const badge = statusBadge[post.status] ?? statusBadge.DRAFT;
                return (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <p className="font-medium text-foreground">{post.title}</p>
                    </td>
                    <td className="hidden p-3 text-muted-foreground sm:table-cell">{post.author}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                        {post.status === "PUBLISHED" ? <Eye className="size-3" /> : <Clock className="size-3" />}
                        {badge.label}
                      </span>
                    </td>
                    <td className="hidden p-3 font-mono text-foreground md:table-cell">{post.views.toLocaleString()}</td>
                    <td className="hidden p-3 text-muted-foreground lg:table-cell">{post.publishedAt || "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/dashboard/blog/${post.id}`}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          <Edit className="size-4" />
                        </button>
                        <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger">
                          <Trash2 className="size-4" />
                        </button>
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