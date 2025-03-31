import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "../../../schemas";
import { getUserByEmail, getUserById } from "../../../data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";

import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";

export const authOptions = {
  // Configure one or more authentication providers
  callbacks: {
    async session({ token, session }: { token: any, session: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },
    async jwt({ token }: { token: any }) {
      
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.role = existingUser.role;

      // getUserById
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions as AuthOptions);
