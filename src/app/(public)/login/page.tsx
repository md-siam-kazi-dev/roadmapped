import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Login page — PRD FR-1, ARCHITECTURE.md §3 `(public)/login/page.tsx`. */
export const metadata: Metadata = { title: "Sign in — Roadmapped" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-display">Sign in</CardTitle>
          <CardDescription>Continue your daily learning path.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-sm text-muted-foreground">
            No account yet?{" "}
            <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}