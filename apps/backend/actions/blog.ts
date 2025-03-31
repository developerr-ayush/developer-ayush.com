"use server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { auth } from "../auth";
import { db } from "../lib/db";
import { blogSchema } from "../schemas";
import { z } from "zod";

export const createBlog = async (values: z.infer<typeof blogSchema>) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const { title, description, status, banner, content, categories } =
    validatedFields.data;

  // Ensure categories is an array
  const categoriesArray: string[] = Array.isArray(categories)
    ? categories
    : typeof categories === "string"
      ? (categories as unknown as string)
          .split(",")
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0)
      : [];

  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  try {
    // save blog to database
    await db.blog.create({
      data: {
        title,
        content:
          typeof content === "object" ? JSON.stringify(content) : content,
        description,
        status,
        banner,
        tags: values.tags ? values.tags.toString() : "",
        slug: values.slug,
        categories: {
          connectOrCreate: categoriesArray.map((cat: string) => {
            return {
              where: { name: cat },
              create: { name: cat, slug: cat.toLowerCase().replace(/ /g, "-") },
            };
          }),
        },
        author: {
          connect: {
            email: session.user?.email || "",
          },
        },
      },
    });
  } catch (e) {
    console.error("Error creating blog:", e);
    // checking if error is because of title
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Title or Slug cateogry already exists" };
    }
    return { error: "something went wrong" };
  }
  return { success: "blog created" };
};
export const updateBlog = async (
  values: z.infer<typeof blogSchema>,
  id: string
) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const { title, description, status, content, banner, categories, slug } =
    validatedFields.data;

  // Ensure categories is an array
  const categoriesArray: string[] = Array.isArray(categories) ? categories : [];

  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  const existingblog = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!existingblog) return { error: "Blog not found" };
  if (session.user.email !== existingblog?.author.email)
    return { error: "Not Authorized" };
  // save blog to database
  try {
    await db.blog.update({
      where: { id: id },
      data: {
        title,
        content:
          typeof content === "object" ? JSON.stringify(content) : content,
        description,
        status,
        banner,
        tags: values.tags ? values.tags.toString() : "",
        slug: slug,
        categories: {
          connectOrCreate: categoriesArray.map((cat: string) => {
            return {
              where: { name: cat },
              create: { name: cat, slug: cat.toLowerCase().replace(/ /g, "-") },
            };
          }),
        },
      },
    });
    return { success: "blog updated" };
  } catch (e) {
    console.error("Error updating blog:", e);
    return { error: "something went wrong" };
  }
};
export const showBlog = async () => {
  const blogs = await db.blog.findMany();
  return blogs;
};
export const getBlogById = async (id: string) => {
  try {
    const blog = await db.blog.findUnique({
      where: { id },
      include: { author: true, categories: true },
    });
    return blog;
  } catch {
    return null;
  }
};
export const deleteBlog = async (id: string) => {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };
  if (!session?.user) return { error: "Not Authorized" };
  const existingblog = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!existingblog) return { error: "Blog not found" };
  if (session.user.email !== existingblog?.author.email)
    return { error: "Not Authorized" };
  try {
    await db.blog.delete({ where: { id } });
    return { success: "blog deleted" };
  } catch (e) {
    console.error("Error deleting blog:", e);
    return { error: "something went wrong" };
  }
};
