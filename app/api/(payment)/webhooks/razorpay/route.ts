import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[WEBHOOK ERROR] RAZORPAY_WEBHOOK_SECRET is not configured in .env");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const receivedSignature = req.headers.get("x-razorpay-signature");
    if (!receivedSignature) {
      console.error("[WEBHOOK ERROR] Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get the raw request body as text for HMAC verification
    const rawBody = await req.text();

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      console.error("[WEBHOOK ERROR] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const eventData = JSON.parse(rawBody);
    const eventName = eventData.event;
    console.log(`[WEBHOOK RECEIVED] Event: ${eventName}`);


    if (eventName === "payment.captured") {
      const paymentEntity = eventData.payload?.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
      }

      const paymentId = paymentEntity.id;
      const orderId = paymentEntity.order_id;
      const email = paymentEntity.email;
      const amount = Number(paymentEntity.amount);

      if (!email) {
        console.warn(`[WEBHOOK WARNING] No email address associated with payment ${paymentId}`);
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      // Check if this payment ID has already been processed (idempotency check)
      const paymentKey = `payment:processed:${paymentId}`;
      const isProcessed = await redis.get(paymentKey);
      if (isProcessed) {
        console.log(`[WEBHOOK INFO] Payment ${paymentId} has already been processed and credited.`);
        return NextResponse.json({ message: "Payment already processed" }, { status: 200 });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.error(`[WEBHOOK ERROR] User not found for email: ${email}`);
        return NextResponse.json({ error: `User with email ${email} not found` }, { status: 404 });
      }


      let creditsToAdd = 0;
      if (amount === 100) {
        creditsToAdd = 5;
      } else if (amount === 500) {
        creditsToAdd = 30;
      } else if (amount === 1000) {
        creditsToAdd = 70;
      } else {
        creditsToAdd = Math.floor((amount * 5) / 100);
      }

      if (creditsToAdd > 0) {
        // Mark as processed in Redis (7 days TTL)
        await redis.set(paymentKey, "true", { ex: 60 * 60 * 24 * 7 });

        // Update user credits and create/update transaction record in a transaction
        const [updatedUser] = await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: {
              credits: { increment: creditsToAdd },
            },
          }),
          prisma.transaction.upsert({
            where: { razorpayOrderId: orderId },
            update: {
              paymentId: paymentId,
              status: "captured",
            },
            create: {
              razorpayOrderId: orderId,
              paymentId: paymentId,
              amount: amount,
              credits: creditsToAdd,
              status: "captured",
              userId: user.id,
            },
          }),
        ]);

        console.log(
          `[WEBHOOK SUCCESS] Successfully credited ${creditsToAdd} credits to user ${email} (${user.id}). New credit balance: ${updatedUser.credits}. Payment ID: ${paymentId}, Order ID: ${orderId}`
        );
      } else {
        console.warn(`[WEBHOOK WARNING] Payment of amount ${amount} did not yield any credits.`);
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK EXCEPTION] Error processing webhook:", error);
    return NextResponse.json({ error: "Internal Server Error in Webhook" }, { status: 500 });
  }
}