import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  generateAccessTokenForGoogleAuth,
  generateRefreshTokenForGoogleAuth,
} from "@/lib/token";
import { sendOnboardingEmail } from "@/lib/sendOnBoardingEmail";

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.log("No code found");
    return NextResponse.redirect(
      new URL("/sign-in?error=NoCodeProvided", request.url),
    );
  }

  try {
    // Exchange the code for actual Google tokens
    const { tokens } = await client.getToken(code);

    // Verify the ID token integrity and pull user profile data
    const idToken = tokens.id_token;
    if (!idToken) {
      throw new Error("Failed to retrieve ID token from Google");
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error("Invalid token payload");
    }

    const { email, name, picture } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "User",
          profilePic: picture,
          provider: "google",
        },
      });
    } else if (picture) {
      user = await prisma.user.update({
        where: { email },
        data: {
          profilePic: picture,
          ...(name && { name }),
        },
      });
    }

    const myAccessToken = generateAccessTokenForGoogleAuth(
      user.id,
      user.email,
      user.name,
    );
    const myRefreshToken = generateRefreshTokenForGoogleAuth(user.id);

    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(myRefreshToken, salt);

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

    sendOnboardingEmail(email, user.name || "User"); // no 'await' -> Important

    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    response.cookies.set("accessToken", myAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hr
    });

    response.cookies.set("refreshToken", myRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("OAuth Callback Error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=OAuthFailed", request.url),
    );
  }
}
