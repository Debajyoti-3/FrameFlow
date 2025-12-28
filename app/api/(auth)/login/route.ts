import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/app/generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json({ message: "required fields are empty" });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "user is not registered yet" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: "given password is not valid" });
    }

    const tokenData = { // payload
        id: user.id,
        email: email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      { message: "login successful" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;

  } catch (error) {
    console.log("error in login: ", error);
    return NextResponse.json({ message: "error in login" });

  } finally {
    await prisma.$disconnect();
  }
}
