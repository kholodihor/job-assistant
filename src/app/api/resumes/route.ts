import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { educations, resumes, workExperiences } from "@/db/schema";
import { getSessionUser, handleRouteError, unauthorized } from "@/lib/api";
import { resolvePhoto } from "./photo";
import { resumeSchema } from "./schema";

const withRelations = { educations: true, workExperiences: true } as const;

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const data = resumeSchema.parse(body.data);
    const photo = await resolvePhoto(data.photo);

    const resumeId = await db.transaction(async (tx) => {
      const [resume] = await tx
        .insert(resumes)
        .values({ ...data, ...photo, userId: user.id })
        .returning({ id: resumes.id });

      if (data.educations?.length) {
        await tx
          .insert(educations)
          .values(
            data.educations.map((edu) => ({ ...edu, resumeId: resume.id }))
          );
      }
      if (data.workExperiences?.length) {
        await tx.insert(workExperiences).values(
          data.workExperiences.map((exp) => ({
            ...exp,
            resumeId: resume.id,
          }))
        );
      }
      return resume.id;
    });

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.id, resumeId),
      with: withRelations,
    });
    return NextResponse.json(resume);
  } catch (error) {
    return handleRouteError(error, "Failed to create resume");
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const userResumes = await db.query.resumes.findMany({
      where: eq(resumes.userId, user.id),
      orderBy: desc(resumes.updatedAt),
      with: withRelations,
    });
    return NextResponse.json(userResumes);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch resumes");
  }
}
