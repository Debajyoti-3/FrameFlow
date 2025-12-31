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

  const isAuthApiRoute =
    currentUrl.pathname.startsWith("/api/login") ||
    currentUrl.pathname.startsWith("/api/signup") ||
    currentUrl.pathname.startsWith("/api/authcheck") ||
    currentUrl.pathname.startsWith("/api/logout");

  const isAccessingDashboard = currentUrl.pathname === "/dashboard";
  const isAccessingHome = currentUrl.pathname === "/";

  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (
    token &&
    (currentUrl.pathname === "/sign-in" || currentUrl.pathname === "/sign-up")
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // If user is not loggedin
  if (!token) {
    if (!isPublicRoute && !isPublicApiRoute && !isAuthApiRoute) {
      if (isApiRequest) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
