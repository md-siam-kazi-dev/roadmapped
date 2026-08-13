import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Signup page — PRD FR-1, ARCHITECTURE.md §3 `(public)/signup/page.tsx`. */
export const metadata: Metadata = { title: "Create account — Roadmapped" };

export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-display">Create account</CardTitle>
          <CardDescription>Start your first daily learning roadmap.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}