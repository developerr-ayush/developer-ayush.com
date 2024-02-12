import { loginSchema } from "@/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: any = await request.json();
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.errors, status: 400 });
  }
  
  return NextResponse.json(body);
}
