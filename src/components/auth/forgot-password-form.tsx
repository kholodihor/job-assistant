"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ForgotPasswordFormValues, forgotPasswordSchema } from "./schema";

interface ForgotPasswordFormProps {
  lang: Locale;
}

export function ForgotPasswordForm({ lang }: ForgotPasswordFormProps) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(lang)),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || lang === "en"
            ? "Failed to process request"
            : "Помилка при обробці запиту"
        );
      }

      setSuccess(true);
      // Redirect to login page after successful submission
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "en"
            ? "Failed to process request"
            : "Помилка при обробці запиту"
      );
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
        <Card className="w-full max-w-[600px] p-4 sm:p-8 md:p-[50px]">
          <CardHeader className="mb-6 p-0 sm:mb-8">
            <CardTitle className="text-center text-xl font-semibold sm:text-2xl">
              {lang === "en"
                ? "Check Your Email"
                : "Перевірте свою електронну пошту"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 px-4 text-center sm:px-8 md:px-[70px]">
            <p>
              {lang === "en"
                ? "If an account exists for this email, you will receive password reset instructions."
                : "Якщо обліковий запис існує для цієї електронної адреси, ви отримаєте інструкції щодо скидання пароля."}
            </p>
            <p className="mt-4 text-blue-500">
              {lang === "en"
                ? "Redirecting to login page..."
                : "Перенаправлення на сторінку входу..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-[600px] p-4 sm:p-8 md:p-[50px]">
        <CardHeader className="mb-6 p-0 sm:mb-8">
          <CardTitle className="text-center text-xl font-semibold sm:text-2xl">
            {lang === "en" ? "Forgot Password?" : "Забули пароль?"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 px-4 sm:px-8 md:px-[70px]">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <p className="mb-4 text-center text-sm sm:mb-6 sm:text-base">
            {lang === "en"
              ? "Please provide your email address to verify your identity."
              : "Вкажіть  Вашу електронну адресу, щоб підтвердити  Вашу особу."}
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="my-6 flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-normal sm:text-xl">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Email"
                        {...field}
                        className={`hover:border-blue-500 focus:border-blue-500 focus:outline-blue-500 ${
                          form.formState.errors.email
                            ? "border-red-300 bg-red-50 text-red-500 hover:border-red-500 focus:border-red-500 focus:outline-red-500"
                            : "border-black-200 bg-inherit"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="mt-1 pl-1 text-[12px] text-red-500" />
                  </FormItem>
                )}
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  type="submit"
                  className="w-full rounded-[40px] bg-blue-500 text-white hover:border-blue-600 hover:bg-blue-600 focus:border-blue-600 focus:bg-blue-600"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? lang === "en"
                      ? "Processing..."
                      : "Обробка..."
                    : lang === "en"
                      ? "Confirm"
                      : "Підтвердити"}
                </Button>
                <Button
                  onClick={() => router.push("/signin")}
                  className="w-full rounded-[40px] border-[1px] border-blue-300 bg-white text-blue-500 hover:bg-blue-100"
                  disabled={form.formState.isSubmitting}
                  variant="outline"
                >
                  {lang === "en" ? "Cancel" : "Скасувати"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
