"use server";
import { LoginSchema } from "../schemas";
import * as z from "zod";
import { redirect } from "next/dist/client/components/redirect";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { isRedirectError } from "next/dist/client/components/redirect-error";
// import { db } from "../lib/db";
import { signIn } from "../auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };

  const { email, password } = validatedFields.data;
  // get all users from database
  // const users = await db.user.findMany();
  // console.log(users);
  // const user = await db.user.create({
  //   data: {
  //     name: "Ayush Shah",
  //     email,
  //     password: bcrypt.hashSync(password, 10),
  //   },
  // });
  // return { success: "User created" };
  try {
    await signIn("credentials", {
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
