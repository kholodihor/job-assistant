"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { authClient } from "@/lib/auth-client";
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

    // Authentication specific errors (better-auth generic handling)
    if (context === "signin") {
      if (typeof error === "string") {
        return error;
      }
      if (isErrorObject(error) && typeof error.message === "string") {
        return error.message;
      }
    }

    // Registration specific errors
    if (context === "register" && isErrorObject(error)) {
      const errorStr = typeof error.error === "string" ? error.error : "";
      const messageStr = typeof error.message === "string" ? error.message : "";
      const codeStr = typeof error.code === "string" ? error.code : "";

      // Prefer structured error codes from the API when available
      switch (codeStr) {
        case "USER_ALREADY_EXISTS":
          return lang === "en"
            ? "This email is already registered. Please use a different email or sign in."
            : "Цей email вже зареєстрований. Використайте інший email або увійдіть.";
        case "VALIDATION_ERROR":
          return lang === "en"
            ? "Please check your input data and try again."
            : "Перевірте введені дані та спробуйте ще раз.";
        case "SIGN_IN_AFTER_REGISTER_FAILED":
        case "INTERNAL_SERVER_ERROR":
          return lang === "en"
            ? "Server error during registration. Please try again later."
            : "Помилка сервера під час реєстрації. Спробуйте пізніше.";
        default:
          break;
      }

      // Fallback to string inspection if no code is present
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
        const { error } = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.name || "",
        });

        if (error) {
          const errorMessage = getErrorMessage(
            error.message ?? "Registration failed. Please try again.",
            "register"
          );
          toast.error(errorMessage);
          return;
        }

        // Reset retry count on success
        setRetryCount(0);
        setShowSuccessModal(true);
        toast.success(
          lang === "en"
            ? "Registration successful! You can now sign in."
            : "Реєстрація успішна! Тепер ви можете увійти."
        );
        return;
      }

      // Sign in flow with better-auth
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: callbackUrl,
        rememberMe: data.rememberMe,
      });

      if (error) {
        const errorMessage = getErrorMessage(
          error.message ?? "Authentication failed. Please try again.",
          "signin"
        );
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
