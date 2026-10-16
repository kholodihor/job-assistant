import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { letters } from "@/db/schema";
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

    const updated = await db
      .update(letters)
      .set({ title })
      .where(and(eq(letters.id, id), eq(letters.userId, user.id)))
      .returning({ title: letters.title });
    if (!updated.length) return notFound("Letter not found");

    return NextResponse.json({ title });
  } catch (error) {
    return handleRouteError(error, "Failed to update the title of the letter");
  }
}
