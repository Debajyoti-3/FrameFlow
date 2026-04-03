export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 },
      );
    }

    let decoded: jwt.JwtPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY!,
      ) as jwt.JwtPayload;
    } catch {
      return NextResponse.json(
        { message: "Refresh token is invalid or expired" },
        { status: 401 },
      );
    }

    // find the matching hashed token in DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.id,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      return NextResponse.json(
        { message: "Refresh token not found" },
        { status: 401 },
      );
    }

    const match = await bcrypt.compare(refreshToken, storedToken.hashedToken);

    if (!match) {
      return NextResponse.json(
        { message: "Refresh token not recognised" },
        { status: 401 },
      );
    }

    // issue new access token
    const tokenData = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    const accessOptions: SignOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
    };

    const newAccessToken = jwt.sign(
      tokenData,
      process.env.ACCESS_TOKEN_SECRET_KEY!,
      accessOptions,
    );

    const redirectTo = req.nextUrl.searchParams.get("redirect") || "/";

    const response = NextResponse.redirect(new URL(redirectTo, req.url));
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1hr
    });

    return response;
  } catch (error) {
    console.error("Error in refresh-token:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
