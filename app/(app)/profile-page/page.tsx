"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2, User, Mail, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmationText === "Delete my account") {
      setIsDeleting(true);
      try {
        await axios.get("/api/delete-account");
        toast.success("Account Deleted Successfully");
        router.push("/sign-in");
      } catch (error) {
        console.log("Error in Account Deletion: ", error);
        toast.error("Failed to delete account");
      } finally {
        setIsDeleting(false);
      }
    } else {
      toast.error("Please type 'Delete my account' exactly to confirm.");
    }
  };

  

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be within 10 MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Using the correct endpoint, fixing typo from "image-upaload" to "image-upload"
      const res = await axios.post("/api/profile-update", formData);
      if (res.data.publicId) {
        setProfilePic(res.data.publicId);
        toast.success("Profile image uploaded successfully");
      }
    } catch (error) {
      console.log("Image upload failed", error);
      toast.error("Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        
        setEmail(res.data.user?.email || "");
        setName(res.data.user?.name || "");
        
        console.log("profile email: ", email); 
        if (res.data.user?.profilePic) {
          setProfilePic(res.data.user.profilePic);
        }

        console.log("profile pic: ", profilePic);
        
      } catch (error) {
        console.log("Failed to fetch profile: ", error);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profilePic]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="w-8 h-8 text-slate-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Profile Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and contact info
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div 
                onClick={handleAvatarClick} 
                className="relative cursor-pointer group rounded-full"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Avatar className="w-24 h-24 border-2 border-slate-100 dark:border-slate-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                  {profilePic ? (
                    <AvatarImage 
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_face,w_300,h_300,r_max/${profilePic}`} 
                      alt="Profile" 
                    />
                  ) : (
                    <AvatarImage src="/avatar.png" alt="Default Avatar" />
                  )}
                  <AvatarFallback className="text-2xl bg-slate-100 dark:bg-slate-800">
                    {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Hover overlay with camera icon */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                    <circle cx="12" cy="13" r="3"/>
                  </svg>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-10">
                    <Spinner className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4 w-full">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                    Full Name
                  </Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-100 font-medium">
                      {name || "Not set"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                    Email Address
                  </Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-100 font-medium truncate">
                      {email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card className="border-red-100 dark:border-red-900/20 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <CardTitle className="text-lg">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Deleting your account will permanently remove all your data, including uploaded images and preferences. This action cannot be undone.
              </p>

              {!showDeletePrompt ? (
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setShowDeletePrompt(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-red-800 dark:text-red-300">
                      Type <span className="font-bold">"Delete my account"</span> to confirm
                    </Label>
                    <Input
                      type="text"
                      className="bg-white dark:bg-slate-900 border-red-200 dark:border-red-900/50 focus-visible:ring-red-500"
                      placeholder="Delete my account"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="destructive"
                      className={`flex-1 ${
                        confirmationText !== "Delete my account"
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={handleDeleteAccount}
                      disabled={confirmationText !== "Delete my account" || isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Spinner className="w-4 h-4 mr-2" />
                          Deleting...
                        </>
                      ) : (
                        "Confirm Deletion"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      onClick={() => {
                        setShowDeletePrompt(false);
                        setConfirmationText("");
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
