"use server";
import { auth } from "../auth";
import { db } from "../lib/db";
import { productSchema } from "../schemas";
import { z } from "zod";

export const createProduct = async (values: z.infer<typeof productSchema>) => {
  const validatedFields = productSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) return { error: "Not Authorized" };

  const { name, slug, shortDescription, description, price, salePrice, image,
    images, affiliateLink, amazonLink, flipkartLink, category, brand, rating,
    instagramPost, tags, status, featured } = validatedFields.data;

  try {
    await db.product.create({
      data: {
        name,
        slug,
        shortDescription,
        description,
        price,
        salePrice,
        image,
        images: images || [],
        affiliateLink,
        amazonLink,
        flipkartLink,
        category,
        brand,
        rating,
        instagramPost,
        tags,
        status: status || "draft",
        featured: featured || false,
      },
    });
    return { success: "Product created" };
  } catch (e) {
    console.error("Error creating product:", e);
    return { error: "Slug already exists or something went wrong" };
  }
};

export const updateProduct = async (
  values: z.infer<typeof productSchema>,
  id: string
) => {
  const validatedFields = productSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) return { error: "Not Authorized" };

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found" };

  const { name, slug, shortDescription, description, price, salePrice, image,
    images, affiliateLink, amazonLink, flipkartLink, category, brand, rating,
    instagramPost, tags, status, featured } = validatedFields.data;

  try {
    await db.product.update({
      where: { id },
      data: {
        name,
        slug,
        shortDescription,
        description,
        price,
        salePrice,
        image,
        images: images || [],
        affiliateLink,
        amazonLink,
        flipkartLink,
        category,
        brand,
        rating,
        instagramPost,
        tags,
        status: status || existing.status,
        featured: featured ?? existing.featured,
      },
    });
    return { success: "Product updated" };
  } catch (e) {
    console.error("Error updating product:", e);
    return { error: "Something went wrong" };
  }
};

export const deleteProduct = async (id: string) => {
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) return { error: "Not Authorized" };

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found" };

  try {
    await db.product.delete({ where: { id } });
    return { success: "Product deleted" };
  } catch (e) {
    console.error("Error deleting product:", e);
    return { error: "Something went wrong" };
  }
};

export const showProducts = async () => {
  return db.product.findMany({ orderBy: { createdAt: "desc" } });
};

export const getProductById = async (id: string) => {
  try {
    return await db.product.findUnique({ where: { id } });
  } catch {
    return null;
  }
};
