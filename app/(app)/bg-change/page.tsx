"use client";

import React, { useEffect, useState, useRef } from "react";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { UploadIcon, DownloadIcon, ImageIcon } from "lucide-react";

const FILE_MAX_SIZE = 10 * 1024 * 1024;

export default function page() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageBgColor, setImageBgColor] = useState<string>("#ffffff");
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage, imageBgColor]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > FILE_MAX_SIZE) {
      toast.error("Image must be within 10 MB");
      return;
    }
    setIsUploading(true);

    const formdata = new FormData();
    formdata.append("file", file);

    try {
      const res = await axios.post<{ publicId: string }>(
        "/api/image-upload",
        formdata,
      );

      if (!res.data) {
        throw new Error("Error in Image Upload");
      }
      toast.success("File uploaded successfully");
      setUploadedImage(res.data.publicId);
    } catch (error: any) {
      console.log("Error while Image Uploading: ", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests!");
      } else {
        toast.error("Error in File Upload");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const extension = imageRef.current?.src.includes(".png")
          ? "png"
          : "jpg";
        const fileName = "bg_removed_image";
        link.download = `${fileName}.${extension}`;

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        toast.success("Image downloaded successfully");
      })
      .catch(() => {
        toast.error("Failed to download image");
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Change The Background
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Change the background to your favourite one easily with FrameFlow
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload an Image</CardTitle>
          <CardDescription>
            Choose an image to change its background
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Choose an image file</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>

          {isUploading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-4">
                <Spinner className="size-8 text-slate-900 dark:text-slate-100" />
                <p className="text-slate-600 dark:text-slate-400">
                  Uploading image...
                </p>
              </div>
            </div>
          )}

          {uploadedImage && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="bg-color"
                    type="color"
                    value={imageBgColor}
                    onChange={(e) => setImageBgColor(e.target.value)}
                    className="w-20 h-11 p-1 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {imageBgColor.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Preview
                  </h3>
                  {!isTransforming && (
                    <Button
                      onClick={handleDownload}
                      className="mr-2 h-11 w-[100px] cursor-pointer"
                    >
                      <DownloadIcon />
                      Download
                    </Button>
                  )}
                </div>
                <div className="relative flex justify-center bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 rounded-lg z-10">
                      <div className="flex flex-col items-center gap-3">
                        <Spinner className="size-8 text-slate-900 dark:text-slate-100" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Transforming image...
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="max-w-full overflow-auto">
                    <CldImage
                      key={imageBgColor}
                      width={1080}
                      height={1080}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio="1:1"
                      removeBackground
                      background={`rgb:${imageBgColor.replace("#", "")}`}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="rounded-lg shadow-sm m-3"
                    />

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Original
                    </h3>
                    <CldImage
                      width={1080}
                      height={1080}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="original image"
                      crop="fill"
                      aspectRatio="1:1"
                      gravity="auto"
                      onLoad={() => setIsTransforming(false)}
                      className="rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!uploadedImage && !isUploading && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No image uploaded yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
