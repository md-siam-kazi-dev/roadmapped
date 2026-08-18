import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { getServerSession } from "@/lib/auth/server-session";

import { AdminMobileNavLinks, AdminNavLinks } from "@/components/admin/admin-nav-links";

/**
 * Admin dashboard layout with sidebar navigation.
 * Renders at /admin/dashboard/* — has its own sidebar, NOT the console sidebar.
 *
 * ADMIN-only, enforced SERVER-SIDE: the parent `(admin)/layout.tsx` already
 * gates ADMIN / INSTRUCTOR, but the full admin dashboard (users, all
 * submissions, categories) belongs to ADMIN alone. Any non-ADMIN session —
 * including INSTRUCTOR — is redirected to the homepage before any dashboard
 * content renders. This is authoritative (server) and not bypassable by
 * client-side navigation.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const session = await getServerSession(headerList);
  const role = (session?.user as { role?: string } | null)?.role;

  if (role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-1">
      {/* ── Sidebar ── */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface p-4 md:flex md:flex-col">
        <div className="mb-6 flex items-center gap-2 px-2">
          <LayoutDashboard className="size-5 text-action" />
          <span className="font-display text-base font-semibold text-foreground">
            Admin Panel
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <AdminNavLinks />
        </nav>

        <div className="mt-auto border-t border-border pt-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* ── Mobile nav strip ── */}
      <div className="flex w-full flex-col md:hidden">
        <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border p-2">
          <AdminMobileNavLinks />
        </nav>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}
