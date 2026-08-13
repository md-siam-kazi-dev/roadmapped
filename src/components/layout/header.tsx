"use client";

import { BookOpen, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { GemCounter } from "@/components/gamification/gem-counter";
import { StreakBadge } from "@/components/gamification/streak-badge";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, useSession } from "@/lib/auth-client";

/**
 * App header — ARCHITECTURE.md §3 `components/layout/Header.tsx`.
 * Logo · streak · gems · avatar/menu (DESIGN.md §2.3 layout).
 *
 * Session-aware: uses Better Auth `useSession` to show Log in / Sign up buttons
 * when logged out, the account menu (with sign out) when logged in, and a
 * skeleton on the avatar position while the session is still loading.
 */
export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user ?? null;
  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const image = user?.image ?? null;
  const role = (user as { role?: string } | null)?.role ?? "LEARNER";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          Roadmapped
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <StreakBadge streak={4} />
          <GemCounter gems={120} />
          <ThemeSwitch />

          {isPending ? (
            <Skeleton className="size-8 rounded-full" aria-label="Loading account" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account menu">
                  <Avatar className="size-7">
                    {image ? <AvatarImage src={image} alt={name} /> : null}
                    <AvatarFallback className="bg-primary/10 font-mono text-xs text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{name}</span>
                  <span className="text-xs text-muted-foreground">{email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/courses">
                    <BookOpen data-icon="inline-start" />
                    Courses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard data-icon="inline-start" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {role === "ADMIN" || role === "INSTRUCTOR" ? (
                  <DropdownMenuItem asChild>
                    <Link href="/console/courses">
                      <User data-icon="inline-start" />
                      Console
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger" onSelect={handleSignOut}>
                  <LogOut data-icon="inline-start" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}