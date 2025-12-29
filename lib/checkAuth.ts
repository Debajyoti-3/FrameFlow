import axios from "axios";

export interface AuthCheckResponse {
  id: string;
  email: string;
  name?: string;
}

export async function CheckAuth(): Promise<AuthCheckResponse | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/authcheck`
    );

    if (response.data && response.data.id) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error in checkAuth:", error instanceof Error ? error.message : error);
    return null;
  }
}