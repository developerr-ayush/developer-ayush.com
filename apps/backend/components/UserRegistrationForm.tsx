"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas";
import { register as registerUser } from "../actions/register";
import { createUser } from "../actions/users";
import { z } from "zod";

type FormValues = z.infer<typeof RegisterSchema> & {
  role?: string;
  confirmPassword?: string;
};

interface UserRegistrationFormProps {
  onSuccess?: () => void;
  showRoleSelector?: boolean;
  isAdmin?: boolean;
}

export default function UserRegistrationForm({
  onSuccess,
  showRoleSelector = false,
  isAdmin = false,
}: UserRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      RegisterSchema.extend({
        confirmPassword: isAdmin
          ? z.string().optional()
          : z.string().min(1, "Confirmation password is required"),
        role: z.enum(["SUPER_ADMIN", "ADMIN", "USER"]).optional(),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    },
  });

  //   const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    // Validate confirm password if not in admin mode
    if (!isAdmin && data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (isAdmin) {
        // Admin is creating a user through admin panel
        result = await createUser(data);
      } else {
        // User is self-registering
        result = await registerUser(data);
      }

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {!isAdmin && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Sign Up</h2>
          <p className="text-slate-400 mt-1">Create your account to get started</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl  space-y-6  animate-slideUp"
      >
        {error && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5">
            <div className="w-4 h-4 text-rose-400 flex-shrink-0">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className={`block w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.name
                  ? "border-rose-500/50 focus:ring-rose-500/30"
                  : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/50"
              }`}
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`block w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.email
                  ? "border-rose-500/50 focus:ring-rose-500/30"
                  : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/50"
              }`}
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`block w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition duration-200 ${
                errors.password
                  ? "border-rose-500/50 focus:ring-rose-500/30"
                  : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/50"
              }`}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
            )}
          </div>

          {!isAdmin && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`block w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition duration-200 ${
                  errors.confirmPassword
                    ? "border-rose-500/50 focus:ring-rose-500/30"
                    : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/50"
                }`}
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {showRoleSelector && (
            <div className="space-y-2">
              <label htmlFor="role" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Role
              </label>
              <select
                id="role"
                className="block w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition duration-200"
                {...register("role")}
              >
                <option value="USER" className="bg-slate-900">User</option>
                <option value="ADMIN" className="bg-slate-900">Admin</option>
                <option value="SUPER_ADMIN" className="bg-slate-900">Super Admin</option>
              </select>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : isAdmin ? "Create User" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}
