import { redirect } from "next/navigation";

/**
 * `/dashboard` is not a public/user route — the real admin dashboard lives at
 * `/admin/dashboard`. Any manual access to `/dashboard` (by any user, admin
 * or not) is redirected to the homepage.
 */
export default async function DashboardPage() {
  redirect("/");
}