"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageIcon, VideoIcon, Share2Icon } from "lucide-react";

function page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-slate-900 rounded-2xl">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight">
            Welcome to FrameFlow
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
            Transform your media with powerful video and image tools of FrameFlow
             
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => router.push("/social-share")}
            className="text-base px-8 py-6"
          >
            <Share2Icon className="mr-2 h-5 w-5" />
            Start Here
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="text-base px-8 py-6"
          >
            <VideoIcon className="mr-2 h-5 w-5" />
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page;
