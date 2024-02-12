import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: "Hello" });
}
export async function POST(request: NextRequest) {
  const body: any = await request.json();
  
  return NextResponse.json(body);
}
