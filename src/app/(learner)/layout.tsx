import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Auth-guarded learner shell — ARCHITECTURE.md §3 `(learner)/layout.tsx`.
 * Full-width dashboard with a shadcn Sidebar (DESIGN.md §2.3): the sidebar
 * (course nav / roadmap) + a main inset with the sidebar trigger header and
 * the page content. The shared navbar (Header) is rendered in the root layout.
 * Route protection happens in `proxy.ts`.
 */
export default function LearnerLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col pt-14">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
