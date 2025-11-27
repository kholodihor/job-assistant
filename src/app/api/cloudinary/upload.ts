import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { cloudinary } from "@/lib/cloudinary";

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        folder: `cvbaza`,
        filename_override: fileName,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export const uploadBase64Image = async (
  base64Data: string
): Promise<{ url: string; publicId: string }> => {
  // Convert base64 to proper format if it's not already
  const formattedBase64 = base64Data.includes("data:")
    ? base64Data
    : `data:image/jpeg;base64,${base64Data}`;

  try {
    const res = await uploadToCloudinary(formattedBase64, "photo.jpg");
    if (res.success && res.result) {
      return {
        url: res.result.secure_url,
        publicId: res.result.public_id,
      };
    }
    throw new Error("Failed to upload image");
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
