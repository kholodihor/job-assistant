import { deleteImage, isDataUri, uploadBase64Image } from "@/lib/cloudinary";

type PhotoFields = { photo: string | null; publicId: string | null };

/**
 * Resolves the photo columns for a resume write. New data URIs are uploaded
 * to Cloudinary; a replaced or removed photo is deleted from it. `publicId`
 * is always derived on the server, never taken from the client.
 */
export async function resolvePhoto(
  photo: string | null | undefined,
  existing?: PhotoFields
): Promise<PhotoFields> {
  if (isDataUri(photo)) {
    const { url, publicId } = await uploadBase64Image(photo);
    if (existing?.publicId) await deleteImage(existing.publicId);
    return { photo: url, publicId };
  }

  if (!photo) {
    if (existing?.publicId) await deleteImage(existing.publicId);
    return { photo: null, publicId: null };
  }

  // Unchanged photo URL: keep what is stored.
  return existing?.photo === photo
    ? existing
    : { photo, publicId: existing?.publicId ?? null };
}
