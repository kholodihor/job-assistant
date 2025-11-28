import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";
import { z } from "zod";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { env } from "@/env";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  service: env.SMTP_SERVICE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  debug: env.SMTP_DEBUG,
});

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = requestSchema.parse(body);

    // Find user by email
    const [user] = await db
      .select()
      .from(userTable) // Use the userTable in the forgot-password query
      .where(eq(userTable.email, email));

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    }

    // Generate reset token with JSON structure
    const tokenData = {
      userId: user.id,
      timestamp: Date.now(),
    };
    console.log("Token data:", tokenData);

    // Convert to JSON and encode as URL-safe base64
    const token = Buffer.from(JSON.stringify(tokenData))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    console.log("Final token:", token);

    // Send reset email
    const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    try {
      const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: "Reset your password",
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        message:
          "If an account exists with that email, a password reset link has been sent.",
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { error: "Failed to send reset email", details: emailError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
