import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { interviewFormSchema } from "@/components/profile/interview/forms/schema";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { getSessionUser, handleRouteError, unauthorized } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const data = interviewFormSchema.parse(body.data);

    const [interview] = await db
      .insert(interviews)
      .values({
        jobPosition: data.position,
        jobDescription: data.description,
        jobExperience: data.yearsOfExperience,
        techStack: data.techStack || [],
        createdBy: user.id,
      })
      .returning();

    return NextResponse.json(interview);
  } catch (error) {
    return handleRouteError(error, "Failed to create interview");
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const userInterviews = await db.query.interviews.findMany({
      where: eq(interviews.createdBy, user.id),
      orderBy: desc(interviews.createdAt),
    });
    return NextResponse.json(userInterviews);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch interviews");
  }
}
