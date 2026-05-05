import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/sendResetEmail";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  
  if (!user) {
    return Response.json({ message: "If user exists, email sent" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes validity
    }
  });

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;
  
  const resetLink = `${baseUrl}/reset-password?token=${rawToken}`;

  await sendResetEmail(user.email, resetLink);

  return Response.json({ message: "If user exists, email sent" });
}
