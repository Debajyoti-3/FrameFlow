"use client";

import React from "react";
import Link from "next/link";
import { ImageIcon, ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              FrameFlow<span className="text-blue-500">.</span>
            </h1>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 py-12 md:py-16 flex justify-center">
        <div className="w-full max-w-3xl space-y-12">
          <div className="space-y-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign Up
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Terms & Privacy<span className="text-blue-500">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Terms of Service */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                1. Terms of Service
              </h2>

              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  1.1 Acceptance of Terms
                </h3>
                <p>
                  By accessing and using FrameFlow ("the Service"), you agree to
                  be bound by these Terms of Service. If you do not agree to
                  these terms, please do not use the Service.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  1.2 User Accounts
                </h3>
                <p>
                  You are responsible for safeguarding the password that you use
                  to access the Service and for any activities or actions under
                  your password. You agree not to disclose your password to any
                  third party.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  1.3 Acceptable Use
                </h3>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Upload or transmit any content that is illegal, harmful, or
                    offensive.
                  </li>
                  <li>
                    Interfere with or disrupt the integrity or performance of
                    the Service.
                  </li>
                  <li>
                    Attempt to gain unauthorized access to the Service or its
                    related systems.
                  </li>
                </ul>
              </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Privacy Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                2. Privacy Policy
              </h2>

              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  2.1 Information We Collect
                </h3>
                <p>
                  We collect information you provide directly to us, such as
                  when you create or modify your account, use our services, or
                  communicate with us. This includes your name, email address,
                  profile picture, and uploaded media.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  2.2 How We Use Information
                </h3>
                <p>
                  We use the information we collect to provide, maintain, and
                  improve our services, as well as to communicate with you about
                  updates, security alerts, and support messages.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  2.3 Third-Party Services
                </h3>
                <p>
                  We utilize third-party services like Cloudinary for media
                  processing and storage. By using our service, you acknowledge
                  that your uploaded content will be processed by these
                  specialized partners in accordance with their respective
                  privacy policies.
                </p>

                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  2.4 Data Security
                </h3>
                <p>
                  We implement reasonable security measures to protect your
                  personal information and media files. However, no method of
                  transmission over the Internet or electronic storage is 100%
                  secure.
                </p>
              </div>
            </section>
          </div>
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
