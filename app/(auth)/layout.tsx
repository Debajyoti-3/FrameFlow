import type { Metadata } from "next";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">FrameFlow</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white/80 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} FrameFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

