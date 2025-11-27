import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageId } = body;

    // Input validation
    if (!imageId) {
      return NextResponse.json(
        { message: "Image ID is required" },
        { status: 400 }
      );
    }

    // Validate imageId format (should start with 'cvbaza/')
    if (!imageId.startsWith("cvbaza/")) {
      return NextResponse.json(
        { message: "Invalid image ID format" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(imageId);

    if (result.result === "ok") {
      return NextResponse.json(
        { message: "Image successfully deleted", imageId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to delete image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
