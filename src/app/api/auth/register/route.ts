import { NextResponse } from "next/server";

// Registration is now handled via Better Auth on the client (authClient.signUp.email).
// This route is kept only to avoid 404s and always returns a clear message.

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Registration via this endpoint is disabled. Please use the main sign up form.",
    },
    { status: 410 }
  );
}
