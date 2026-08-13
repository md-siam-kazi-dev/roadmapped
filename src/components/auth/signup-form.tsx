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
import { signupSchema, type SignupValues } from "@/lib/validation/auth";

export function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupValues) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError("root", {
        message: error.message ?? "Unable to create account",
      });
      return;
    }

    toast.success("Account created");
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
            <FieldLabel htmlFor="signup-name">Name</FieldLabel>
            <FieldContent>
              <Input
                id="signup-name"
                autoComplete="name"
                placeholder="Ada Lovelace"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-email">Email</FieldLabel>
            <FieldContent>
              <Input
                id="signup-email"
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
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <FieldContent>
              <PasswordInput
                id="signup-password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="signup-confirm">Confirm password</FieldLabel>
            <FieldContent>
              <PasswordInput
                id="signup-confirm"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </FieldContent>
          </Field>
        </FieldGroup>

        {errors.root && <FieldError>{errors.root.message}</FieldError>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
