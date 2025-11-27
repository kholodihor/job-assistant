import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { findUserByEmail } from "@/resources/user-queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, updatedAt } = body;
    const user = await findUserByEmail(email);
    const formattedUpdatedAt = updatedAt ? new Date(updatedAt) : new Date();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db
      .update(users)
      .set({ name, updatedAt: formattedUpdatedAt })
      .where(eq(users.email, email))
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
