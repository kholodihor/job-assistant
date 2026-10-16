import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { resumes } from "@/db/schema";
import {
  getSessionUser,
  handleRouteError,
  notFound,
  unauthorized,
} from "@/lib/api";

const updateTitleSchema = z.object({
  title: z.string().min(1).max(255),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const { title } = updateTitleSchema.parse(await req.json());

    // Title edits deliberately leave updatedAt untouched.
    const updated = await db
      .update(resumes)
      .set({ title })
      .where(and(eq(resumes.id, id), eq(resumes.userId, user.id)))
      .returning({ title: resumes.title });
    if (!updated.length) return notFound("Resume not found");

    return NextResponse.json({ title });
  } catch (error) {
    return handleRouteError(error, "Failed to update resume title");
  }
}
