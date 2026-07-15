import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
    try {
        const {amount} = await request.json();
        const options = {
            amount: amount,
            currency: "INR"
        };
        const order = await instance.orders.create(options);
        return NextResponse.json(order);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
