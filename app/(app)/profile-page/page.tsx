"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Trash2,
  User,
  Mail,
  AlertTriangle,
  Coins,
  CreditCard,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getProfileImageUrl } from "@/lib/profileImage";

interface Transaction {
  id: string;
  razorpayOrderId: string;
  paymentId: string | null;
  amount: number;
  currency: string;
  credits: number;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("john.doe@example.com");
  const [name, setName] = useState<string>("John Doe");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [creditUsed, setCreditUsed] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
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
      } catch (error: any) {
        console.log("Error in Account Deletion: ", error);
        if (error.response?.status === 429) {
          toast.error("Too many requests!");
        } else {
          toast.error("Failed to delete account");
        }
      } finally {
        setIsDeleting(false);
      }
    } else {
      toast.error("Please type 'Delete my account' exactly to confirm.");
    }
  };

  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      const res = await axios.post("/api/profile-update", formData);
      if (res.data.publicId) {
        setProfilePic(res.data.publicId);
        toast.success("Profile image uploaded successfully");
      }
    } catch (error: any) {
      console.log("Image upload failed", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests!");
      } else {
        toast.error("Failed to upload profile image");
      }
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
        setCredits(res.data.user?.credits ?? 5);
        setCreditUsed(res.data.user?.creditUsed ?? 0);
        setTransactions(res.data.user?.transactions || []);

        console.log("profile email: ", email);
        if (res.data.user?.profilePic) {
          setProfilePic(res.data.user.profilePic);
        }
      } catch (error: any) {
        console.log("Failed to fetch profile: ", error);
        if (error.response?.status === 429) {
          toast.error("Too many requests!");
        } else {
          toast.error("Failed to fetch profile");
        }
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

  const usagePercent = credits > 0 ? (creditUsed / credits) * 100 : 0;
  const isHighUsage = usagePercent >= 80;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Profile Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Manage your account information, credit transactions, and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="h-fit border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Personal Information
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
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
                      src={getProfileImageUrl(profilePic, {
                        width: 300,
                        height: 300,
                      })}
                      alt="Profile"
                    />
                  ) : (
                    <AvatarImage src="/avatar.png" alt="Default Avatar" />
                  )}
                  <AvatarFallback className="text-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {name?.[0]?.toUpperCase() ||
                      email?.[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Hover overlay with camera icon */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
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
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                    Full Name
                  </Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <span className="text-slate-900 dark:text-slate-100 font-medium">
                      {name || "Not set"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                    Email Address
                  </Label>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <span className="text-slate-900 dark:text-slate-100 font-medium truncate">
                      {email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits Balance Card */}
        <Card className="h-fit border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Credits Balance
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-850 dark:bg-slate-800 dark:text-slate-200 font-semibold border border-slate-200/50 dark:border-slate-700/50"
              >
                Active
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Monitor and purchase credits to continue processing media
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                    Available Credits
                  </span>
                  <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-baseline gap-1">
                    {Math.max(0, credits - creditUsed)}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      / {credits} remaining
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                  <CreditCard className="w-5 h-5 text-indigo-650 dark:text-indigo-400" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span>Usage: {usagePercent.toFixed(0)}%</span>
                  <span>{creditUsed} used</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out",
                      isHighUsage
                        ? "bg-red-500 dark:bg-red-650"
                        : "bg-emerald-500 dark:bg-emerald-600",
                    )}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full py-6 font-bold text-sm tracking-wide rounded-xl cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-md shadow-indigo-500/10 dark:shadow-indigo-950/30 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              onClick={() => router.push("/subscription")}
            >
              Buy Credits
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader
            className={cn(
              "pb-4 flex flex-row items-center justify-between space-y-0 gap-4",
              isHistoryExpanded &&
                transactions.length > 0 &&
                "border-b border-slate-100 dark:border-slate-800/80",
            )}
          >
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <CreditCard className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                Transaction History
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Review your previous credit purchases and payments
              </CardDescription>
            </div>
            {transactions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="flex items-center gap-1.5 border-slate-200 text-slate-900 dark:text-slate-100 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-semibold shrink-0"
              >
                {isHistoryExpanded ? (
                  <>
                    Hide <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show ({transactions.length}){" "}
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </CardHeader>

          {!isHistoryExpanded || transactions.length === 0 ? (
            transactions.length === 0 && (
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-full mb-3 border border-slate-100 dark:border-slate-800/60">
                    <Coins className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    No transactions yet
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                    When you purchase credits, your transaction history will
                    appear here.
                  </p>
                </div>
              </CardContent>
            )
          ) : (
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-950/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-lg hidden sm:flex items-center justify-center">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-base">
                            {tx.credits} Credits Purchased
                          </span>
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                              tx.status === "captured" ||
                                tx.status === "success"
                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30"
                                : tx.status === "pending"
                                  ? "bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-450 border border-amber-100 dark:border-amber-900/30"
                                  : "bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-450 border border-red-100 dark:border-red-900/30",
                            )}
                          >
                            {tx.status === "captured" ? "Success" : tx.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
                          <span>
                            ID:{" "}
                            <code className="font-mono text-[11px] bg-slate-550 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                              {tx.paymentId || tx.razorpayOrderId}
                            </code>
                          </span>
                          <span className="hidden sm:inline text-slate-200 dark:border-slate-800">
                            •
                          </span>
                          <span>
                            {new Date(tx.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800/80">
                      {/* Mobile Only Label */}
                      <span className="sm:hidden text-xs text-slate-500 uppercase font-semibold tracking-wider">
                        Amount Paid
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          ₹
                          {(tx.amount / 100).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 block uppercase font-bold tracking-wider">
                          INR
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Account Deletion */}
        <Card className="border-red-100 dark:border-red-900/20 shadow-sm md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <CardTitle className="text-lg font-semibold">
                Danger Zone
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Deleting your account will permanently remove all your data,
                including uploaded images and preferences. This action cannot be
                undone.
              </p>

              {!showDeletePrompt ? (
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto font-semibold"
                  onClick={() => setShowDeletePrompt(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-red-800 dark:text-red-300">
                      Type{" "}
                      <span className="font-bold">"Delete my account"</span> to
                      confirm
                    </Label>
                    <Input
                      type="text"
                      className="bg-white dark:bg-slate-950 border-red-200 dark:border-red-900/50 focus-visible:ring-red-500"
                      placeholder="Delete my account"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="destructive"
                      className={`flex-1 font-semibold ${
                        confirmationText !== "Delete my account"
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={handleDeleteAccount}
                      disabled={
                        confirmationText !== "Delete my account" || isDeleting
                      }
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
                      className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
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
