"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileText,
  FolderTree,
  PenSquare,
  Users,
} from "lucide-react";

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

const sidebarLinks = [
  { href: "/admin/dashboard/overview", label: "Overview", icon: BarChart3 },
  { href: "/admin/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/dashboard/submissions", label: "Submissions", icon: FileText },
  { href: "/admin/dashboard/users", label: "Users", icon: Users },
  { href: "/admin/dashboard/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/dashboard/blog", label: "Blog", icon: PenSquare },
];

/**
 * Admin dashboard sidebar content — rendered inside the shadcn `Sidebar`,
 * which automatically switches between a Sheet (mobile) and a collapsible
 * persistent rail (desktop). Used by `admin/dashboard/layout.tsx`.
 */
export function AdminSidebarContent() {
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
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map((item) => {
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
          <SidebarGroupLabel>Back to site</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Homepage">
                  <Link href="/">
                    <PenSquare data-icon="inline-start" />
                    <span>Homepage</span>
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
            A
          </div>
          <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}