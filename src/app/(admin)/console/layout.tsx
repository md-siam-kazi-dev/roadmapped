import type { ReactNode } from "react";

import { ConsoleSidebarContent } from "@/components/admin/console-sidebar-content";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * Console layout — shadcn sidebar shell (responsive), same pattern as the
 * admin dashboard and learner shell.
 *
 * Desktop (md+): a collapsible (icon-rail) persistent sidebar.
 * Mobile (<md): the same nav becomes a Sheet sidebar opened via the
 * SidebarTrigger in the inset header.
 *
 * Role guard (ADMIN / INSTRUCTOR) is enforced server-side by the parent
 * `(admin)/layout.tsx`.
 */
export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ConsoleSidebarContent />
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