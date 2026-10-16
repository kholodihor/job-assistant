import { z } from "zod";

export const authFormSchema = (isRegister = false) =>
  z.object({
    email: z.string().email("validation.emailRequired"),
    password: z
      .string()
      .min(8, "validation.passwordMinLength")
      .regex(/[0-9]/, "validation.passwordNumber")
      .regex(/[a-zA-Z]/, "validation.passwordLatin"),
    name: z.string().optional(),
    rememberMe: z.boolean().default(false),
    termsAccepted: isRegister
      ? z.boolean().refine((val) => val === true, {
          message: "validation.termsAccepted",
        })
      : z.boolean().optional(),
  });

// `t` is a translator scoped to the "Auth.forgotPassword" namespace.
export const forgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("invalidEmail")),
  });

export const resetPasswordSchema = () =>
  z
    .object({
      password: z
        .string()
        .min(8, "validation.passwordMinLength")
        .regex(/[0-9]/, "validation.passwordNumber")
        .regex(/[a-zA-Z]/, "validation.passwordLatin"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "validation.passwordsMatch",
      path: ["confirmPassword"],
    });

export type AuthFormValues = z.infer<ReturnType<typeof authFormSchema>>;

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
