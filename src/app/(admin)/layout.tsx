import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getServerSession } from "@/lib/auth/server-session";

/**
 * Role-guarded admin shell — ARCHITECTURE.md §3 `(admin)/layout.tsx`,
 * ARCHITECTURE.md §4 step 5.
 *
 * - `proxy.ts` gates session presence for `/console/*` and `/admin/*`.
 * - This layout gates the role server-side: only ADMIN / INSTRUCTOR may enter.
 *   Anyone who manually enters an admin URL without the right role is sent
 *   straight to the homepage.
 * - `/admin/*` (the full admin dashboard) is additionally ADMIN-only — enforced
 *   in `admin/dashboard/layout.tsx` (client-side guard for in-app nav).
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const session = await getServerSession(headerList);
  const role = session?.user?.role;

  if (role !== "ADMIN" && role !== "INSTRUCTOR") {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
