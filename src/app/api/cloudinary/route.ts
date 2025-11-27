import { NextRequest, NextResponse } from "next/server";
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

const uploadBase64Image = async (
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const base64Data = formData.get("base64") as string | null;

    // Input validation
    if (!file && !base64Data) {
      return NextResponse.json(
        { message: "File or base64 data is required" },
        { status: 400 }
      );
    }

    if (file) {
      // File size validation (e.g., 10MB limit)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: "File size exceeds 10MB limit" },
          { status: 400 }
        );
      }

      // File type validation
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: "Invalid file type. Allowed types: JPEG, PNG, WebP" },
          { status: 400 }
        );
      }

      const fileBuffer = await file.arrayBuffer();
      const mimeType = file.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = `data:${mimeType};${encoding},${base64Data}`;

      const res = await uploadToCloudinary(fileUri, file.name);

      if (res.success && res.result) {
        return NextResponse.json({
          message: "success",
          fileUrl: res.result.secure_url,
          publicId: res.result.public_id,
        });
      }
    }

    if (base64Data) {
      try {
        const { url, publicId } = await uploadBase64Image(base64Data);
        return NextResponse.json({
          message: "success",
          fileUrl: url,
          publicId: publicId,
        });
      } catch (error) {
        console.error("Error uploading base64 image:", error);
        return NextResponse.json(
          { message: "Failed to upload base64 image" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
