import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { interviews } from "@/db/schema";
import {
  getSessionUser,
  handleRouteError,
  notFound,
  unauthorized,
} from "@/lib/api";
import { updateInterviewSchema } from "../schema";

type Params = { params: Promise<{ id: string }> };

const ownedBy = (id: string, userId: string) =>
  and(eq(interviews.id, id), eq(interviews.createdBy, userId));

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const interview = await db.query.interviews.findFirst({
      where: ownedBy(id, user.id),
    });
    if (!interview) return notFound("Interview not found");

    return NextResponse.json(interview);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch interview");
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const { questions } = updateInterviewSchema.parse(await req.json());

    const [interview] = await db
      .update(interviews)
      .set({ questions })
      .where(ownedBy(id, user.id))
      .returning();
    if (!interview) return notFound("Interview not found");

    return NextResponse.json(interview);
  } catch (error) {
    return handleRouteError(error, "Failed to update interview");
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const deleted = await db
      .delete(interviews)
      .where(ownedBy(id, user.id))
      .returning({ id: interviews.id });
    if (!deleted.length) return notFound("Interview not found");

    return NextResponse.json({ message: "Interview deleted successfully" });
  } catch (error) {
    return handleRouteError(error, "Failed to delete interview");
  }
}
