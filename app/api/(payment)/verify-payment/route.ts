import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { CheckAuth } from "@/lib/checkAuth";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { redis } from "@/lib/rateLimit";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const user = await CheckAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    // Check if this payment ID has already been processed (idempotency check)
    const paymentKey = `payment:processed:${razorpay_payment_id}`;
    const isProcessed = await redis.get(paymentKey);
    if (isProcessed) {
      console.log(`[PAYMENT ALREADY PROCESSED] Payment ID: ${razorpay_payment_id} was already credited.`);
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully! (Already processed)",
        creditsAdded: 0,
      });
    }

    // Verify signature using the correct secret_key
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.warn(`[PAYMENT FAILED] Signature verification failed for user: ${user.email}, Order ID: ${razorpay_order_id}`);
      return NextResponse.json(
        { success: false, message: "Payment verification failed!" },
        { status: 400 }
      );
    }

    // Fetch order from Razorpay to get the actual amount paid
    const orderDetails = await instance.orders.fetch(razorpay_order_id);
    const amount = Number(orderDetails.amount); // in paise

    // Determine credits 
    let creditsToAdd = 0;
    if (amount === 100) {
      creditsToAdd = 5;
    } else if (amount === 500) {
      creditsToAdd = 30;
    } else if (amount === 1000) {
      creditsToAdd = 70;
    } else {
      // Fallback calculation: 5 credit per ₹1 spent
      creditsToAdd = Math.floor(amount * 5 / 100);
    }

    if (creditsToAdd > 0) {
      // Mark as processed in Redis (7 days TTL) to prevent duplicate crediting via webhook
      await redis.set(paymentKey, "true", { ex: 60 * 60 * 24 * 7 });

      // Update user credits and create/update transaction record in a transaction
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            credits: { increment: creditsToAdd },
          },
        }),
        prisma.transaction.upsert({
          where: { razorpayOrderId: razorpay_order_id },
          update: {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            status: "captured",
          },
          create: {
            razorpayOrderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            amount: amount,
            credits: creditsToAdd,
            status: "captured",
            userId: user.id,
          },
        }),
      ]);

      console.log(
        `[PAYMENT SUCCESS] User ${user.email} (${user.id}) successfully purchased ${creditsToAdd} credits for INR ${amount / 100} (Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id})`
      );
    }

    

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully!",
      creditsAdded: creditsToAdd,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during payment verification" },
      { status: 500 }
    );
  }
}
