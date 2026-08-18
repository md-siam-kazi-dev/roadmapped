"use client";

import { usePathname } from "next/navigation";

import {
  BarChart3,
  BookOpen,
  FileText,
  FolderTree,
  PenSquare,
  Users,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

const sidebarLinks = [
  { href: "/admin/dashboard/overview", label: "Overview", icon: BarChart3 },
  { href: "/admin/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/dashboard/submissions", label: "Submissions", icon: FileText },
  { href: "/admin/dashboard/users", label: "Users", icon: Users },
  { href: "/admin/dashboard/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/dashboard/blog", label: "Blog", icon: PenSquare },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
              isActive
                ? "bg-action/10 font-medium text-action"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminMobileNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-action/10 text-action"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
