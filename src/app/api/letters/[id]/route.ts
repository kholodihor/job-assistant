import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the letter
    const letter = await db.query.letters.findFirst({
      where: and(eq(letters.id, id), eq(letters.userId, session.user.id)),
    });

    if (!letter) {
      return NextResponse.json(
        { message: "The letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(letter);
  } catch (error) {
    console.error("Error fetching the letter:", error);
    return NextResponse.json(
      { message: "Failed to fetch the letter" },
      { status: 500 }
    );
  }
}

const letterDataSchema = z.object({
  data: z.object({
    name: z.string(),
    profession: z.string(),
    position: z.string(),
    company: z.string(),
    text: z.string(),
    title: z.string(),
    template: z.string(),
    nameRecipient: z.string(),
    positionRecipient: z.string(),
    publicId: z.string().optional(),
  }),
});

export async function PUT(
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
    const { data } = letterDataSchema.parse(body);

    // Check if letter exists and belongs to user
    const existingLetter = await db.query.letters.findFirst({
      where: and(eq(letters.id, id), eq(letters.userId, session.user.id)),
    });

    if (!existingLetter) {
      return NextResponse.json(
        { message: "Letter not found" },
        { status: 404 }
      );
    }

    // Update letter
    await db
      .update(letters)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(letters.id, id));

    return NextResponse.json({ message: "Letter updated successfully" });
  } catch (error) {
    console.error("Error updating letter:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid letter data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update letter" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the letter to check ownership and get photo URL
    const letter = await db.query.letters.findFirst({
      where: and(eq(letters.id, id), eq(letters.userId, session.user.id)),
    });

    if (!letter) {
      return NextResponse.json(
        { message: "The letter not found" },
        { status: 404 }
      );
    }

    // Delete a letter and related a data
    await db.transaction(async (tx) => {
      // Delete a letter
      await tx.delete(letters).where(eq(letters.id, id));
    });

    return NextResponse.json({ message: "The letter deleted successfully" });
  } catch (error) {
    console.error("Error deleting the letter:", error);
    return NextResponse.json(
      { message: "Failed to delete the letter" },
      { status: 500 }
    );
  }
}
