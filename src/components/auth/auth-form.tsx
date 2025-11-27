"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, Locale } from "@/i18n/routing";
import { Icon } from "../shared/icon";
import { Checkbox } from "../ui/checkbox";
import { authFormSchema } from "./schema";
import { SocialAuth } from "./social-auth";
import { SuccessRegistrationModal } from "./success-registration-modal";

interface AuthFormProps {
  type: "signin" | "register";
  lang: Locale;
}

export function AuthForm({ type, lang }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile/dashboard";
  const error = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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

  // Enhanced error handling functions
  const getErrorMessage = (
    error: unknown,
    context: "register" | "signin"
  ): string => {
    // Type guard for Error objects
    const isError = (err: unknown): err is Error => {
      return err instanceof Error;
    };

    // Type guard for objects with properties
    const isErrorObject = (err: unknown): err is Record<string, unknown> => {
      return typeof err === "object" && err !== null;
    };

    // Network errors
    if (
      isError(error) &&
      error.name === "TypeError" &&
      error.message.includes("fetch")
    ) {
      return lang === "en"
        ? "Network error. Please check your connection and try again."
        : "Помилка мережі. Перевірте підключення та спробуйте ще раз.";
    }

    // Timeout errors
    if (
      isError(error) &&
      (error.name === "AbortError" || error.message?.includes("timeout"))
    ) {
      return lang === "en"
        ? "Request timed out. Please try again."
        : "Час очікування вичерпано. Спробуйте ще раз.";
    }

    // Rate limiting
    if (isErrorObject(error) && error.status === 429) {
      return lang === "en"
        ? "Too many attempts. Please wait a few minutes before trying again."
        : "Забагато спроб. Зачекайте кілька хвилин перед повторною спробою.";
    }

    // Server errors
    if (
      isErrorObject(error) &&
      typeof error.status === "number" &&
      error.status >= 500
    ) {
      return lang === "en"
        ? "Server error. Please try again later."
        : "Помилка сервера. Спробуйте пізніше.";
    }

    // Authentication specific errors
    if (context === "signin") {
      if (error === "CredentialsSignin" || error === "Configuration") {
        return lang === "en"
          ? "Invalid email or password. Please check your credentials."
          : "Невірний email або пароль. Перевірте свої дані.";
      }
      if (error === "AccessDenied") {
        return lang === "en"
          ? "Access denied. Please check your account status."
          : "Доступ заборонено. Перевірте статус свого облікового запису.";
      }
    }

    // Registration specific errors
    if (context === "register" && isErrorObject(error)) {
      const errorStr = typeof error.error === "string" ? error.error : "";
      const messageStr = typeof error.message === "string" ? error.message : "";

      if (errorStr.includes("email") || messageStr.includes("email")) {
        return lang === "en"
          ? "This email is already registered. Please use a different email or sign in."
          : "Цей email вже зареєстрований. Використайте інший email або увійдіть.";
      }
      if (
        errorStr.includes("validation") ||
        messageStr.includes("validation")
      ) {
        return lang === "en"
          ? "Please check your input data and try again."
          : "Перевірте введені дані та спробуйте ще раз.";
      }
    }

    // Generic fallback
    let errorMessage = "";
    if (isErrorObject(error)) {
      errorMessage =
        (typeof error.error === "string" ? error.error : "") ||
        (typeof error.message === "string" ? error.message : "");
    } else if (isError(error)) {
      errorMessage = error.message;
    }

    return (
      errorMessage ||
      (lang === "en"
        ? `${context === "register" ? "Registration" : "Authentication"} failed. Please try again.`
        : `${context === "register" ? "Реєстрація" : "Авторизація"} не вдалася. Спробуйте ще раз.`)
    );
  };

  const handleRetry = async (
    data: z.infer<ReturnType<typeof authFormSchema>>
  ) => {
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1);
      toast.info(lang === "en" ? "Retrying..." : "Повторна спроба...");
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      return onSubmit(data);
    }
    return false;
  };

  const onSubmit = async (data: z.infer<ReturnType<typeof authFormSchema>>) => {
    try {
      setIsLoading(true);

      if (type === "register") {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Unknown error" }));
            const errorMessage = getErrorMessage(
              { ...errorData, status: response.status },
              "register"
            );

            form.setError("root", { message: errorMessage });
            toast.error(errorMessage);

            // Offer retry for certain errors
            if (response.status >= 500 || response.status === 429) {
              const retried = await handleRetry(data);
              if (retried !== false) return;
            }
            return;
          }

          // Reset retry count on success
          setRetryCount(0);
          setShowSuccessModal(true);
          toast.success(
            lang === "en"
              ? "Registration successful! Please check your email."
              : "Реєстрація успішна! Перевірте свою електронну пошту."
          );
          return;
        } catch (fetchError: unknown) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      }

      // Sign in flow
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        remember: data.rememberMe,
        redirect: false,
      });

      if (result?.error) {
        const errorMessage = getErrorMessage(result.error, "signin");
        form.setError("root", { message: errorMessage });
        toast.error(errorMessage);
        return;
      }

      // Reset retry count on success
      setRetryCount(0);
      toast.success(lang === "en" ? "Welcome back!" : "Ласкаво просимо!");
      router.push(callbackUrl);
      router.refresh();
    } catch (error: unknown) {
      console.error("Auth error:", error);
      const errorMessage = getErrorMessage(error, type);

      form.setError("root", { message: errorMessage });
      toast.error(errorMessage);

      // Offer retry for network errors
      if (
        error instanceof Error &&
        (error.name === "TypeError" || error.name === "AbortError")
      ) {
        const retried = await handleRetry(data);
        if (retried !== false) return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-8 md:px-[70px]">
      <SocialAuth />

      <div className="relative">
        <p className="relative my-6 flex justify-center text-base font-semibold">
          {type === "register"
            ? lang === "en"
              ? "or register using email"
              : "або зареєструйтесь за допомогою email"
            : lang === "en"
              ? "or use email"
              : "або скористайтеся email"}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-small text-red-600">
          <div className="flex items-center gap-2">
            <Icon name="icon-warning" size="16px" className="text-red-500" />
            <span className="font-medium">
              {lang === "en" ? "Authentication Error" : "Помилка авторизації"}
            </span>
          </div>
          <p className="mt-1 text-sm">
            {error === "CredentialsSignin" &&
              (lang === "en"
                ? "Invalid email or password. Please check your credentials."
                : "Невірний email або пароль. Перевірте свої дані.")}
            {error === "AccessDenied" &&
              (lang === "en"
                ? "This email is registered with email/password. Please sign in with your password."
                : "Цей email зареєстрований з паролем. Будь ласка, увійдіть, використовуючи свій пароль.")}
            {error === "OAuthAccountNotLinked" &&
              (lang === "en"
                ? "This email is already registered with a different sign-in method."
                : "Цей email вже зареєстрований з іншим способом входу.")}
            {error === "UseCredentials" &&
              (lang === "en"
                ? "This email is already registered with email/password. Please sign in using your email and password instead of Google."
                : "Цей email вже зареєстрований з паролем. Будь ласка, увійдіть, використовуючи свій email та пароль замість Google.")}
            {![
              "CredentialsSignin",
              "AccessDenied",
              "OAuthAccountNotLinked",
              "UseCredentials",
            ].includes(error) &&
              (lang === "en"
                ? "An error occurred during authentication. Please try again."
                : "Сталася помилка під час авторизації. Спробуйте ще раз.")}
          </p>
        </div>
      )}

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
                  {lang === "en" ? "Password" : "Пароль"}
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center rounded-[40px]">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Пароль"
                      {...field}
                      className={`w-full rounded-[8px] border px-4 py-3 hover:border-blue-500 focus:border-blue-500 focus:outline-blue-500 ${form.formState.errors.password ? "border-red-300 bg-red-50 text-red-500 hover:border-red-500 focus:border-red-500 focus:outline-red-500" : "border-black-200 bg-inherit"}`}
                    />
                    <Button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={`absolute right-4 border-none bg-inherit p-0 hover:bg-inherit ${form.formState.errors.password ? "stroke-red-500 text-red-500" : "stroke-gray-500 text-gray-400"}`}
                    >
                      {showPassword ? (
                        <Icon name="icon-closed" size="24px" />
                      ) : (
                        <Icon name="icon-open" size="24px" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage
                  className={`mt-1 pl-1 text-[12px] text-gray-400 ${form.formState.errors.password && "hidden"}`}
                >
                  {type === "register" &&
                    (lang === "en"
                      ? "The password must consist of 8 characters and contain numbers and Latin letters"
                      : "Пароль має складатись з 8 символів і містити цифри та латинські літери")}
                </FormMessage>
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
                          {lang === "en" ? "I agree with " : "Я погоджуюся з "}
                          <a
                            href="/Правила користування сайтом.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {lang === "en"
                              ? "Terms of service "
                              : "Умовами надання послуг "}
                          </a>
                          {lang === "en"
                            ? "and agree with "
                            : "і погоджуюся з "}
                          <a
                            href="/Політика конфіденційності.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            {lang === "en"
                              ? "Privacy policy"
                              : "Політикою конфіденційності"}
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
                    {lang === "en" ? "Remember me" : "Запам'ятати мене"}
                  </FormLabel>
                </FormItem>
              )}
            />
          )}

          {form.formState.errors.root && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <div className="flex items-start gap-2">
                <Icon
                  name="icon-warning"
                  size="16px"
                  className="mt-0.5 flex-shrink-0 text-red-500"
                />
                <div>
                  <p className="mb-1 font-medium">
                    {lang === "en" ? "Error" : "Помилка"}
                  </p>
                  <p>{form.formState.errors.root.message}</p>
                  {retryCount > 0 && (
                    <p className="mt-2 text-xs text-red-500">
                      {lang === "en"
                        ? `Attempt ${retryCount + 1} of 3`
                        : `Спроба ${retryCount + 1} з 3`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
                    ? lang === "en"
                      ? "Signing in..."
                      : "Вхід..."
                    : lang === "en"
                      ? "Registering..."
                      : "Реєстрація..."}
                </span>
              </div>
            ) : type === "signin" ? (
              lang === "en" ? (
                "Sign In"
              ) : (
                "Увійти"
              )
            ) : lang === "en" ? (
              "Register"
            ) : (
              "Зареєструватися"
            )}
          </Button>

          {type === "signin" && (
            <Link
              href={`/forgot-password`}
              className="mt-2 text-center text-sm text-blue-500 hover:text-blue-700"
            >
              {lang === "en" ? "Forgot password?" : "Забули пароль?"}
            </Link>
          )}
        </form>
      </Form>

      {type === "signin" ? (
        <div className="mt-6 flex flex-col items-center text-sm md:text-lg">
          <h4>
            {lang === "en"
              ? "Don't have an account?"
              : "Не маєте облікового запису?"}
          </h4>
          <Link
            href="register"
            className="mt-3 text-blue-500 hover:border-blue-500 hover:text-blue-700"
          >
            {lang === "en" ? "Register" : "Зареєструватися"}
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center text-sm md:text-lg">
          <h4>
            {lang === "en"
              ? "Already have an account?"
              : "Вже маєте обліковий запис?"}
          </h4>
          <Link
            href="signin"
            className="mt-3 text-blue-500 hover:border-blue-500 hover:text-blue-700"
          >
            {lang === "en" ? "Sign In" : "Увійти"}
          </Link>
        </div>
      )}

      <SuccessRegistrationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        lang={lang}
      />
    </div>
  );
}
