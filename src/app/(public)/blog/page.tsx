import { BookOpen, Calendar, Clock, Eye, Tag } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  { id: "1", title: "Getting Started with Next.js 15", excerpt: "Everything you need to know about the latest Next.js release including App Router improvements, server components, and more.", author: "Admin User", category: "Web Development", views: 1243, publishedAt: "2026-04-01", readTime: "5 min" },
  { id: "2", title: "Why Streaks Help You Learn Faster", excerpt: "The science behind habit formation and why maintaining a learning streak can dramatically improve your retention rates.", author: "David Chen", category: "Learning", views: 876, publishedAt: "2026-03-28", readTime: "4 min" },
  { id: "3", title: "Building Better Learning Habits", excerpt: "Practical tips and strategies to build consistent learning habits that stick, backed by research and real-world examples.", author: "Sarah Khan", category: "Learning", views: 2105, publishedAt: "2026-03-15", readTime: "6 min" },
  { id: "4", title: "5 YouTube Channels Every Dev Should Follow", excerpt: "Curated list of high-quality YouTube channels covering frontend, backend, DevOps, and general software engineering topics.", author: "Admin User", category: "Resources", views: 3210, publishedAt: "2026-03-10", readTime: "3 min" },
  { id: "5", title: "TypeScript Tips for Beginners", excerpt: "Essential TypeScript concepts explained simply, with practical examples to help you type your JavaScript code effectively.", author: "Admin User", category: "Languages", views: 1567, publishedAt: "2026-03-05", readTime: "7 min" },
];

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tips, tutorials, and resources for learners on the platform.
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Web Development", "Learning", "Resources", "Languages"].map((cat) => (
          <button
            key={cat}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              cat === "All"
                ? "bg-action/10 text-action"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="block rounded-lg border border-border bg-surface p-5 transition-colors hover:border-action/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-action/10 px-2 py-0.5 text-[10px] font-medium text-action">
                    <Tag className="size-2.5" />
                    {post.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{post.readTime} read</span>
                </div>
                <h2 className="font-medium text-foreground">{post.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {post.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3" />
                    {post.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}