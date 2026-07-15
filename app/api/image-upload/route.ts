import { CheckAuth } from "@/lib/checkAuth";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import sharp from "sharp"; // using sharp for extra image meta-data/type checks
import { uploadLimiter } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
  public_id: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  const user = await CheckAuth();
  // const userId = user?.id

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  // Check user credits first
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id  }, 
    });

    if ( dbUser && dbUser.creditUsed >= dbUser.credits) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }
  } catch (dbError) {
    console.error("Database error during credit check:", dbError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "file not found" });
    }

    const bytes = await file.arrayBuffer(); // creating bytes from the file
    const buffer = Buffer.from(bytes); // creating buffer from bytes (it will be uploaded in cloudinary)

    const processed = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "cloudinary-saas" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          },
        );
        uploadStream.end(processed);
      },
    );

    // Decrement credits on successful upload
    await prisma.user.update({
      where: { id: user.id },
      data: {
        creditUsed: { increment: 1 },
      },
    });

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.log("Image upload failed", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
