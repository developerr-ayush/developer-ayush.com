"use server";

import { auth } from "../auth";
import { db } from "../lib/db";
import { revalidatePath } from "next/cache";

export const deleteUser = async (userId: string) => {
  const session = await auth();

  // Only super admins can delete users
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Not authorized to delete users" };
  }

  // Prevent deletion of super admin accounts
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { blogs: true },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.role === "SUPER_ADMIN") {
    return { error: "Cannot delete Super Admin accounts" };
  }

  try {
    // Begin transaction to handle user and related data
    await db.$transaction(async (tx) => {
      // If user has blogs, transfer them to the admin performing the action
      if (user.blogs.length > 0) {
        await tx.blog.updateMany({
          where: { authorId: userId },
          data: {
            authorId: session.user.id,
            status: "draft",
          },
        });
      }

      // Delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    revalidatePath("/admin/users");
    return { success: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
};
