import { NextRequest, NextResponse } from "next/server";
import { CheckAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userData = await CheckAuth();

    if (!userData) {
      return NextResponse.json({ message: "userData not found" });
    }
    const fetchedUser = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!fetchedUser) {
      return NextResponse.json({ message: "fetchedUser not found" });
    }

    const name = fetchedUser?.name || "Unknown";
    const email = fetchedUser?.email;
    const profilePic = fetchedUser?.profilePic || null;
    const credits = fetchedUser?.credits;
    const creditUsed = fetchedUser?.creditUsed ?? 0;
    const transactions = fetchedUser?.transactions || [];

    return NextResponse.json({
      user: { name, email, profilePic, credits, creditUsed, transactions },
      messege: "user data fetched",
    });
  } catch (error) {
    console.log("User data fetch error for profile card: ", error);
    return NextResponse.json({
      message: "Error in data fetch for profile card",
    });
  }
}
