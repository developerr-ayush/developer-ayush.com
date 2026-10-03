"use server";

// Small server actions added for the admin UI. They reuse the same
// authorisation rules as actions/blog.ts and never touch public APIs.

import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { db } from "../lib/db";

export async function checkSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<{ available: boolean }> {
  const session = await auth();
  if (!session?.user) return { available: false };
  const clean = slug.trim();
  if (!clean) return { available: false };
  const existing = await db.blog.findUnique({
    where: { slug: clean },
    select: { id: true },
  });
  return { available: !existing || existing.id === excludeId };
}

export async function checkProductSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<{ available: boolean }> {
  const session = await auth();
  if (!session?.user) return { available: false };
  const clean = slug.trim();
  if (!clean) return { available: false };
  const existing = await db.product.findUnique({
    where: { slug: clean },
    select: { id: true },
  });
  return { available: !existing || existing.id === excludeId };
}

export async function setBlogStatus(
  id: string,
  status: "draft" | "published" | "archived"
): Promise<{ success?: string; error?: string }> {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return { error: "Only admins can change a post's status" };
  }
  const blog = await db.blog.findUnique({ where: { id } });
  if (!blog) return { error: "Post not found" };
  if (status === "published" && !blog.approved) {
    return { error: "Approve the post before publishing" };
  }
  try {
    await db.blog.update({ where: { id }, data: { status } });
    revalidatePath("/admin/blog");
    revalidatePath("/admin");
    return {
      success:
        status === "archived"
          ? "Post archived"
          : status === "published"
            ? "Post published"
            : "Post moved to drafts",
    };
  } catch (e) {
    console.error("setBlogStatus failed:", e);
    return { error: "Could not update the post" };
  }
}

/**
 * `updateBlog` only ever connects categories, so removing one in the editor
 * would silently do nothing. This replaces the post's categories with the
 * given set (same permission rules as updateBlog: author or admin).
 */
export async function setBlogCategories(
  id: string,
  names: string[]
): Promise<{ success?: string; error?: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  const blog = await db.blog.findUnique({
    where: { id },
    include: { author: { select: { email: true } } },
  });
  if (!blog) return { error: "Post not found" };
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin && blog.author.email !== session.user.email) return { error: "Not Authorized" };

  const clean = [...new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean))];
  try {
    await db.$transaction([
      db.blog.update({ where: { id }, data: { categories: { set: [] } } }),
      db.blog.update({
        where: { id },
        data: {
          categories: {
            connectOrCreate: clean.map((name) => ({
              where: { name },
              create: { name, slug: name.replace(/ /g, "-") },
            })),
          },
        },
      }),
    ]);
    return { success: "Categories updated" };
  } catch (e) {
    console.error("setBlogCategories failed:", e);
    return { error: "Could not update categories" };
  }
}

export async function checkTitleAvailable(
  title: string,
  excludeId?: string
): Promise<{ available: boolean }> {
  const session = await auth();
  if (!session?.user) return { available: false };
  const clean = title.trim();
  if (!clean) return { available: true };
  const existing = await db.blog.findUnique({
    where: { title: clean },
    select: { id: true },
  });
  return { available: !existing || existing.id === excludeId };
}
