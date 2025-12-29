import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get("token");
    const token = (
      tokenCookie && typeof tokenCookie === "object"
        ? tokenCookie.value
        : tokenCookie
    ) as string | undefined;

    if (!token) {
      return NextResponse.json({ message: "No auth token" }, { status: 401 });
    }

    // Verify token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Ensure payload contains user id
    const userId = payload?.id;
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 401 }
      );
    }

    // Fetch user from DB to confirm existence
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    return NextResponse.json({
      message: "auth check successful",
      success: true,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("authcheck error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
