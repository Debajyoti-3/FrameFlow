import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthCheckResponse {
  id: string;
  email: string;
  name?: string;
}

export async function CheckAuth(): Promise<AuthCheckResponse | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      return null;
    }

    // try access token first
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET_KEY!
        ) as jwt.JwtPayload;

        if (!decoded?.id) return null;

        return {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
        };
      } catch {
        
      }
    }

    // try refresh token
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET_KEY!
        ) as jwt.JwtPayload;

        if (!decoded?.id) return null;

        
        return {
          id: decoded.id,
          email: decoded.email ?? "",
          name: decoded.name,
        };
      } catch {
        return null; // refresh token also invalid
      }
    }

    return null;
  } catch (error) {
    console.error("Error in checkAuth:", error instanceof Error ? error.message : error);
    return null;
  }
}