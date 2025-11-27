"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Locale, useRouter } from "@/i18n/routing";
import { ResetPasswordFormValues, resetPasswordSchema } from "./schema";

interface ResetPasswordFormProps {
  token: string;
  lang: Locale;
}

export function ResetPasswordForm({ token, lang }: ResetPasswordFormProps) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema()),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setError("");
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            (lang === "en"
              ? "Failed to reset password"
              : "Помилка при зміні паролю")
        );
      }

      setSuccess(true);
      // Redirect to login page after successful password reset
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "en"
            ? "Failed to reset password"
            : "Помилка при зміні паролю"
      );
    }
  };

  if (success) {
    return (
      <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center">
        <Card className="w-[90%] max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-xl text-green-600">
              {lang === "en" ? "Success!" : "Успішно!"}
            </CardTitle>
            <CardDescription className="text-center">
              {lang === "en"
                ? "Your password has been successfully reset. Redirecting to login..."
                : "Ваш пароль успішно змінено. Перенаправлення на сторінку входу..."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-[600px] p-4 sm:p-[50px]">
        <CardHeader className="mb-8 p-0">
          <CardTitle className="text-center text-2xl font-semibold">
            {lang === "en" ? "Reset Your Password" : "Відновити пароль"}
          </CardTitle>
          <CardDescription className="text-black text-center text-base sm:text-lg">
            {lang === "en" ? "Create new password" : "Створіть новий пароль"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 sm:px-[70px]">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-small text-red-500">
                {error}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="my-6 flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-normal">
                        {lang === "en" ? "New Password" : "Новий пароль"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={
                              lang === "en"
                                ? "Enter your new password"
                                : "Введіть новий пароль"
                            }
                            {...field}
                            className={`w-full rounded-lg border border-gray-300 bg-gray-50 pr-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${
                              form.formState.errors.password
                                ? "border-red-300 bg-red-50 text-red-500"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage
                        className={`mt-1 pl-1 text-[12px] ${form.formState.errors.password ? "text-red-500" : "text-gray-400"}`}
                      >
                        {!form.formState.errors.password &&
                          (lang === "en"
                            ? "The password must consist of 8 characters and contain numbers and Latin letters"
                            : "Пароль має складатись з 8 символів і містити цифри та латинські літери")}
                      </FormMessage>
                      <FormMessage className="mt-1 pl-1 text-[12px] text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-normal">
                        {lang === "en"
                          ? "Confirm Password"
                          : "Підтвердіть пароль"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={
                              lang === "en"
                                ? "Confirm your new password"
                                : "Підтвердіть новий пароль"
                            }
                            {...field}
                            className={`w-full rounded-lg border border-gray-300 bg-gray-50 pr-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${
                              form.formState.errors.confirmPassword
                                ? "border-red-300 bg-red-50 text-red-500"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="mt-1 pl-1 text-[12px] text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="mt-4 flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full rounded-[40px] bg-blue-500 py-2.5 text-white hover:border-blue-600 hover:bg-blue-600 focus:border-blue-600 focus:bg-blue-600"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? lang === "en"
                        ? "Processing..."
                        : "Обробка..."
                      : lang === "en"
                        ? "Reset Password"
                        : "Змінити пароль"}
                  </Button>
                  <Button
                    onClick={() => router.push("/signin")}
                    className="w-full rounded-[40px] border-[1px] border-blue-300 bg-white py-2.5 text-blue-500 hover:bg-blue-100"
                    disabled={form.formState.isSubmitting}
                    variant="outline"
                  >
                    {lang === "en" ? "Cancel" : "Скасувати"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
