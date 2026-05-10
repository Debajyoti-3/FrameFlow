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
import { UploadIcon, DownloadIcon, ImageIcon, TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FILE_MAX_SIZE = 10 * 1024 * 1024;

export default function SmartEnhancePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const [enhance, setEnhance] = useState(false);
  const [improve, setImprove] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blur, setBlur] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [bgBlur, setBgBlur] = useState(0);
  const [portraitMode, setPortraitMode] = useState(false);
  const [temperature, setTemperature] = useState(0);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [uploadedImage, enhance, improve, brightness, contrast, blur, saturation, sharpness, bgBlur, portraitMode, temperature]);

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
      const res = await axios.post<{ publicId: string; tags: string[] }>(
        "/api/smart-upload",
        formdata,
      );

      if (!res.data) {
        throw new Error("Error in Image Upload");
      }
      toast.success("File uploaded and analyzed successfully!");
      setUploadedImage(res.data.publicId);
      setTags(res.data.tags || []);
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
        const extension = imageRef.current?.src.includes(".png") ? "png" : "jpg";
        const fileName = "smart_enhanced_image";
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

  // transformation key to force CldImage to update when props change
  const transformKey = `${enhance}-${improve}-${brightness}-${contrast}-${blur}-${saturation}-${sharpness}-${bgBlur}-${portraitMode}-${temperature}`;

  const activeEffects: any[] = [];
  if (saturation !== 0) activeEffects.push({ saturation });
  if (sharpness !== 0) activeEffects.push({ sharpen: sharpness });
  if (bgBlur !== 0) activeEffects.push({ blurRegion: bgBlur });

  if (portraitMode) {
    activeEffects.push({ blurRegion: 1000 });
  }

  if (temperature > 0) {
    activeEffects.push({ tint: `${Math.floor(temperature)}:orange` });
  } else if (temperature < 0) {
    activeEffects.push({ tint: `${Math.abs(Math.floor(temperature))}:blue` });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          Smart Enhance
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Upload an image to get smart suggestions and apply AI-powered enhancements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: UPLOAD & CONTROLS */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Image Source</CardTitle>
              <CardDescription>Upload an image for analysis</CardDescription>
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
                <div className="flex items-center justify-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="flex flex-col items-center gap-4">
                    <Spinner className="size-8 text-slate-900 dark:text-slate-100" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Analyzing \u0026 Uploading...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {uploadedImage && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5" /> Smart Tags / Suggestions
                  </CardTitle>
                  <CardDescription>AI-generated tags for this image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                      tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No specific tags detected.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhancements</CardTitle>
                  <CardDescription>Fine-tune the upgraded version</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {/* Toggles */}
                  <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enhance-toggle" className="flex items-center gap-2 cursor-pointer font-medium">
                        Auto Enhance
                      </Label>
                      <input
                        id="enhance-toggle"
                        type="checkbox"
                        checked={enhance}
                        onChange={(e) => setEnhance(e.target.checked)}
                        className="w-5 h-5 accent-indigo-600 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      * Transformations may vary from image to image.
                    </p>
                  </div>

                  <div className="space-y-1 pb-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="improve-toggle" className="flex items-center gap-2 cursor-pointer font-medium">
                        Auto Improve Colors
                      </Label>
                      <input
                        id="improve-toggle"
                        type="checkbox"
                        checked={improve}
                        onChange={(e) => setImprove(e.target.checked)}
                        className="w-5 h-5 accent-indigo-600 cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      * Tip: Upload a portrait image for maximum output quality.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Brightness</Label>
                        <span className="text-sm text-slate-500">{brightness}</span>
                      </div>
                      <input
                        type="range"
                        min="-99"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Contrast</Label>
                        <span className="text-sm text-slate-500">{contrast}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Saturation</Label>
                        <span className="text-sm text-slate-500">{saturation}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Temperature (Cold/Warm)</Label>
                        <span className="text-sm text-slate-500">{temperature > 0 ? `+${temperature}` : temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-blue-400 via-slate-200 to-orange-400 dark:via-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Sharpness</Label>
                        <span className="text-sm text-slate-500">{sharpness}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={sharpness}
                        onChange={(e) => setSharpness(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Image Blur</Label>
                        <span className="text-sm text-slate-500">{bgBlur}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="100"
                        value={bgBlur}
                        onChange={(e) => setBgBlur(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-600"
                      />
                    </div>


                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      setEnhance(false);
                      setImprove(false);
                      setPortraitMode(false);
                      setBrightness(0);
                      setContrast(0);
                      setSaturation(0);
                      setTemperature(0);
                      setSharpness(0);
                      setBgBlur(0);
                      setBlur(0);
                    }}
                  >
                    Reset Adjustments
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Preview</CardTitle>
                <CardDescription>View your enhanced image</CardDescription>
              </div>
              {uploadedImage && !isTransforming && (
                <Button onClick={handleDownload} className="h-10 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 m-6 mt-0 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              {!uploadedImage && !isUploading && (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <ImageIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                    No image uploaded yet
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Upload an image from the sidebar to begin
                  </p>
                </div>
              )}

              {uploadedImage && (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-10">
                      <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                        <Spinner className="size-8 text-indigo-600" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Applying Enhancements...
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="w-full max-w-[800px] flex justify-center">
                    <CldImage
                      key={transformKey} // forces re-render
                      width={1200}
                      height={1200}
                      src={uploadedImage}
                      sizes="(max-width: 768px) 100vw, 800px"
                      alt="Enhanced Image"
                      preserveTransformations
                      enhance={enhance}
                      improve={improve}
                      brightness={brightness !== 0 ? brightness.toString() : undefined}
                      contrast={contrast !== 0 ? contrast.toString() : undefined}
                      blur={blur !== 0 ? blur.toString() : undefined}
                      effects={activeEffects.length > 0 ? activeEffects : undefined}
                      ref={imageRef}
                      onLoad={() => setIsTransforming(false)}
                      className="rounded-lg shadow-md object-contain max-h-[70vh] w-auto transition-opacity duration-300"
                      style={{ opacity: isTransforming ? 0.5 : 1 }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
