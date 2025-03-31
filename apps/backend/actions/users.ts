"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const GetUsers = async () => {
  let session = await auth();
  if (!session || !session.user) return { error: "Not authorized" };
  // if (session.user.role !== "SUPER_ADMIN") return { error: "Not authorized" };
  let users = await db.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
  return users;
};
