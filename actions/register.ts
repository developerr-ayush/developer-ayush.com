"use server";
import { RegisterSchema } from "@/schema";
import * as z from "zod";
import bcrypt from "bcrypt";
import { db } from "@/prisma/db";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "invalid fields" };
  }
  const { email, password, name } = values;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }
  console.log(hashedPassword);
  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  // Todo: send verification token email
  return { success: "Email Send" };
};
