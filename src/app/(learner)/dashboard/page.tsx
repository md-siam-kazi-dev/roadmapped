import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth/server-session";

/**
 * `/dashboard` is the shared dashboard route.
 * - ADMIN / INSTRUCTOR → the admin dashboard (`/admin/dashboard/overview`).
 * - Signed-out / LEARNER users without a learner dashboard are sent home.
 */
export default async function DashboardPage() {
  const headerList = await headers();
  const session = await getServerSession(headerList);
  const role = session?.user?.role;

  if (role === "ADMIN" || role === "INSTRUCTOR") {
    redirect("/admin/dashboard/overview");
  }

  redirect("/");
}
