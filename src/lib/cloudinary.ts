import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export const isDataUri = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("data:");

export async function uploadBase64Image(
  base64Data: string
): Promise<{ url: string; publicId: string }> {
  const fileUri = isDataUri(base64Data)
    ? base64Data
    : `data:image/jpeg;base64,${base64Data}`;

  const result = await cloudinary.uploader.upload(fileUri, {
    invalidate: true,
    resource_type: "image",
    use_filename: true,
    unique_filename: true,
    folder: "cvbaza",
    filename_override: "photo.jpg",
  });

  return { url: result.secure_url, publicId: result.public_id };
}

/** Best-effort delete; a failure here must not block the caller. */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
}
