import { loginSchema, postSchema } from "@/schema/schema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: any = await request.json();
  const validation = postSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.errors, status: 400 });
  }
  let data = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      posts: { create: {
        title: body.posts[0].title,
        content: body.posts[0].content,
      } },
      profile: { create: body.profile },
    },
  });
  console.log(data);
  return NextResponse.json(data);
}
