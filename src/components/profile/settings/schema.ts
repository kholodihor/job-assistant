import { z } from "zod";

// `t` is a translator scoped to the "Settings.validation" namespace.
export const changeNameSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, {
      message: t("nameMin"),
    }),
    email: z.string().email(t("invalidEmail")),
  });

export const changePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      oldPassword: z.string().min(8, {
        message: t("passwordMinLength"),
      }),
      newPassword: z.string().min(8, {
        message: t("passwordMinLength"),
      }),
      repeatNewPassword: z.string().min(8, {
        message: t("passwordMinLength"),
      }),
    })
    .refine((data) => data.newPassword === data.repeatNewPassword, {
      message: t("passwordsMatch"),
      path: ["repeatNewPassword"],
    });

export type ChangeNameValues = z.infer<ReturnType<typeof changeNameSchema>>;
export type ChangePasswordValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
