"use server";

import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { interviewFormSchema } from "@/components/profile/interview/forms/schema";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
          createdBy: session.user.id,
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
    const session = await auth.api.getSession({
      // no request object here, rely on global headers
      headers: new Headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get all interviews for the user
    const userInterviews = await db
      .select()
      .from(interviews)
      .where(eq(interviews.createdBy, session.user.id))
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
