"use server";

import { Role } from "@prisma/client";
import { auth } from "../auth";
import { db } from "../lib/db";
import { RegisterSchema } from "../schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const GetUsers = async () => {
  const session = await auth();
  if (!session || !session.user) return { error: "Not authorized" };

  // Only admin and super admin can view users
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { error: "Not authorized" };
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      blogs: {
        select: {
          id: true,
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    blogCount: user.blogs.length,
    blogs: undefined, // Remove the blogs array from the response
  }));
};

export const createUser = async (
  values: z.infer<typeof RegisterSchema> & { role?: string }
) => {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return { error: "Not authorized to create users" };
  }

  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Default to USER role unless specified and the current user is a SUPER_ADMIN
  let role = "USER";
  if (values.role && session.user.role === "SUPER_ADMIN") {
    role = values.role;
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) return { error: "User already exists" };

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });

    return { success: "User created successfully" };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
};

export const updateUser = async (
  id: string,
  data: { name?: string; role?: string }
) => {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  // Only SUPER_ADMIN can update roles
  if (data.role && session.user.role !== "SUPER_ADMIN") {
    return { error: "Not authorized to change user roles" };
  }

  // Check if user exists
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return { error: "User not found" };

  // Prevent role changes for SUPER_ADMIN users (only by themselves)
  if (user.role === "SUPER_ADMIN" && session.user.id !== id) {
    return { error: "Cannot modify a SUPER_ADMIN user" };
  }

  try {
    await db.user.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role as Role,
      },
    });

    return { success: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user" };
  }
};

export const getUserDetails = async (id: string) => {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  // Users can only view their own details unless they're admin
  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (session.user.id !== id && !isAdmin) {
    return { error: "Not authorized to view this user" };
  }

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        blogs: {
          select: {
            id: true,
            title: true,
            status: true,
            approved: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!user) return { error: "User not found" };

    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { error: "Failed to fetch user details" };
  }
};
