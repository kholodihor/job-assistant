import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { educations, resumes, workExperiences } from "@/db/schema";
import { auth } from "@/lib/auth";
import { uploadBase64Image } from "../cloudinary/upload";
import { resumeSchema } from "./schema";

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
        { message: "Invalid resume data" },
        { status: 400 }
      );
    }

    try {
      const validatedData = resumeSchema.parse(data);

      // Handle photo upload if it's a base64 string
      if (
        validatedData.photo &&
        typeof validatedData.photo === "string" &&
        validatedData.photo.startsWith("data:")
      ) {
        const { url, publicId } = await uploadBase64Image(validatedData.photo);
        validatedData.photo = url;
        validatedData.publicId = publicId;
      }

      // Insert resume
      const [resume] = await db
        .insert(resumes)
        .values({
          ...validatedData,
          userId: session.user.id,
        })
        .returning();

      // Insert educations
      if (validatedData.educations && validatedData.educations.length > 0) {
        await db.insert(educations).values(
          validatedData.educations.map((edu) => ({
            ...edu,
            resumeId: resume.id,
          }))
        );
      }

      // Insert work experiences
      if (
        validatedData.workExperiences &&
        validatedData.workExperiences.length > 0
      ) {
        await db.insert(workExperiences).values(
          validatedData.workExperiences.map((exp) => ({
            ...exp,
            resumeId: resume.id,
          }))
        );
      }

      // Fetch complete resume data with relations
      const [resumeEducations, resumeWorkExperiences] = await Promise.all([
        db.select().from(educations).where(eq(educations.resumeId, resume.id)),
        db
          .select()
          .from(workExperiences)
          .where(eq(workExperiences.resumeId, resume.id)),
      ]);

      // Return complete resume data
      return NextResponse.json({
        ...resume,
        educations: resumeEducations,
        workExperiences: resumeWorkExperiences,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            message: "Invalid resume data",
            errors: (error as z.ZodError).errors,
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { message: "Failed to create resume", error },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // First get all resumes
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, session.user.id))
      .orderBy(desc(resumes.updatedAt));

    // Then get related data for each resume
    const resumesWithData = await Promise.all(
      userResumes.map(async (resume) => {
        const [resumeEducations, resumeWorkExperiences] = await Promise.all([
          db
            .select()
            .from(educations)
            .where(eq(educations.resumeId, resume.id)),
          db
            .select()
            .from(workExperiences)
            .where(eq(workExperiences.resumeId, resume.id)),
        ]);

        return {
          ...resume,
          educations: resumeEducations,
          workExperiences: resumeWorkExperiences,
        };
      })
    );

    return NextResponse.json(resumesWithData);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { message: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
