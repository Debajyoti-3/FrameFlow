export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { authLimiter } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password, turnstileToken } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { message: "required fields are empty" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "user is not registered yet" },
        { status: 400 },
      );
    }

    if (user.provider === "google" && !user.password) {
      return NextResponse.json(
        {
          message:
            "This account uses Google Sign-In. Please click the 'Sign in with Google' button.",
        },
        { status: 409 },
      );
    }

    const { success, limit, remaining, reset } = await authLimiter.limit(
      user.id,
    );

    if (!success) {
      return NextResponse.json(
        {
          message: "Too many requests",
          limit,
          remaining,
          reset,
        },
        {
          status: 429,
        },
      );
    }

    const validPassword = await bcrypt.compare(password, user.password!);
    if (!validPassword) {
      return NextResponse.json(
        { message: "given password is not valid" },
        { status: 400 },
      );
    }

    const tokenData = {
      // payload
      id: user.id,
      email: email,
      name: user.name,
    };

    const secretA = process.env.ACCESS_TOKEN_SECRET_KEY;
    const expiryA = process.env.ACCESS_TOKEN_EXPIRY;

    const secretR = process.env.REFRESH_TOKEN_SECRET_KEY;
    const expiryR = process.env.REFRESH_TOKEN_EXPIRY;

    // doing this to prevent Typescript issues
    if (!secretA || !expiryA || !secretR || !expiryR) {
      throw new Error("JWT Configuration is incomplete in .env");
    }
    const generatedAccessToken = jwt.sign({ ...tokenData }, secretA, {
      expiresIn: expiryA as any,
    });

    const generatedRefreshToken = jwt.sign({ id: user.id }, secretR, {
      expiresIn: expiryR as any,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(generatedRefreshToken, salt);

    // delete old refresh tokens before creating new token
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.refreshToken.create({
      data: {
        hashedToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days validity
      },
    });
    const response = NextResponse.json(
      { message: "login successful" },
      { status: 200 },
    );

    response.cookies.set("accessToken", generatedAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // cookie will expire after 1 hr
    });

    response.cookies.set("refreshToken", generatedRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // cookie will expire after 7 days
    });

    return response;
  } catch (error) {
    console.log("error in login: ", error);
    return NextResponse.json({ message: "error in login" });
  }
}
