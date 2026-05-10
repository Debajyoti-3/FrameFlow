"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/videoCard";
import { Video } from "@/types"; // types of the video
import { Spinner } from "@/components/ui/spinner";
import { VideoIcon } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error(" Unexpected response format");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 429) {
        toast.error("Too many requests!");
      }
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback(async (url: string, title: string) => {
   try {
    // Fetch the file data without leaving the page
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to download file");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${title}.mp4`; // or use the correct extension if you know it

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the temporary URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed", err);
    // optionally show a toast / error message
  }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-12 text-slate-900 dark:text-slate-100"/>
          <p className="text-slate-600 dark:text-slate-400">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Videos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and download your compressed videos
          </p>
        </div>
      </div>
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
            <VideoIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No videos available
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
            Upload your first video to get started with compression
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
