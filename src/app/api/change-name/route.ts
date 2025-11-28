import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { findUserByEmail } from "@/resources/user-queries";
import { requireAuth } from "@/utils/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const { session } = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, updatedAt } = body;
    const existingUser = await findUserByEmail(email);
    const formattedUpdatedAt = updatedAt ? new Date(updatedAt) : new Date();

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db
      .update(userTable)
      .set({ name, updatedAt: formattedUpdatedAt })
      .where(eq(userTable.email, email))
      .returning();

    return NextResponse.json({ message: "Name was updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Failed to update the name",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
