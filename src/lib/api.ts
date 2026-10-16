import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

/** Returns the signed-in user, or null (never redirects). */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/** Like `getSessionUser`, but throws when nobody is signed in (server actions). */
export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export const unauthorized = () =>
  NextResponse.json({ message: "Unauthorized" }, { status: 401 });

export const notFound = (message = "Not found") =>
  NextResponse.json({ message }, { status: 404 });

/** Maps zod errors to 400 and everything else to a generic 500. */
export function handleRouteError(error: unknown, message: string) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { message: "Invalid request data", errors: error.errors },
      { status: 400 }
    );
  }
  console.error(message, error);
  return NextResponse.json({ message }, { status: 500 });
}
