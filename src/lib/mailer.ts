import nodemailer from "nodemailer";
import { env } from "@/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  service: env.SMTP_SERVICE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  debug: env.SMTP_DEBUG,
});

export function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

  return transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Reset your password",
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}
