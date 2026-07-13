"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Turnstile } from "@/components/ui/turnstile";

export default function page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      toast.error("Please complete the Turnstile captcha verification.");
      return;
    }
    setLoading(true);

    try {
      await axios.post("/api/forgot-password", { email, turnstileToken });
      setSubmitted(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex w-full items-center justify-center p-4">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Check your email
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We've sent a password reset link to <span className="font-medium text-slate-900 dark:text-white">{email}</span>.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
              <p>
                Didn't receive the email? Check your spam filter or{" "}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  try another email address
                </button>
                .
              </p>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                asChild 
                className="w-full h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
              >
                <Link href="/sign-in">Return to Sign In</Link>
              </Button>
            </div>
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
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>

            <Turnstile onVerify={setTurnstileToken} />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl text-slate-900 dark:text-slate-100 text-white dark:text-black font-medium shadow-sm transition-all" 
                disabled={loading}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
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
