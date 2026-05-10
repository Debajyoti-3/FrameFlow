"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { ModeToggle } from "@/components/theme-toggle";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  XIcon,
  Eraser,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
  { href: "/remove-bg", icon: Eraser, label: "BG-Remove" },
  { href: "/bg-change", icon: Eraser, label: "BG-Change" },
  { href: "/smart-enhance", icon: Wand2, label: "Smart Enhance" },
];


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{name?: string, email?: string, profilePic?: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/profile");
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
          router.push("/sign-in");
        }
      } catch (error: any) {
        console.error("Auth check failed", error);
        if (error.response?.status === 429) {
          toast.error("Too many requests!");
        }
        setUser(null);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    try {
      await axios.get("/api/logout");
      setUser(null);
      toast.success("Logout successful");
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Logout failed", error);
      if (error.response?.status === 429) {
        toast.error("Too many requests!");
      } else {
        toast.error("Logout failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <ImageIcon className="w-8 h-8 text-slate-900 dark:text-slate-100" />
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                FrameFlow
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {user && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>

            <div className="flex-1 lg:hidden" />

            <div className="flex items-center gap-4">
              {user && (
                <>
                  <Link href="/profile-page">
                    <div className="hidden sm:flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.profilePic ? (
                          <AvatarImage 
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_face,w_100,h_100,r_max/${user.profilePic}`} 
                            alt="Profile" 
                          />
                        ) : (
                          <AvatarImage src="/avatar.png" alt="Profile" />
                        )}
                        <AvatarFallback>
                          {user.name?.[0]?.toUpperCase() ||
                            user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                        {user.name || user.email}
                      </span>
                    </div>
                  </Link>
                  <Link href="/profile-page">
                    <div className="sm:hidden">
                      <Avatar className="h-8 w-8">
                        {user.profilePic ? (
                          <AvatarImage 
                            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_face,w_100,h_100,r_max/${user.profilePic}`} 
                            alt="Profile" 
                          />
                        ) : (
                          <AvatarImage src="/avatar.png" alt="Profile" />
                        )}
                        <AvatarFallback>
                          {user.name?.[0]?.toUpperCase() ||
                            user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="hidden sm:flex cursor-pointer"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            <div className="cursor-pointer mx-3">
              <ModeToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
