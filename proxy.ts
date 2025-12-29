import { NextResponse, NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  const currentUrl = new URL(req.url);

  const isPublicRoute =
    currentUrl.pathname === "/sign-in" ||
    currentUrl.pathname === "/sign-up" ||
    currentUrl.pathname === "/" ||
    currentUrl.pathname === "/home";
  
    const isPublicApiRoute = currentUrl.pathname === "/api/videos";

  const isAccessingDashboard = currentUrl.pathname === "/dashboard";

  const isAccessingHome = currentUrl.pathname === "/";

  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (token && isPublicRoute && !isAccessingDashboard && !isAccessingHome) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!token) {
    if (!isPublicRoute && !isPublicApiRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }
    if (isApiRequest && !isPublicApiRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
