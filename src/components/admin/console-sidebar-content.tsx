"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderTree, Inbox, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/console/courses", label: "Courses", icon: BookOpen },
  { href: "/console/categories", label: "Categories", icon: FolderTree },
  { href: "/console/users", label: "Users", icon: Users },
  { href: "/console/submissions", label: "Submissions", icon: Inbox },
];

/**
 * Console sidebar content — rendered inside the shadcn `Sidebar`, which
 * automatically switches between a Sheet (mobile) and a collapsible
 * persistent rail (desktop). Used by `(admin)/console/layout.tsx`.
 */
export function ConsoleSidebarContent() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex size-8 items-center justify-center rounded-lg bg-action text-action-fg">
                  <BookOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-display text-base font-semibold text-foreground">
                    Roadmapped
                  </span>
                  <span className="text-xs text-muted-foreground">Console</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <item.icon data-icon="inline-start" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Admin dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin Dashboard">
                  <Link href="/admin/dashboard/overview">
                    <Inbox data-icon="inline-start" />
                    <span>Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          )}
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-action/10 font-mono text-xs text-action">
            C
          </div>
          <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Console
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}