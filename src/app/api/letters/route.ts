import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { requireAuth } from "@/utils/auth-guard";
import { letterSchema } from "./schema";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json(
        { message: "Invalid letter data" },
        { status: 400 }
      );
    }

    try {
      const validatedData = letterSchema.parse(data);

      // Insert the letter
      const [letter] = await db
        .insert(letters)
        .values({
          ...validatedData,
          userId: session.userId,
        })
        .returning();

      // Return complete letter data
      return NextResponse.json({ ...letter });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            message: "Invalid letter data",
            errors: (error as z.ZodError).errors,
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating the letter:", error);
    return NextResponse.json(
      { message: "Failed to create the letter", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First get all letters
    const userLetters = await db
      .select()
      .from(letters)
      .where(eq(letters.userId, session.userId))
      .orderBy(desc(letters.updatedAt));

    return NextResponse.json(userLetters);
  } catch (error) {
    console.error("Error fetching letters:", error);
    return NextResponse.json(
      { message: "Failed to fetch letters" },
      { status: 500 }
    );
  }
}
