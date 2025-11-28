import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { auth } from "@/lib/auth";

const updateTitleSchema = z.object({
  title: z.string().min(1).max(255),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate request body
    const validatedData = updateTitleSchema.parse(body);

    // First check if the letter exists and belongs to the user
    const letter = await db.query.letters.findFirst({
      where: and(eq(letters.id, id), eq(letters.userId, session.user.id)),
      columns: { id: true },
    });

    if (!letter) {
      return NextResponse.json(
        { message: "The letter is not found" },
        { status: 404 }
      );
    }

    // Update using raw SQL to avoid any timestamp issues
    await db.execute(
      sql`UPDATE letters SET title = ${validatedData.title} WHERE id = ${id}`
    );

    // Return only the new title
    return NextResponse.json({ title: validatedData.title });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid title", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating the title of the letter:", error);
    return NextResponse.json(
      { message: "Failed to update the title of the letter", error },
      { status: 500 }
    );
  }
}
