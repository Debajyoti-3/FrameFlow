"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters and a number");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/reset-password", {
        token,
        newPassword: password,
      });

      setSuccess(true);
      toast.success("Password reset successful. You can now log in.");
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex w-full items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Invalid or Expired Link
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The password reset link is invalid or has expired.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              asChild 
              className="w-full h-11 rounded-xl  text-white font-medium shadow-sm transition-all"
            >
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex w-full items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Password Reset Complete
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your password has been successfully updated.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              asChild 
              className="w-full h-11 rounded-xl bg-[#849aef] hover:bg-[#6e85e5] text-white font-medium shadow-sm transition-all"
            >
              <Link href="/sign-in">Continue to Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center gap-1 mb-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              FrameFlow<span className="text-blue-500">.</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose a new strong password
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Confirm new password"
                required
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl dark:text-black text-white font-medium shadow-sm transition-all" 
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            <Link 
              href="/sign-in" 
              className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
