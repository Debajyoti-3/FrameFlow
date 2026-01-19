export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);


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

    try {
      await resend.emails.send({
        from: 'FrameFlow <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to FrameFlow',
        react: EmailTemplate({ firstName: name }),
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.log("Signup failed: ", error)
    return NextResponse.json({ message: "Error in signup" }, { status: 500 });
  } 
}
