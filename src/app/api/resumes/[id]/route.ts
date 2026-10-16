import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { educations, resumes, workExperiences } from "@/db/schema";
import {
  getSessionUser,
  handleRouteError,
  notFound,
  unauthorized,
} from "@/lib/api";
import { deleteImage } from "@/lib/cloudinary";
import { resolvePhoto } from "../photo";
import { resumeSchema } from "../schema";

type Params = { params: Promise<{ id: string }> };

const ownedBy = (id: string, userId: string) =>
  and(eq(resumes.id, id), eq(resumes.userId, userId));

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const resume = await db.query.resumes.findFirst({
      where: ownedBy(id, user.id),
      with: { educations: true, workExperiences: true },
    });
    if (!resume) return notFound("Resume not found");

    return NextResponse.json(resume);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch resume");
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const existing = await db.query.resumes.findFirst({
      where: ownedBy(id, user.id),
      columns: { photo: true, publicId: true },
    });
    if (!existing) return notFound("Resume not found");

    const body = await req.json();
    const data = resumeSchema.parse(body.data);
    const photo = await resolvePhoto(data.photo, existing);

    const updatedResume = await db.transaction(async (tx) => {
      await tx.delete(educations).where(eq(educations.resumeId, id));
      await tx.delete(workExperiences).where(eq(workExperiences.resumeId, id));

      const [resume] = await tx
        .update(resumes)
        .set({ ...data, ...photo, updatedAt: new Date() })
        .where(ownedBy(id, user.id))
        .returning();

      if (data.educations?.length) {
        await tx
          .insert(educations)
          .values(data.educations.map((edu) => ({ ...edu, resumeId: id })));
      }
      if (data.workExperiences?.length) {
        await tx
          .insert(workExperiences)
          .values(
            data.workExperiences.map((exp) => ({ ...exp, resumeId: id }))
          );
      }
      return resume;
    });

    return NextResponse.json(updatedResume);
  } catch (error) {
    return handleRouteError(error, "Failed to update resume");
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const resume = await db.query.resumes.findFirst({
      where: ownedBy(id, user.id),
      columns: { publicId: true },
    });
    if (!resume) return notFound("Resume not found");

    await db.transaction(async (tx) => {
      await tx.delete(educations).where(eq(educations.resumeId, id));
      await tx.delete(workExperiences).where(eq(workExperiences.resumeId, id));
      await tx.delete(resumes).where(ownedBy(id, user.id));
    });

    if (resume.publicId) await deleteImage(resume.publicId);

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    return handleRouteError(error, "Failed to delete resume");
  }
}
