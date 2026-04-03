import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value || "";
  const refreshToken = req.cookies.get("refreshToken")?.value || "";

  const currentUrl = new URL(req.url);

  const isPublicRoute =
    currentUrl.pathname === "/sign-in" ||
    currentUrl.pathname === "/sign-up" ||
    currentUrl.pathname === "/" ||
    currentUrl.pathname === "/forgot-password" ||
    currentUrl.pathname === "/reset-password";

  const isPublicApiRoute = currentUrl.pathname === "/api/videos";

  const isAuthApiRoute =
    currentUrl.pathname.startsWith("/api/login") ||
    currentUrl.pathname.startsWith("/api/signup") ||
    currentUrl.pathname.startsWith("/api/authcheck") ||
    currentUrl.pathname.startsWith("/api/logout") ||
    currentUrl.pathname.startsWith("/api/forgot-password") ||
    currentUrl.pathname.startsWith("/api/reset-password") ||
    currentUrl.pathname.startsWith("/api/refresh-token");

  const isAccessingDashboard = currentUrl.pathname === "/dashboard";
  const isAccessingHome = currentUrl.pathname === "/";

  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (
    accessToken &&
    (currentUrl.pathname === "/sign-in" || currentUrl.pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // If user has not valid access token
  if (!accessToken) {
    if (!refreshToken) {
      if (!isPublicRoute && !isAuthApiRoute && !isPublicApiRoute) {
        return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
      }
      return NextResponse.next();
    }
    if (!isApiRequest && !isPublicRoute && !isPublicApiRoute && !isAuthApiRoute ) {
      const refreshUrl = new URL("/api/refresh-token", req.nextUrl);
      refreshUrl.searchParams.set("redirect", currentUrl.pathname);

      return NextResponse.redirect(refreshUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
