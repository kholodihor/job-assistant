import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/utils/password";

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = resetSchema.parse(body);

    // Normalize and decode the token
    const normalizedToken = token.replace(/-/g, "+").replace(/_/g, "/");
    const paddedToken = normalizedToken.padEnd(
      normalizedToken.length + ((4 - (normalizedToken.length % 4)) % 4),
      "="
    );

    // Parse the JSON token data
    let tokenData;
    try {
      tokenData = JSON.parse(Buffer.from(paddedToken, "base64").toString());
      console.log("Decoded token data:", tokenData);
    } catch (error) {
      console.error("Failed to parse token:", error);
      return NextResponse.json(
        { error: "Invalid reset link" },
        { status: 400 }
      );
    }

    if (!tokenData?.userId || !tokenData?.timestamp) {
      console.error("Missing required token data");
      return NextResponse.json(
        { error: "Invalid reset link" },
        { status: 400 }
      );
    }

    const userId = tokenData.userId;
    const tokenTime = Number(tokenData.timestamp);

    if (isNaN(tokenTime)) {
      console.error("Invalid timestamp in token");
      return NextResponse.json(
        { error: "Invalid reset link" },
        { status: 400 }
      );
    }

    console.log("Token time:", tokenTime);
    console.log("Current time:", Date.now());
    console.log("Difference:", Date.now() - tokenTime);

    // Check if token is expired (1 hour)
    if (Date.now() - tokenTime > ONE_HOUR) {
      return NextResponse.json(
        { error: "Reset link has expired" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    try {
      // Update password using Drizzle
      const result = await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning({ id: users.id });

      if (result.length === 0) {
        console.error("User not found:", userId);
        return NextResponse.json(
          { error: "Invalid reset link" },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
