import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getServerSession } from "@/lib/auth/server-session";

import { AdminSidebarContent } from "@/components/admin/admin-sidebar-content";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * Admin dashboard layout — shadcn sidebar shell (responsive).
 *
 * Desktop (md+): a collapsible (icon-rail) persistent sidebar with the admin
 * nav beside the content inset.
 * Mobile (<md): the same nav becomes a Sheet sidebar opened via the
 * SidebarTrigger in the inset header.
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
  const role = session?.user?.role;

  if (role !== "ADMIN") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AdminSidebarContent />
      <SidebarInset className="min-h-[calc(100vh-3.5rem)]">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}