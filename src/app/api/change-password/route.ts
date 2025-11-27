import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/utils/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { oldPassword, newPassword, idUser, updatedAt } = body;
    const formattedUpdatedAt = updatedAt ? new Date(updatedAt) : new Date();

    const user = await db.select().from(users).where(eq(users.id, idUser));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPassword = user[0].password;
    if (!userPassword) {
      return NextResponse.json(
        { error: "User password is missing" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, userPassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: formattedUpdatedAt })
      .where(eq(users.id, idUser));

    return NextResponse.json({
      message: "Password has been changed successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Failed to update the password",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
