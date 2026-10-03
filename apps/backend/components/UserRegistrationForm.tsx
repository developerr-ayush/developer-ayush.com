"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as registerUser } from "../actions/register";
import { createUser } from "../actions/users";
import { Button } from "./ui/button";
import { Field, fieldA11y } from "./ui/field";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import { Select } from "./ui/select";
import { toast } from "../lib/toast";

const base = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters)"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Use at least 6 characters"),
  confirmPassword: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "USER"]).optional(),
});
type Values = z.infer<typeof base>;

interface Props {
  onSuccess?: () => void;
  showRoleSelector?: boolean;
  /** true when an admin creates the account (no confirm-password step) */
  isAdmin?: boolean;
  submitLabel?: string;
}

/** Used for public sign-up on /login and for admins creating accounts at /admin/users/new. */
export default function UserRegistrationForm({ onSuccess, showRoleSelector = false, isAdmin = false, submitLabel }: Props) {
  const [formError, setFormError] = React.useState<string | null>(null);

  const schema = React.useMemo(
    () =>
      base.superRefine((v, ctx) => {
        if (!isAdmin && v.password !== v.confirmPassword) {
          ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords don't match" });
        }
      }),
    [isAdmin]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: "USER" } });

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null);
    try {
      const res = isAdmin
        ? await createUser({ name: data.name, email: data.email, password: data.password, role: data.role })
        : await registerUser({ name: data.name, email: data.email, password: data.password });
      if (res.error) {
        setFormError(res.error);
        return;
      }
      toast.success(res.success ?? "Account created");
      onSuccess?.();
    } catch {
      setFormError("Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {formError ? (
        <p role="alert" className="rounded-[var(--radius-ctl)] border border-[color-mix(in_srgb,var(--danger)_40%,var(--line))] bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))] px-3 py-2.5 text-[13px] text-danger">
          {formError}
        </p>
      ) : null}
      <Field id="reg-name" label="Name" required error={errors.name?.message}>
        <Input {...register("name")} {...fieldA11y("reg-name", errors.name?.message)} autoComplete="name" />
      </Field>
      <Field id="reg-email" label="Email" required error={errors.email?.message}>
        <Input {...register("email")} {...fieldA11y("reg-email", errors.email?.message)} type="email" autoComplete="email" />
      </Field>
      <Field id="reg-password" label="Password" required error={errors.password?.message} hint="At least 6 characters.">
        <PasswordInput {...register("password")} {...fieldA11y("reg-password", errors.password?.message, true)} autoComplete="new-password" />
      </Field>
      {!isAdmin ? (
        <Field id="reg-confirm" label="Confirm password" required error={errors.confirmPassword?.message}>
          <PasswordInput {...register("confirmPassword")} {...fieldA11y("reg-confirm", errors.confirmPassword?.message)} autoComplete="new-password" />
        </Field>
      ) : null}
      {showRoleSelector ? (
        <Field id="reg-role" label="Role" hint="Admins can publish and manage users. Users write drafts that need approval.">
          <Select {...register("role")} {...fieldA11y("reg-role", undefined, true)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </Select>
        </Field>
      ) : null}
      <Button type="submit" variant="default" className="w-full" loading={isSubmitting}>
        {isSubmitting ? "Creating…" : (submitLabel ?? "Create account")}
      </Button>
    </form>
  );
}
