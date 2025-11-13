import { clerkMiddleware } from "@clerk/nextjs/server";
import { createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up", 
  "/", 
  "/home"
]);
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);



export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();  // await is important here
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/dashboard";
  const isAccessingHome =  currentUrl.pathname === '/';
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (userId && isPublicRoute(req) && !isAccessingDashboard && !isAccessingHome) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!userId) {
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
