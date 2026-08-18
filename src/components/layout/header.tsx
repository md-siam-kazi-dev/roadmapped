"use client";

import {
  BookOpen,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PenSquare,
  PlusCircle,
  Settings,
  User,
  Users,
} from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * App header — ARCHITECTURE.md §3 `components/layout/Header.tsx`.
 * Logo · nav links · streak · gems · avatar/menu (DESIGN.md §2.3 layout).
 *
 * Desktop (md+): navlinks are shown inline in the header bar.
 * Mobile (<md): navlinks are inside the avatar dropdown menu (current style).
 */
export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  const user = session?.user ?? null;
  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const image = user?.image ?? null;
  const role = (user as { role?: string } | null)?.role ?? "LEARNER";
  const isAdmin = role === "ADMIN" || role === "INSTRUCTOR";

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

        {/* ─── Desktop nav: loading skeleton / admin links / learner links ─── */}
        {isDesktop &&
          (isPending ? (
            <nav
              className="ml-4 flex items-center gap-2 text-sm"
              aria-label="Loading navigation"
            >
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-md" />
              ))}
              <Skeleton className="mx-1 h-4 w-px" />
            </nav>
          ) : user ? (
            <nav className="ml-4 flex items-center gap-1 text-sm">
              {isAdmin ? (
                <>
                  <Link
                    href="/admin/dashboard/overview"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LayoutDashboard className="size-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/dashboard/courses"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <BookOpen className="size-3.5" />
                    Courses
                  </Link>
                  <Link
                    href="/admin/dashboard/submissions"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <FileText className="size-3.5" />
                    Submissions
                  </Link>
                  {role === "ADMIN" && (
                    <>
                      <Link
                        href="/admin/dashboard/users"
                        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Users className="size-3.5" />
                        Users
                      </Link>
                      <Link
                        href="/admin/dashboard/categories"
                        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Settings className="size-3.5" />
                        Categories
                      </Link>
                    </>
                  )}
                  <span className="mx-1 h-4 w-px bg-border" />
                </>
              ) : (
                <>
                  <Link
                    href="/mycourse"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <BookOpen className="size-3.5" />
                    My Courses
                  </Link>
                  <Link
                    href="/addcourse"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <PlusCircle className="size-3.5" />
                    Add Course
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <FileText className="size-3.5" />
                    Blog
                  </Link>
                  <Link
                    href="/addblog"
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <PenSquare className="size-3.5" />
                    Write Blog
                  </Link>
                </>
              )}
            </nav>
          ) : null)}

        <div className="ml-auto flex items-center gap-2">
          {isPending ? (
            <>
              <Skeleton
                className="h-6 w-14 rounded-full"
                aria-label="Loading streak"
              />
              <Skeleton
                className="h-6 w-16 rounded-full"
                aria-label="Loading gems"
              />
            </>
          ) : (
            <>
              <StreakBadge streak={4} />
              <GemCounter gems={120} />
            </>
          )}
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
                  <span className="mt-0.5 inline-block w-fit rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {role}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* ─── Mobile-only nav links inside dropdown ─── */}
                {!isDesktop && (
                  <>
                    {isAdmin ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard/overview">
                            <LayoutDashboard data-icon="inline-start" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard/courses">
                            <BookOpen data-icon="inline-start" />
                            Courses
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard/submissions">
                            <FileText data-icon="inline-start" />
                            Submissions
                          </Link>
                        </DropdownMenuItem>
                        {role === "ADMIN" && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href="/admin/dashboard/users">
                                <Users data-icon="inline-start" />
                                Users
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/admin/dashboard/categories">
                                <Settings data-icon="inline-start" />
                                Categories
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/mycourse">
                            <BookOpen data-icon="inline-start" />
                            My Courses
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/addcourse">
                            <PlusCircle data-icon="inline-start" />
                            Add Course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/blog">
                            <FileText data-icon="inline-start" />
                            Blog
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/addblog">
                            <PenSquare data-icon="inline-start" />
                            Write Blog
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                  </>
                )}

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