import { signIn } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/resources/user-queries";
import { hashPassword } from "@/utils/password";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User with this email already exists",
          code: "USER_ALREADY_EXISTS",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      email,
      password: hashedPassword,
      name: name || null,
    });

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      return NextResponse.json(
        {
          error: "Failed to sign in after registration",
          code: "SIGN_IN_AFTER_REGISTER_FAILED",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors[0].message,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error during registration",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
