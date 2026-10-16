import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { getSessionUser, handleRouteError, unauthorized } from "@/lib/api";

const changeNameSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const { name } = changeNameSchema.parse(await req.json());

    await db
      .update(userTable)
      .set({ name, updatedAt: new Date() })
      .where(eq(userTable.id, user.id));

    return NextResponse.json({ message: "Name was updated successfully" });
  } catch (error) {
    return handleRouteError(error, "Failed to update the name");
  }
}
