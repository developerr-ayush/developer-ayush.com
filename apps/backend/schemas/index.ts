import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, {
    message: "Password is required",
  }),
});
export const blogSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(10, { message: "Title should be atleast 10 letters" })
    .max(255, { message: "Title should be less than 255 letters" }),
  content: z.union([z.string(), z.object({}), z.null()]).transform((val) => {
    // If it's an empty string or null, return null
    if (!val) return null;

    // If it's already an object, return it
    if (typeof val === "object") return val;

    // If it's a string, try to parse it as JSON
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        // If it's not valid JSON, return it as a string
        return val;
      }
    }

    return val;
  }),
  json_content: z.any().optional(),
  date: z.date(),
  author: z.string().optional(),
  banner: z.string(),
  description: z.string().max(1000).optional(),
  status: z
    .union([z.literal("draft"), z.literal("published"), z.literal("archived")])
    .optional(),
  slug: z.string(),
  tags: z.string().optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
  categories: z.union([
    z.array(z.string()),
    z.string().transform((val) => {
      if (!val) return [];
      return val
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }),
  ]),
});
