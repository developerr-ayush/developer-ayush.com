"use server";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import * as z from "zod";
import bcrypt from "bcryptjs";
import {
  isRedirectError,
  redirect,
} from "next/dist/client/components/redirect";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { email, password } = validatedFields.data;
  // const user = await db.user.create({
  //   data: {
  //     name: "Ayush Shah",
  //     email,
  //     password: bcrypt.hashSync(password, 10),
  //   },
  // });
  // return { success: "User created" };
  try {
    let success = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
      redirect: false,
    });
  } catch (err) {
    if (isRedirectError(err)) {
      console.error(err);
      throw err;
    }
    return { error: "Invalid Credentials" };
  }
  redirect(DEFAULT_LOGIN_REDIRECT);
  return { success: "Login Success" };
};
