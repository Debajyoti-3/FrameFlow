import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req:NextRequest) {
    const reqBody = await req.json()

    if (!reqBody.email || !reqBody.name) {
    return NextResponse.json(
      { error: 'Missing required fields: email and name' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'FrameFlow <onboarding@resend.dev>',
      to: [reqBody.email],
      subject: 'Welcome to FrameFlow',
      react: EmailTemplate({ firstName: reqBody.name }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}