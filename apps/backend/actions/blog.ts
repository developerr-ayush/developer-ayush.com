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

  // Users can only create draft posts
  // Only ADMIN and SUPER_ADMIN can publish directly
  let finalStatus = status;
  let approved = false;

  if (session.user.role === "USER") {
    // USER role can only create draft posts that need approval
    finalStatus = "draft";
    // Posts created by users need approval
    approved = false;
  } else if (
    session.user.role === "ADMIN" ||
    session.user.role === "SUPER_ADMIN"
  ) {
    // Admins can publish directly and their posts are auto-approved
    approved = true;
  }

  try {
    // save blog to database
    await db.blog.create({
      data: {
        title,
        content:
          typeof content === "object" ? JSON.stringify(content) : content,
        description,
        status: finalStatus,
        banner,
        tags: values.tags ? values.tags.toString() : "",
        slug: values.slug,
        approved,
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

  // Check permissions
  const isAuthor = session.user.email === existingblog.author.email;
  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  // Only author or admin can edit a blog
  if (!isAuthor && !isAdmin) return { error: "Not Authorized" };

  // Determine final status and approval state
  let finalStatus = status;
  let approvalStatus = existingblog.approved;

  if (session.user.role === "USER") {
    // Regular users cannot publish directly, they can only save as draft
    finalStatus = "draft";

    // If a user is updating their blog, it needs approval again
    approvalStatus = false;
  } else if (isAdmin) {
    // Admins can change approval status
    approvalStatus = true;
  }

  // save blog to database
  try {
    await db.blog.update({
      where: { id: id },
      data: {
        title,
        content:
          typeof content === "object" ? JSON.stringify(content) : content,
        description,
        status: finalStatus,
        banner,
        approved: approvalStatus,
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

// New function to approve a blog post
export const approveBlog = async (id: string) => {
  const session = await auth();

  // Only admins can approve blogs
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return { error: "Not authorized to approve blogs" };
  }

  const blog = await db.blog.findUnique({ where: { id } });
  if (!blog) return { error: "Blog not found" };

  try {
    await db.blog.update({
      where: { id },
      data: {
        approved: true,
      },
    });
    return { success: "Blog approved successfully" };
  } catch (error) {
    console.error("Error approving blog:", error);
    return { error: "Failed to approve blog" };
  }
};

// Function to publish an approved blog
export const publishBlog = async (id: string) => {
  const session = await auth();

  // Only admins can publish blogs
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return { error: "Not authorized to publish blogs" };
  }

  const blog = await db.blog.findUnique({ where: { id } });
  if (!blog) return { error: "Blog not found" };

  // Only approved blogs can be published
  if (!blog.approved)
    return { error: "Blog must be approved before publishing" };

  try {
    await db.blog.update({
      where: { id },
      data: {
        status: "published",
      },
    });
    return { success: "Blog published successfully" };
  } catch (error) {
    console.error("Error publishing blog:", error);
    return { error: "Failed to publish blog" };
  }
};

export const showBlog = async () => {
  const blogs = await db.blog.findMany({
    include: { author: true, categories: true },
  });
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

  // Check permissions based on role
  const userRole = session.user.role;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  const isAuthor = session.user.email === existingblog?.author.email;

  // Only allow deletion if user is admin/super_admin OR the author of the blog
  if (!isAdmin && !isAuthor) {
    return { error: "You don't have permission to delete this blog" };
  }

  try {
    await db.blog.delete({ where: { id } });
    return { success: "blog deleted" };
  } catch (e) {
    console.error("Error deleting blog:", e);
    return { error: "something went wrong" };
  }
};
