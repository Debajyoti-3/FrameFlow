import { NextRequest, NextResponse } from "next/server";
import { CheckAuth } from "@/lib/checkAuth";

export async function GET() {
  try {
    const userData = await CheckAuth();
    const name = userData?.name|| "Unknown";
    const email = userData?.email;

    return NextResponse.json({ user:{name, email}, messege: "user data fetched" });
  } catch (error) {
    console.log("User data fetch error for profile card: ", error);
    return NextResponse.json({
      message: "Error in data fetch for profile card",
    });
  }
}
