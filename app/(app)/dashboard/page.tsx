"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/videoCard";
import { Video } from "@/types"; // types of the video
import { Spinner } from "@/components/ui/spinner";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function Dashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditUsed, setCreditUsed] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [videosRes, profileRes] = await Promise.all([
        axios.get("/api/videos"),
        axios.get("/api/profile")
      ]);

      if (Array.isArray(videosRes.data)) {
        setVideos(videosRes.data);
      } else {
        throw new Error("Unexpected response format");
      }

      if (profileRes.data?.user) {
        setCredits(profileRes.data.user.credits ?? 5);
        setCreditUsed(profileRes.data.user.creditUsed ?? 0);
      }
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests!");
      }
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    );
  }

  const totalCredits = credits !== null ? credits : 5;
  const used = creditUsed !== null ? creditUsed : 0;
  const remaining = Math.max(0, totalCredits - used);
  const usagePercent = totalCredits > 0 ? (used / totalCredits) * 100 : 0;
  const isHighUsage = usagePercent >= 80;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Videos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and download your compressed videos
          </p>
        </div>

        {/* Credits Indicator */}
        <div className="w-full md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Credits Usage
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 mt-0.5">
                <div>Total: <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCredits}</span></div>
                <div>Used: <span className="font-semibold text-slate-800 dark:text-slate-200">{used}</span></div>
                <div>Remaining: <span className="font-semibold text-slate-800 dark:text-slate-200">{remaining}</span></div>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "text-lg font-bold tracking-tight",
                isHighUsage ? "text-red-500 dark:text-red-400" : "text-emerald-500 dark:text-emerald-400"
              )}>
                {usagePercent.toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">used</span>
            </div>
          </div>

          {/* Progress Bar (Line Diagram) */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                isHighUsage 
                  ? "bg-red-500 dark:bg-red-600" 
                  : "bg-emerald-500 dark:bg-emerald-600"
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          
          {isHighUsage && (
            <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 font-medium leading-tight animate-pulse">
              ⚠️ Warning: You have used {usagePercent.toFixed(0)}% of your credits.
            </p>
          )}
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
