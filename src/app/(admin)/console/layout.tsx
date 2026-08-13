import { BookOpen, FolderTree, Inbox, Users } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { href: "/console/courses", label: "Courses", icon: BookOpen },
  { href: "/console/categories", label: "Categories", icon: FolderTree },
  { href: "/console/users", label: "Users", icon: Users },
  { href: "/console/submissions", label: "Submissions", icon: Inbox },
];

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <aside className="hidden w-60 shrink-0 border-r border-border p-4 md:flex md:flex-col">
        <p className="px-2 font-display text-lg font-semibold text-foreground">Console</p>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}