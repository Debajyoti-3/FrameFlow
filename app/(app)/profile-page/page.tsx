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
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        
        setEmail(res.data.user?.email || "");
        setName(res.data.user?.name || "");
      } catch (error) {
        console.log("Failed to fetch profile: ", error);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
              <Avatar className="w-24 h-24 border-2 border-slate-100 dark:border-slate-800">
                <AvatarImage src="/avatar.png" alt="Profile" />
                <AvatarFallback className="text-2xl bg-slate-100 dark:bg-slate-800">
                  {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
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
