export async function verifyTurnstileToken(token: string | undefined, remoteIp?: string | null): Promise<boolean> {
  const secretKey = process.env.TRUNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("TRUNSTILE_SECRET_KEY is not defined in environment variables.");
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: remoteIp || undefined,
      }),
    });

    if (!response.ok) {
      console.error(`Turnstile verification failed with status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error("Error verifying Turnstile token:", error);
    return false;
  }
}
