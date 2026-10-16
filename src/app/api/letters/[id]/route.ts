import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { letters } from "@/db/schema";
import {
  getSessionUser,
  handleRouteError,
  notFound,
  unauthorized,
} from "@/lib/api";
import { letterSchema } from "../schema";

type Params = { params: Promise<{ id: string }> };

const ownedBy = (id: string, userId: string) =>
  and(eq(letters.id, id), eq(letters.userId, userId));

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const letter = await db.query.letters.findFirst({
      where: ownedBy(id, user.id),
    });
    if (!letter) return notFound("Letter not found");

    return NextResponse.json(letter);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch the letter");
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const body = await req.json();
    const data = letterSchema.partial().parse(body.data);

    const updated = await db
      .update(letters)
      .set({ ...data, updatedAt: new Date() })
      .where(ownedBy(id, user.id))
      .returning({ id: letters.id });
    if (!updated.length) return notFound("Letter not found");

    return NextResponse.json({ message: "Letter updated successfully" });
  } catch (error) {
    return handleRouteError(error, "Failed to update letter");
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    const { id } = await params;

    const deleted = await db
      .delete(letters)
      .where(ownedBy(id, user.id))
      .returning({ id: letters.id });
    if (!deleted.length) return notFound("Letter not found");

    return NextResponse.json({ message: "The letter deleted successfully" });
  } catch (error) {
    return handleRouteError(error, "Failed to delete the letter");
  }
}
