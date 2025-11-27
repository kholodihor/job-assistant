import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { workExperiences } from "@/db/schema";
import { auth } from "@/lib/auth";

const workExperienceSchema = z.object({
  position: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  location: z.string().max(255),
  startDate: z.string().max(255),
  endDate: z.string().max(255),
  description: z.string().optional(),
  resumeId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to add work experience" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = workExperienceSchema.parse(body);

    const [newWorkExperience] = await db
      .insert(workExperiences)
      .values(validatedData)
      .returning();

    return NextResponse.json(newWorkExperience, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating work experience:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
