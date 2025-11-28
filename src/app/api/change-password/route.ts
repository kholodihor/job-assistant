import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { account } from "@/db/schema";
import { hashPassword } from "@/utils/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { oldPassword, newPassword, idUser, updatedAt } = body;
    const formattedUpdatedAt = updatedAt ? new Date(updatedAt) : new Date();
    console.log(formattedUpdatedAt);

    const accounts = await db
      .select()
      .from(account)
      .where(eq(account.userId, idUser));

    const passwordAccount = accounts.find((a) => a.password != null);

    if (!passwordAccount || !passwordAccount.password) {
      return NextResponse.json(
        { error: "User password is missing" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(oldPassword, passwordAccount.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.id, passwordAccount.id));

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
