import { NextResponse } from "next/server";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { auth } from "@/lib/auth";

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

// Shadows better-auth's own /api/auth/reset-password to keep the form's
// `{ token, password }` contract; the token is verified by better-auth.
export async function POST(req: Request) {
  const parsed = resetSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid reset link" }, { status: 400 });
  }

  try {
    await auth.api.resetPassword({
      body: { token: parsed.data.token, newPassword: parsed.data.password },
    });
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        { error: "Reset link is invalid or has expired" },
        { status: 400 }
      );
    }
    console.error("Error resetting password:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
