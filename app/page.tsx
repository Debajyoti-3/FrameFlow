"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ImageIcon, 
  VideoIcon, 
  Share2Icon, 
  Sparkles, 
  Eraser, 
  Wand2, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Coins,
  User
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import axios from "axios";

const featuresList = [
  {
    icon: VideoIcon,
    title: "Video Compressor",
    description: "Compress video files up to 80% without losing noticeable quality. Adjust resolution, formats, and bitrates instantly."
  },
  {
    icon: ImageIcon,
    title: "AI Background Remover",
    description: "Remove background from your photos automatically in a single click using high-precision semantic segmentation."
  },
  {
    icon: Eraser,
    title: "AI Background Changer",
    description: "Instantly swap backgrounds with professional solid colors, modern office backdrops, or custom environment images."
  },
  {
    icon: Sparkles,
    title: "Smart Image Enhancer",
    description: "Upscale, denoise, and sharpen low-quality or blurry pictures. Turn old memory snapshots into high-definition assets."
  },
  {
    icon: Share2Icon,
    title: "Social Share Optimizer",
    description: "Reformat and crop videos or images to perfectly fit Instagram, YouTube, TikTok, LinkedIn, and Facebook specs."
  },
  {
    icon: Coins,
    title: "Flexible Credit System",
    description: "Only pay for what you process. Get free starter credits on sign-up, with affordable top-up packages as you scale."
  }
];

function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/profile");
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log("Not logged in");
      } finally {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, []);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-105 flex flex-col justify-between">
      {/* Background Ripple & Blur Glows */}
      <div className="absolute top-0 left-0 w-full h-[80vh] z-0 pointer-events-none overflow-hidden">
        <BackgroundRippleEffect rows={15} cols={70} />
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                FrameFlow<span className="text-indigo-500">.</span>
              </h1>
            </Link>

            {/* Middle nav links - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <a href="#features" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Features</a>
              <Link href="/subscription" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <Link href="/dashboard" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
            </nav>

            <div className="flex items-center gap-4">
              <ModeToggle />
              {!checkingAuth && (
                user ? (
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-semibold shadow-sm transition-all rounded-full px-4"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Link href="/sign-in" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hidden sm:block">
                      Sign In
                    </Link>
                    <Button
                      onClick={() => router.push("/sign-up")}
                      className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-semibold shadow-sm transition-all rounded-full px-4"
                    >
                      Get Started
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="px-4 py-20 sm:py-28 text-center max-w-5xl mx-auto space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase border border-indigo-500/20">
              AI-Powered Media Processing Suite
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-[1.1]">
              Enhance, Compress & Crop Your Media Instantly
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Transform raw images and video files in seconds. Leverage our advanced AI suite to scale, remove backgrounds, and share automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Button
              size="lg"
              onClick={() => router.push(user ? "/dashboard" : "/sign-up")}
              className="text-base px-8 py-6 rounded-2xl cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/15 dark:shadow-indigo-900/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              Start Processing Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/subscription")}
              className="text-base px-8 py-6 rounded-2xl cursor-pointer border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900 bg-white/50 dark:bg-slate-900/50"
            >
              View Pricing Plans
            </Button>
          </div>

          
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Equipped with Next-Gen Media Tools
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Process video assets and image files in a unified workspace. Clean, fast, and completely powered by artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {featuresList.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300/80 dark:hover:border-slate-700/80"
                >
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4 transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-slate-100/40 dark:bg-slate-950/20 py-16 border-t border-b border-slate-200 dark:border-slate-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">80%</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Average Video Compression</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:border-r border-slate-200 dark:border-slate-800 py-6 sm:py-0">
              <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">Instant</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">AI Background Removal</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">4K Upscaling</div>
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Smart Resolution Enhancer</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-30 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Info */}
            <div className="space-y-4 text-left">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  FrameFlow<span className="text-indigo-500">.</span>
                </span>
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Transform your media workflows with AI-driven compression, resolution upscaling, social exports, and background removal tools.
              </p>
            </div>

            {/* Column 2: Tools Links */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs uppercase font-bold text-slate-900 dark:text-white tracking-wider">Media Tools</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><Link href="/video-upload" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Video Compressor</Link></li>
                <li><Link href="/remove-bg" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Background Remover</Link></li>
                <li><Link href="/bg-change" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Background Changer</Link></li>
                <li><Link href="/smart-enhance" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Smart Enhancer</Link></li>
                <li><Link href="/social-share" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Social Share Crop</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform Links */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs uppercase font-bold text-slate-900 dark:text-white tracking-wider">Platform</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><Link href="/dashboard" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">My Dashboard</Link></li>
                <li><Link href="/subscription" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Pricing Packages</Link></li>
                <li><Link href="/profile-page" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Profile Settings</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Get Support</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact/Legal */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs uppercase font-bold text-slate-900 dark:text-white tracking-wider">Contact & Trust</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Secure SSL payments
                </li>
                <li>Support Email: <a href="mailto:support@frameflow.app" className="hover:text-indigo-500 transition-colors">support@frameflow.app</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <span>© {new Date().getFullYear()} FrameFlow. All rights reserved. Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-current" />
              <span>for media creators.</span>
            </div>
            
            <div className="flex gap-4">
              <a href="/legal" className="hover:underline">Privacy Policy</a>
              <a href="/legal" className="hover:underline">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

