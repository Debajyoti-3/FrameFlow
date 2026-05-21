export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { CheckAuth } from "@/lib/checkAuth";
import { uploadLimiter } from "@/lib/rateLimit";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 *  GET Request: Generates a secure, signed token for the frontend to upload directly to Cloudinary.
 * This completely bypasses serverless payload size limits!
 */
export async function GET(request: NextRequest) {
  try {
    const user = await CheckAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting execution before issuing signature
    const { success, limit, remaining, reset } = await uploadLimiter.limit(
      user.id,
    );
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests", limit, remaining, reset },
        { status: 429 },
      );
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary Config is not setup properly" },
        { status: 500 },
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    // These parameters MUST match exactly what the frontend sends to Cloudinary
    const paramsToSign = {
      timestamp: timestamp,
      folder: "cloudinary-video-uploads",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET,
    );

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Failed to generate upload signature:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

  // POST Request: Receives JSON data after successful client-side upload to save information in Prisma.
 
export async function POST(request: NextRequest) {
  try {
    const user = await CheckAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Expecting standard JSON now, not heavy multi-part form data
    const body = await request.json();
    const {
      title,
      description,
      publicId,
      duration,
      originalSize,
      compressedSize,
    } = body;

    if (!title || !publicId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId,
        duration: duration || 0,
        originalSize: String(originalSize),
        compressedSize: String(compressedSize),
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Video saving database entry failed", error);
    return NextResponse.json(
      { error: "Failed to record video data" },
      { status: 500 },
    );
  }
}
