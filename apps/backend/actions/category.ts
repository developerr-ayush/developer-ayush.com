"use server";
import { auth } from "../auth";
import { db } from "../lib/db";
export const createCategory = async (values: string) => {
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  try {
    await db.category.create({
      data: {
        name: values.toLowerCase(),
        slug: values.toLowerCase().replace(/ /g, "-"),
      },
    });
    return { success: "Category created" };
  } catch (e) {
    return { error: "Category already exists", message: e };
  }
};
export const editCategory = async (values: {
  id: string;
  name: string;
  showInHome: boolean;
}) => {
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  try {
    await db.category.update({
      where: { id: values.id },
      data: {
        name: values.name.toLowerCase(),
        showInHome: values.showInHome,
      },
    });
    return { success: "Category updated" };
  } catch (e) {
    return { error: "Category already exists", message: e };
  }
};
