const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function getProfileImageUrl(
  profilePic: string | null | undefined,
  options?: { width?: number; height?: number }
): string {
  if (!profilePic) return "/avatar.png";

  // Google / any external URL
  if (profilePic.startsWith("http://") || profilePic.startsWith("https://")) {
    return profilePic;
  }

  // Cloudinary public_id (manual upload)
  const w = options?.width ?? 100;
  const h = options?.height ?? 100;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,g_face,w_${w},h_${h},r_max/${profilePic}`;
}