"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError("root", { message: error.message ?? "Unable to sign in" });
      return;
    }

    toast.success("Signed in");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="font-mono text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-center">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <FieldContent>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <FieldContent>
              <PasswordInput
                id="login-password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </FieldContent>
          </Field>
        </FieldGroup>

        {errors.root && <FieldError>{errors.root.message}</FieldError>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
