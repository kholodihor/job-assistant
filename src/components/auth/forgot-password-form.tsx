"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { useRouter } from "@/i18n/routing";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "./schema";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth.forgotPassword");
  const tAuth = useTranslations("Auth");
  const redirectTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError("");
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

      const result: { error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || t("failedToProcess"));
      }

      setSuccess(true);
      // Redirect to login page after successful submission
      redirectTimer.current = setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToProcess"));
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
        <Card className="w-full max-w-[600px] p-4 sm:p-8 md:p-[50px]">
          <CardHeader className="mb-6 p-0 sm:mb-8">
            <CardTitle className="text-center text-xl font-semibold sm:text-2xl">
              {t("checkEmailTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 px-4 text-center sm:px-8 md:px-[70px]">
            <p>{t("checkEmailDescription")}</p>
            <p className="mt-4 text-blue-500">{t("redirecting")}</p>
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
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 px-4 sm:px-8 md:px-[70px]">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <p className="mb-4 text-center text-sm sm:mb-6 sm:text-base">
            {t("description")}
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
                    ? tAuth("processing")
                    : t("confirm")}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="w-full rounded-[40px] border-[1px] border-blue-300 bg-white text-blue-500 hover:bg-blue-100"
                  disabled={form.formState.isSubmitting}
                  variant="outline"
                >
                  {tAuth("cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
