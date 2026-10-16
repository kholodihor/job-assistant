"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "@/i18n/routing";
import { PasswordInput } from "./password-input";
import { ResetPasswordFormValues, resetPasswordSchema } from "./schema";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const tAuth = useTranslations("Auth");
  const t = useTranslations("Auth.resetPassword");
  const redirectTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

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

      const result: { error?: string; message?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || t("failedToReset"));
      }

      setSuccess(true);
      // Redirect to login page after successful password reset
      redirectTimer.current = setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToReset"));
    }
  };

  if (success) {
    return (
      <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center">
        <Card className="w-[90%] max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-xl text-green-600">
              {t("success")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("successDescription")}
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
            {t("title")}
          </CardTitle>
          <CardDescription className="text-black text-center text-base sm:text-lg">
            {t("subtitle")}
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
                        {t("newPassword")}
                      </FormLabel>
                      <PasswordInput
                        placeholder={t("newPasswordPlaceholder")}
                        {...field}
                        className={`rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${
                          form.formState.errors.password
                            ? "border-red-300 bg-red-50 text-red-500"
                            : ""
                        }`}
                      />
                      <FormDescription className="mt-1 pl-1 text-[12px] text-gray-400">
                        {tAuth("passwordHint")}
                      </FormDescription>
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
                        {t("confirmPassword")}
                      </FormLabel>
                      <PasswordInput
                        placeholder={t("confirmPasswordPlaceholder")}
                        {...field}
                        className={`rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${
                          form.formState.errors.confirmPassword
                            ? "border-red-300 bg-red-50 text-red-500"
                            : ""
                        }`}
                      />
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
                      ? tAuth("processing")
                      : t("submit")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => router.push("/signin")}
                    className="w-full rounded-[40px] border-[1px] border-blue-300 bg-white py-2.5 text-blue-500 hover:bg-blue-100"
                    disabled={form.formState.isSubmitting}
                    variant="outline"
                  >
                    {tAuth("cancel")}
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
