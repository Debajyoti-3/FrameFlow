"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      // TODO: use Toast notifications
      alert("Max File Size Exceeded");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);    
    formData.append("originalSize", file.size.toString());

    try {
      const res = await axios.post("/api/video-upload", formData);
      if(!res.data){
        toast.error("Error in File upload")
        throw new Error("Error in file upload")
      }
      toast.success("File successfully uploaded")
    } catch (error) {
      console.log(error);
      toast.error("Error while file upload")
    } finally {
      setIsUploading(false);
    }
  };
  return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Upload Video</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
                required
                
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary bg-blue-700 p-1.5 rounded-2xl cursor-default"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      );
}

export default page;
