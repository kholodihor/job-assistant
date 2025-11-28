import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { requireAuth } from "@/utils/auth-guard";

// Schema for updating interview title if needed in the future
const updateInterviewSchema = z.object({
  jobPosition: z.string().min(1),
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if interview exists and belongs to user
    const interview = await db
      .select()
      .from(interviews)
      .where(
        and(eq(interviews.id, id), eq(interviews.createdBy, session.userId))
      )
      .then((res) => res[0]);

    if (!interview) {
      return NextResponse.json(
        {
          message:
            "Interview not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    // Delete interview
    await db
      .delete(interviews)
      .where(
        and(eq(interviews.id, id), eq(interviews.createdBy, session.userId))
      );

    return NextResponse.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { message: "Failed to delete interview", error },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    // Get interview
    const interview = await db
      .select()
      .from(interviews)
      .where(
        and(eq(interviews.id, id), eq(interviews.createdBy, session.userId))
      )
      .then((res) => res[0]);

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { message: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate request body
    const validatedData = updateInterviewSchema.parse(body);

    // Check if interview exists and belongs to user
    const interview = await db
      .select()
      .from(interviews)
      .where(
        and(eq(interviews.id, id), eq(interviews.createdBy, session.userId))
      )
      .then((res) => res[0]);

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    // Update interview
    const [updatedInterview] = await db
      .update(interviews)
      .set({ jobPosition: validatedData.jobPosition })
      .where(
        and(eq(interviews.id, id), eq(interviews.createdBy, session.userId))
      )
      .returning();

    return NextResponse.json(updatedInterview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating interview:", error);
    return NextResponse.json(
      { message: "Failed to update interview" },
      { status: 500 }
    );
  }
}
