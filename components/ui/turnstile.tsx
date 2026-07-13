"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface TurnstileProps {
  onVerify: (token: string | null) => void;
  theme?: "light" | "dark" | "auto";
}

export function Turnstile({ onVerify, theme = "auto" }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TRUNSTILE_SITE_KEY;

  // Use a ref for onVerify to avoid recreating the Turnstile widget on parent state changes
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!siteKey) {
      console.warn("Cloudflare Turnstile site key is missing.");
      return;
    }

    const renderWidget = () => {
      const turnstile = (window as any).turnstile;
      if (turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerifyRef.current(token);
            },
            "error-callback": () => {
              onVerifyRef.current(null);
            },
            "expired-callback": () => {
              onVerifyRef.current(null);
              if (widgetIdRef.current) {
                turnstile.reset(widgetIdRef.current);
              }
            },
            theme: theme,
          });
          widgetIdRef.current = id;
        } catch (error) {
          console.error("Error rendering Turnstile widget:", error);
        }
      }
    };

    if (scriptLoaded || (typeof window !== "undefined" && (window as any).turnstile)) {
      renderWidget();
    }

    return () => {
      const turnstile = (window as any).turnstile;
      if (widgetIdRef.current && turnstile) {
        try {
          turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch (error) {
          console.error("Error removing Turnstile widget:", error);
        }
      }
    };
  }, [scriptLoaded, siteKey, theme]);

  if (!siteKey) {
    return (
      <div className="text-xs text-red-500 text-center my-2">
        Turnstile configuration error: Site key is missing
      </div>
    );
  }

  return (
    <div className="flex justify-center my-2 min-h-[65px]">
      <div ref={containerRef} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
    </div>
  );
}
