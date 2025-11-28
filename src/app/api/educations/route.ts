import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { educations } from "@/db/schema";
import { requireAuth } from "@/utils/auth-guard";

const educationSchema = z.object({
  degree: z.string().min(1).max(255),
  school: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().max(255),
  endDate: z.string().max(255),
  resumeId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = educationSchema.parse(body);

    const [newEducation] = await db
      .insert(educations)
      .values(validatedData)
      .returning();

    return NextResponse.json(newEducation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating education:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
