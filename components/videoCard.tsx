"use client";

import React, { useCallback, useState, useEffect } from "react";
import dayjs from "dayjs";
// @ts-ignore - dayjs plugin types
import relativeTime from "dayjs/plugin/relativeTime.js";
import { filesize } from "filesize";
import { FileDown, FileUp, Download, Clock } from "lucide-react";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

// @ts-ignore - dayjs extend method
dayjs.extend(relativeTime);

import { Video } from "@/types";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [videoClicked, setVideoClicked] = useState(false);
  const [ClickedPublicId, setClickedPublicId] = useState<string | null>(null)

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  }, []);

  const handleVideoClick = (publicId: string) => {
    setVideoClicked(true);
    setClickedPublicId(publicId)
  };
  const handleCloseVideo = () => {
    setVideoClicked(false);
    setClickedPublicId(null);
  };

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const formatRelativeTime = useCallback((date: Date | string) => {
    return (dayjs(date) as any).fromNow() as string;
  }, []);

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="aspect-video relative bg-slate-100 overflow-hidden cursor-pointer"
        onClick={()=>handleVideoClick(video.publicId)}
      >
        {videoClicked && ClickedPublicId ? (
          <div onClick={(e) => e.stopPropagation()}>
            <CldVideoPlayer 
              width="1920" 
              height="1080" 
              src={ClickedPublicId}
            />
          </div>
        ) : isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <p className="text-sm text-slate-500">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-slate-900 flex items-center gap-1 shadow-sm">
          <Clock size={14} />
          {formatDuration(video.duration)}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        <p className="text-xs text-slate-500 mb-4">
          Uploaded {formatRelativeTime(video.createdAt)}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
            <FileUp size={16} className="text-slate-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-500">Original</div>
              <div className="text-sm font-semibold text-slate-900">
                {formatSize(Number(video.originalSize))}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
            <FileDown size={16} className="text-slate-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-500">
                Compressed
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatSize(Number(video.compressedSize))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <div className="text-sm">
            <span className="text-slate-600">Compression: </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {compressionPercentage}%
            </span>
          </div>
          <Button
            size="sm"
            onClick={() =>
              onDownload(getFullVideoUrl(video.publicId), video.title)
            }
            className="cursor-pointer"
          >
            <Download size={16} className="mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
