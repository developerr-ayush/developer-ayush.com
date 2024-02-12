import { profile } from "console";
import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const postSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  posts: z.array(
    z.object({
      title: z.string().min(1),
      content: z.string().optional(),
    })
  ),
  profile: z.object({
    age: z.number().optional(),
    bio: z.string().optional(),
  }),
});
