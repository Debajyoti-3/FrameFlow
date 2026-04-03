import { NextResponse } from "next/server";
import { CheckAuth } from "@/lib/checkAuth";

export async function GET() {
  const user = await CheckAuth();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ success: true, user });
}