export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendOnboardingEmail } from "@/lib/sendOnBoardingEmail";


export async function POST(req: NextRequest) {
  try {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

    const reqBody = await req.json();
    const { password, email, name } = reqBody;

    if (!password || !email || !name) {
      return NextResponse.json(
        { message: "Required fields are empty" },
        { status: 400 },
      );
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include a number",
        },
        { status: 400 },
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json(
        { message: "user already existed" },
        { status: 400 },
      );
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    sendOnboardingEmail(email, name); // no 'await' -> Important

    return NextResponse.json(
      {
        message: "User Created successfully",
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("Signup failed: ", error);
    return NextResponse.json({ message: "Error in signup" }, { status: 500 });
  }
}
