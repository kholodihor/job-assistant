import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

const requestSchema = z.object({
  email: z.string().email(),
});

const GENERIC_MESSAGE =
  "If an account exists with that email, a password reset link has been sent.";

export async function POST(req: Request) {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // better-auth stores a random, single-use token and calls
    // `sendResetPassword`; unknown emails get the same response.
    await auth.api.requestPasswordReset({
      body: { email: parsed.data.email },
    });
    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
