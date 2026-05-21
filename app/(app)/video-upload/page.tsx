"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadIcon, Loader2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function page() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState<string>("");

  // max file size is 15 mb
  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return;
    }

    try {
      setIsUploading(true);

      // Get signed upload details
      const signatureRes = await axios.get("/api/video-upload");

      const { signature, timestamp, apiKey, cloudName } = signatureRes.data;

      //  Upload directly to Cloudinary
      const cloudinaryFormData = new FormData();

      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("api_key", apiKey);
      cloudinaryFormData.append("timestamp", timestamp);
      cloudinaryFormData.append("signature", signature);

      cloudinaryFormData.append("folder", "cloudinary-video-uploads");

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        cloudinaryFormData,
      );

      // Save metadata to DB
      const saveRes = await axios.post("/api/video-upload", {
        title,
        description,
        publicId: cloudinaryRes.data.public_id,
        duration: cloudinaryRes.data.duration,
        originalSize: file.size,
        compressedSize: cloudinaryRes.data.bytes,
      });

      toast.success("Video uploaded successfully!");

      setFile(null);
      setTitle("");
      setDescription("");

      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.error || error.message || "Upload failed";

      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Upload Video
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Upload and compress your video files (max{" "}
          {MAX_FILE_SIZE / (1024 * 1024)}MB)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
          <CardDescription>
            Fill in the information about your video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description (optional)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Video File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                  required
                />
              </div>
              {file && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Selected: {file.name} ({formatFileSize(file.size)})
                </p>
              )}
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
