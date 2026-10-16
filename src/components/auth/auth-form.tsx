"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { getAuthErrorMessage } from "@/utils/auth-errors";
import { Checkbox } from "../ui/checkbox";
import { PasswordInput } from "./password-input";
import { getSafeCallbackUrl } from "./safe-callback-url";
import { authFormSchema } from "./schema";
import { SocialAuth } from "./social-auth";
import { useSignIn, useSignUp } from "./use-auth";

interface AuthFormProps {
  type: "signin" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const [isLoading, setIsLoading] = useState(false);
  const tAuth = useTranslations("Auth");
  const tErrors = useTranslations("Auth.authErrors");
  const passwordLabel = tAuth("password");

  const form = useForm<z.infer<ReturnType<typeof authFormSchema>>>({
    resolver: zodResolver(authFormSchema(type === "register")),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      rememberMe: false,
      termsAccepted: false,
    },
  });

  // Enhanced error handling via shared utility
  const getErrorMessage = (
    error: unknown,
    context: "register" | "signin"
  ): string => getAuthErrorMessage(error, context, tErrors);

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const handleRegisterSubmit = async (
    data: z.infer<ReturnType<typeof authFormSchema>>
  ) => {
    const result = await signUp({
      email: data.email,
      password: data.password,
      name: data.name || "",
    });

    if (!result.ok) {
      toast.error(
        result.message ??
          getErrorMessage("Registration failed. Please try again.", "register")
      );
      return;
    }

    // Success: user is automatically signed in
    toast.success(tAuth("welcome"));
    router.push(callbackUrl);
    router.refresh();
  };

  const handleSignInSubmit = async (
    data: z.infer<ReturnType<typeof authFormSchema>>
  ) => {
    const result = await signIn({
      email: data.email,
      password: data.password,
      callbackUrl,
      rememberMe: data.rememberMe,
    });

    if (!result.ok) {
      toast.error(
        result.message ??
          getErrorMessage("Authentication failed. Please try again.", "signin")
      );
      return;
    }

    // Success
    toast.success(tAuth("welcomeBack"));
    router.push(callbackUrl);
    router.refresh();
  };

  const onSubmit = async (data: z.infer<ReturnType<typeof authFormSchema>>) => {
    try {
      setIsLoading(true);

      if (type === "register") {
        await handleRegisterSubmit(data);
      } else {
        await handleSignInSubmit(data);
      }
    } catch (error: unknown) {
      console.error("Auth error:", error);
      const errorMessage = getErrorMessage(error, type);

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-8 md:px-[70px]">
      <SocialAuth callbackUrl={callbackUrl} />

      <div className="relative">
        <p className="relative my-6 flex justify-center text-base font-semibold">
          {type === "register"
            ? tAuth("orRegisterWithEmail")
            : tAuth("orUseEmail")}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-normal md:text-xl">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className={`hover:border-blue-500 focus:border-blue-500 focus:outline-blue-500 ${form.formState.errors.email ? "border-red-300 bg-red-50 text-red-500 hover:border-red-500 focus:border-red-500 focus:outline-red-500" : "border-black-200 bg-inherit"}`}
                  />
                </FormControl>
                <FormMessage className="mt-1 pl-1 text-[12px] text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-normal md:text-xl">
                  {passwordLabel}
                </FormLabel>
                <PasswordInput
                  placeholder={passwordLabel}
                  {...field}
                  className={`rounded-[8px] border px-4 py-3 hover:border-blue-500 focus:border-blue-500 focus:outline-blue-500 ${form.formState.errors.password ? "border-red-300 bg-red-50 text-red-500 hover:border-red-500 focus:border-red-500 focus:outline-red-500" : "border-black-200 bg-inherit"}`}
                />
                {type === "register" && !form.formState.errors.password && (
                  <FormDescription className="mt-1 pl-1 text-[12px] text-gray-400">
                    {tAuth("passwordHint")}
                  </FormDescription>
                )}
                <FormMessage className="mt-1 pl-1 text-[12px] text-red-500" />
              </FormItem>
            )}
          />
          {type === "register" && (
            <div className="mt-2">
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <p className="text-black text-small">
                          {tAuth("agreePrefix")}
                          <a
                            href="/Правила користування сайтом.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {tAuth("termsOfService")}
                          </a>
                          {tAuth("andAgreeWith")}
                          <a
                            href="/Політика конфіденційності.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {tAuth("privacyPolicy")}
                          </a>
                        </p>
                      </label>
                    </FormControl>
                    <FormMessage className="mt-1 pl-1 text-[12px] text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}

          {type === "signin" && (
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {tAuth("rememberMe")}
                  </FormLabel>
                </FormItem>
              )}
            />
          )}

          {/* Inline form-level error box removed; errors are shown via toasts only */}

          <Button
            type="submit"
            className="mt-2 w-full rounded-[40px] bg-blue-500 py-2.5 text-base text-white hover:border-blue-600 hover:bg-blue-600 focus:border-blue-600 focus:bg-blue-600 md:text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>
                  {type === "signin"
                    ? tAuth("signingIn")
                    : tAuth("registering")}
                </span>
              </div>
            ) : type === "signin" ? (
              tAuth("signIn")
            ) : (
              tAuth("register")
            )}
          </Button>

          {type === "signin" && (
            <Link
              href={`/forgot-password`}
              className="mt-2 text-center text-sm text-blue-500 hover:text-blue-700"
            >
              {tAuth("forgotPasswordLink")}
            </Link>
          )}
        </form>
      </Form>

      {type === "signin" ? (
        <div className="mt-6 flex flex-col items-center text-sm md:text-lg">
          <h4>{tAuth("noAccount")}</h4>
          <Link
            href="register"
            className="mt-3 text-blue-500 hover:border-blue-500 hover:text-blue-700"
          >
            {tAuth("register")}
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center text-sm md:text-lg">
          <h4>{tAuth("haveAccount")}</h4>
          <Link
            href="signin"
            className="mt-3 text-blue-500 hover:border-blue-500 hover:text-blue-700"
          >
            {tAuth("signIn")}
          </Link>
        </div>
      )}
    </div>
  );
}
