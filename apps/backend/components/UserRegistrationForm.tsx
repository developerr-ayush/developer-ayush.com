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
    watch,
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

  const password = watch("password");

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
    <div className="w-full max-w-md mx-auto animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isAdmin ? "Create New User" : "Sign Up"}
        </h2>
        <p className="text-gray-500 mt-1">
          {isAdmin
            ? "Add a new user to the system"
            : "Create your account to get started"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl  space-y-6  animate-slideUp"
      >
        {error && (
          <div className="bg-red-50 rounded-lg p-4 mb-6 border-l-4 border-red-500 animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                className={`block w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-indigo-500"
                } focus:border-transparent focus:outline-none focus:ring-2 transition duration-200`}
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                className={`block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-indigo-500"
                } focus:border-transparent focus:outline-none focus:ring-2 transition duration-200`}
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                className={`block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-200 focus:ring-indigo-500"
                } focus:border-transparent focus:outline-none focus:ring-2 transition duration-200`}
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {!isAdmin && (
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-indigo-500"
                  } focus:border-transparent focus:outline-none focus:ring-2 transition duration-200`}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {showRoleSelector && (
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <select
                  id="role"
                  className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none"
                  {...register("role")}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 relative overflow-hidden"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : isAdmin ? (
              "Create User"
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
