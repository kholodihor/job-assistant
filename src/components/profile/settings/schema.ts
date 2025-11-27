import { z } from "zod";
import { Locale } from "@/i18n/routing";

export const changeNameSchema = (lang: Locale) =>
  z.object({
    name: z.string().min(2, {
      message:
        lang === "en"
          ? "Name should be at least 2 symbols"
          : "Ім'я повинно мати не менше двох символів",
    }),
    email: z
      .string()
      .email(
        lang === "en"
          ? "Please enter a valid email address"
          : "Будь ласка, введіть дійсну електронну адресу"
      ),
  });

export const changePasswordSchema = (lang: Locale) =>
  z
    .object({
      oldPassword: z.string().min(8, {
        message:
          lang === "en"
            ? "Password must be at least 8 characters"
            : "Пароль повинен містити щонайменше 8 символів",
      }),
      newPassword: z.string().min(8, {
        message:
          lang === "en"
            ? "Password must be at least 8 characters"
            : "Пароль повинен містити щонайменше 8 символів",
      }),
      repeatNewPassword: z.string().min(8, {
        message:
          lang === "en"
            ? "Password must be at least 8 characters"
            : "Пароль повинен містити щонайменше 8 символів",
      }),
    })
    .refine((data) => data.newPassword === data.repeatNewPassword, {
      message:
        lang === "en" ? "Passwords must match" : "Паролі повинні співпадати",
      path: ["repeatNewPassword"],
    });

export type ChangeNameValues = z.infer<ReturnType<typeof changeNameSchema>>;
export type ChangePasswordValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
