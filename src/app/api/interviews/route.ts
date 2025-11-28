"use server";

import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { interviewFormSchema } from "@/components/profile/interview/forms/schema";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { requireAuth } from "@/utils/auth-guard";

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
        { message: "Invalid interview data" },
        { status: 400 }
      );
    }

    try {
      const validatedData = interviewFormSchema.parse(data);

      // Insert interview
      const [interview] = await db
        .insert(interviews)
        .values({
          jobPosition: validatedData.position,
          jobDescription: validatedData.description,
          jobExperience: validatedData.yearsOfExperience,
          techStack: validatedData.techStack || [],
          createdBy: session.userId,
        })
        .returning();

      return NextResponse.json(interview);
    } catch (error) {
      console.error("Validation error:", error);
      return NextResponse.json(
        { message: "Invalid interview data", error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { message: "Failed to create interview", error },
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

    // Get all interviews for the user
    const userInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.createdBy, session.userId))
      .orderBy(desc(interviews.createdAt));

    return NextResponse.json(userInterviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}
