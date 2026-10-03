"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { login } from "../../actions/login";
import { LogoMark } from "../../components/brand/Logo";
import { Button } from "../../components/ui/button";
import { Field, fieldA11y } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { PasswordInput } from "../../components/ui/password-input";
import UserRegistrationForm from "../../components/UserRegistrationForm";

const schema = z.object({
  email: z.string().trim().min(1, "Enter your email address").email("That doesn't look like an email address"),
  password: z.string().min(1, "Enter your password"),
});
type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const [mode, setMode] = React.useState<"signin" | "signup">("signin");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [redirecting, setRedirecting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      // On success the action redirects, so this call does not return normally.
      const result = await login(values);
      if (result?.error) {
        setServerError(result.error === "Invalid Credentials" ? "That email and password don't match. Check them and try again." : result.error);
        return;
      }
      setRedirecting(true);
    } catch (e) {
      // The login action signals success by throwing Next's redirect error.
      if (e instanceof Error && (e.message === "NEXT_REDIRECT" || (e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT"))) {
        setRedirecting(true);
        return;
      }
      console.error("Sign-in failed:", e);
      setServerError("Something went wrong. Please try again.");
    }
  });

  const busy = isSubmitting || redirecting;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[22rem]">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark size="lg" />
          <p className="eyebrow mt-5">Ayush Shah · Admin</p>
          <h1 className="page-title mt-2">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        </div>

        <div className="card p-5 sm:p-6">
          {mode === "signin" ? (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              {serverError ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-[var(--radius-ctl)] border border-[color-mix(in_srgb,var(--danger)_40%,var(--line))] bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))] px-3 py-2.5 text-[13px] text-danger"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{serverError}</p>
                </div>
              ) : null}
              <Field id="login-email" label="Email" error={errors.email?.message}>
                <Input
                  {...register("email", { onChange: () => setServerError(null) })}
                  {...fieldA11y("login-email", errors.email?.message)}
                  type="email"
                  autoComplete="username"
                  autoFocus
                  placeholder="you@example.com"
                />
              </Field>
              <Field id="login-password" label="Password" error={errors.password?.message}>
                <PasswordInput
                  {...register("password", { onChange: () => setServerError(null) })}
                  {...fieldA11y("login-password", errors.password?.message)}
                  autoComplete="current-password"
                />
              </Field>
              <Button type="submit" variant="default" className="w-full" loading={busy}>
                {redirecting ? "Signing in…" : isSubmitting ? "Checking…" : "Sign in"}
              </Button>
            </form>
          ) : (
            <UserRegistrationForm
              onSuccess={() => {
                setMode("signin");
              }}
            />
          )}
        </div>

        <p className="mt-5 text-center text-[13px] text-muted">
          {mode === "signin" ? "Need an account?" : "Already have one?"}{" "}
          <button
            type="button"
            onClick={() => {
              setServerError(null);
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="font-medium text-ink underline underline-offset-4 hover:text-accent"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
