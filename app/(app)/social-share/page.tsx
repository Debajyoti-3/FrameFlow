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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { UploadIcon, DownloadIcon, ImageIcon } from "lucide-react";


const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Instagram Reel (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Instagram Landscape (191:100)": {
    width: 1080,
    height: 566,
    aspectRatio: "191:100",
  },

  "TikTok (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "YouTube Shorts (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Twitter Card (191:100)": {
    width: 1200,
    height: 628,
    aspectRatio: "191:100",
  },

  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Facebook Post (191:100)": {
    width: 1200,
    height: 628,
    aspectRatio: "191:100",
  },
  "Facebook Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  "LinkedIn Post (191:100)": {
    width: 1200,
    height: 627,
    aspectRatio: "191:100",
  },
  "LinkedIn Cover (1192:220)": {
    width: 1192,
    height: 220,
    aspectRatio: "1192:220",
  },
  "LinkedIn Article (191:100)": {
    width: 1200,
    height: 627,
    aspectRatio: "191:100",
  },

  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
  "Pinterest Pin Square (1:1)": {
    width: 1000,
    height: 1000,
    aspectRatio: "1:1",
  },

  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "YouTube Channel Art (2560:1440)": {
    width: 2560,
    height: 1440,
    aspectRatio: "2560:1440",
  },

  "Snapchat Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  "Discord Banner (16:5)": { width: 960, height: 300, aspectRatio: "16:5" },

  "Reddit Banner (10:3)": { width: 1920, height: 576, aspectRatio: "10:3" },

  "Standard HD (16:9)": { width: 1920, height: 1080, aspectRatio: "16:9" },
  "Portrait HD (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Square HD (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
};

type SocialFormat = keyof typeof socialFormats;

const FILE_MAX_SIZE = 10 * 1024 * 1024;

export default function page() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage, selectedFormat]);

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
        formdata
      );

      if (!res.data) {
        throw new Error("Error in Image Upload");
      }
      toast.success("File uploaded successfully");
      setUploadedImage(res.data.publicId);
    } catch (error) {
      console.log("Error while Image Uploading: ", error);
      toast.error("Error in File Upload");
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
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.${extension}`;

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
          Social Media Image Creator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Transform your images for different social media platforms
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload an Image</CardTitle>
          <CardDescription>
            Choose an image file to transform for social media
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
                <Label htmlFor="format-select">
                  Select Social Media Format
                </Label>
                <Select
                  value={selectedFormat}
                  onValueChange={(value) =>
                    setSelectedFormat(value as SocialFormat)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.keys(socialFormats).map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Preview
                  </h3>
                  <Button onClick={handleDownload}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
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
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="transformed image"
                      crop="fill"
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
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
