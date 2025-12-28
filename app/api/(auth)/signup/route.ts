import { PrismaClient } from "@/app/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { password, email } = reqBody;

    if (!password || !email) {
      return NextResponse.json({ message: "Required fields are empty" });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if(user){
        return NextResponse.json({message:"user already existed"})
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser);

  } catch (error) {
    console.log("Signup failed: ", error)
    return NextResponse.json({ message: "Error in signup" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
