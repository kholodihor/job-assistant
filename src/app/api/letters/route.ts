import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { getSessionUser, handleRouteError, unauthorized } from "@/lib/api";
import { letterSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const data = letterSchema.parse(body.data);

    const [letter] = await db
      .insert(letters)
      .values({ ...data, userId: user.id })
      .returning();

    return NextResponse.json(letter);
  } catch (error) {
    return handleRouteError(error, "Failed to create the letter");
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const userLetters = await db.query.letters.findMany({
      where: eq(letters.userId, user.id),
      orderBy: desc(letters.updatedAt),
    });
    return NextResponse.json(userLetters);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch letters");
  }
}
