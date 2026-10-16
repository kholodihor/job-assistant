import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { handleRouteError } from "@/lib/api";
import { auth } from "@/lib/auth";

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = changePasswordSchema.parse(
      await req.json()
    );

    // Acts on the session user only; better-auth verifies the old password.
    await auth.api.changePassword({
      headers: await headers(),
      body: { currentPassword: oldPassword, newPassword },
    });

    return NextResponse.json({
      message: "Password has been changed successfully",
    });
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { message: error.body?.message ?? "Failed to update the password" },
        { status: error.statusCode }
      );
    }
    return handleRouteError(error, "Failed to update the password");
  }
}
