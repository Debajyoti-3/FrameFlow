import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface AuthCheckResponse {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export async function CheckAuth(): Promise<AuthCheckResponse | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as jwt.JwtPayload;
      
      if (!decoded || !decoded.id) {
        return null;
      }

      return {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name // if you put name in the token payload
      };

    } catch (err) {
      console.error("Token verification failed:", err);
      return null;
    }
  } catch (error) {
    console.error("Error in checkAuth:", error instanceof Error ? error.message : error);
    return null;
  }
}