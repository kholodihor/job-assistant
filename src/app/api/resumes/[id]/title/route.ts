import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/lib/auth";

const updateTitleSchema = z.object({
  title: z.string().min(1).max(255),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate request body
    const validatedData = updateTitleSchema.parse(body);

    // First check if resume exists and belongs to user
    const resume = await db.query.resumes.findFirst({
      where: and(eq(resumes.id, id), eq(resumes.userId, session.user.id)),
      columns: { id: true },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    // Update using raw SQL to avoid any timestamp issues
    await db.execute(
      sql`UPDATE resumes SET title = ${validatedData.title} WHERE id = ${id}`
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

    console.error("Error updating resume title:", error);
    return NextResponse.json(
      { message: "Failed to update resume title", error },
      { status: 500 }
    );
  }
}
