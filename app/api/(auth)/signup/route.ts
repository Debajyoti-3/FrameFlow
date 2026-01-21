export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { password, email, name } = reqBody;

    if (!password || !email || !name) {
      return NextResponse.json({ message: "Required fields are empty" }, { status: 400 });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if(user){
        return NextResponse.json({message:"user already existed"}, { status: 400 })
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.log("Signup failed: ", error)
    return NextResponse.json({ message: "Error in signup" }, { status: 500 });
  } 
}
