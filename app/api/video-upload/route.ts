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

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const user = await CheckAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({
        error: "Cloudinary Config is not setup properly",
      });
    }

    const { success, limit, remaining, reset } = await uploadLimiter.limit(
      user.id,
    );

    if (!success) {
      return NextResponse.json(
        {
          message: "Too many requests",
          limit,
          remaining,
          reset,
        },
        {
          status: 429,
        },
      );
    }
    const formData = await request.formData(); // So yes, you use FormData() constructor when creating/sending, but request.formData() method when receiving/parsing in Next.js!
    const file = formData.get("file") as File | null;
    const originalSize = formData.get("originalSize") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json({ error: "file not found" });
    }

    const bytes = await file.arrayBuffer(); // creating bytes from the file
    const buffer = Buffer.from(bytes); // creating buffer from bytes (it will be uploaded in cloudinary)

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "cloudinary-video-uploads",
            transformation: [{ quality: "auto", fetch_format: "mp4" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          },
        );
        uploadStream.end(buffer);
      },
    );

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId: result.public_id,
        duration: result.duration || 0,
        originalSize: originalSize,
        compressedSize: String(result.bytes),
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.log("Video upload failed", error);
    return NextResponse.json({ error: "Video upload failed" }, { status: 500 });
  }
}
