import type { Metadata } from "next";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Authentication - FrameFlow",
  description: "Sign in or sign up to FrameFlow",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              FrameFlow<span className="text-blue-500">.</span>
            </h1>
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full flex justify-center">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} FrameFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


